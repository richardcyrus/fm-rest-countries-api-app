import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// A plain path, not a URL object: happy-dom replaces the global URL class.
const FIXTURE = join(
  dirname(fileURLToPath(import.meta.url)),
  'countries.v5.json'
)

/**
 * The real v5 country snapshot. It is API data that may not be redistributed,
 * so it is git-ignored: each developer generates it with `pnpm
 * fixtures:refresh` (needs the 1Password key).
 */
export function loadCountriesFixture(): unknown[] {
  try {
    return JSON.parse(readFileSync(FIXTURE, 'utf8')) as unknown[]
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(
        'test/fixtures/countries.v5.json is missing. It is git-ignored API ' +
          'data; generate it with `pnpm fixtures:refresh`.'
      )
    }
    throw error
  }
}
