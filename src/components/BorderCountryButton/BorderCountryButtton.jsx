import { Link } from 'react-router-dom'

import styles from './BorderCountryButton.module.scss'

function BorderCountryButton({ to, children }) {
  return (
    <Link to={to} className={styles.button}>
      {children}
    </Link>
  )
}
export default BorderCountryButton
