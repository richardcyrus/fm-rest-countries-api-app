import { describe, expect, it } from 'vite-plus/test'
import { countries } from './testing'
import { formatPopulation, toBorderCountry, toDetail, toSummary } from './view'

const czechia = countries.find((c) => c.cca3 === 'CZE')!

describe('view', () => {
  it('formats population with thousands separators', () => {
    expect(formatPopulation(10882341)).toBe('10,882,341')
  })

  it('builds a display-ready summary', () => {
    expect(toSummary(czechia)).toEqual({
      cca3: 'CZE',
      name: 'Czechia',
      flag: 'https://flags.restcountries.com/v5/svg/cz.svg',
      capital: 'Prague',
      region: 'Europe',
      population: '10,903,655',
    })
  })

  it('omits the capital when a country has none', () => {
    const antarctica = countries.find((c) => c.cca3 === 'ATA')!

    expect(toSummary(antarctica).capital).toBeUndefined()
  })

  it('flattens detail lists into display strings', () => {
    expect(toDetail(czechia)).toMatchObject({
      nativeName: 'Česká republika',
      subregion: 'Central Europe',
      topLevelDomain: '.cz',
      currencies: 'Czech koruna',
      languages: 'Czech, Slovak',
      borders: ['AUT', 'DEU', 'POL', 'SVK'],
    })
  })

  it('reduces a country to a border country', () => {
    expect(toBorderCountry(czechia)).toEqual({ cca3: 'CZE', name: 'Czechia' })
  })
})
