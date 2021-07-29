import { Link } from 'react-router-dom'

import styles from './Card.module.scss'

function Card() {
  return (
    <Link to="/details/col" className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.cardImage}>
          <img
            className={styles.flag}
            src="https://restcountries.eu/data/col.svg"
            alt="Flag of Columbia"
          />
        </div>
        <div className={styles.cardBody}>
          <h2 className={styles.countryName}>Columbia</h2>
          <dl className={styles.facts}>
            <div className={styles.factGroup}>
              <dt className={styles.factLabel}>Population</dt>
              <dd className={styles.factValue}>48,759,958</dd>
            </div>
            <div className={styles.factGroup}>
              <dt className={styles.factLabel}>Region</dt>
              <dd className={styles.factValue}>Americas</dd>
            </div>
            <div className={styles.factGroup}>
              <dt className={styles.factLabel}>Capital</dt>
              <dd className={styles.factValue}>Bogotá</dd>
            </div>
          </dl>
        </div>
      </div>
    </Link>
  )
}

export default Card
