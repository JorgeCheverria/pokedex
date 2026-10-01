import { Link, useLocation } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { useTheme } from '../hooks/useTheme'
import { IconButton } from './IconButton'
import { MoonIcon, StarIcon, SunIcon } from './icons'

export function Pokeball({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <path d="M2 16a14 14 0 0 1 28 0Z" fill="#e3350d" stroke="currentColor" strokeWidth="3" />
      <circle cx="16" cy="16" r="4.5" fill="#fff" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

export function Header() {
  const { count } = useFavorites()
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const onFavorites =
    location.pathname === '/' && new URLSearchParams(location.search).get('fav') === '1'

  return (
    <header className="sticky top-0 z-20 border-b border-slate-900/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg text-slate-900 focus-visible:outline-3 focus-visible:outline-poke-red dark:text-slate-100"
        >
          <Pokeball />
          <span className="text-xl font-extrabold tracking-tight">Pokédex</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={onFavorites ? '/' : '/?fav=1'}
            aria-label={`Favoritos (${count})`}
            aria-current={onFavorites ? 'page' : undefined}
            className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-poke-red ${
              onFavorites
                ? 'bg-amber-400 text-slate-900'
                : 'ring-1 ring-slate-900/10 hover:bg-slate-100 dark:ring-white/15 dark:hover:bg-slate-800'
            }`}
          >
            <StarIcon filled size={18} className={onFavorites ? '' : 'text-amber-400'} />
            <span aria-hidden="true" className="hidden sm:inline">
              Favoritos
            </span>
            <span
              aria-hidden="true"
              className={`min-w-5 rounded-full px-1.5 text-center font-mono text-xs leading-5 ${
                onFavorites ? 'bg-slate-900/15' : 'bg-slate-900/5 dark:bg-white/10'
              }`}
            >
              {count}
            </span>
          </Link>
          <IconButton
            onClick={toggle}
            label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </div>
      </div>
    </header>
  )
}
