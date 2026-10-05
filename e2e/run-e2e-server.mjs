import { spawn } from 'node:child_process';
import { spawnSync } from 'node:child_process';

const appPort = Number(process.env.PORT || 3100);

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const migrate = spawnSync(npm, ['run', 'db:deploy'], {
  stdio: 'inherit',
  env: process.env,
});
if (migrate.status !== 0) {
  process.exit(migrate.status ?? 1);
}

const seed = spawnSync(npm, ['run', 'db:seed'], {
  stdio: 'inherit',
  env: process.env,
});
if (seed.status !== 0) {
  process.exit(seed.status ?? 1);
}

const build = spawnSync(npx, ['next', 'build'], {
  stdio: 'inherit',
  env: process.env,
});
if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const child = spawn(npx, ['next', 'start', '-p', String(appPort)], {
  stdio: ['ignore', 'inherit', 'inherit'],
  env: {
    ...process.env,
    PORT: String(appPort),
  },
});

function shutdown(code = 0) {
  child.kill('SIGTERM');
  process.exit(code);
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));
child.on('exit', (code) => shutdown(code ?? 0));
