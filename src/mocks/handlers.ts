import { http, HttpResponse } from 'msw'
import type {
  CountryDetailOrBorderSummary,
  CountrySummary,
  RegionOrCountrySummary,
} from '../../types.ts'

import countries from './data/countries.json'

const endpoint = 'https://restcountries.com/v3.1'

export const handlers = [
  http.get(`${endpoint}/all`, ({ request }) => {
    const url = new URL(request.url)
    const fields = (url.searchParams.get('fields') ?? '').split(',')

    const results = countries.reduce<RegionOrCountrySummary[]>(
      (accumulator, item) => {
        const record: RegionOrCountrySummary = {}

        // @ts-expect-error TS7053
        fields.forEach((field) => (record[field] = item[field]))
        accumulator.push(record)

        return accumulator
      },
      []
    )

    return HttpResponse.json(results, { status: 200 })
  }),

  http.get(`${endpoint}/region/:region`, ({ request, params }) => {
    const url = new URL(request.url)
    const { region } = params
    const fields = (url.searchParams.get('fields') ?? '').split(',')

    const results = countries.reduce<Partial<CountrySummary>[]>(
      (accumulator, item) => {
        const record: Partial<CountrySummary> = {}

        if (item.region.toLowerCase() === region) {
          // @ts-expect-error TS7053
          fields.forEach((field) => (record[field] = item[field]))

          accumulator.push(record)
        }

        return accumulator
      },
      []
    )

    return HttpResponse.json(results, { status: 200 })
  }),

  http.get(`${endpoint}/name/:partialName`, ({ request, params }) => {
    const url = new URL(request.url)
    const { partialName } = params
    const fields = (url.searchParams.get('fields') ?? '').split(',')

    const results = countries.reduce<Partial<CountrySummary>[]>(
      (accumulator, item) => {
        const country: Partial<CountrySummary> = {}

        if (
          typeof partialName === 'string' &&
          item.name.common.toLowerCase().includes(partialName.toLowerCase())
        ) {
          // @ts-expect-error TS7053
          fields.forEach((field) => (country[field] = item[field]))
          accumulator.push(country)
        }

        return accumulator
      },
      []
    )

    return HttpResponse.json(results, { status: 200 })
  }),

  http.get(`${endpoint}/alpha/:code`, ({ request, params }) => {
    const url = new URL(request.url)
    const { code } = params
    const fields = (url.searchParams.get('fields') ?? '').split(',')

    const result = countries.reduce<CountryDetailOrBorderSummary>(
      (accumulator, item) => {
        if (
          typeof code === 'string' &&
          item.cca3.toLowerCase() === code.toLowerCase()
        ) {
          // @ts-expect-error TS7053
          fields.forEach((field) => (accumulator[field] = item[field]))
        }
        return accumulator
      },
      {}
    )

    return HttpResponse.json(result, { status: 200 })
  }),
]
