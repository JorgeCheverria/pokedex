import { useMemo } from 'react'
import { CardSkeleton } from '../components/CardSkeleton'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { GenerationSelect } from '../components/GenerationSelect'
import { PokemonCard } from '../components/PokemonCard'
import { SearchBar } from '../components/SearchBar'
import { TypeFilter } from '../components/TypeFilter'
import { usePokemonIdsByType, usePokemonList } from '../hooks/queries'
import { useInfiniteCount } from '../hooks/useInfiniteCount'
import { useFavorites } from '../hooks/useFavorites'
import { usePokedexFilters } from '../hooks/usePokedexFilters'
import { filterPokemon } from '../utils/filter'

export const PAGE_SIZE = 24
const GRID = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

const skeletons = (n: number) =>
  Array.from({ length: n }, (_, i) => <CardSkeleton key={`sk-${i}`} />)

export function Home() {
  const filters = usePokedexFilters()
  const listQuery = usePokemonList()
  const typeQuery = usePokemonIdsByType(filters.type)

  const favorites = useFavorites()
  const favIds = filters.favOnly ? favorites.ids : null

  const typeIds = useMemo(() => (typeQuery.data ? new Set(typeQuery.data) : null), [typeQuery.data])
  const results = useMemo(
    () =>
      filterPokemon(listQuery.data ?? [], {
        query: filters.query,
        typeIds,
        gen: filters.gen,
        favIds,
      }),
    [listQuery.data, filters.query, typeIds, filters.gen, favIds],
  )

  const resetKey = `${filters.query}|${filters.type}|${filters.gen}|${filters.favOnly}`
  const emptyMessage =
    filters.favOnly && favorites.count === 0
      ? 'Aún no tienes favoritos. Toca ☆ en cualquier Pokémon para guardarlo.'
      : undefined
  const { count, hasMore, sentinelRef } = useInfiniteCount(results.length, PAGE_SIZE, resetKey)

  const isError = listQuery.isError || typeQuery.isError
  const isLoading = listQuery.isPending || (!!filters.type && typeQuery.isPending)
  const retry = () => (listQuery.isError ? listQuery.refetch() : typeQuery.refetch())

  return (
    <section aria-label="Lista de Pokémon" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <SearchBar value={filters.text} onChange={filters.setText} />
        <TypeFilter selected={filters.type} onSelect={filters.setType} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <GenerationSelect value={filters.gen} onChange={filters.setGen} />
            <button
              type="button"
              onClick={filters.toggleFavOnly}
              aria-pressed={filters.favOnly}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-poke-red ${
                filters.favOnly
                  ? 'bg-amber-400 text-slate-900 ring-amber-400'
                  : 'bg-white ring-slate-900/10 hover:ring-2 dark:bg-slate-800/60 dark:ring-white/10'
              }`}
            >
              ★ Solo favoritos
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400" aria-live="polite">
            {!isLoading && listQuery.data && `${results.length} de ${listQuery.data.length} Pokémon`}
            {filters.hasFilters && !isLoading && (
              <button
                type="button"
                onClick={filters.clear}
                className="ml-3 font-semibold text-poke-red hover:underline"
              >
                Limpiar
              </button>
            )}
          </p>
        </div>
      </div>

      {isError ? (
        <ErrorState onRetry={retry} />
      ) : isLoading ? (
        <div className={GRID}>{skeletons(PAGE_SIZE)}</div>
      ) : results.length === 0 ? (
        <EmptyState onClear={filters.clear} message={emptyMessage} />
      ) : (
        <ul className={GRID}>
          {results.slice(0, count).map((p) => (
            <li key={p.id} className="h-full">
              <PokemonCard pokemon={p} />
            </li>
          ))}
        </ul>
      )}

      {!isLoading && !isError && hasMore && (
        <div ref={sentinelRef} className={GRID} aria-hidden="true">
          {skeletons(6)}
        </div>
      )}
    </section>
  )
}
