import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { COUNTRY_CODE_PATTERN } from '../../utils/countryCode'
import { getCountryService } from './instance'

const UNAVAILABLE = 'Country data is temporarily unavailable. Please retry.'

/** Log the real failure on the server; show the browser a plain message. */
async function guard<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run()
  } catch (error) {
    console.error(
      'Country data request failed:',
      error instanceof Error ? error.message : 'unknown error'
    )
    throw new Error(UNAVAILABLE)
  }
}

const searchInputSchema = z.object({
  q: z.string().max(100).optional(),
  region: z.string().max(50).optional(),
  cursor: z.number().int().min(0).optional(),
})

const codeInputSchema = z.object({
  code: z.string().regex(COUNTRY_CODE_PATTERN),
})

export const searchCountries = createServerFn({ method: 'GET' })
  .validator(searchInputSchema)
  .handler(({ data }) => guard(() => getCountryService().search(data)))

export const getRegions = createServerFn({ method: 'GET' }).handler(() =>
  guard(() => getCountryService().regions())
)

/** A Country Detail and its Border Countries, or null for an unknown code. */
export const getCountryDetail = createServerFn({ method: 'GET' })
  .validator(codeInputSchema)
  .handler(({ data }) =>
    guard(async () => {
      const service = getCountryService()
      const detail = await service.detail(data.code)
      if (!detail) {
        return null
      }
      const borders = await service.borderCountries(detail.borders)
      return { detail, borders }
    })
  )
