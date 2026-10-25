import slugify from '../../utils/slugify'
import type { Country } from './schema'
import {
  toBorderCountry,
  toSummary,
  type BorderCountry,
  type CountrySummary,
} from './view'

export const DEFAULT_PAGE_SIZE = 24

export type Region = { slug: string; label: string }

export type CountryQuery = {
  /** Case-insensitive substring of the country's common name. */
  q?: string
  /** A Region slug, as produced by `listRegions`. */
  region?: string
  /** Offset of the first item of the requested page. */
  cursor?: number
  pageSize?: number
}

export type CountryPage = {
  items: CountrySummary[]
  /** Cursor for the next page, or null when this is the last page. */
  nextCursor: number | null
  /** Number of Countries matching the query, across all pages. */
  total: number
}

const byName = (a: Country, b: Country) => a.name.localeCompare(b.name)

export function queryCountries(
  countries: Country[],
  {
    q = '',
    region,
    cursor = 0,
    pageSize = DEFAULT_PAGE_SIZE,
  }: CountryQuery = {}
): CountryPage {
  const needle = q.trim().toLowerCase()

  const matches = [...countries]
    .filter((country) => !region || slugify(country.region, '-') === region)
    .filter((country) => !needle || country.name.toLowerCase().includes(needle))
    .sort(byName)

  const end = cursor + pageSize

  return {
    items: matches.slice(cursor, end).map(toSummary),
    nextCursor: end < matches.length ? end : null,
    total: matches.length,
  }
}

export function listRegions(countries: Country[]): Region[] {
  const labels = new Set(
    countries.map((country) => country.region).filter((label) => label !== '')
  )

  return [...labels]
    .sort((a, b) => a.localeCompare(b))
    .map((label) => ({ slug: slugify(label, '-'), label }))
}

export function findByCode(
  countries: Country[],
  code: string
): Country | undefined {
  const wanted = code.toUpperCase()
  return countries.find((country) => country.cca3 === wanted)
}

export function findBorderCountries(
  countries: Country[],
  codes: string[]
): BorderCountry[] {
  return codes
    .map((code) => findByCode(countries, code))
    .filter((country) => country !== undefined)
    .map(toBorderCountry)
}
