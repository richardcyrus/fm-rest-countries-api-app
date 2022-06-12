import { useDarkMode } from '../hooks/useDarkMode'
import ThemeToggle from './ThemeToggle'

function Header() {
  const [, toggleTheme] = useDarkMode()

  return (
    <header className="site-header">
      <div className="header-wrapper">
        <h1 className="site-title">Where in the world?</h1>
        <div className="theme-switch-container">
          <ThemeToggle toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  )
}

export default Header
