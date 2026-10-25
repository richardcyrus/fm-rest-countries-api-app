type CacheOptions<T> = {
  load: () => Promise<T>
  /** How long a successful load is considered fresh. */
  ttlMs: number
  /** After a failed refresh, wait this long before trying again. */
  retryAfterMs?: number
  /** With no value yet, how long a failed load is replayed before retrying. */
  initialRetryAfterMs?: number
  now?: () => number
  onRefreshError?: (error: unknown) => void
}

/**
 * A single-value cache with a TTL. A failed refresh serves the stale value
 * (and backs off before retrying); with no value yet, the failure is thrown
 * and replayed to callers for a short while, so an outage at startup cannot
 * turn every request into upstream calls. Concurrent callers share one
 * in-flight load.
 */
export function createCache<T>({
  load,
  ttlMs,
  retryAfterMs = 60_000,
  initialRetryAfterMs = 5_000,
  now = Date.now,
  onRefreshError,
}: CacheOptions<T>) {
  let value: T | undefined
  let hasValue = false
  let refreshAt = 0
  let inflight: Promise<T> | undefined
  let failure: { error: unknown; until: number } | undefined

  const refresh = async () => {
    try {
      value = await load()
      hasValue = true
      failure = undefined
      refreshAt = now() + ttlMs
      return value
    } catch (error) {
      if (!hasValue) {
        failure = { error, until: now() + initialRetryAfterMs }
        throw error
      }
      onRefreshError?.(error)
      refreshAt = now() + retryAfterMs
      return value as T
    } finally {
      inflight = undefined
    }
  }

  return {
    get(): Promise<T> {
      if (hasValue && now() < refreshAt) {
        return Promise.resolve(value as T)
      }
      if (!inflight && failure && now() < failure.until) {
        return Promise.reject(failure.error)
      }
      inflight ??= refresh()
      return inflight
    },
  }
}
