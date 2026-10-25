import { describe, expect, it, vi } from 'vite-plus/test'
import { createCache } from './cache'

function setup(load: () => Promise<string>) {
  let time = 0
  const onRefreshError = vi.fn()
  const cache = createCache({
    load,
    ttlMs: 1000,
    retryAfterMs: 100,
    initialRetryAfterMs: 50,
    now: () => time,
    onRefreshError,
  })
  return { cache, onRefreshError, advance: (ms: number) => (time += ms) }
}

describe('createCache', () => {
  it('loads once while the value is fresh', async () => {
    const load = vi.fn().mockResolvedValue('a')
    const { cache, advance } = setup(load)

    await cache.get()
    advance(999)
    await expect(cache.get()).resolves.toBe('a')
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('shares one in-flight load between concurrent callers', async () => {
    const load = vi.fn().mockResolvedValue('a')
    const { cache } = setup(load)

    await Promise.all([cache.get(), cache.get(), cache.get()])
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('reloads after the TTL expires', async () => {
    const load = vi.fn().mockResolvedValueOnce('a').mockResolvedValueOnce('b')
    const { cache, advance } = setup(load)

    await cache.get()
    advance(1000)
    await expect(cache.get()).resolves.toBe('b')
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('serves the stale value when a refresh fails, then backs off', async () => {
    const boom = new Error('upstream down')
    const load = vi.fn().mockResolvedValueOnce('a').mockRejectedValue(boom)
    const { cache, advance, onRefreshError } = setup(load)

    await cache.get()
    advance(1000)
    await expect(cache.get()).resolves.toBe('a')
    expect(onRefreshError).toHaveBeenCalledWith(boom)

    advance(99)
    await cache.get()
    expect(load).toHaveBeenCalledTimes(2)

    advance(1)
    await cache.get()
    expect(load).toHaveBeenCalledTimes(3)
  })

  it('throws when the first load fails, replays it briefly, then retries', async () => {
    const load = vi
      .fn()
      .mockRejectedValueOnce(new Error('down'))
      .mockResolvedValueOnce('a')
    const { cache, advance } = setup(load)

    await expect(cache.get()).rejects.toThrow('down')
    advance(49)
    await expect(cache.get()).rejects.toThrow('down')
    expect(load).toHaveBeenCalledTimes(1)

    advance(1)
    await expect(cache.get()).resolves.toBe('a')
    expect(load).toHaveBeenCalledTimes(2)
  })
})
