import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const args = process.argv.slice(2);

const getArg = (name, fallback) => {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
};

const host = getArg('--host', '0.0.0.0');
const port = getArg('--port', '4321');
const lockPath = join(tmpdir(), 'astro-threejs-portfolio-dev.lock');

const isAlive = (pid) => {
  try {
    return process.kill(pid, 0);
  } catch {
    return false;
  }
};

const removeLock = () => {
  try {
    rmSync(lockPath);
  } catch {
    // Ignore stale lock cleanup errors.
  }
};

if (existsSync(lockPath)) {
  try {
    const payload = JSON.parse(readFileSync(lockPath, 'utf8'));
    if (payload?.pid && isAlive(payload.pid)) {
      console.error(
        `A dev instance is already running (pid ${payload.pid}, port ${payload.port}). Stop it before starting another one.`,
      );
      process.exit(1);
    }
  } catch {
    // If the lock is corrupt or stale, clear it and continue.
  }
  removeLock();
}

const child = spawn('astro', ['dev', '--host', host, '--port', port, '--strictPort'], {
  stdio: 'inherit',
  env: process.env,
});

if (!child.pid) {
  console.error('Failed to start Astro dev server.');
  process.exit(1);
}

writeFileSync(
  lockPath,
  JSON.stringify({
    pid: child.pid,
    cwd: process.cwd(),
    host,
    port,
    startedAt: new Date().toISOString(),
  }),
);

const shutdown = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('exit', removeLock);

child.on('error', (error) => {
  removeLock();
  console.error(error);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  removeLock();
  process.exit(signal ? 1 : (code ?? 0));
});
