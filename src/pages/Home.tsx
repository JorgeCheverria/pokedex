import { CardSkeleton } from '../components/CardSkeleton'
import { ErrorState } from '../components/ErrorState'
import { PokemonCard } from '../components/PokemonCard'
import { usePokemonList } from '../hooks/queries'
import { useInfiniteCount } from '../hooks/useInfiniteCount'

export const PAGE_SIZE = 24
const GRID = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

const skeletons = (n: number) =>
  Array.from({ length: n }, (_, i) => <CardSkeleton key={`sk-${i}`} />)

export function Home() {
  const { data: list, isPending, isError, refetch } = usePokemonList()
  const { count, hasMore, sentinelRef } = useInfiniteCount(list?.length ?? 0, PAGE_SIZE)

  if (isError) return <ErrorState onRetry={() => refetch()} />

  return (
    <section aria-label="Lista de Pokémon" className="flex flex-col gap-4">
      {list && (
        <p className="text-sm text-slate-500" aria-live="polite">
          {list.length} Pokémon
        </p>
      )}
      <ul className={GRID}>
        {isPending
          ? skeletons(PAGE_SIZE).map((s) => <li key={s.key}>{s}</li>)
          : list.slice(0, count).map((p) => (
              <li key={p.id} className="h-full">
                <PokemonCard pokemon={p} />
              </li>
            ))}
      </ul>
      {hasMore && (
        <div ref={sentinelRef} className={GRID} aria-hidden="true">
          {skeletons(6)}
        </div>
      )}
    </section>
  )
}
