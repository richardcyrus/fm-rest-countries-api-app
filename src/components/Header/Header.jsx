import { useDarkMode } from '../../hooks/useDarkMode'
import ThemeToggle from '../ThemeToggle'
import styles from './Header.module.scss'

function Header() {
  const [theme, toggleTheme] = useDarkMode()

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <h1 className={styles.title} data-test="page-title">
          Where in the world?
        </h1>
        <div className={styles.themeSwitchContainer}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  )
}

export default Header
