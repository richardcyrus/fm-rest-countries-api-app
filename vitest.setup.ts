// @vitest-environment node
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vite-plus/test'

afterEach(() => {
  cleanup()
})
