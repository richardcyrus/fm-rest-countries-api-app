import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import {
  getAllCountries,
  getBorderCountryByCode,
  getCountriesByRegion,
  getCountryByCode,
  getCountryByName,
  getRegionList,
} from '../api/client'
import type {
  BorderCountrySummary,
  CountryDetail,
  CountrySummary,
  Region,
} from '../types'
import slugify from '../utils/slugify'
import type { SearchParams } from '../types'

type QueryKey = [
  'countries',
  { params: SearchParams | '' },
  ...ReadonlyArray<unknown>,
]

const formatPopulation = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(value)
}

const searchCountries = ({ queryKey }: { queryKey: QueryKey }) => {
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  const [_key, { params }] = queryKey

  if (typeof params === 'undefined' || params === '') {
    return getAllCountries()
  }

  if (
    Object.prototype.hasOwnProperty.call(params, 'type') &&
    params.type === 'region' &&
    typeof params.value === 'string'
  ) {
    return getCountriesByRegion(params.value)
  }

  if (
    Object.prototype.hasOwnProperty.call(params, 'type') &&
    typeof params.value === 'string' &&
    params.type === 'search' &&
    params.value !== ''
  ) {
    return getCountryByName(params.value)
  }

  return getAllCountries()
}

export function useRegionsQuery() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: getRegionList,
    select: useCallback(
      (data: Region[]) => ({
        regions: data.reduce<Record<string, string>>((acc, entry) => {
          // We set the separator to a literal space, so it is encoded
          // correctly when sent to the API.
          const slug = slugify(entry.region, ' ')
          acc[slug] = entry.region
          return acc
        }, {}),
      }),
      []
    ),
  })
}

export function useCountriesQuery(params: SearchParams) {
  return useQuery({
    queryKey: ['countries', { params }],
    queryFn: searchCountries,
    select: useCallback(
      (data: CountrySummary[]) => ({
        countries: data.map((country) => {
          return {
            flag: country.flags.svg,
            name: country.name.common,
            cca3: country.cca3,
            capital: country.capital ? country.capital.join(', ') : undefined,
            region: country.region,
            population: formatPopulation(country.population),
          }
        }),
      }),
      []
    ),
  })
}

export const useCountryQuery = (code: string) => {
  return useQuery({
    queryKey: ['country', code],
    queryFn: () => getCountryByCode(code),
    select: useCallback((data: CountryDetail) => {
      let topLevelDomains = ''
      let languages = ''
      let currencies = ''
      let nativeName = ''

      if (data.tld && data.tld.length > 1) {
        topLevelDomains = data.tld.join(', ')
      } else if (data.tld && data.tld.length === 1) {
        topLevelDomains = data.tld[0]
      }

      if (data.languages) {
        languages = Object.values(data.languages).join(', ')
      }

      if (data.currencies) {
        currencies = Object.keys(data.currencies)
          .map((key) => data.currencies?.[key].name)
          .join(', ')
      }

      if (data.name.nativeName) {
        const nativeNames = Object.values(data.name.nativeName).map(
          (n) => n.official
        )
        nativeName = nativeNames[0]
      }

      return {
        flag: data.flags.svg,
        name: data.name.common,
        nativeName: nativeName,
        population: formatPopulation(data.population),
        region: data.region,
        subregion: data.subregion,
        capital: data.capital ? data.capital.join(', ') : undefined,
        topLevelDomain: topLevelDomains,
        currencies: currencies,
        languages: languages,
        borders: data.borders,
        cca3: data.cca3,
      }
    }, []),
  })
}

export const useBorderCountryQuery = (code: string) => {
  return useQuery({
    queryKey: ['borderCountry', [code]],
    queryFn: () => getBorderCountryByCode(code),
    select: useCallback(
      (data: BorderCountrySummary) => ({
        name: data.name.common,
        cca3: data.cca3,
      }),
      []
    ),
  })
}
