import { GENERATIONS } from '../utils/generations'

type Props = { value: number | null; onChange: (gen: number | null) => void }

export function GenerationSelect({ value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <span className="text-slate-500">Generación</span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className="rounded-full border-0 bg-white py-1.5 pr-8 pl-3 shadow-sm ring-1 ring-slate-900/10 focus:ring-2 focus:ring-poke-red focus:outline-none dark:bg-slate-800 dark:ring-white/10"
      >
        <option value="">Todas</option>
        {GENERATIONS.map((g) => (
          <option key={g.id} value={g.id}>
            {g.label} · {g.region}
          </option>
        ))}
      </select>
    </label>
  )
}
