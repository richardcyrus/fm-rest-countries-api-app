import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import styles from './Card.module.scss'

function Card({ flag, name, alpha3Code, capital, region, population }) {
  return (
    <Link to={`/details/${alpha3Code}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.cardImage}>
          <img
            className={styles.flag}
            src={flag}
            alt={`Flag of ${name}`}
            loading="lazy"
          />
        </div>
        <div className={styles.cardBody}>
          <h2 className={styles.countryName}>{name}</h2>
          <dl className={styles.facts}>
            <div className={styles.factGroup}>
              <dt className={styles.factLabel}>Population</dt>
              <dd className={styles.factValue}>{population}</dd>
            </div>
            <div className={styles.factGroup}>
              <dt className={styles.factLabel}>Region</dt>
              <dd className={styles.factValue}>{region}</dd>
            </div>
            {capital && capital.length > 0 ? (
              <div className={styles.factGroup}>
                <dt className={styles.factLabel}>Capital</dt>
                <dd className={styles.factValue}>{capital}</dd>
              </div>
            ) : null}
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
