export type Region = {
  region: string
}

export type CountrySummary = {
  name: {
    common: string
    official: string
    nativeName?: Record<string, { official: string; common: string }>
  }
  flags: { png: string; svg: string; alt?: string }
  cca3: string
  capital?: string[]
  population: number
  region: string
}

export type AddCountryDetail = {
  tld?: string[]
  currencies?: Record<string, { name: string; symbol: string }>
  subregion?: string
  languages?: Record<string, string>
  borders?: string[]
}

export type BorderCountrySummary = {
  name: {
    common: string
    official: string
    nativeName?: Record<string, { official: string; common: string }>
  }
  flags: { png: string; svg: string; alt?: string }
  cca3: string
}

export type CountryDetail = CountrySummary & AddCountryDetail

export type RegionOrCountrySummary = Partial<Region | CountrySummary>
export type CountryDetailOrBorderSummary = Partial<
  CountryDetail | BorderCountrySummary
>

// export type CountryDetails = {}
