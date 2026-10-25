import { describe, expect, it } from 'vite-plus/test'
import { DEFAULT_API_URL, loadConfig } from './config'

describe('loadConfig', () => {
  it('requires the API token', () => {
    expect(() => loadConfig({})).toThrow(/COUNTRIES_API_TOKEN/)
    expect(() => loadConfig({ COUNTRIES_API_TOKEN: '' })).toThrow()
  })

  it('applies defaults', () => {
    expect(loadConfig({ COUNTRIES_API_TOKEN: 'abc' })).toEqual({
      baseUrl: DEFAULT_API_URL,
      token: 'abc',
      ttlMs: 86_400_000,
    })
  })

  it('accepts overrides and rejects a bad URL', () => {
    expect(
      loadConfig({
        COUNTRIES_API_TOKEN: 'abc',
        COUNTRIES_API_URL: 'http://localhost:4010/countries/v5',
        COUNTRIES_CACHE_TTL_SECONDS: '60',
      })
    ).toMatchObject({
      baseUrl: 'http://localhost:4010/countries/v5',
      ttlMs: 60_000,
    })

    expect(() =>
      loadConfig({ COUNTRIES_API_TOKEN: 'abc', COUNTRIES_API_URL: 'nope' })
    ).toThrow()
  })
})
