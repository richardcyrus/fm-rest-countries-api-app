import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { loadCountriesFixture } from '../fixtures/load.ts'

/** Keep only the requested dot-paths; a path to an array or object keeps all of it. */
function project(object: unknown, fields: string[]): unknown {
  const result: Record<string, unknown> = {}

  for (const field of fields) {
    const keys = field.split('.')
    let source: unknown = object
    let target = result

    for (const [index, key] of keys.entries()) {
      if (typeof source !== 'object' || source === null || !(key in source)) {
        break
      }
      source = (source as Record<string, unknown>)[key]

      if (index === keys.length - 1) {
        target[key] = source
      } else {
        target[key] ??= {}
        target = target[key] as Record<string, unknown>
      }
    }
  }

  return result
}

const DEFAULT_LIMIT = 25
const MAX_LIMIT = 100

export type FakeUpstreamOptions = {
  /** Port to listen on; 0 picks a free one. */
  port?: number
  /** The Bearer token the fake accepts. */
  token?: string
  countries?: unknown[]
  /** Start out answering every country-list request with this status. */
  failWith?: number
}

export type FakeUpstream = {
  /** Base URL of the list endpoint, as `COUNTRIES_API_URL` expects it. */
  url: string
  /** Every country-list request the fake has served, in order. */
  requests: {
    url: string
    authorization: string | undefined
    status: number
  }[]
  /** Answer every request with this status until cleared with `null`. */
  failWith: (status: number | null) => void
  close: () => Promise<void>
}

/**
 * A stand-in for the v5 countries API: Bearer auth, `limit`/`offset` paging,
 * `response_fields` projection, and the `data.objects` / `data.meta`
 * envelope. Its behaviour is checked against the real API by
 * `test/live-contract.test.ts`.
 */
export async function startFakeUpstream({
  port = 0,
  token = 'test-token',
  countries = loadCountriesFixture(),
  failWith: initialFailure,
}: FakeUpstreamOptions = {}): Promise<FakeUpstream> {
  const requests: FakeUpstream['requests'] = []
  let failure: number | null = initialFailure ?? null

  const server: Server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://fake-upstream')
    const send = (status: number, body: unknown) => {
      res.writeHead(status, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(body))
    }

    // Test control, for suites that drive the fake over HTTP:
    //   POST /__control/fail?status=500  answer every request with that status
    //   POST /__control/reset            stop failing and forget the request log
    //   GET  /__control/requests         the request log
    if (url.pathname.startsWith('/__control/')) {
      if (url.pathname === '/__control/fail' && req.method === 'POST') {
        failure = Number(url.searchParams.get('status') ?? 500)
      } else if (url.pathname === '/__control/reset' && req.method === 'POST') {
        failure = initialFailure ?? null
        requests.length = 0
      } else if (
        url.pathname !== '/__control/requests' ||
        req.method !== 'GET'
      ) {
        return send(404, { errors: [{ message: 'Unknown control route' }] })
      }
      return send(200, { failure, requests })
    }

    const entry = {
      url: req.url ?? '',
      authorization: req.headers.authorization,
      status: 200,
    }
    requests.push(entry)
    const reply = (status: number, body: unknown) => {
      entry.status = status
      return send(status, body)
    }

    if (failure !== null) {
      return reply(failure, { errors: [{ message: `Forced ${failure}` }] })
    }
    if (req.headers.authorization !== `Bearer ${token}`) {
      return reply(401, { errors: [{ message: 'Invalid or missing API key' }] })
    }
    if (url.pathname !== '/countries/v5') {
      return reply(404, { errors: [{ message: 'Not found' }] })
    }

    const limit = Math.min(
      Number(url.searchParams.get('limit') ?? DEFAULT_LIMIT),
      MAX_LIMIT
    )
    const offset = Number(url.searchParams.get('offset') ?? 0)
    const requested = url.searchParams.get('response_fields')
    const page = countries.slice(offset, offset + limit)
    const objects = requested
      ? page.map((c) => project(c, requested.split(',')))
      : page

    reply(200, {
      data: {
        objects,
        meta: {
          total: countries.length,
          count: objects.length,
          limit,
          offset,
          more: offset + objects.length < countries.length,
          request_id: `fake-${requests.length}`,
          duration: 1,
        },
      },
    })
  })

  await new Promise<void>((resolve) => server.listen(port, resolve))
  const { port: boundPort } = server.address() as AddressInfo

  return {
    url: `http://localhost:${boundPort}/countries/v5`,
    requests,
    failWith: (status) => {
      failure = status
    },
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()))
      }),
  }
}
