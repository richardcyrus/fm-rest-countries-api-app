import { loadConfig } from './config'
import { createCountryService, type CountryService } from './service'

let service: CountryService | undefined

/** The process-wide country service, created on first use from the environment. */
export function getCountryService(): CountryService {
  service ??= createCountryService({
    ...loadConfig(process.env),
    onRefreshError: (error) => {
      console.error(
        'Countries refresh failed; serving stale data:',
        error instanceof Error ? error.message : 'unknown error'
      )
    },
  })
  return service
}
