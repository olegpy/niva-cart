import { spawn } from 'node:child_process';
import { startMockApiServer } from './fixtures/mock-api-server.mjs';

const api = await startMockApiServer({ port: 4000 });
const appPort = Number(process.env.PORT || 3100);

const child = spawn(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'dev', '--', '-p', String(appPort)],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: String(appPort),
      NEXT_PUBLIC_API_BASE_URL: `http://127.0.0.1:${api.port}`,
    },
  }
);

function shutdown(code = 0) {
  child.kill('SIGTERM');
  api.close().finally(() => process.exit(code));
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));
child.on('exit', (code) => shutdown(code ?? 0));

