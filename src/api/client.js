import axios from 'axios'

const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: 'https://restcountries.com/v2',
  responseType: 'json',
})

export const getAllCountries = () => {
  const fields = [
    'name',
    'alpha3Code',
    'capital',
    'region',
    'population',
    'flag',
  ]

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get('/all', { params: queryParams })
    .then((response) => response.data)
}

export const getCountriesByRegion = (region) => {
  const fields = [
    'name',
    'alpha3Code',
    'capital',
    'region',
    'population',
    'flag',
  ]

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/region/${region}`, { params: queryParams })
    .then((response) => response.data)
}

export const getCountryByName = (name) => {
  const fields = [
    'name',
    'topLevelDomain',
    'alpha3Code',
    'capital',
    'region',
    'subregion',
    'population',
    'borders',
    'nativeName',
    'currencies',
    'languages',
    'flag',
  ]

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/name/${name}`, { params: queryParams })
    .then((response) => response.data)
}

export const getCountryByCode = (code) => {
  const fields = [
    'name',
    'topLevelDomain',
    'alpha3Code',
    'capital',
    'region',
    'subregion',
    'population',
    'borders',
    'nativeName',
    'currencies',
    'languages',
    'flag',
  ]

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/alpha/${code}`, { params: queryParams })
    .then((response) => response.data)
}

export const getBorderCountryByCode = (code) => {
  const fields = ['name', 'alpha3Code']

  const queryParams = {
    fields: fields.join(','),
  }

  return client
    .get(`/alpha/${code}`, { params: queryParams })
    .then((response) => response.data)
}
