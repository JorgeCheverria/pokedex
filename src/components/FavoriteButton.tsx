import { useFavorites } from '../hooks/useFavorites'
import { StarIcon } from './icons'

type Props = { id: number; name: string; className?: string }

export function FavoriteButton({ id, name, className = '' }: Props) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(id)
  const label = active ? `Quitar ${name} de favoritos` : `Agregar ${name} a favoritos`

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-110 focus-visible:outline-3 focus-visible:outline-poke-red motion-reduce:transform-none ${
        active ? 'text-amber-400' : 'text-slate-500 hover:text-amber-500 dark:text-slate-400'
      } ${className}`}
    >
      <StarIcon filled={active} size={20} />
    </button>
  )
}
