import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { PokemonSummary } from '../../api/types'
import { formatId, formatName } from '../../utils/format'

type Props = { prev?: PokemonSummary; next?: PokemonSummary }

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) ||
    el.getAttribute('role') === 'tab')

/** Links al anterior/siguiente + atajos de teclado ← →. */
export function PrevNextNav({ prev, next }: Props) {
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || isTyping(e.target)) return
      const target = e.key === 'ArrowLeft' ? prev : e.key === 'ArrowRight' ? next : undefined
      if (target) navigate(`/pokemon/${target.id}`, { replace: true })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, navigate])

  const linkClass =
    'flex min-w-0 flex-1 flex-col rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 transition hover:shadow-md focus-visible:outline-3 focus-visible:outline-poke-red dark:bg-slate-800/60 dark:ring-white/10'

  return (
    <nav aria-label="Pokémon anterior y siguiente" className="flex gap-3">
      {prev ? (
        <Link to={`/pokemon/${prev.id}`} rel="prev" replace className={linkClass}>
          <span className="text-xs text-slate-400">← Anterior</span>
          <span className="truncate font-semibold">
            <span className="font-mono text-slate-400">{formatId(prev.id)}</span> {formatName(prev.name)}
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <Link to={`/pokemon/${next.id}`} rel="next" replace className={`${linkClass} items-end text-right`}>
          <span className="text-xs text-slate-400">Siguiente →</span>
          <span className="truncate font-semibold">
            {formatName(next.name)} <span className="font-mono text-slate-400">{formatId(next.id)}</span>
          </span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  )
}
