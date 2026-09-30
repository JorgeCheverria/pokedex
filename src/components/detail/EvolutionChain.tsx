import { Link } from 'react-router-dom'
import type { EvolutionNode } from '../../api/types'
import { formatId, formatName } from '../../utils/format'
import { artworkUrl } from '../../utils/sprites'
import { PokemonImage } from '../PokemonImage'

type Props = { chain: EvolutionNode; currentId: number }

function EvoCard({ node, current }: { node: EvolutionNode; current: boolean }) {
  return (
    <Link
      to={`/pokemon/${node.id}`}
      replace
      aria-current={current ? 'page' : undefined}
      className={`flex w-24 shrink-0 flex-col items-center rounded-2xl p-2 text-center transition hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-poke-red dark:hover:bg-slate-800 ${
        current ? 'bg-slate-100 ring-2 ring-poke-red dark:bg-slate-800' : ''
      }`}
    >
      <PokemonImage src={artworkUrl(node.id)} alt="" className="w-20" />
      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{formatId(node.id)}</span>
      <span className="text-sm font-semibold">{formatName(node.name)}</span>
    </Link>
  )
}

const Arrow = () => (
  <span aria-hidden="true" className="shrink-0 text-xl text-slate-500 dark:text-slate-400">
    →
  </span>
)

function Branch({ node, currentId }: { node: EvolutionNode; currentId: number }) {
  return (
    <div className="flex items-center gap-1">
      <EvoCard node={node} current={node.id === currentId} />
      {node.evolvesTo.length > 0 && (
        <>
          <Arrow />
          <div
            className={
              node.evolvesTo.length > 2 ? 'grid grid-cols-2 gap-1 sm:grid-cols-4' : 'flex flex-col gap-1'
            }
          >
            {node.evolvesTo.map((child) => (
              <Branch key={child.id} node={child} currentId={currentId} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function EvolutionChain({ chain, currentId }: Props) {
  if (chain.evolvesTo.length === 0) {
    return <p className="text-center text-slate-500 dark:text-slate-400">Este Pokémon no evoluciona.</p>
  }
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2">
      <div className="flex w-max min-w-full justify-center">
        <Branch node={chain} currentId={currentId} />
      </div>
    </div>
  )
}
