import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { useTheme } from '../hooks/useTheme'

export function Pokeball({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <path d="M2 16a14 14 0 0 1 28 0Z" fill="#e3350d" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="16" r="4.5" fill="#fff" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

const headerButton =
  'flex h-9 min-w-9 items-center justify-center gap-1 rounded-full px-2.5 font-semibold ring-1 ring-slate-900/10 transition hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-poke-red dark:ring-white/15 dark:hover:bg-slate-800'

export function Header() {
  const { count } = useFavorites()
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-20 border-b border-slate-900/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#121218]/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg text-slate-900 focus-visible:outline-3 focus-visible:outline-poke-red dark:text-slate-100"
        >
          <Pokeball />
          <span className="text-xl font-extrabold tracking-tight">Pokédex</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/?fav=1"
            aria-label={`Favoritos (${count})`}
            className={headerButton}
          >
            <span aria-hidden="true" className="text-amber-400">
              ★
            </span>
            <span aria-hidden="true" className="font-mono text-sm">
              {count}
            </span>
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className={headerButton}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
