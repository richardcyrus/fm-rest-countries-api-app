import { defineConfig, devices } from '@playwright/test'
import { failing, flaky, healthy, origin, TOKEN } from './e2e/servers'

/** A fake upstream plus the built app pointed at it. */
function instance(
  ports: { app: number; fake: number },
  options: {
    fail?: number
    cacheTtlSeconds?: number
    /** Reuse an app already running on the port; off when a cold cache matters. */
    reuseApp?: boolean
  } = {}
) {
  const upstream = `${origin(ports.fake)}/countries/v5`

  return [
    {
      command: 'node test/fake-upstream/main.ts',
      // The control route always answers 200, even while the fake is failing.
      url: `${origin(ports.fake)}/__control/requests`,
      reuseExistingServer: !process.env.CI,
      env: {
        FAKE_UPSTREAM_PORT: String(ports.fake),
        FAKE_UPSTREAM_TOKEN: TOKEN,
        ...(options.fail ? { FAKE_UPSTREAM_FAIL: String(options.fail) } : {}),
      },
    },
    {
      command: 'node .output/server/index.mjs',
      // A static file, so readiness does not depend on the upstream.
      url: `${origin(ports.app)}/favicon-32x32.png`,
      reuseExistingServer: (options.reuseApp ?? true) && !process.env.CI,
      env: {
        PORT: String(ports.app),
        COUNTRIES_API_URL: upstream,
        COUNTRIES_API_TOKEN: TOKEN,
        ...(options.cacheTtlSeconds
          ? { COUNTRIES_CACHE_TTL_SECONDS: String(options.cacheTtlSeconds) }
          : {}),
      },
    },
  ]
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: {
    baseURL: origin(healthy.app),
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Tests run against the production build; `pnpm e2e` builds it first.
  webServer: [
    ...instance(healthy),
    ...instance(failing, { fail: 500 }),
    // The recovery test needs the app's cache to start empty.
    ...instance(flaky, { cacheTtlSeconds: 1, reuseApp: false }),
  ],
})
