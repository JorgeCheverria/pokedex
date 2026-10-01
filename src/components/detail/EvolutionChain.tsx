import { Link } from 'react-router-dom'
import type { EvolutionCondition, EvolutionNode } from '../../api/types'
import { useItemName } from '../../hooks/queries'
import { formatId, formatName } from '../../utils/format'
import { artworkUrl } from '../../utils/sprites'
import { ArrowRightIcon } from '../icons'
import { PokemonImage } from '../PokemonImage'

type Props = { chain: EvolutionNode; currentId: number }

const TIME_LABEL = { day: ' (día)', night: ' (noche)' } as const

/** Texto corto de la condición: "Nv. 16", "Piedra Agua", "Intercambio"… */
function conditionText(condition: EvolutionCondition, item: string): string {
  switch (condition.kind) {
    case 'level':
      return `Nv. ${condition.level}`
    case 'item':
      return item
    case 'trade':
      return item ? `Intercambio + ${item}` : 'Intercambio'
    case 'friendship':
      return `Amistad${condition.time ? TIME_LABEL[condition.time] : ''}`
    case 'other':
      return 'Especial'
  }
}

function ConditionLabel({ condition }: { condition: EvolutionCondition }) {
  const itemSlug =
    condition.kind === 'item' || condition.kind === 'trade' ? condition.item : undefined
  const { data: itemName } = useItemName(itemSlug)
  const text = conditionText(condition, itemName ?? (itemSlug ? formatName(itemSlug) : ''))

  return (
    <span className="mt-1 max-w-full rounded-xl bg-slate-100 px-2 py-0.5 text-[11px] leading-tight font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
      {text}
    </span>
  )
}

function EvoCard({ node, current }: { node: EvolutionNode; current: boolean }) {
  return (
    <Link
      to={`/pokemon/${node.id}`}
      replace
      aria-current={current ? 'page' : undefined}
      className={`flex w-[6.5rem] shrink-0 flex-col items-center rounded-2xl p-2 text-center transition hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-poke-red dark:hover:bg-slate-800 ${
        current ? 'bg-slate-100 ring-2 ring-slate-900 dark:bg-slate-800 dark:ring-white' : ''
      }`}
    >
      <PokemonImage src={artworkUrl(node.id)} alt="" className="w-20" />
      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{formatId(node.id)}</span>
      <span className="text-sm font-semibold">{formatName(node.name)}</span>
      {node.condition && <ConditionLabel condition={node.condition} />}
    </Link>
  )
}

function Branch({ node, currentId }: { node: EvolutionNode; currentId: number }) {
  return (
    <div className="flex items-center gap-1">
      <EvoCard node={node} current={node.id === currentId} />
      {node.evolvesTo.length > 0 && (
        <>
          <ArrowRightIcon size={18} className="shrink-0 text-slate-400 dark:text-slate-500" />
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
