// @vitest-environment node
//
// Checks the real v5 API against what the app (and the fake upstream) assume.
// Skipped unless LIVE_API=1; run it with `pnpm test:live`, which injects the
// token from 1Password.
import { afterAll, beforeAll, describe, expect, it } from 'vite-plus/test'
import { loadConfig } from '../src/server/countries/config'
import { listRegions } from '../src/server/countries/query'
import {
  upstreamCountrySchema,
  upstreamPageSchema,
} from '../src/server/countries/schema'
import {
  fetchAllCountries,
  PAGE_LIMIT,
  RESPONSE_FIELDS,
} from '../src/server/countries/upstream'
import { startFakeUpstream, type FakeUpstream } from './fake-upstream/server'

type Page = { objects: unknown[]; meta: Record<string, unknown> }

async function fetchRawPages(baseUrl: string, token: string): Promise<Page[]> {
  const pages: Page[] = []

  for (let offset = 0; ;) {
    const url = new URL(baseUrl)
    url.searchParams.set('limit', String(PAGE_LIMIT))
    url.searchParams.set('offset', String(offset))
    url.searchParams.set('response_fields', RESPONSE_FIELDS)

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(response.status).toBe(200)

    // Validate the envelope, but keep the raw data so meta is not stripped.
    const body: unknown = await response.json()
    upstreamPageSchema.parse(body)
    const data = (body as { data: Page }).data
    pages.push(data)
    offset += data.objects.length

    if (!data.meta.more || data.objects.length === 0) {
      return pages
    }
  }
}

/** Every dot-path the app reads, with the JSON types seen for it. */
const APP_PATHS = [
  'names.common',
  'names.native',
  'codes.alpha_3',
  'capitals',
  'flag.url_svg',
  'flag.description',
  'region',
  'subregion',
  'population',
  'borders',
  'currencies',
  'languages',
  'tlds',
]

function typeOf(value: unknown) {
  return value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value
}

function typeSignature(objects: unknown[]) {
  const signature: Record<string, string[]> = {}

  for (const path of APP_PATHS) {
    const types = new Set<string>()
    for (const object of objects) {
      const value = path
        .split('.')
        .reduce<unknown>(
          (current, key) =>
            typeof current === 'object' && current !== null
              ? (current as Record<string, unknown>)[key]
              : undefined,
          object
        )
      types.add(value === undefined ? 'absent' : typeOf(value))
    }
    signature[path] = [...types].sort()
  }

  return signature
}

describe.skipIf(process.env.LIVE_API !== '1')('live v5 contract', () => {
  let baseUrl: string
  let token: string
  let realPages: Page[]
  let realObjects: unknown[]
  let fake: FakeUpstream

  beforeAll(async () => {
    ;({ baseUrl, token } = loadConfig(process.env))
    realPages = await fetchRawPages(baseUrl, token)
    realObjects = realPages.flatMap((page) => page.objects)
    fake = await startFakeUpstream({ token: 'fake-token' })
  })

  afterAll(() => fake.close())

  it('pages with the meta the client relies on', () => {
    const last = realPages.at(-1)!.meta

    for (const page of realPages) {
      expect(page.meta).toMatchObject({
        total: expect.any(Number),
        count: expect.any(Number),
        limit: PAGE_LIMIT,
        offset: expect.any(Number),
        more: expect.any(Boolean),
      })
    }
    expect(last.more).toBe(false)
    expect(realObjects).toHaveLength(last.total as number)
  })

  it('returns objects that all satisfy the app schema', () => {
    for (const object of realObjects) {
      expect(() => upstreamCountrySchema.parse(object)).not.toThrow()
    }
  })

  it('yields unique, linkable countries from fetchAllCountries', async () => {
    const countries = await fetchAllCountries({ baseUrl, token })
    const codes = countries.map((c) => c.cca3)

    expect(countries.length).toBeGreaterThan(200)
    expect(codes.every((code) => /^[A-Z]{3}$/.test(code))).toBe(true)
    expect(new Set(codes).size).toBe(codes.length)
    expect(countries.every((c) => c.flag.svg.startsWith('https://'))).toBe(true)

    const known = new Set(codes)
    const dangling = countries.flatMap((c) =>
      c.borders.filter((border) => !known.has(border))
    )
    expect(dangling).toEqual([])
  })

  it('derives distinct, non-empty regions', async () => {
    const regions = listRegions(await fetchAllCountries({ baseUrl, token }))

    expect(regions.length).toBeGreaterThan(3)
    expect(new Set(regions.map((r) => r.slug)).size).toBe(regions.length)
    expect(regions.every((r) => r.slug && r.label)).toBe(true)
  })

  it('rejects a bad token with a 401 and an errors array', async () => {
    const response = await fetch(`${baseUrl}?limit=1`, {
      headers: { Authorization: 'Bearer not-a-real-key' },
    })

    expect(response.status).toBe(401)
    expect(await response.json()).toMatchObject({
      errors: [{ message: expect.any(String) }],
    })
  })

  it('has the same field types as the fake upstream', async () => {
    const fakePages = await fetchRawPages(fake.url, 'fake-token')
    const fakeObjects = fakePages.flatMap((page) => page.objects)

    expect(typeSignature(fakeObjects)).toEqual(typeSignature(realObjects))
  })

  it('has the same meta keys and page sizes as the fake upstream', async () => {
    const fakePages = await fetchRawPages(fake.url, 'fake-token')
    const realKeys = Object.keys(realPages[0].meta)

    for (const key of Object.keys(fakePages[0].meta)) {
      expect(realKeys).toContain(key)
    }
    const fullPageSizes = (pages: Page[]) =>
      pages.slice(0, -1).map((page) => page.objects.length)
    expect(fullPageSizes(fakePages)).toEqual(fullPageSizes(realPages))
  })
})
