// @vitest-environment happy-dom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vite-plus/test'
import useDebounce from './useDebounce'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

test('returns the initial value immediately', () => {
  const { result } = renderHook(() => useDebounce('a'))

  expect(result.current).toBe('a')
})

test('only updates after the value has been stable for the delay', () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 500),
    { initialProps: { value: 'a' } }
  )

  rerender({ value: 'b' })
  act(() => vi.advanceTimersByTime(499))
  expect(result.current).toBe('a')

  rerender({ value: 'c' })
  act(() => vi.advanceTimersByTime(499))
  expect(result.current).toBe('a')

  act(() => vi.advanceTimersByTime(1))
  expect(result.current).toBe('c')
})
