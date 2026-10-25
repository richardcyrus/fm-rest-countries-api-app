// Rewrites test/fixtures/countries.v5.json from the real v5 API, keeping only
// the fields the app requests. Run with `pnpm fixtures:refresh` (the token is
// injected from 1Password); review the diff before committing.
import { writeFileSync } from 'node:fs'
import { RESPONSE_FIELDS } from '../src/server/countries/fields.ts'

const baseUrl =
  process.env.COUNTRIES_API_URL ?? 'https://api.restcountries.com/countries/v5'
const token = process.env.COUNTRIES_API_TOKEN
if (!token) {
  throw new Error('COUNTRIES_API_TOKEN is required')
}

const objects: unknown[] = []

for (let offset = 0; ;) {
  const url = new URL(baseUrl)
  url.searchParams.set('limit', '100')
  url.searchParams.set('offset', String(offset))
  url.searchParams.set('response_fields', RESPONSE_FIELDS)

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new Error(`Countries API responded ${response.status}`)
  }

  const { data } = (await response.json()) as {
    data: { objects: unknown[]; meta: { more?: boolean } }
  }
  objects.push(...data.objects)
  offset += data.objects.length

  if (!data.meta.more || data.objects.length === 0) {
    break
  }
}

const target = new URL('../test/fixtures/countries.v5.json', import.meta.url)
writeFileSync(target, JSON.stringify(objects))
console.log(`Wrote ${objects.length} countries to ${target.pathname}`)
