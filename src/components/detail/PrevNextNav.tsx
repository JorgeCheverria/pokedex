import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { PokemonSummary } from '../../api/types'
import { formatId, formatName } from '../../utils/format'
import { artworkUrl } from '../../utils/sprites'
import { ArrowLeftIcon, ArrowRightIcon } from '../icons'

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

  return (
    <nav aria-label="Pokémon anterior y siguiente" className="flex gap-3">
      {prev ? <NavCard pokemon={prev} dir="prev" /> : <span className="flex-1" />}
      {next ? <NavCard pokemon={next} dir="next" /> : <span className="flex-1" />}
    </nav>
  )
}

function NavCard({ pokemon, dir }: { pokemon: PokemonSummary; dir: 'prev' | 'next' }) {
  const isNext = dir === 'next'
  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      rel={dir}
      replace
      className={`group flex min-w-0 flex-1 items-center gap-2 rounded-2xl bg-white p-2 pr-3 shadow-sm ring-1 ring-slate-900/5 transition hover:shadow-md focus-visible:outline-3 focus-visible:outline-poke-red dark:bg-slate-800/60 dark:ring-white/10 ${
        isNext ? 'flex-row-reverse pr-2 pl-3 text-right' : ''
      }`}
    >
      <img
        src={artworkUrl(pokemon.id)}
        alt=""
        loading="lazy"
        className="h-12 w-12 shrink-0 object-contain transition-transform group-hover:scale-110 motion-reduce:transform-none"
      />
      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className={`flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ${isNext ? 'justify-end' : ''}`}
        >
          {!isNext && <ArrowLeftIcon size={14} />}
          {isNext ? 'Siguiente' : 'Anterior'}
          {isNext && <ArrowRightIcon size={14} />}
          <kbd className="ml-1 hidden rounded border border-slate-900/10 px-1 font-mono text-[10px] lg:inline dark:border-white/15">
            {isNext ? '→' : '←'}
          </kbd>
        </span>
        <span className="truncate font-semibold">
          <span className="font-mono text-slate-500 dark:text-slate-400">{formatId(pokemon.id)}</span>{' '}
          {formatName(pokemon.name)}
        </span>
      </span>
    </Link>
  )
}
