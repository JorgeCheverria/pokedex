import { TYPE_NAMES, typeInfo } from '../utils/typeColors'

type Props = { selected: string | null; onSelect: (type: string | null) => void }

export function TypeFilter({ selected, onSelect }: Props) {
  return (
    <div
      role="group"
      aria-label="Filtrar por tipo"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {TYPE_NAMES.map((type) => {
        const { label, color } = typeInfo(type)
        const active = selected === type
        return (
          <button
            key={type}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(type)}
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-poke-red ${
              active
                ? 'text-white shadow-md'
                : 'bg-white text-slate-700 ring-1 ring-slate-900/10 hover:ring-2 dark:bg-slate-800/60 dark:text-slate-200 dark:ring-white/10'
            }`}
            style={active ? { backgroundColor: color } : undefined}
          >
            <span
              aria-hidden="true"
              className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle"
              style={{ backgroundColor: active ? '#fff' : color }}
            />
            {label}
          </button>
        )
      })}
    </div>
  )
}
