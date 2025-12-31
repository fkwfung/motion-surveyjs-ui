import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// motion/react useInView relies on IntersectionObserver
// JSDOM doesn't provide it by default.
globalThis.IntersectionObserver =
  globalThis.IntersectionObserver ??
  (IntersectionObserverMock as unknown as typeof IntersectionObserver)
