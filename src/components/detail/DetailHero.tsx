import { useState } from 'react'
import type { Pokemon } from '../../api/types'
import { formatId } from '../../utils/format'
import { typeInfo } from '../../utils/typeColors'
import { FavoriteButton } from '../FavoriteButton'
import { IconButton } from '../IconButton'
import { SparklesIcon, VolumeIcon } from '../icons'
import { PokemonImage } from '../PokemonImage'
import { TypeBadge } from '../TypeBadge'

type Props = { pokemon: Pokemon; name: string; genus?: string }

export function DetailHero({ pokemon, name, genus }: Props) {
  const [shiny, setShiny] = useState(false)
  const [c1, c2] = pokemon.types.map((t) => typeInfo(t).color)
  const src = shiny && pokemon.artworkShiny ? pokemon.artworkShiny : pokemon.artwork

  const playCry = () => {
    if (pokemon.cry) void new Audio(pokemon.cry).play().catch(() => {})
  }

  return (
    <header
      className="relative overflow-hidden rounded-3xl px-4 pt-3 pb-6 text-center"
      style={{ background: `linear-gradient(135deg, ${c1}55, ${c2 ?? c1}22)` }}
    >
      <div className="relative z-10 flex justify-end gap-2">
        {pokemon.cry && (
          <IconButton variant="glass" label="Escuchar grito" onClick={playCry}>
            <VolumeIcon />
          </IconButton>
        )}
        {pokemon.artworkShiny && (
          <IconButton
            variant="glass"
            label="Versión Shiny"
            aria-pressed={shiny}
            onClick={() => setShiny((s) => !s)}
            className={shiny ? 'text-amber-500 ring-2 ring-amber-400' : ''}
          >
            <SparklesIcon />
          </IconButton>
        )}
        <FavoriteButton
          id={pokemon.id}
          name={name}
          className="bg-white/80 shadow-sm backdrop-blur dark:bg-slate-900/60"
        />
      </div>
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 font-mono text-[7rem] leading-none font-black tracking-tighter opacity-[0.05] select-none sm:text-[9rem] dark:opacity-[0.07]"
        >
          {formatId(pokemon.id)}
        </span>
        <PokemonImage
          key={src}
          src={src}
          alt={`${name}${shiny ? ' (shiny)' : ''}`}
          className="mx-auto w-56 sm:w-72"
          eager
        />
      </div>
      <p className="relative font-mono text-sm font-medium text-slate-600 dark:text-slate-300">
        {formatId(pokemon.id)}
      </p>
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
