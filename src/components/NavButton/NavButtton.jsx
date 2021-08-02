import { Link } from 'react-router-dom'
import { ArrowNarrowLeftIcon } from '@heroicons/react/outline'

import styles from './NavButton.module.scss'

function NavButton({ to }) {
  return (
    <Link to={to} className={styles.button}>
      <ArrowNarrowLeftIcon className={styles.arrowIcon} />
      Back
    </Link>
  )
}
export default NavButton