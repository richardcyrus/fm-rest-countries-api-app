import { z } from 'zod'

export const THEME_COOKIE = 'theme'

export const themeSchema = z.enum(['light', 'dark'])

export type Theme = z.infer<typeof themeSchema>

/** Read a theme cookie value; anything unrecognised means light. */
export function parseTheme(value: string | undefined): Theme {
  const parsed = themeSchema.safeParse(value)
  return parsed.success ? parsed.data : 'light'
}
