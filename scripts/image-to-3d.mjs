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
 *   pnpm image:3d -- ./image.png --openai-svg --prompt "turn this into a clean SVG"
 *   pnpm image:3d -- ./image.png --svg-provider local --svg-base-url http://localhost:1234/v1
 *   pnpm image:3d -- ./image.png --workflow svg --svg-provider local --svg-model qwen2.5vl:3b
 *   pnpm image:3d -- ./image.png --workflow raster --image-provider ollama --image-model x/z-image-turbo:fp8
 */

import { constants as fsConstants } from 'node:fs';
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { basename, extname, join, resolve } from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);

function usage(exitCode = 0) {
  console.log(
    [
      'Usage:',
      '  pnpm image:3d -- ./image.png [--out ./artifacts] [--name badge] [--preview] [--command "backend cmd"]',
      '',
      'Options:',
      '  --input <path>     Source image path. You can also pass it as the first positional argument.',
      '  --out <dir>        Output root directory. Defaults to ./artifacts/image-to-3d.',
      '  --name <name>      Job name used in the run folder.',
      '  --preview          Create a resized preview if `sips` is available.',
      '  --command <cmd>    Backend command to execute with INPUT_IMAGE and OUTPUT_DIR env vars.',
      '  --workflow <mode>  Workflow mode: bundle, svg, raster, or raster-to-svg (default: svg).',
      '  --image-provider   Raster image provider for raster modes: ollama or openai (default: ollama).',
      '  --image-base-url   OpenAI-compatible image API base URL (default: http://localhost:11434/v1 for ollama).',
      '  --image-model      Model name for raster generation (default: x/z-image-turbo:fp8).',
      '  --openai-svg       Shortcut for --svg-provider openai.',
      '  --svg-provider     SVG model provider: openai, local, or ollama (default: local).',
      '  --svg-base-url     OpenAI-compatible base URL (default: https://api.openai.com/v1, http://localhost:1234/v1, or http://localhost:11434/v1).',
      '  --svg-model        Model name for SVG generation (default: qwen2.5vl:3b).',
      '  --prompt           Extra instruction appended to the SVG request.',
      '  --dry-run          Print what would happen without writing files.',
      '  --help             Show this help.',
    ].join('\n'),
  );
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

function getPositionalArgs() {
  const valueFlags = new Set([
    '--input',
    '--out',
    '--name',
    '--command',
    '--workflow',
    '--image-provider',
    '--image-base-url',
    '--image-model',
    '--svg-provider',
    '--svg-base-url',
    '--svg-model',
    '--prompt',
  ]);

  const positionals = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--') {
      for (let tail = index + 1; tail < args.length; tail += 1) {
        const tailArg = args[tail];
        if (!tailArg.startsWith('--')) {
          positionals.push(tailArg);
        }
      }
      break;
    }

    if (valueFlags.has(arg)) {
      index += 1;
      continue;
    }

    if (!arg.startsWith('--')) {
      positionals.push(arg);
    }
  }

  return positionals;
}

function slugify(input) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'image-job'
  );
}

function hasCommand(commandName) {
  const result = spawnSync(
    'sh',
    ['-lc', `command -v ${commandName} >/dev/null 2>&1`],
    { stdio: 'ignore' },
  );
  return result.status === 0;
}

const dryRun = getFlag('--dry-run');
if (getFlag('--help') || args.length === 0) usage(0);

const positionalInput = getPositionalArgs()[0];
const inputArg = getOption('--input', positionalInput);
if (!inputArg) {
  console.error(
    'Missing input image. Pass a path as the first argument or via --input.',
  );
  usage(1);
}

const inputPath = resolve(process.cwd(), inputArg);
await access(inputPath, fsConstants.R_OK);

const jobName = getOption('--name', basename(inputPath, extname(inputPath)));
const runId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const outputRoot = resolve(
  process.cwd(),
  getOption('--out', join('artifacts', 'image-to-3d')),
);
const runDir = join(outputRoot, `${slugify(jobName)}-${runId}`);
const previewRequested = getFlag('--preview');
const backendCommand = getOption('--command');
const workflow = getOption('--workflow', 'svg').toLowerCase();
const imageProvider = getOption('--image-provider', 'ollama').toLowerCase();
const imageBaseUrl = normalizeBaseUrl(
  getOption(
    '--image-base-url',
    imageProvider === 'ollama'
      ? 'http://localhost:11434/v1'
      : 'https://api.openai.com/v1',
  ),
);
const imageModel = getOption(
  '--image-model',
  imageProvider === 'ollama' ? 'x/z-image-turbo:fp8' : 'gpt-image-1',
);
const openaiSvgRequested = getFlag('--openai-svg');
const svgRequested =
  workflow === 'svg' ||
  workflow === 'raster-to-svg' ||
  openaiSvgRequested ||
  args.includes('--svg-provider');
