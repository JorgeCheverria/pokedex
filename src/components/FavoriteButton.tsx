import { useFavorites } from '../hooks/useFavorites'

type Props = { id: number; name: string; className?: string }

export function FavoriteButton({ id, name, className = '' }: Props) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(id)

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={active}
      aria-label={active ? `Quitar ${name} de favoritos` : `Agregar ${name} a favoritos`}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none transition hover:scale-110 focus-visible:outline-3 focus-visible:outline-poke-red motion-reduce:transform-none ${
        active ? 'text-amber-400' : 'text-slate-500 hover:text-amber-500 dark:text-slate-400'
      } ${className}`}
    >
      <span aria-hidden="true">{active ? '★' : '☆'}</span>
    </button>
  )
}
