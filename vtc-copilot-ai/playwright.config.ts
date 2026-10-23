import { defineConfig, devices } from "@playwright/test";

// Les tests tournent contre le vrai Worker (wrangler dev) : site pré-rendu + API + D1 locale.
const PORT = Number(process.env.E2E_PORT ?? 8787);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  globalSetup: "./tests/e2e/global-setup.ts",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx wrangler dev --local --port ${PORT}`,
        url: `http://localhost:${PORT}/api/health`,
        reuseExistingServer: true,
        timeout: 60_000,
      },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 800 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
