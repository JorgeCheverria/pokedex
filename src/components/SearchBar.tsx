type Props = { value: string; onChange: (value: string) => void }

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
      >
        <path
          fill="currentColor"
          d="M8.5 3a5.5 5.5 0 0 1 4.38 8.83l3.65 3.64a.75.75 0 1 1-1.06 1.06l-3.64-3.65A5.5 5.5 0 1 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o número…"
        aria-label="Buscar Pokémon por nombre o número"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-full border-0 bg-white py-3 pr-4 pl-12 text-base shadow-sm ring-1 ring-slate-900/10 placeholder:text-slate-400 focus:ring-2 focus:ring-poke-red focus:outline-none dark:bg-slate-800/60 dark:ring-white/10"
      />
    </div>
  )
}
