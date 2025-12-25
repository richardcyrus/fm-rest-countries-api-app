import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getAllCountries,
  getCountryByName,
  getCountryByCode,
  getCountriesByRegion,
  getBorderCountryByCode,
  getRegionList,
} from '../api/client'
import slugify from '../utils/slugify'

const formatPopulation = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(value)
}

const searchCountries = ({ queryKey }) => {
  // eslint-disable-next-line no-unused-vars
  const [_key, { params }] = queryKey

  if (typeof params === 'undefined' || params === '') {
    return getAllCountries()
  }

  if (
    Object.prototype.hasOwnProperty.call(params, 'type') &&
    params.type === 'region'
  ) {
    return getCountriesByRegion(params.value)
  }

  if (
    Object.prototype.hasOwnProperty.call(params, 'type') &&
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
      (data) => ({
        regions: data.reduce((acc, entry) => {
          // We set the separator to a literal space, so it is encoded
          // correctly when sent to the API.
          let slug = slugify(entry.region, ' ')
          acc[slug] = entry.region
          return acc
        }, {}),
      }),
      []
    ),
  })
}

export function useCountriesQuery(params) {
  return useQuery({
    queryKey: ['countries', { params }],
    queryFn: searchCountries,
    select: useCallback(
      (data) => ({
        countries: data.map((country) => ({
          ...country,
          flag: country.flag.includes('flagcdn')
            ? country.flag
            : `https://flagcdn.com/${country.alpha2Code.toLowerCase()}.svg`,
          population: formatPopulation(country.population),
        })),
      }),
      []
    ),
  })
}

export const useCountryQuery = (code) => {
  return useQuery({
    queryKey: ['country', code],
    queryFn: () => getCountryByCode(code),
    select: useCallback(
      (data) => ({
        ...data,
        population: formatPopulation(data.population),
        flag: data.flag.includes('flagcdn')
          ? data.flag
          : `https://flagcdn.com/${data.alpha2Code.toLowerCase()}.svg`,
        topLevelDomains:
          data.topLevelDomain.length > 1
            ? data.topLevelDomain.join(', ')
            : data.topLevelDomain[0],
        languages:
          data.languages.length > 1
            ? data.languages.map((lang) => lang.name).join(', ')
            : data.languages[0].name,
        currencies:
          data.currencies && data.currencies.length > 1
            ? data.currencies.map((money) => money.name).join(', ')
            : data.currencies instanceof Array
              ? data.currencies[0]?.name
              : '',
      }),
      []
    ),
  })
}

export const useBorderCountryQuery = (code) => {
  return useQuery({
    queryKey: ['borderCountry', [code]],
    queryFn: () => getBorderCountryByCode(code)})
}
