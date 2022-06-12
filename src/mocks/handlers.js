import { rest } from 'msw'

import countries from './data/countries.json'

const endpoint = 'https://restcountries.com/v2'

export const handlers = [
  rest.get(`${endpoint}/all`, (req, res, ctx) => {
    const fields = req.url.searchParams.get('fields').split(',')

    let results = countries.reduce((accumulator, item) => {
      let country = {}

      fields.forEach((field) => (country[field] = item[field]))
      accumulator.push(country)

      return accumulator
    }, [])

    return res(ctx.status(200), ctx.json(results))
  }),

  rest.get(`${endpoint}/name/:partialName`, (req, res, ctx) => {
    const { partialName } = req.params
    const fields = req.url.searchParams.get('fields').split(',')

    let results = countries.reduce((accumulator, item) => {
      let country = {}

      if (item.name.toLowerCase().includes(partialName)) {
        fields.forEach((field) => (country[field] = item[field]))
        accumulator.push(country)
      }

      return accumulator
    }, [])

    return res(ctx.status(200), ctx.json(results))
  }),

  rest.get(`${endpoint}/region/:region`, (req, res, ctx) => {
    const { region } = req.params
    const fields = req.url.searchParams.get('fields').split(',')

    let results = countries.reduce((accumulator, item) => {
      let country = {}

      if (item.region.toLowerCase().includes(region)) {
        fields.forEach((field) => (country[field] = item[field]))
        accumulator.push(country)
      }

      return accumulator
    }, [])

    return res(ctx.status(200), ctx.json(results))
  }),

  rest.get(`${endpoint}/alpha/:code`, (req, res, ctx) => {
    const { code } = req.params
    const fields = req.url.searchParams.get('fields').split(',')

    let result = countries.reduce((accumulator, item) => {
      if (item.alpha2Code === code || item.alpha3Code === code) {
        fields.forEach((f) => (accumulator[f] = item[f]))
      }
      return accumulator
    }, {})

    return res(ctx.status(200), ctx.json(result))
  }),
]
