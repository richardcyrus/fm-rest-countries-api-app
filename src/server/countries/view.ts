import { z } from 'zod'
import type { Country } from './schema'

export const countrySummarySchema = z.object({
  cca3: z.string(),
  name: z.string(),
  flag: z.string(),
  capital: z.string().optional(),
  region: z.string(),
  population: z.string(),
})

export const countryDetailSchema = countrySummarySchema.extend({
  nativeName: z.string(),
  subregion: z.string().optional(),
  topLevelDomain: z.string(),
  currencies: z.string(),
  languages: z.string(),
  borders: z.array(z.string()),
})

export const borderCountrySchema = z.object({
  cca3: z.string(),
  name: z.string(),
})

export type CountrySummary = z.infer<typeof countrySummarySchema>
export type CountryDetail = z.infer<typeof countryDetailSchema>
export type BorderCountry = z.infer<typeof borderCountrySchema>

export const formatPopulation = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'decimal' }).format(value)

const joinOrUndefined = (values: string[]) =>
  values.length > 0 ? values.join(', ') : undefined

export function toSummary(country: Country): CountrySummary {
  return {
    cca3: country.cca3,
    name: country.name,
    flag: country.flag.svg,
    capital: joinOrUndefined(country.capital),
    region: country.region,
    population: formatPopulation(country.population),
  }
}

export function toDetail(country: Country): CountryDetail {
  return {
    ...toSummary(country),
    nativeName: country.nativeName ?? '',
    subregion: country.subregion,
    topLevelDomain: country.topLevelDomains.join(', '),
    currencies: country.currencies.join(', '),
    languages: country.languages.join(', '),
    borders: country.borders,
  }
}

export function toBorderCountry(country: Country): BorderCountry {
  return { cca3: country.cca3, name: country.name }
}
