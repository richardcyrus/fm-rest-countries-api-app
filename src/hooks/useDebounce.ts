import { useEffect, useState } from 'react'
import type { SearchParams } from '~/types'

export default function useDebounce(value: SearchParams) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, 500)

    return () => clearTimeout(handler)
  }, [value])

  return debouncedValue
}
