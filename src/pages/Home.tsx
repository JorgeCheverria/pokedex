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

  const typeIds = useMemo(() => (typeQuery.data ? new Set(typeQuery.data) : null), [typeQuery.data])
  const results = useMemo(
    () =>
      filterPokemon(listQuery.data ?? [], { query: filters.query, typeIds, gen: filters.gen }),
    [listQuery.data, filters.query, typeIds, filters.gen],
  )

  const resetKey = `${filters.query}|${filters.type}|${filters.gen}`
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
          <GenerationSelect value={filters.gen} onChange={filters.setGen} />
          <p className="text-sm text-slate-500" aria-live="polite">
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
        <EmptyState onClear={filters.clear} />
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
