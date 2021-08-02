import { Link } from 'react-router-dom'

import { useBorderCountryQuery } from '../../hooks/useRestCountries'

import styles from './BorderCountryButton.module.scss'

function BorderCountryButton({ code }) {
  const {
    data: country,
    error,
    isLoading,
    isError,
  } = useBorderCountryQuery(code)

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>{error.message}</div>
      ) : (
        <Link to={`/details/${country.alpha3Code}`} className={styles.button}>
          {country.name}
        </Link>
      )}
    </>
  )
}
export default BorderCountryButton
