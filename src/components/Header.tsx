import { useEffect } from 'react'
import { useDarkMode } from 'usehooks-ts'
import ThemeToggle from '~/components/ThemeToggle'

function Header() {
  const { isDarkMode, toggle } = useDarkMode({
    defaultValue: false,
    initializeWithValue: false,
    localStorageKey: 'theme',
  })

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <header role="banner" className="site-header">
      <div className="header-wrapper">
        <h1 className="site-title">Where in the world?</h1>
        <div className="theme-switch-container">
          <ThemeToggle toggleTheme={toggle} />
        </div>
      </div>
    </header>
  )
}

export default Header
