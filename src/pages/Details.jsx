import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQueryClient } from 'react-query'
import { useCountryQuery } from '../hooks/useRestCountries'

import BorderCountryButton from '../components/BorderCountryButton'
import Loading from '../components/Loading'
import { ArrowNarrowLeftIcon } from '@heroicons/react/outline'

function Details() {
  const { code } = useParams()
  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.invalidateQueries()
  }, [queryClient])

  const { data: country, error, isLoading, isError } = useCountryQuery(code)

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <main id="main-content" className="country-detail-content">
          <div>{error.message}</div>
        </main>
      ) : (
        <main id="main-content" className="country-detail-content">
          <div className="nav-container">
            <Link to="/" className="button nav-button">
              <ArrowNarrowLeftIcon className="back-arrow-icon" />
              Back
            </Link>
          </div>
          <div className="detail-wrapper">
            <div id="flag-container" className="flag-container">
              <img
                src={country.flag}
                alt={`Flag of ${country.name}`}
                className="large-flag"
                loading="lazy"
                width={560}
              />
            </div>
            <div className="country-data">
              <h2 className="country-name">{country.name}</h2>
              <div className="country-facts">
                <dl className="fact-group-left" id="fact-group-left">
                  <div className="fact-group">
                    <dt className="fact-label">Native Name</dt>
                    <dd className="fact-value">{country.nativeName}</dd>
                  </div>
                  <div className="fact-group">
                    <dt className="fact-label">Population</dt>
                    <dd className="fact-value">{country.population}</dd>
                  </div>
                  <div className="fact-group">
                    <dt className="fact-label">Region</dt>
                    <dd className="fact-value">{country.region}</dd>
                  </div>
                  <div className="fact-group">
                    <dt className="fact-label">Sub Region</dt>
                    <dd className="fact-value">{country.subregion}</dd>
                  </div>
                  {country.capital && country.capital.length > 0 ? (
                    <div className="fact-group">
                      <dt className="fact-label">Capital</dt>
                      <dd className="fact-value">{country.capital}</dd>
                    </div>
                  ) : null}
                </dl>
                <dl className="fact-group-right" id="fact-group-right">
                  <div className="fact-group">
                    <dt className="fact-label">Top Level Domain</dt>
                    <dd className="fact-value">{country.topLevelDomain}</dd>
                  </div>
                  {country.currencies && country.currencies.length > 0 ? (
                    <div className="fact-group">
                      <dt className="fact-label">Currencies</dt>
                      <dd className="fact-value">{country.currencies}</dd>
                    </div>
                  ) : null}
                  <div className="fact-group">
                    <dt className="fact-label">Languages</dt>
                    <dd className="fact-value">{country.languages}</dd>
                  </div>
                </dl>
              </div>
              {country.borders && country.borders.length > 0 ? (
                <div className="border-countries">
                  <h3 className="border-countries-title">Border Countries:</h3>
                  {country.borders.map((code) => (
                    <BorderCountryButton key={code} code={code} />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default Details
