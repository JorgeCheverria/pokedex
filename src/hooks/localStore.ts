import { useSyncExternalStore } from 'react'

/**
 * Valor JSON en localStorage observable con useSyncExternalStore.
 * Se sincroniza entre componentes y entre pestañas (evento `storage`).
 * Si localStorage no está disponible (modo privado estricto) cae a memoria.
 */
export function createLocalStore<T>(key: string, fallback: T, isValid: (v: unknown) => v is T) {
  const listeners = new Set<() => void>()
  let lastRaw: string | null | undefined
  let snapshot = fallback
  let memory: string | null = null

  const readRaw = (): string | null => {
    try {
      return localStorage.getItem(key)
    } catch {
      return memory
    }
  }

  const get = (): T => {
    const raw = readRaw()
    if (raw === lastRaw) return snapshot
    lastRaw = raw
    try {
      const parsed: unknown = raw === null ? fallback : JSON.parse(raw)
      snapshot = isValid(parsed) ? parsed : fallback
    } catch {
      snapshot = fallback
    }
    return snapshot
  }

  const set = (value: T) => {
    const raw = JSON.stringify(value)
    memory = raw
    try {
      localStorage.setItem(key, raw)
    } catch {
      /* sin persistencia: se mantiene en memoria */
    }
    listeners.forEach((l) => l())
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    const onStorage = (e: StorageEvent) => e.key === key && listener()
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  const useValue = () => useSyncExternalStore(subscribe, get, () => fallback)

  return { get, set, useValue }
}
