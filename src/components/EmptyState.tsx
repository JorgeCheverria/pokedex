import { Pokeball } from './Header'

type Props = { onClear: () => void }

export function EmptyState({ onClear }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <Pokeball className="h-14 w-14 text-slate-300 opacity-60 dark:text-slate-600" />
      <p className="font-medium">Ningún Pokémon coincide con tu búsqueda.</p>
      <button
        type="button"
        onClick={onClear}
        className="rounded-full bg-poke-red px-5 py-2 font-semibold text-white shadow transition hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-poke-red"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
