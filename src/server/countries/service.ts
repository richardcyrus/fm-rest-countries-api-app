import { createCache } from './cache'
import type { CountriesConfig } from './config'
import {
  findBorderCountries,
  findByCode,
  listRegions,
  queryCountries,
  type CountryQuery,
} from './query'
import { fetchAllCountries } from './upstream'
import { toDetail } from './view'

type ServiceOptions = CountriesConfig & {
  fetch?: typeof fetch
  now?: () => number
  onRefreshError?: (error: unknown) => void
}

/** The server-held country list and the questions the app asks of it. */
export function createCountryService({
  baseUrl,
  token,
  ttlMs,
  fetch: fetchImpl,
  now,
  onRefreshError,
}: ServiceOptions) {
  const cache = createCache({
    load: () => fetchAllCountries({ baseUrl, token, fetch: fetchImpl }),
    ttlMs,
    now,
    onRefreshError,
  })

  return {
    async search(query: CountryQuery) {
      return queryCountries(await cache.get(), query)
    },
    async regions() {
      return listRegions(await cache.get())
    },
    async detail(code: string) {
      const country = findByCode(await cache.get(), code)
      return country ? toDetail(country) : undefined
    },
    async borderCountries(codes: string[]) {
      return findBorderCountries(await cache.get(), codes)
    },
  }
}

export type CountryService = ReturnType<typeof createCountryService>
