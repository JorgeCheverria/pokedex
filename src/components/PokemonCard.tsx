import { Link } from 'react-router-dom'
import type { PokemonSummary } from '../api/types'
import { usePokemon } from '../hooks/queries'
import { formatId, formatName } from '../utils/format'
import { artworkUrl } from '../utils/sprites'
import { typeInfo } from '../utils/typeColors'
import { PokemonImage } from './PokemonImage'
import { TypeBadge } from './TypeBadge'

type Props = { pokemon: PokemonSummary }

export function PokemonCard({ pokemon }: Props) {
  const { data } = usePokemon(pokemon.id)
  const tint = data ? typeInfo(data.types[0]).color : '#94a3b8'

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      aria-label={`${formatName(pokemon.name)} ${formatId(pokemon.id)}`}
      className="group relative flex h-full flex-col items-center gap-1 overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-poke-red motion-reduce:transform-none dark:bg-slate-800/60 dark:ring-white/10"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-60 transition-opacity group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at 50% 40%, ${tint}40, transparent 70%)` }}
      />
      <span className="relative self-start font-mono text-xs font-medium text-slate-400">
        {formatId(pokemon.id)}
      </span>
      <PokemonImage
        src={artworkUrl(pokemon.id)}
        alt=""
        className="w-full transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none"
      />
      <h2 className="relative truncate text-center text-sm font-semibold sm:text-base">
        {formatName(pokemon.name)}
      </h2>
      <div className="relative flex min-h-5 flex-wrap justify-center gap-1">
        {data ? (
          data.types.map((t) => <TypeBadge key={t} type={t} />)
        ) : (
          <span className="h-5 w-14 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        )}
      </div>
    </Link>
  )
}
