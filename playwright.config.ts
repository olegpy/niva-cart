import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const e2eAppPort = process.env.E2E_APP_PORT || '3100';
const mockApiPort = process.env.MOCK_API_PORT || '4000';
const e2eBaseURL = `http://127.0.0.1:${e2eAppPort}`;

export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: e2eBaseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'node e2e/run-dev-with-mock.mjs',
    url: e2eBaseURL,
    env: {
      ...process.env,
      PORT: e2eAppPort,
      MOCK_API_PORT: mockApiPort,
    },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