const svgProvider = svgRequested
  ? getOption(
      '--svg-provider',
      openaiSvgRequested ? 'openai' : 'local',
    ).toLowerCase()
  : null;
const svgBaseUrl = svgRequested
  ? normalizeBaseUrl(
      getOption(
        '--svg-base-url',
        svgProvider === 'ollama'
          ? 'http://localhost:11434/v1'
          : svgProvider === 'local'
            ? 'http://localhost:1234/v1'
            : 'https://api.openai.com/v1',
      ),
    )
  : null;
const svgModel = svgRequested
  ? getOption(
      '--svg-model',
      svgProvider === 'ollama'
        ? 'qwen2.5vl:3b'
        : svgProvider === 'local'
          ? 'qwen2.5-vl-7b-instruct'
          : 'gpt-5-mini',
    )
  : null;
const svgPrompt = svgRequested ? getOption('--prompt', '') : '';
const rasterRequested = workflow === 'raster' || workflow === 'raster-to-svg';
const rasterOutputPath = join(runDir, 'generated.png');
const rasterPrompt = getOption('--prompt', '');
const manifestPath = join(runDir, 'job.json');
const notesPath = join(runDir, 'README.md');
const copiedInputPath = join(
  runDir,
  `input${extname(inputPath).toLowerCase() || '.png'}`,
);
const previewPath = join(runDir, 'preview.png');
const generatedSvgPath = join(runDir, 'generated.svg');
const sourceDimensions = getImageDimensions(inputPath);

