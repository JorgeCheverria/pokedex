import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { clearInfiniteCountCache } from '../hooks/useInfiniteCount'

// jsdom no implementa scroll. Chromium reciente hace que scrollTo devuelva una
// Promise: se imita para detectar effects que la devuelvan como "cleanup".
window.scrollTo = vi.fn(() => Promise.resolve()) as unknown as typeof window.scrollTo

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  clearInfiniteCountCache()
  document.documentElement.classList.remove('dark')
})
