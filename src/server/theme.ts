import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { parseTheme, THEME_COOKIE, themeSchema } from '~/utils/theme'

export const getTheme = createServerFn({ method: 'GET' }).handler(() =>
  parseTheme(getCookie(THEME_COOKIE))
)

export const setTheme = createServerFn({ method: 'POST' })
  .validator(themeSchema)
  .handler(({ data }) => {
    setCookie(THEME_COOKIE, data, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      // Dev and preview run over plain http, where browsers drop Secure cookies.
      secure: process.env.NODE_ENV === 'production',
    })
  })
