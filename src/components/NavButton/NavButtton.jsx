import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
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

NavButton.propTypes = {
  to: PropTypes.string.isRequired,
}

export default NavButton
