import { Link } from 'react-router'

import { useBorderCountryQuery } from '../hooks/useRestCountries'

function BorderCountryButton({ code }: { code: string }) {
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
          to={`/details/${country.cca3}`}
          className="button border-country-button"
        >
          {country.name}
        </Link>
      )}
    </>
  )
}

export default BorderCountryButton
