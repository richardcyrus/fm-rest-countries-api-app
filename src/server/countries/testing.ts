import { loadCountriesFixture } from '../../../test/fixtures/load'
import { hasAlpha3Code, upstreamCountrySchema, type Country } from './schema'

/** The fixture countries the app keeps, translated to the app Country. */
export const countries: Country[] = loadCountriesFixture()
  .map((c) => upstreamCountrySchema.parse(c))
  .filter(hasAlpha3Code)
