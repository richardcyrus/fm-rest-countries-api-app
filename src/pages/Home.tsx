import { useState, useEffect } from 'react'
import { useRegionsQuery, useCountriesQuery } from '../hooks/useRestCountries'
import { useQueryClient } from '@tanstack/react-query'
import useDebounce from '../hooks/useDebounce'
import { SearchIcon } from '@heroicons/react/outline'
import { VisuallyHidden } from 'radix-ui'

import FilterListBox from '../components/FilterListBox'
import Card from '../components/Card'
import Loading from '../components/Loading'

const filterDefault = {
  default: 'Filter by Region',
}

function Home() {
  const queryClient = useQueryClient()
  const [searchCountryName, setSearchCountryName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('default')

  const onInputChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRegion('default')
    setSearchCountryName(evt.target.value)
    setSearchTerm({ type: 'search', value: evt.target.value })
  }

  const onFilterChanged = (region: string) => {
    setSearchCountryName('')
    setSelectedRegion(region)
    setSearchTerm({ type: 'region', value: region })
  }

  const debouncedTerm = useDebounce(searchTerm)

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['regions'] })
  }, [queryClient])

  const { data, error, isLoading, isError } = useCountriesQuery(debouncedTerm)
  const { data: regionList } = useRegionsQuery()

  const regions = { ...filterDefault, ...regionList.regions }

  return (
    <>
      <main id="main-content" className="main-content" role="main">
        <div className="filter-bar">
          <label className="control-group">
            <VisuallyHidden.Root>Search for a country</VisuallyHidden.Root>
            <SearchIcon className="search-icon" />
            <input
              type="text"
              name="search-text"
              placeholder="Search for a country..."
              id="search-country"
              className="search-input"
              value={searchCountryName}
              onChange={onInputChanged}
            />
          </label>
          <div className="region-filter">
            <FilterListBox
              regions={regions}
              selectedRegion={selectedRegion}
              onFilterChanged={onFilterChanged}
            />
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <div className="card-container">
            <div>{error.message}</div>
          </div>
        ) : (
          <div className="card-container">
            {data.countries.map((country) => (
              <Card key={country.alpha3Code} {...country} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default Home
