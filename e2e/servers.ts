/**
 * Ports and tokens for the e2e fixtures. Each app instance talks to its own
 * fake upstream, so a suite can break one without touching the others.
 */
export const TOKEN = 'test-token'

export const healthy = { app: 4173, fake: 4010 }
/** The upstream answers 500 from the start, so no data is ever cached. */
export const failing = { app: 4174, fake: 4011 }
/** Driven over HTTP through the fake's `/__control/` routes; 1s cache TTL. */
export const flaky = { app: 4175, fake: 4012 }

export const origin = (port: number) => `http://localhost:${port}`
