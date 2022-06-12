import { rest } from 'msw'

import countries from './data/countries.json'

const endpoint = 'https://restcountries.com/v2'

export const handlers = [
  rest.get(`${endpoint}/all`, (req, res, ctx) => {
    // const fields = req.url.searchParams.get('fields');
    return res(ctx.status(200), ctx.json(countries))
  }),

  rest.get(`${endpoint}/name/:name`, (req, res, ctx) => {
    const { name: pname } = req.params
    // const fields = req.url.searchParams.get('fields');

    let results = countries.filter((item) =>
      item.name.toLowerCase().includes(pname)
    )

    return res(ctx.status(200), ctx.json(results))
  }),

  rest.get(`${endpoint}/region/:region`, (req, res, ctx) => {
    const { region } = req.params
    // const fields = req.url.searchParams.get('fields');

    let results = countries.filter((item) =>
      item.region.toLowerCase().includes(region)
    )

    return res(ctx.status(200), ctx.json(results))
  }),

  rest.get(`${endpoint}/alpha/:code`, (req, res, ctx) => {
    const { code } = req.params
    // const fields = req.url.searchParams.get('fields');

    let result = countries.find((item) => item.alpha3Code === code)

    return res(ctx.status(200), ctx.json(result))
  }),
]
