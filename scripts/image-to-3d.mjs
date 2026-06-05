#!/usr/bin/env node
/**
 * image-to-3d.mjs
 *
 * Local job runner for image-to-3D workflows.
 *
 * This tool does not pretend to solve 3D reconstruction by itself. Instead it:
 * - validates the source image
 * - creates a reusable run directory
 * - stores metadata and a handoff manifest
 * - optionally generates a preview copy when `sips` is available
 * - optionally executes a backend command with stable env vars
 *
 * Usage:
 *   pnpm image:3d -- --input ./image.png
 *   pnpm image:3d -- ./image.png --out ./artifacts --preview
 *   pnpm image:3d -- ./image.png --command "python3 your-backend.py"
 */

import { constants as fsConstants } from 'node:fs';
import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { basename, extname, join, resolve } from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);

function usage(exitCode = 0) {
  console.log([
    'Usage:',
    '  pnpm image:3d -- ./image.png [--out ./artifacts] [--name badge] [--preview] [--command "backend cmd"]',
    '',
    'Options:',
    '  --input <path>     Source image path. You can also pass it as the first positional argument.',
    '  --out <dir>        Output root directory. Defaults to ./artifacts/image-to-3d.',
    '  --name <name>      Job name used in the run folder.',
    '  --preview          Create a resized preview if `sips` is available.',
    '  --command <cmd>    Backend command to execute with INPUT_IMAGE and OUTPUT_DIR env vars.',
    '  --dry-run          Print what would happen without writing files.',
    '  --help             Show this help.',
  ].join('\n'));
  process.exit(exitCode);
}

function getFlag(name) {
  return args.includes(name);
}

function getOption(name, fallback = undefined) {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  const value = args[idx + 1];
  if (!value || value.startsWith('--')) return fallback;
  return value;
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'image-job';
}

function hasCommand(commandName) {
  const result = spawnSync('sh', ['-lc', `command -v ${commandName} >/dev/null 2>&1`], { stdio: 'ignore' });
  return result.status === 0;
}

const dryRun = getFlag('--dry-run');
if (getFlag('--help') || args.length === 0) usage(0);

const positionalInput = args.find((arg) => !arg.startsWith('--'));
const inputArg = getOption('--input', positionalInput);
if (!inputArg) {
  console.error('Missing input image. Pass a path as the first argument or via --input.');
  usage(1);
}

const inputPath = resolve(process.cwd(), inputArg);
await access(inputPath, fsConstants.R_OK);

const jobName = getOption('--name', basename(inputPath, extname(inputPath)));
const runId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const outputRoot = resolve(process.cwd(), getOption('--out', join('artifacts', 'image-to-3d')));
const runDir = join(outputRoot, `${slugify(jobName)}-${runId}`);
const previewRequested = getFlag('--preview');
const backendCommand = getOption('--command');
const manifestPath = join(runDir, 'job.json');
const notesPath = join(runDir, 'README.md');
const copiedInputPath = join(runDir, `input${extname(inputPath).toLowerCase() || '.png'}`);
const previewPath = join(runDir, 'preview.png');

const manifest = {
  id: runId,
  name: jobName,
  createdAt: new Date().toISOString(),
  inputPath,
  outputRoot,
  runDir,
  copiedInputPath,
  previewPath,
  backendCommand: backendCommand ?? null,
  previewRequested,
  capabilities: {
    sips: hasCommand('sips'),
  },
};

const notes = [
  `# ${jobName}`,
  '',
  'This run directory is a handoff bundle for an image-to-3D backend.',
  '',
  '## Inputs',
  `- Source: ${inputPath}`,
  `- Copied input: ${copiedInputPath}`,
  '',
  '## Env vars for a backend command',
  `- INPUT_IMAGE=${copiedInputPath}`,
  `- OUTPUT_DIR=${runDir}`,
  `- JOB_FILE=${manifestPath}`,
  `- JOB_ID=${runId}`,
  `- JOB_NAME=${jobName}`,
  '',
  '## Suggested next steps',
  '- Use a depth or reconstruction backend you install locally.',
  '- Emit one or more of: depth map, point cloud, mesh, GLB, or preview render.',
  '- Keep the output directory stable so the CLI becomes reusable.',
  '',
];

if (dryRun) {
  console.log(JSON.stringify(manifest, null, 2));
  console.log(notes.join('\n'));
  process.exit(0);
}

await mkdir(runDir, { recursive: true });
await copyFile(inputPath, copiedInputPath);
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
await writeFile(notesPath, `${notes.join('\n')}\n`, 'utf8');

if (previewRequested && hasCommand('sips')) {
  try {
    await new Promise((resolvePromise, rejectPromise) => {
      let stderr = '';
      const child = spawn('sips', ['-Z', '1024', copiedInputPath, '--out', previewPath], {
        stdio: ['ignore', 'ignore', 'pipe'],
        env: process.env,
      });
      child.stderr?.on('data', (chunk) => {
        stderr += chunk.toString();
      });
      child.on('error', rejectPromise);
      child.on('exit', (code) => {
        if (code === 0) resolvePromise();
        else rejectPromise(new Error((stderr.trim() || `sips exited with code ${code}`).trim()));
      });
    });
  } catch (error) {
    await copyFile(copiedInputPath, previewPath);
    console.warn('Preview generation fell back to a direct copy.');
  }
}

if (backendCommand) {
  const env = {
    ...process.env,
    INPUT_IMAGE: copiedInputPath,
    OUTPUT_DIR: runDir,
    JOB_FILE: manifestPath,
    JOB_ID: runId,
    JOB_NAME: jobName,
    JOB_INPUT: copiedInputPath,
    JOB_PREVIEW: previewPath,
  };

  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(backendCommand, {
      shell: true,
      stdio: 'inherit',
      env,
    });
    child.on('error', rejectPromise);
    child.on('exit', (code, signal) => {
      if (signal) {
        rejectPromise(new Error(`backend command terminated with ${signal}`));
        return;
      }
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`backend command exited with ${code}`));
    });
  });
}

console.log([
  `Created run: ${runDir}`,
  `Manifest: ${manifestPath}`,
  `Notes: ${notesPath}`,
  previewRequested && hasCommand('sips') ? `Preview: ${previewPath}` : null,
  backendCommand ? `Backend: ${backendCommand}` : null,
].filter(Boolean).join('\n'));
