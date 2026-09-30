import { useState } from 'react'
import type { Pokemon } from '../../api/types'
import { formatId } from '../../utils/format'
import { typeInfo } from '../../utils/typeColors'
import { PokemonImage } from '../PokemonImage'
import { TypeBadge } from '../TypeBadge'

type Props = { pokemon: Pokemon; name: string; genus?: string }

const iconButton =
  'rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-3 focus-visible:outline-poke-red dark:bg-slate-900/60 dark:hover:bg-slate-900'

export function DetailHero({ pokemon, name, genus }: Props) {
  const [shiny, setShiny] = useState(false)
  const [c1, c2] = pokemon.types.map((t) => typeInfo(t).color)
  const src = shiny && pokemon.artworkShiny ? pokemon.artworkShiny : pokemon.artwork

  const playCry = () => {
    if (pokemon.cry) void new Audio(pokemon.cry).play().catch(() => {})
  }

  return (
    <header
      className="relative overflow-hidden rounded-3xl px-4 pt-4 pb-6 text-center"
      style={{ background: `linear-gradient(135deg, ${c1}55, ${c2 ?? c1}22)` }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 right-2 font-mono text-8xl font-black opacity-10 select-none sm:text-9xl"
      >
        {formatId(pokemon.id)}
      </span>
      <div className="relative flex justify-end gap-2">
        {pokemon.cry && (
          <button type="button" onClick={playCry} className={iconButton} aria-label="Escuchar grito">
            🔊
          </button>
        )}
        {pokemon.artworkShiny && (
          <button
            type="button"
            onClick={() => setShiny((s) => !s)}
            aria-pressed={shiny}
            className={iconButton}
          >
            ✨ Shiny
          </button>
        )}
      </div>
      <PokemonImage
        key={src}
        src={src}
        alt={`${name}${shiny ? ' (shiny)' : ''}`}
        className="mx-auto w-56 sm:w-72"
        eager
      />
      <p className="relative font-mono text-slate-500 dark:text-slate-400">{formatId(pokemon.id)}</p>
      <h1 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">{name}</h1>
      {genus && <p className="relative text-sm text-slate-600 dark:text-slate-300">{genus}</p>}
      <div className="relative mt-3 flex justify-center gap-2">
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} size="md" />
        ))}
      </div>
    </header>
  )
}
