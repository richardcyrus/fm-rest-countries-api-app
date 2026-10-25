import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import {
  getCountryDetail,
  getRegions,
  searchCountries,
} from '~/server/countries/functions'

const FIVE_MINUTES = 5 * 60 * 1000

export const regionsQueryOptions = queryOptions({
  queryKey: ['regions'],
  queryFn: () => getRegions(),
  staleTime: Infinity,
})

export const countriesQueryOptions = (filter: {
  q?: string
  region?: string
}) =>
  infiniteQueryOptions({
    queryKey: ['countries', filter],
    queryFn: ({ pageParam }) =>
      searchCountries({ data: { ...filter, cursor: pageParam } }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: FIVE_MINUTES,
  })

export const countryQueryOptions = (code: string) =>
  queryOptions({
    queryKey: ['country', code.toUpperCase()],
    queryFn: () => getCountryDetail({ data: { code } }),
    staleTime: FIVE_MINUTES,
  })
