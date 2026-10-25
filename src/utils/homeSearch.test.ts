import { describe, expect, it } from 'vite-plus/test'
import { homeSearchSchema } from './homeSearch'

describe('homeSearchSchema', () => {
  it('accepts q and region', () => {
    expect(homeSearchSchema.parse({ q: 'czech', region: 'europe' })).toEqual({
      q: 'czech',
      region: 'europe',
    })
  })

  it('treats missing and blank values as absent', () => {
    expect(homeSearchSchema.parse({})).toEqual({
      q: undefined,
      region: undefined,
    })
    expect(homeSearchSchema.parse({ q: '   ', region: '' })).toEqual({
      q: undefined,
      region: undefined,
    })
  })

  it('trims the search text', () => {
    expect(homeSearchSchema.parse({ q: '  aru ' }).q).toBe('aru')
  })

  it('drops values of the wrong type instead of failing the route', () => {
    expect(homeSearchSchema.parse({ q: 5, region: ['a'] })).toEqual({
      q: undefined,
      region: undefined,
    })
  })
})
