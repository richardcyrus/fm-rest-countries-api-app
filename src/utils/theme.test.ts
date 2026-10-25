import { describe, expect, it } from 'vite-plus/test'
import { parseTheme } from './theme'

describe('parseTheme', () => {
  it('accepts the two known themes', () => {
    expect(parseTheme('dark')).toBe('dark')
    expect(parseTheme('light')).toBe('light')
  })

  it.each([undefined, '', 'DARK', 'true', 'blue'])(
    'falls back to light for %j',
    (value) => {
      expect(parseTheme(value)).toBe('light')
    }
  )
})
