import { useEffect, useRef } from 'react'
import { SearchIcon } from './icons'

type Props = { value: string; onChange: (value: string) => void }

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))

/** Búsqueda con atajo "/" para enfocar y Escape para limpiar. */
export function SearchBar({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.preventDefault()
            onChange('')
          }
        }}
        placeholder="Buscar por nombre o número…"
        aria-label="Buscar Pokémon por nombre o número"
        aria-keyshortcuts="/"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
        className="peer w-full rounded-full border-0 bg-white py-3 pr-12 pl-12 text-base shadow-sm ring-1 ring-slate-900/10 placeholder:text-slate-500 focus:ring-2 focus:ring-poke-red focus:outline-none dark:bg-slate-800/60 dark:ring-white/10 dark:placeholder:text-slate-400"
      />
      {!value && (
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-md border border-slate-900/15 px-1.5 font-mono text-xs text-slate-500 peer-focus:hidden sm:block dark:border-white/15 dark:text-slate-400"
        >
          /
        </kbd>
      )}
    </div>
  )
}
