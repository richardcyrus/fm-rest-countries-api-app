// @vitest-environment node
import { expect, test } from 'vitest'

test('getRegionList', async () => {
  const response = await fetch(
    'https://restcountries.com/v3.1/all?fields=region'
  )

  expect(response.status).toBe(200)
  expect(response.statusText).toBe('OK')
  await expect(response.json()).resolves.toContainEqual({
    region: 'Americas',
  })
})

test('getAllCountries', async () => {
  const response = await fetch(
    'https://restcountries.com/v3.1/all?fields=cca3,capital,flags,name,population,region'
  )

  expect(response.status).toBe(200)
  expect(response.statusText).toBe('OK')
  await expect(response.json()).resolves.toContainEqual({
    flags: {
      png: 'https://flagcdn.com/w320/ag.png',
      svg: 'https://flagcdn.com/ag.svg',
      alt: 'The flag of Antigua and Barbuda has a red field with an inverted isosceles triangle based on the top edge and spanning the height of the field. This triangle has three horizontal bands of black, light blue and white, with the light blue band half the height of the two other bands. The top half of a golden-yellow sun is situated in the lower two-third of the black band to depict a rising sun.',
    },
    name: {
      common: 'Antigua and Barbuda',
      official: 'Antigua and Barbuda',
      nativeName: {
        eng: {
          official: 'Antigua and Barbuda',
          common: 'Antigua and Barbuda',
        },
      },
    },
    cca3: 'ATG',
    capital: ["Saint John's"],
    region: 'Americas',
    population: 103603,
  })
})

test('getCountriesByRegion', async () => {
  const response = await fetch(
    'https://restcountries.com/v3.1/region/europe?fields=cca3,capital,flags,name,population,region'
  )

  expect(response.status).toBe(200)
  expect(response.statusText).toBe('OK')
  await expect(response.json()).resolves.toContainEqual({
    flags: {
      png: 'https://flagcdn.com/w320/it.png',
      svg: 'https://flagcdn.com/it.svg',
      alt: 'The flag of Italy is composed of three equal vertical bands of green, white and red.',
    },
    name: {
      common: 'Italy',
      official: 'Italian Republic',
      nativeName: {
        ita: {
          official: 'Repubblica italiana',
          common: 'Italia',
        },
      },
    },
    cca3: 'ITA',
    capital: ['Rome'],
    region: 'Europe',
    population: 58927633,
  })
})

test('getCountryByName', async () => {
  const response = await fetch(
    'https://restcountries.com/v3.1/name/czechia?fields=cca3,capital,flags,name,population,region'
  )

  expect(response.status).toBe(200)
  expect(response.statusText).toBe('OK')
  await expect(response.json()).resolves.toContainEqual({
    flags: {
      png: 'https://flagcdn.com/w320/cz.png',
      svg: 'https://flagcdn.com/cz.svg',
      alt: 'The flag of Czechia is composed of two equal horizontal bands of white and red, with a blue isosceles triangle superimposed on the hoist side of the field. The triangle has its base on the hoist end and spans about two-fifth the width of the field.',
    },
    name: {
      common: 'Czechia',
      official: 'Czech Republic',
      nativeName: {
        ces: {
          official: 'Česká republika',
          common: 'Česko',
        },
        slk: {
          official: 'Česká republika',
          common: 'Česko',
        },
      },
    },
    cca3: 'CZE',
    capital: ['Prague'],
    region: 'Europe',
    population: 10882341,
  })
})

test('getCountryByCode', async () => {
  const response = await fetch(
    'https://restcountries.com/v3.1/alpha/cze?fields=cca3,borders,capital,currencies,flags,languages,name,population,region,subregion,tld'
  )

  expect(response.status).toBe(200)
  expect(response.statusText).toBe('OK')
  await expect(response.json()).resolves.toEqual({
    flags: {
      png: 'https://flagcdn.com/w320/cz.png',
      svg: 'https://flagcdn.com/cz.svg',
      alt: 'The flag of Czechia is composed of two equal horizontal bands of white and red, with a blue isosceles triangle superimposed on the hoist side of the field. The triangle has its base on the hoist end and spans about two-fifth the width of the field.',
    },
    name: {
      common: 'Czechia',
      official: 'Czech Republic',
      nativeName: {
        ces: {
          official: 'Česká republika',
          common: 'Česko',
        },
        slk: {
          official: 'Česká republika',
          common: 'Česko',
        },
      },
    },
    tld: ['.cz'],
    cca3: 'CZE',
    currencies: {
      CZK: {
        name: 'Czech koruna',
        symbol: 'Kč',
      },
    },
    capital: ['Prague'],
    region: 'Europe',
    subregion: 'Central Europe',
    languages: {
      ces: 'Czech',
      slk: 'Slovak',
    },
    borders: ['AUT', 'DEU', 'POL', 'SVK'],
    population: 10882341,
  })
})

test('getBorderCountryByCode', async () => {
  const response = await fetch(
    'https://restcountries.com/v3.1/alpha/cze?fields=cca3,name,flags'
  )

  expect(response.status).toBe(200)
  expect(response.statusText).toBe('OK')
  await expect(response.json()).resolves.toEqual({
    flags: {
      png: 'https://flagcdn.com/w320/cz.png',
      svg: 'https://flagcdn.com/cz.svg',
      alt: 'The flag of Czechia is composed of two equal horizontal bands of white and red, with a blue isosceles triangle superimposed on the hoist side of the field. The triangle has its base on the hoist end and spans about two-fifth the width of the field.',
    },
    name: {
      common: 'Czechia',
      official: 'Czech Republic',
      nativeName: {
        ces: {
          official: 'Česká republika',
          common: 'Česko',
        },
        slk: {
          official: 'Česká republika',
          common: 'Česko',
        },
      },
    },
    cca3: 'CZE',
  })
})
