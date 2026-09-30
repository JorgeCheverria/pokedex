import { useEffect, useSyncExternalStore } from 'react'
import { createLocalStore } from './localStore'

export type Theme = 'light' | 'dark'

const isTheme = (v: unknown): v is Theme | null => v === 'light' || v === 'dark' || v === null
const themeStore = createLocalStore<Theme | null>('pokedex:theme', null, isTheme)

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribeSystem(cb: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {}
  const mq = window.matchMedia(DARK_QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

const systemPrefersDark = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches

/** Tema elegido por el usuario o, si no eligió, el del sistema. */
export function useTheme() {
  const stored = themeStore.useValue()
  const systemDark = useSyncExternalStore(subscribeSystem, systemPrefersDark, () => false)
  const theme: Theme = stored ?? (systemDark ? 'dark' : 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return {
    theme,
    toggle: () => themeStore.set(theme === 'dark' ? 'light' : 'dark'),
  }
}
