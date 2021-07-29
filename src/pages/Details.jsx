import NavButton from '../components/NavButton'
import BorderCountryButton from '../components/BorderCountryButton'

import styles from '../styles/Details.module.scss'

function Details() {
  return (
    <>
      <main id="main-content" className={styles.detailContainer}>
        <div className={styles.navContainer}>
          <NavButton to="/" />
        </div>
        <div className={styles.contentContainer}>
          <div id="flag-container">
            <img
              className={styles.flag}
              src="https://restcountries.eu/data/col.svg"
              alt="Flag of Columbia"
            />
          </div>
          <div className={styles.countryDetails}>
            <h2 className={styles.countryName}>Columbia</h2>
            <div className={styles.countryFacts}>
              <dl id="fact-group-left">
                <div className={styles.factGroup}>
                  <dt className={styles.factLabel}>Native Name</dt>
                  <dd className={styles.factValue}>Colombia</dd>
                </div>
                <div className={styles.factGroup}>
                  <dt className={styles.factLabel}>Population</dt>
                  <dd className={styles.factValue}>48,759,958</dd>
                </div>
                <div className={styles.factGroup}>
                  <dt className={styles.factLabel}>Region</dt>
                  <dd className={styles.factValue}>Americas</dd>
                </div>
                <div className={styles.factGroup}>
                  <dt className={styles.factLabel}>Sub Region</dt>
                  <dd className={styles.factValue}>South America</dd>
                </div>
                <div className={styles.factGroup}>
                  <dt className={styles.factLabel}>Capital</dt>
                  <dd className={styles.factValue}>Bogotá</dd>
                </div>
              </dl>
              <dl id="fact-group-right" className={styles.factGroupRight}>
                <div className={styles.factGroup}>
                  <dt className={styles.factLabel}>Top Level Domain</dt>
                  <dd className={styles.factValue}>.co</dd>
                </div>
                <div className={styles.factGroup}>
                  <dt className={styles.factLabel}>Currencies</dt>
                  <dd className={styles.factValue}>Colombian peso</dd>
                </div>
                <div className={styles.factGroup}>
                  <dt className={styles.factLabel}>Languages</dt>
                  <dd className={styles.factValue}>Spanish</dd>
                </div>
              </dl>
            </div>
            <div className={styles.borderCountries}>
              <h3 className={styles.borderCountiesTitle}>Border Countries:</h3>
              <BorderCountryButton to="/details/bra">
                Brasil
              </BorderCountryButton>
              <BorderCountryButton to="/details/ecu">
                Ecuador
              </BorderCountryButton>
              <BorderCountryButton to="/details/pan">
                Panamá
              </BorderCountryButton>
              <BorderCountryButton to="/details/per">Perú</BorderCountryButton>
              <BorderCountryButton to="/details/ven">
                Venezuela
              </BorderCountryButton>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Details
