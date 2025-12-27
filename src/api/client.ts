import axios from 'redaxios'

const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'https://restcountries.com/v3.1',
  responseType: 'json',
})

export const getRegionList = async () => {
  const queryParams = { fields: 'region' }

  return client
    .get('/all', { params: queryParams })
    .then((response) => response.data)
}

export const getAllCountries = async () => {
  const fields = ['cca3', 'capital', 'flags', 'name', 'population', 'region']

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get('/all', { params: queryParams })
    .then((response) => response.data)
}

export const getCountriesByRegion = async (region: string) => {
  const fields = ['cca3', 'capital', 'flags', 'name', 'population', 'region']

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/region/${region.toLowerCase()}`, { params: queryParams })
    .then((response) => response.data)
}

export const getCountryByName = async (name: string) => {
  const fields = ['cca3', 'capital', 'flags', 'name', 'population', 'region']

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/name/${name.toLowerCase()}`, { params: queryParams })
    .then((response) => response.data)
}

export const getCountryByCode = async (code: string) => {
  const fields = [
    'cca3',
    'borders',
    'capital',
    'currencies',
    'flags',
    'languages',
    'name',
    'population',
    'region',
    'subregion',
    'tld',
  ]

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/alpha/${code.toLowerCase()}`, { params: queryParams })
    .then((response) => response.data)
}

export const getBorderCountryByCode = async (code: string) => {
  const fields = ['cca3', 'name', 'flags']

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/alpha/${code.toLowerCase()}`, { params: queryParams })
    .then((response) => response.data)
}
