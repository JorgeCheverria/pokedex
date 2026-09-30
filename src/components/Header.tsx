import { Link } from 'react-router-dom'

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
      </div>
    </header>
  )
}
