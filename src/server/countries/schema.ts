import { z } from 'zod'

/**
 * The canonical in-app Country. Every consumer works from this shape; the
 * upstream v5 contract is translated into it in exactly one place
 * (`upstreamCountrySchema` below).
 */
export const countrySchema = z.object({
  cca3: z.string(),
  name: z.string(),
  nativeName: z.string().optional(),
  flag: z.object({ svg: z.string(), alt: z.string().optional() }),
  capital: z.array(z.string()),
  region: z.string(),
  subregion: z.string().optional(),
  population: z.number(),
  topLevelDomains: z.array(z.string()),
  currencies: z.array(z.string()),
  languages: z.array(z.string()),
  borders: z.array(z.string()),
})

export type Country = z.infer<typeof countrySchema>

const nativeNamesSchema = z.record(
  z.string(),
  z.object({ common: z.string(), official: z.string() })
)

/** One country object as returned by the v5 API (only the fields we use). */
export const upstreamCountrySchema = z
  .object({
    names: z.object({
      common: z.string(),
      native: nativeNamesSchema.nullish(),
    }),
    codes: z.object({ alpha_3: z.string() }),
    capitals: z.array(z.object({ name: z.string() })).nullish(),
    flag: z.object({
      url_svg: z.string(),
      description: z.string().nullish(),
    }),
    region: z.string(),
    subregion: z.string().nullish(),
    borders: z.array(z.string()).nullish(),
    currencies: z.array(z.object({ name: z.string() })).nullish(),
    languages: z.array(z.object({ name: z.string() })).nullish(),
    tlds: z.array(z.string()).nullish(),
    population: z.number(),
  })
  .transform((c): Country => ({
    cca3: c.codes.alpha_3,
    name: c.names.common,
    nativeName: Object.values(c.names.native ?? {}).at(0)?.official,
    flag: { svg: c.flag.url_svg, alt: c.flag.description || undefined },
    capital: (c.capitals ?? []).map((capital) => capital.name),
    region: c.region,
    subregion: c.subregion || undefined,
    population: c.population,
    topLevelDomains: c.tlds ?? [],
    currencies: (c.currencies ?? []).map((currency) => currency.name),
    languages: (c.languages ?? []).map((language) => language.name),
    borders: c.borders ?? [],
  }))

/** The paged envelope the v5 list endpoint wraps results in. */
export const upstreamPageSchema = z.object({
  data: z.object({
    objects: z.array(z.unknown()),
    meta: z.object({ more: z.boolean().nullish() }),
  }),
})

/**
 * A Country is identified by its alpha-3 code. The API also lists a few de
 * facto states (e.g. Abkhazia) with an empty code; they cannot be linked to
 * or looked up, so they are not kept.
 */
export const hasAlpha3Code = (country: Country) => country.cca3 !== ''
