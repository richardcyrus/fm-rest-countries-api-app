import { Link } from 'react-router'
import PropTypes from 'prop-types'

import { useBorderCountryQuery } from '../hooks/useRestCountries'

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
        <Link
          to={`/details/${country.alpha3Code}`}
          className="button border-country-button"
        >
          {country.name}
        </Link>
      )}
    </>
  )
}

BorderCountryButton.propTypes = { code: PropTypes.string.isRequired }

export default BorderCountryButton
