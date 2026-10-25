import { describe, expect, it } from 'vite-plus/test'
import {
  findBorderCountries,
  findByCode,
  listRegions,
  queryCountries,
} from './query'
import { countries } from './testing'

describe('queryCountries', () => {
  it('returns the first page sorted by name, with a next cursor', () => {
    const page = queryCountries(countries, { pageSize: 5 })

    expect(page.items).toHaveLength(5)
    expect(page.total).toBe(countries.length)
    expect(page.nextCursor).toBe(5)
    expect(page.items.map((c) => c.name)).toEqual(
      page.items.map((c) => c.name).sort((a, b) => a.localeCompare(b))
    )
  })

  it('pages through every country exactly once', () => {
    const seen: string[] = []
    let cursor: number | null = 0

    while (cursor !== null) {
      const page = queryCountries(countries, { cursor, pageSize: 24 })
      seen.push(...page.items.map((c) => c.cca3))
      cursor = page.nextCursor
    }

    expect(seen).toHaveLength(countries.length)
    expect(new Set(seen).size).toBe(countries.length)
  })

  it('has no next cursor on the last page', () => {
    const page = queryCountries(countries, { cursor: countries.length - 1 })

    expect(page.items).toHaveLength(1)
    expect(page.nextCursor).toBeNull()
  })

  it('matches names case-insensitively by substring', () => {
    const page = queryCountries(countries, { q: '  CZECH ' })

    expect(page.items.map((c) => c.name)).toContain('Czechia')
    expect(page.total).toBe(page.items.length)
  })

  it('filters by region slug and combines with a name search', () => {
    const europe = queryCountries(countries, {
      region: 'europe',
      pageSize: 500,
    })
    expect(europe.items.every((c) => c.region === 'Europe')).toBe(true)

    const both = queryCountries(countries, { region: 'europe', q: 'czech' })
    expect(both.items.map((c) => c.cca3)).toEqual(['CZE'])
  })

  it('returns nothing for an unknown region or name', () => {
    expect(queryCountries(countries, { region: 'atlantis' }).total).toBe(0)
    expect(queryCountries(countries, { q: 'zzzz' })).toEqual({
      items: [],
      nextCursor: null,
      total: 0,
    })
  })
})

describe('listRegions', () => {
  it('lists distinct regions sorted, with slugs', () => {
    expect(listRegions(countries)).toEqual([
      { slug: 'africa', label: 'Africa' },
      { slug: 'americas', label: 'Americas' },
      { slug: 'antarctic', label: 'Antarctic' },
      { slug: 'asia', label: 'Asia' },
      { slug: 'europe', label: 'Europe' },
      { slug: 'oceania', label: 'Oceania' },
    ])
  })
})

describe('lookups', () => {
  it('finds a country by code regardless of case', () => {
    expect(findByCode(countries, 'cze')?.name).toBe('Czechia')
    expect(findByCode(countries, 'XXX')).toBeUndefined()
  })

  it('resolves border codes in order and skips unknown ones', () => {
    expect(findBorderCountries(countries, ['SVK', 'XXX', 'AUT'])).toEqual([
      { cca3: 'SVK', name: 'Slovakia' },
      { cca3: 'AUT', name: 'Austria' },
    ])
  })
})
