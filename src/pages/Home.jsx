import { useState } from 'react'
import { useCountriesQuery } from '../hooks/useRestCountries'
import useDebounce from '../hooks/useDebounce'

import FilterInput from '../components/FilterInput'
import FilterListBox from '../components/FilterListBox'
import Card from '../components/Card'
import Loading from '../components/Loading'

import styles from '../styles/Home.module.scss'

const filterDefault = {
  id: 0,
  name: 'Filter by Region',
  value: 'default',
  unavailable: true,
}

function Home() {
  const [searchCountryName, setSearchCountryName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState(filterDefault)

  const debouncedTerm = useDebounce(searchTerm)
  const { data, error, isLoading, isError } = useCountriesQuery(debouncedTerm)

  const onInputChanged = (evt) => {
    setSelectedRegion(filterDefault)
    setSearchCountryName(evt.target.value)
    setSearchTerm({ type: 'search', value: evt.target.value })
  }

  const onFilterChanged = (region) => {
    setSearchCountryName('')
    setSelectedRegion(region)
    setSearchTerm(region)
  }

  return (
    <>
      <main id="main-content">
        <div className={styles.filterBar}>
          <FilterInput
            searchCountryName={searchCountryName}
            onInputChanged={onInputChanged}
          />
          <FilterListBox
            selectedRegion={selectedRegion}
            onFilterChanged={onFilterChanged}
          />
        </div>
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <div className={styles.cardContainer}>
            <div>{error.message}</div>
          </div>
        ) : (
          <div className={styles.cardContainer} data-test="card-list">
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
