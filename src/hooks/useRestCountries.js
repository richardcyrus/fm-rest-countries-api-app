import { useCallback } from 'react'
import { useQuery } from 'react-query'
import {
  getCountryByCode,
} from '../utils/api'

const formatPopulation = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(value)
}
export const useCountryQuery = (code) => {
  return useQuery(['country', code], () => getCountryByCode(code), {
    select: useCallback(
      (data) => ({
        ...data,
        population: formatPopulation(data.population),
        topLevelDomains:
          data.topLevelDomain.length > 1
            ? data.topLevelDomain.join(', ')
            : data.topLevelDomain[0],
        languages:
          data.languages.length > 1
            ? data.languages.map((lang) => lang.name).join(', ')
            : data.languages[0].name,
        currencies:
          data.currencies.length > 1
            ? data.currencies.map((cur) => cur.name).join(', ')
            : data.currencies[0].name,
      }),
      []
    ),
  })
}
