import axios from 'redaxios'

const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'https://restcountries.com/v2',
  responseType: 'json',
})

export const getRegionList = async () => {
  const queryParams = { fields: 'region' }

  return client
    .get('/all', { params: queryParams })
    .then((response) => response.data)
}

export const getAllCountries = async () => {
  const fields = [
    'alpha2Code',
    'alpha3Code',
    'capital',
    'flag',
    'name',
    'population',
    'region',
  ]

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get('/all', { params: queryParams })
    .then((response) => response.data)
}

export const getCountriesByRegion = async (region: string) => {
  const fields = [
    'alpha2Code',
    'alpha3Code',
    'capital',
    'flag',
    'name',
    'population',
    'region',
  ]

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/region/${region}`, { params: queryParams })
    .then((response) => response.data)
}

export const getCountryByName = async (name: string) => {
  const fields = [
    'alpha2Code',
    'alpha3Code',
    'capital',
    'flag',
    'name',
    'population',
    'region',
  ]

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/name/${name}`, { params: queryParams })
    .then((response) => response.data)
}

export const getCountryByCode = async (code: string) => {
  const fields = [
    'alpha2Code',
    'alpha3Code',
    'borders',
    'capital',
    'currencies',
    'flag',
    'languages',
    'name',
    'nativeName',
    'population',
    'region',
    'subregion',
    'topLevelDomain',
  ]

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/alpha/${code}`, { params: queryParams })
    .then((response) => response.data)
}

export const getBorderCountryByCode = async (code: string) => {
  const fields = ['alpha2Code', 'alpha3Code', 'name']

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/alpha/${code}`, { params: queryParams })
    .then((response) => response.data)
}
