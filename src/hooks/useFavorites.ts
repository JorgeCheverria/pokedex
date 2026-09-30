import { useMemo } from 'react'
import { createLocalStore } from './localStore'

const isIdList = (v: unknown): v is number[] =>
  Array.isArray(v) && v.every((x) => Number.isInteger(x) && x > 0)

export const favoritesStore = createLocalStore<number[]>('pokedex:favorites', [], isIdList)

export function useFavorites() {
  const ids = favoritesStore.useValue()
  const set = useMemo(() => new Set(ids), [ids])

  return {
    ids: set,
    count: ids.length,
    isFavorite: (id: number) => set.has(id),
    toggle: (id: number) => {
      const current = favoritesStore.get()
      favoritesStore.set(
        current.includes(id) ? current.filter((x) => x !== id) : [...current, id].sort((a, b) => a - b),
      )
    },
  }
}
