import { useEffect, useState } from 'react'

export const themeTypes = {
  light: 'light',
  dark: 'dark',
}

export const useDarkMode = () => {
  const [themeType, setThemeType] = useState(themeTypes.light)
  const [componentMounted, setComponentMounted] = useState(false)

  const setThemeMode = (mode) => {
    window.localStorage.setItem('theme', mode)
    setThemeType(mode)

    if (mode === themeTypes.dark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    if (themeType === themeTypes.light) {
      setThemeMode(themeTypes.dark)
    } else {
      setThemeMode(themeTypes.light)
    }
  }

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme')

    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches &&
    !localTheme
      ? setThemeMode(themeTypes.dark)
      : localTheme
      ? setThemeMode(localTheme)
      : setThemeMode(themeTypes.light)

    setComponentMounted(true)
  }, [])

  return [themeType, toggleTheme, componentMounted]
}
