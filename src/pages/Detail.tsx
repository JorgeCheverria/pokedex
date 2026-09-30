import { Link, useParams } from 'react-router-dom'
import { PokemonImage } from '../components/PokemonImage'
import { TypeBadge } from '../components/TypeBadge'
import { usePokemon } from '../hooks/queries'
import { formatId, formatName } from '../utils/format'
import { artworkUrl } from '../utils/sprites'

/** Vista mínima; se completa en la Fase 4 (stats, evolución, prev/next). */
export function Detail() {
  const id = Number(useParams().id)
  const { data } = usePokemon(id)

  return (
    <article className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
      <Link to="/" className="self-start text-sm font-medium text-poke-red hover:underline">
        ← Volver
      </Link>
      <span className="font-mono text-slate-400">{formatId(id)}</span>
      <PokemonImage src={artworkUrl(id)} alt={data ? formatName(data.name) : ''} className="w-64" eager />
      <h1 className="text-3xl font-bold">{data ? formatName(data.name) : '…'}</h1>
      <div className="flex gap-2">
        {data?.types.map((t) => <TypeBadge key={t} type={t} size="md" />)}
      </div>
      <p className="text-sm text-slate-500">Detalle completo en construcción.</p>
    </article>
  )
}
