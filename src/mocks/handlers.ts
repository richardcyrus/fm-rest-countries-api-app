import { http, HttpResponse } from 'msw'

import countries from './data/countries.json'

const endpoint = 'https://restcountries.com/v2'

export const handlers = [
  http.get(`${endpoint}/all`, ({ request }) => {
    const url = new URL(request.url)
    const fields = (url.searchParams.get('fields') ?? '').split(',')

    const results = countries.reduce((accumulator, item) => {
      const country = {}

      fields.forEach((field) => (country[field] = item[field]))
      accumulator.push(country)

      return accumulator
    }, [])

    return HttpResponse.json(results, { status: 200 })
  }),

  http.get(`${endpoint}/name/:partialName`, ({ request, params }) => {
    const url = new URL(request.url)
    const { partialName } = params
    const fields = (url.searchParams.get('fields') ?? '').split(',')

    const results = countries.reduce((accumulator, item) => {
      const country = {}

      if (item.name.toLowerCase().includes(partialName)) {
        fields.forEach((field) => (country[field] = item[field]))
        accumulator.push(country)
      }

      return accumulator
    }, [])

    return HttpResponse.json(results, { status: 200 })
  }),

  http.get(`${endpoint}/region/:region`, ({ request, params }) => {
    const url = new URL(request.url)
    const { region } = params
    const fields = (url.searchParams.get('fields') ?? '').split(',')

    const results = countries.reduce((accumulator, item) => {
      const country = {}

      if (item.region.toLowerCase() === region) {
        fields.forEach((field) => (country[field] = item[field]))
        accumulator.push(country)
      }

      return accumulator
    }, [])

    return HttpResponse.json(results, { status: 200 })
  }),

  http.get(`${endpoint}/alpha/:code`, ({ request, params }) => {
    const url = new URL(request.url)
    const { code } = params
    const fields = (url.searchParams.get('fields') ?? '').split(',')

    const result = countries.reduce((accumulator, item) => {
      if (item.alpha2Code === code || item.alpha3Code === code) {
        fields.forEach((f) => (accumulator[f] = item[f]))
      }
      return accumulator
    }, {})

    return HttpResponse.json(result, { status: 200 })
  }),
]
