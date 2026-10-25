import { describe, expect, it } from 'vite-plus/test'
import sampleCanada from '../../../test/fixtures/sample-canada.v5.json'
import { upstreamCountrySchema, upstreamPageSchema } from './schema'

describe('upstreamCountrySchema', () => {
  it('translates a v5 country into the app Country', () => {
    expect(upstreamCountrySchema.parse(sampleCanada)).toEqual({
      cca3: 'CAN',
      name: 'Canada',
      nativeName: 'Canada',
      flag: {
        svg: 'https://flags.restcountries.com/v5/svg/ca.svg',
        alt: expect.stringContaining('The flag of Canada'),
      },
      capital: ['Ottawa'],
      region: 'Americas',
      subregion: 'North America',
      population: 41798407,
      topLevelDomains: ['.ca'],
      currencies: ['Canadian dollar'],
      languages: ['English', 'French'],
      borders: ['USA'],
    })
  })

  it('tolerates missing and null optional fields', () => {
    const minimal = {
      names: { common: 'Nowhere', native: null },
      codes: { alpha_3: 'NWH' },
      flag: { url_svg: 'https://example.test/nwh.svg' },
      region: '',
      population: 0,
    }

    expect(upstreamCountrySchema.parse(minimal)).toEqual({
      cca3: 'NWH',
      name: 'Nowhere',
      nativeName: undefined,
      flag: { svg: 'https://example.test/nwh.svg', alt: undefined },
      capital: [],
      region: '',
      subregion: undefined,
      population: 0,
      topLevelDomains: [],
      currencies: [],
      languages: [],
      borders: [],
    })
  })

  it('rejects a country without an alpha-3 code', () => {
    const { codes: _codes, ...broken } = sampleCanada

    expect(() => upstreamCountrySchema.parse(broken)).toThrow()
  })
})

describe('upstreamPageSchema', () => {
  it('requires the data.objects / data.meta envelope', () => {
    expect(() => upstreamPageSchema.parse({ objects: [] })).toThrow()
    expect(
      upstreamPageSchema.parse({ data: { objects: [], meta: { more: false } } })
    ).toEqual({ data: { objects: [], meta: { more: false } } })
  })
})
