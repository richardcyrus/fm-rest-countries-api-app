import { ZodError } from 'zod'
import {
  hasAlpha3Code,
  upstreamCountrySchema,
  upstreamPageSchema,
  type Country,
} from './schema'
import { RESPONSE_FIELDS } from './fields'

export { RESPONSE_FIELDS }

export const PAGE_LIMIT = 100

export class UpstreamError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'UpstreamError'
    this.status = status
  }
}

export type UpstreamConfig = {
  baseUrl: string
  token: string
  fetch?: typeof fetch
}

/** Fetch every page of the v5 country list and translate it to `Country[]`. */
export async function fetchAllCountries({
  baseUrl,
  token,
  fetch: fetchImpl = fetch,
}: UpstreamConfig): Promise<Country[]> {
  const countries: Country[] = []
  let offset = 0

  for (;;) {
    const url = new URL(baseUrl)
    url.searchParams.set('limit', String(PAGE_LIMIT))
    url.searchParams.set('offset', String(offset))
    url.searchParams.set('response_fields', RESPONSE_FIELDS)

    const response = await fetchImpl(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })

    // Only the status is surfaced: bodies and URLs can carry sensitive detail.
    if (!response.ok) {
      throw new UpstreamError(
        `Countries API responded ${response.status}`,
        response.status
      )
    }

    try {
      const page = upstreamPageSchema.parse(await response.json())
      const parsed = page.data.objects.map((object) =>
        upstreamCountrySchema.parse(object)
      )
      countries.push(...parsed.filter(hasAlpha3Code))

      if (!page.data.meta.more || parsed.length === 0) {
        return countries
      }
      offset += parsed.length
    } catch (error) {
      if (error instanceof ZodError || error instanceof SyntaxError) {
        throw new UpstreamError('Countries API response did not match contract')
      }
      throw error
    }
  }
}
