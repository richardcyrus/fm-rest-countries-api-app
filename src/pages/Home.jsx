import { useState, useEffect } from 'react'
import { useRegionsQuery, useCountriesQuery } from '../hooks/useRestCountries'
import { useQueryClient } from 'react-query'
import useDebounce from '../hooks/useDebounce'

import FilterInput from '../components/FilterInput'
import FilterListBox from '../components/FilterListBox'
import Card from '../components/Card'
import Loading from '../components/Loading'

import styles from '../styles/Home.module.scss'

const filterDefault = {
  default: 'Filter by Region',
}

function Home() {
  const [searchCountryName, setSearchCountryName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('default')

  const onInputChanged = (evt) => {
    setSelectedRegion('default')
    setSearchCountryName(evt.target.value)
    setSearchTerm({ type: 'search', value: evt.target.value })
  }

  const onFilterChanged = (region) => {
    setSearchCountryName('')
    setSelectedRegion(region)
    setSearchTerm({ type: 'region', value: region })
  }

  const debouncedTerm = useDebounce(searchTerm)

  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.invalidateQueries('regions')
  }, [])

  const { data, error, isLoading, isError } = useCountriesQuery(debouncedTerm)
  const { data: regionList } = useRegionsQuery()

  const regions = { ...filterDefault, ...regionList.regions }

  return (
    <>
      <main id="main-content">
        <div className={styles.filterBar}>
          <FilterInput
            searchCountryName={searchCountryName}
            onInputChanged={onInputChanged}
          />
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
          <div className={styles.cardContainer}>
            <div>{error.message}</div>
          </div>
        ) : (
          <div className={styles.cardContainer}>
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