const manifest = {
  id: runId,
  name: jobName,
  createdAt: new Date().toISOString(),
  inputPath,
  outputRoot,
  runDir,
  copiedInputPath,
  previewPath,
  generatedSvgPath,
  rasterOutputPath,
  backendCommand: backendCommand ?? null,
  workflow,
  imageProvider,
  imageBaseUrl,
  imageModel,
  svgProvider,
  svgBaseUrl,
  svgModel,
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
  `- Workflow: ${workflow}`,
  rasterRequested ? `- Raster output: ${rasterOutputPath}` : null,
  svgRequested ? `- SVG provider: ${svgProvider}` : null,
  svgRequested ? `- SVG output: ${generatedSvgPath}` : null,
  sourceDimensions
    ? `- Source dimensions: ${sourceDimensions.width}x${sourceDimensions.height}`
    : null,
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
      const child = spawn(
        'sips',
        ['-Z', '1024', copiedInputPath, '--out', previewPath],
        {
          stdio: ['ignore', 'ignore', 'pipe'],
          env: process.env,
        },
      );
      child.stderr?.on('data', (chunk) => {
        stderr += chunk.toString();
      });
      child.on('error', rejectPromise);
      child.on('exit', (code) => {
        if (code === 0) resolvePromise();
        else
          rejectPromise(
            new Error(
              (stderr.trim() || `sips exited with code ${code}`).trim(),
            ),
          );
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

if (rasterRequested) {
  const rasterPayload = await requestRaster({
    baseUrl: imageBaseUrl,
    apiKey:
      imageProvider === 'openai'
        ? (process.env.OPENAI_API_KEY ?? process.env.IMAGE_API_KEY)
        : (process.env.OLLAMA_API_KEY ?? process.env.OPENAI_API_KEY),
    model: imageModel,
    inputImage: `data:${mimeTypeForPath(copiedInputPath)};base64,${(await readFile(copiedInputPath)).toString('base64')}`,
    prompt: [
      'Generate a high-resolution, richly textured, color-accurate reference image that keeps the badge readable and dimensional.',
      'Preserve metallic surfaces, reflections, edge contrast, and layered depth.',
      'Keep the silhouette clean for later vectorization or 3D reconstruction.',
      rasterPrompt ? `Additional instruction: ${rasterPrompt}` : '',
    ]
      .filter(Boolean)
      .join(' '),
    provider: imageProvider,
  });

  const imageData = extractImageData(rasterPayload);
  if (!imageData) {
    throw new Error('Raster provider did not return an image.');
  }
  await writeFile(rasterOutputPath, Buffer.from(imageData, 'base64'));
}

if (svgRequested) {
  const base64Image = (await readFile(copiedInputPath)).toString('base64');
  const instruction = [
    'Convert the provided image into a single self-contained SVG.',
    'Return only raw SVG markup.',
    'Do not include markdown, explanations, or code fences.',
    'Preserve the original colors as closely as possible.',
    'Preserve the object silhouette, premium metallic feel, glow, and badge-like depth.',
    'Use layered vector gradients, highlights, specular reflections, and subtle texture patterns.',
    'Prefer crisp edges, dense internal detail, and a rich 3D read from the front and sides.',
    sourceDimensions
      ? `Match the source aspect ratio and use a viewBox that reflects ${sourceDimensions.width} by ${sourceDimensions.height}.`
      : '',
    'The result should upscale cleanly and remain sharp at large sizes.',
    svgPrompt ? `Additional instruction: ${svgPrompt}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const payload = await requestSvg({
    baseUrl: svgBaseUrl,
    apiKey:
      svgProvider === 'openai'
        ? (process.env.OPENAI_API_KEY ?? process.env.SVG_API_KEY)
        : process.env.SVG_API_KEY,
    model: svgModel,
    inputImage: `data:${mimeTypeForPath(copiedInputPath)};base64,${base64Image}`,
    instruction,
    provider: svgProvider,
  });

  const svgText = extractSvg(extractOutputText(payload));
  await writeFile(generatedSvgPath, `${svgText}\n`, 'utf8');
}

console.log(
  [
    `Created run: ${runDir}`,
    `Manifest: ${manifestPath}`,
    `Notes: ${notesPath}`,
    rasterRequested ? `Raster: ${rasterOutputPath}` : null,
    svgRequested ? `SVG: ${generatedSvgPath}` : null,
    previewRequested && hasCommand('sips') ? `Preview: ${previewPath}` : null,
    backendCommand ? `Backend: ${backendCommand}` : null,
  ]
    .filter(Boolean)
    .join('\n'),
);

async function requestRaster({
  baseUrl,
  apiKey,
  model,
  inputImage,
  prompt,
  provider,
}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  if (provider === 'ollama') {
    const response = await fetch(new URL('/api/generate', baseUrl), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        prompt,
        images: [inputImage.replace(/^data:[^,]+,/, '')],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama raster request failed with ${response.status} ${response.statusText}`,
      );
    }
    return response.json();
  }

  const response = await fetch(new URL('/responses', baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            { type: 'input_image', image_url: inputImage, detail: 'high' },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `OpenAI raster request failed with ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

async function requestSvg({
  baseUrl,
  apiKey,
  model,
  inputImage,
  instruction,
  provider,
}) {
  if (provider === 'openai' && !apiKey) {
    throw new Error('OPENAI_API_KEY is required for --openai-svg');
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(new URL('/responses', baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: instruction },
            { type: 'input_image', image_url: inputImage, detail: 'high' },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `${provider === 'openai' ? 'OpenAI' : 'Local'} request failed with ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

function mimeTypeForPath(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  return 'image/png';
}

function normalizeBaseUrl(baseUrl) {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

function getImageDimensions(filePath) {
  if (!hasCommand('sips')) return null;

  const result = spawnSync(
    'sips',
    ['-g', 'pixelWidth', '-g', 'pixelHeight', filePath],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) return null;

  const width = result.stdout.match(/pixelWidth:\s+(\d+)/)?.[1];
  const height = result.stdout.match(/pixelHeight:\s+(\d+)/)?.[1];
  if (!width || !height) return null;

  return { width: Number(width), height: Number(height) };
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text;
  }

  const parts = [];
  for (const item of payload?.output ?? []) {
    if (item?.type !== 'message') continue;
    for (const content of item.content ?? []) {
      if (content?.type === 'output_text' && typeof content.text === 'string') {
        parts.push(content.text);
      }
    }
  }
  return parts.join('\n').trim();
}

function extractImageData(payload) {
  if (typeof payload?.image === 'string' && payload.image.trim())
    return payload.image.trim();
  if (typeof payload?.data === 'string' && payload.data.trim())
    return payload.data.trim();
  if (typeof payload?.response === 'string' && payload.response.trim())
    return payload.response.trim();
  return null;
}

function extractSvg(text) {
  const trimmed = String(text || '').trim();
  const fenced = trimmed.match(/```(?:svg)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  const svgMatch = candidate.match(/<svg[\s\S]*<\/svg>/i);
  const svg = (svgMatch?.[0] ?? candidate).trim();
  if (!/^<svg[\s>]/i.test(svg) || !/<\/svg>\s*$/i.test(svg)) {
    throw new Error('OpenAI did not return valid SVG markup.');
  }
  return svg;
}
