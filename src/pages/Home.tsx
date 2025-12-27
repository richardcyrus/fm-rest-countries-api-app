import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useQueryClient } from '@tanstack/react-query'
import { VisuallyHidden } from 'radix-ui'
import { useEffect, useState } from 'react'
import useDebounce from '~/hooks/useDebounce'
import { useCountriesQuery, useRegionsQuery } from '~/hooks/useRestCountries'
import type { SearchParams } from '~/types'

import Card from '~/components/Card'
import FilterListBox from '~/components/FilterListBox'
import Loading from '~/components/Loading'

const filterDefault = {
  default: 'Filter by Region',
}

function Home() {
  const queryClient = useQueryClient()
  const [searchCountryName, setSearchCountryName] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<SearchParams>({})
  const [selectedRegion, setSelectedRegion] = useState<string>('default')

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
  // const debouncedTerm = useDebounce(searchCountryName)

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['regions'] })
  }, [queryClient])

  const { data, error, isLoading, isError } = useCountriesQuery(debouncedTerm)
  const { data: regionList } = useRegionsQuery()

  const regions = { ...filterDefault, ...regionList?.regions }

  return (
    <>
      <main id="main-content" className="main-content" role="main">
        <div className="filter-bar">
          <label className="control-group">
            <VisuallyHidden.Root>Search for a country</VisuallyHidden.Root>
            <MagnifyingGlassIcon className="search-icon" />
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
            {data?.countries.map((country) => (
              <Card key={country.cca3} {...country} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default Home
