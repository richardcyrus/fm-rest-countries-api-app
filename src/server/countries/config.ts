import { z } from 'zod'

export const DEFAULT_API_URL = 'https://api.restcountries.com/countries/v5'

const configSchema = z.object({
  COUNTRIES_API_TOKEN: z.string().min(1, 'COUNTRIES_API_TOKEN is required'),
  COUNTRIES_API_URL: z.url().default(DEFAULT_API_URL),
  COUNTRIES_CACHE_TTL_SECONDS: z.coerce.number().positive().default(86_400),
})

export type CountriesConfig = {
  baseUrl: string
  token: string
  ttlMs: number
}

/** Validate the server environment once, at startup. */
export function loadConfig(
  env: Record<string, string | undefined>
): CountriesConfig {
  const parsed = configSchema.parse(env)

  return {
    baseUrl: parsed.COUNTRIES_API_URL,
    token: parsed.COUNTRIES_API_TOKEN,
    ttlMs: parsed.COUNTRIES_CACHE_TTL_SECONDS * 1000,
  }
}
