import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import styles from './Card.module.scss'

function Card({ flag, name, alpha3Code, capital, region, population }) {
  return (
    <Link
      to={`/details/${alpha3Code}`}
      className={styles.cardLink}
      data-test={`country-${alpha3Code}-card`}
    >
      <div className={styles.card} data-test="card">
        <div className={styles.cardImage}>
          <img
            className={styles.flag}
            src={flag}
            alt={`Flag of ${name}`}
            data-test={`country-${alpha3Code}-flag`}
          />
        </div>
        <div className={styles.cardBody}>
          <h2
            className={styles.countryName}
            data-test={`country-${alpha3Code}-name`}
          >
            {name}
          </h2>
          <dl className={styles.facts}>
            <div className={styles.factGroup}>
              <dt className={styles.factLabel}>Population</dt>
              <dd
                className={styles.factValue}
                data-test={`country-${alpha3Code}-population`}
              >
                {population}
              </dd>
            </div>
            <div className={styles.factGroup}>
              <dt className={styles.factLabel}>Region</dt>
              <dd
                className={styles.factValue}
                data-test={`country-${alpha3Code}-region`}
              >
                {region}
              </dd>
            </div>
            <div className={styles.factGroup}>
              <dt className={styles.factLabel}>Capital</dt>
              <dd
                className={styles.factValue}
                data-test={`country-${alpha3Code}-capital`}
              >
                {capital}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Link>
  )
}

Card.propTypes = {
  flag: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  alpha3Code: PropTypes.string.isRequired,
  capital: PropTypes.string,
  region: PropTypes.string,
  population: PropTypes.string,
}

export default Card
