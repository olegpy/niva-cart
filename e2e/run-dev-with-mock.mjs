import { spawn } from 'node:child_process';
import { startMockApiServer } from './fixtures/mock-api-server.mjs';

const mockApiPort = Number(process.env.MOCK_API_PORT || 4000);
const api = await startMockApiServer({ port: mockApiPort });
const appPort = Number(process.env.PORT || 3100);

// Do not inherit stdin: under Playwright's webServer (and `test --ui`) stdin is often closed;
// `next dev` can then see EOF and exit immediately with code 0 ("Process from config.webServer exited early").
const child = spawn(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'dev', '--', '-p', String(appPort)],
  {
    stdio: ['ignore', 'inherit', 'inherit'],
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

