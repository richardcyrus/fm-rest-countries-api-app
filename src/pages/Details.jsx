import { useParams } from 'react-router-dom'

import { useCountryQuery } from '../hooks/useRestCountries'

import NavButton from '../components/NavButton'
import BorderCountryButton from '../components/BorderCountryButton'
import Loading from '../components/Loading'

import styles from '../styles/Details.module.scss'

function Details() {
  const { code } = useParams()
  const { data: country, error, isLoading, isError } = useCountryQuery(code)

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div>{error.message}</div>
      ) : (
        <main id="main-content" className={styles.detailContainer}>
          <div className={styles.navContainer}>
            <NavButton to="/" />
          </div>
          <div className={styles.contentContainer}>
            <div id="flag-container">
              <img
                className={styles.flag}
                src={country.flag}
                alt={`Flag of ${country.name}`}
              />
            </div>
            <div className={styles.countryDetails}>
              <h2 className={styles.countryName}>{country.name}</h2>
              <div className={styles.countryFacts}>
                <dl id="fact-group-left">
                  <div className={styles.factGroup}>
                    <dt className={styles.factLabel}>Native Name</dt>
                    <dd className={styles.factValue}>{country.nativeName}</dd>
                  </div>
                  <div className={styles.factGroup}>
                    <dt className={styles.factLabel}>Population</dt>
                    <dd className={styles.factValue}>{country.population}</dd>
                  </div>
                  <div className={styles.factGroup}>
                    <dt className={styles.factLabel}>Region</dt>
                    <dd className={styles.factValue}>{country.region}</dd>
                  </div>
                  <div className={styles.factGroup}>
                    <dt className={styles.factLabel}>Sub Region</dt>
                    <dd className={styles.factValue}>{country.subregion}</dd>
                  </div>
                  <div className={styles.factGroup}>
                    <dt className={styles.factLabel}>Capital</dt>
                    <dd className={styles.factValue}>{country.capital}</dd>
                  </div>
                </dl>
                <dl id="fact-group-right" className={styles.factGroupRight}>
                  <div className={styles.factGroup}>
                    <dt className={styles.factLabel}>Top Level Domain</dt>
                    <dd className={styles.factValue}>
                      {country.topLevelDomains}
                    </dd>
                  </div>
                  <div className={styles.factGroup}>
                    <dt className={styles.factLabel}>Currencies</dt>
                    <dd className={styles.factValue}>{country.currencies}</dd>
                  </div>
                  <div className={styles.factGroup}>
                    <dt className={styles.factLabel}>Languages</dt>
                    <dd className={styles.factValue}>{country.languages}</dd>
                  </div>
                </dl>
              </div>
              <div className={styles.borderCountries}>
                <h3 className={styles.borderCountiesTitle}>
                  Border Countries:
                </h3>
                {country.borders.map((code, i) => (
                  <BorderCountryButton key={i} to={`/details/${code}`}>
                    {code}
                  </BorderCountryButton>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default Details
