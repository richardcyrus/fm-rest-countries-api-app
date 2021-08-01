import { useState } from 'react'
import { useCountriesQuery } from '../hooks/useRestCountries'
import useDebounce from '../hooks/useDebounce'

import FilterInput from '../components/FilterInput'
import FilterListBox from '../components/FilterListBox'
import Card from '../components/Card'
import Loading from '../components/Loading'

import styles from '../styles/Home.module.scss'

function Home() {
  const [searchCountryName, setSearchCountryName] = useState('')
  const debouncedTerm = useDebounce(searchCountryName)
  const { data, error, isLoading, isError } = useCountriesQuery(debouncedTerm)

  const onInputChanged = (evt) => {
    setSearchCountryName(evt.target.value)
  }

  return (
    <>
      <main id="main-content">
        <div className={styles.filterBar}>
          <FilterInput
            searchCountryName={searchCountryName}
            onInputChanged={onInputChanged}
          />
          <FilterListBox />
        </div>
        {isLoading ? (
          <Loading />
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
