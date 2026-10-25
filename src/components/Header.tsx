import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import ThemeToggle from '~/components/ThemeToggle'
import { setTheme } from '~/server/theme'

const rootRoute = getRouteApi('__root__')

function Header() {
  const initialTheme = rootRoute.useLoaderData()
  const [theme, setCurrentTheme] = useState(initialTheme)

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'

    setCurrentTheme(next)
    document.body.classList.toggle('dark', next === 'dark')
    void setTheme({ data: next })
  }

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
