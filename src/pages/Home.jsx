import { useState } from 'react'
import { useCountriesQuery } from '../hooks/useRestCountries'
import useDebounce from '../hooks/useDebounce'

import FilterBar from '../components/FilterBar/FilterBar'
import Card from '../components/Card'

import styles from '../styles/Home.module.scss'

function Home() {
  const [searchCountryName, setSearchCountryName] = useState('')
  const debouncedTerm = useDebounce(searchCountryName)
  const { data, error, isLoading, isError } = useCountriesQuery(debouncedTerm)

  const handleChange = (evt) => {
    setSearchCountryName(evt.target.value)
  }

  return (
    <>
      <main id="main-content">
        <FilterBar
          searchCountryName={searchCountryName}
          handleChange={handleChange}
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>{error.message}</div>
        ) : (
          <div className={styles.cardContainer}>
            {data.countries.map((country, i) => (
              <Card key={i} {...country} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default Home
