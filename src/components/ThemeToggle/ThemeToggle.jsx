import { func, string } from 'prop-types'

import { MoonIcon } from '@heroicons/react/outline'

import styles from './ThemeToggle.module.scss'

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button type="button" className={styles.button} onClick={toggleTheme}>
      <MoonIcon className={styles.themeSwitchIcon} />
      Dark Mode
    </button>
  )
}

ThemeToggle.propTypes = {
  theme: string.isRequired,
  toggleTheme: func.isRequired,
}

export default ThemeToggle
