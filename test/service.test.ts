// @vitest-environment node
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vite-plus/test'
import { startFakeUpstream, type FakeUpstream } from './fake-upstream/server'
import { createCountryService } from '../src/server/countries/service'
import {
  fetchAllCountries,
  UpstreamError,
} from '../src/server/countries/upstream'

const token = 'test-token'
let fake: FakeUpstream

beforeAll(async () => {
  fake = await startFakeUpstream({ token })
})

afterAll(() => fake.close())

beforeEach(() => {
  fake.failWith(null)
  fake.requests.length = 0
})

describe('fetchAllCountries', () => {
  it('follows every page and sends the Bearer token', async () => {
    const countries = await fetchAllCountries({ baseUrl: fake.url, token })

    // The fake lists 254 objects, 4 of them without an alpha-3 code.
    expect(countries).toHaveLength(250)
    expect(countries.every((c) => /^[A-Z]{3}$/.test(c.cca3))).toBe(true)
    expect(countries.map((c) => c.name)).not.toContain('Abkhazia')
    expect(fake.requests).toHaveLength(3)
    expect(
      fake.requests.every((r) => r.authorization === `Bearer ${token}`)
    ).toBe(true)
    expect(fake.requests[1].url).toContain('offset=100')
    expect(fake.requests[0].url).toContain('response_fields=')
  })

  it.each([401, 403, 429, 500])(
    'reports a %i without leaking details',
    async (status) => {
      fake.failWith(status)

      await expect(
        fetchAllCountries({ baseUrl: fake.url, token })
      ).rejects.toMatchObject({
        name: 'UpstreamError',
        status,
        message: `Countries API responded ${status}`,
      })
    }
  )

  it('rejects a wrong token', async () => {
    await expect(
      fetchAllCountries({ baseUrl: fake.url, token: 'wrong' })
    ).rejects.toMatchObject({ status: 401 })
  })

  it('reports a response that breaks the contract', async () => {
    const broken = await startFakeUpstream({ token, countries: [{ nope: 1 }] })

    try {
      await expect(
        fetchAllCountries({ baseUrl: broken.url, token })
      ).rejects.toThrow(UpstreamError)
    } finally {
      await broken.close()
    }
  })
})

describe('createCountryService', () => {
  const make = () =>
    createCountryService({ baseUrl: fake.url, token, ttlMs: 86_400_000 })

  it('answers every question from a single upstream fill', async () => {
    const service = make()

    const page = await service.search({ q: 'czech' })
    const regions = await service.regions()
    const detail = await service.detail('cze')
    const borders = await service.borderCountries(detail!.borders)

    expect(page.items.map((c) => c.cca3)).toEqual(['CZE'])
    expect(regions.map((r) => r.slug)).toContain('europe')
    expect(detail?.name).toBe('Czechia')
    expect(borders.map((b) => b.cca3)).toEqual(['AUT', 'DEU', 'POL', 'SVK'])
    expect(fake.requests).toHaveLength(3)
  })

  it('returns undefined for an unknown code', async () => {
    await expect(make().detail('XXX')).resolves.toBeUndefined()
  })

  it('serves stale data when the upstream later fails', async () => {
    let time = 0
    const service = createCountryService({
      baseUrl: fake.url,
      token,
      ttlMs: 1000,
      now: () => time,
      onRefreshError: () => {},
    })

    await service.regions()
    fake.failWith(429)
    time = 5000

    await expect(service.regions()).resolves.toHaveLength(6)
  })

  it('throws when there is no cache yet and the upstream fails', async () => {
    fake.failWith(403)

    await expect(make().regions()).rejects.toMatchObject({ status: 403 })
  })
})

describe('fake upstream control routes', () => {
  const control = (path: string, method = 'POST') =>
    fetch(new URL(`/__control/${path}`, fake.url), { method })
  const requestLog = async () =>
    (
      (await (await control('requests', 'GET')).json()) as {
        requests: { status: number }[]
      }
    ).requests

  it('fails on demand, logs the status, and resets', async () => {
    await control('fail?status=429')

    const failed = await fetch(fake.url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(failed.status).toBe(429)

    expect((await requestLog()).at(-1)).toMatchObject({ status: 429 })

    await control('reset')
    const recovered = await fetch(fake.url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(recovered.status).toBe(200)
    expect(await requestLog()).toEqual([
      expect.objectContaining({ status: 200 }),
    ])
  })

  it('does not apply the token check to control routes', async () => {
    expect((await control('requests', 'GET')).status).toBe(200)
  })
})
