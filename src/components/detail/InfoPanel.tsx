import type { Pokemon, Species } from '../../api/types'
import { formatName } from '../../utils/format'
import { GENERATIONS } from '../../utils/generations'

type Props = { pokemon: Pokemon; species?: Species }

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-center dark:bg-slate-800">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}

export function InfoPanel({ pokemon, species }: Props) {
  const gen = GENERATIONS.find((g) => g.id === species?.generation)

  return (
    <div className="flex flex-col gap-4">
      {species ? (
        <p className="leading-relaxed text-slate-600 dark:text-slate-300">{species.description}</p>
      ) : (
        <div className="h-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
      )}
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Fact label="Altura" value={`${pokemon.heightM.toLocaleString('es')} m`} />
        <Fact label="Peso" value={`${pokemon.weightKg.toLocaleString('es')} kg`} />
        <Fact label="Categoría" value={species?.genus.replace(/^Pokémon /, '') || '—'} />
        <Fact label="Generación" value={gen ? `${gen.label} · ${gen.region}` : '—'} />
      </dl>
      <div>
        <h3 className="mb-2 text-sm font-semibold text-slate-500">Habilidades</h3>
        <ul className="flex flex-wrap gap-2">
          {pokemon.abilities.map((a) => (
            <li
              key={a.name}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium dark:bg-slate-800"
            >
              {formatName(a.name)}
              {a.hidden && <span className="ml-1.5 text-xs text-slate-500">(oculta)</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
