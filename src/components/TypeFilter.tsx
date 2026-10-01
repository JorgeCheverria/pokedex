import { useEffect, useRef } from 'react'
import { readableText, TYPE_NAMES, typeInfo } from '../utils/typeColors'

type Props = { selected: string | null; onSelect: (type: string | null) => void }

/** En móvil los chips hacen scroll horizontal: se desvanecen los bordes como pista. */
const MOBILE_FADE =
  '[mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-32px),transparent)] sm:[mask-image:none]'

export function TypeFilter({ selected, onSelect }: Props) {
  const activeRef = useRef<HTMLButtonElement | null>(null)
  const groupRef = useRef<HTMLDivElement | null>(null)

  // Si el chip activo quedó fuera de la vista (p. ej. al abrir un link con ?type=fairy),
  // centrarlo moviendo solo el scroll horizontal del grupo (no el de la página).
  useEffect(() => {
    const center = () => {
      const chip = activeRef.current
      const group = groupRef.current
      if (!chip || !group || group.scrollWidth <= group.clientWidth) return
      group.scrollLeft = chip.offsetLeft - (group.clientWidth - chip.offsetWidth) / 2
    }
    center()
    // Inter cambia el ancho de los chips al cargar: recentrar cuando esté lista.
    let cancelled = false
    void document.fonts?.ready.then(() => !cancelled && center())
    return () => {
      cancelled = true
    }
  }, [selected])

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label="Filtrar por tipo"
      className={`relative -mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 ${MOBILE_FADE}`}
    >
      {TYPE_NAMES.map((type) => {
        const { label, color } = typeInfo(type)
        const active = selected === type
        return (
          <button
            key={type}
            ref={active ? activeRef : undefined}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(type)}
            className={`inline-flex h-9 shrink-0 items-center rounded-full px-3 text-sm font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-poke-red ${
              active
                ? 'shadow-md'
                : 'bg-white text-slate-700 ring-1 ring-slate-900/10 hover:ring-2 dark:bg-slate-800/60 dark:text-slate-200 dark:ring-white/10'
            }`}
            style={active ? { backgroundColor: color, color: readableText(color) } : undefined}
          >
            <span
              aria-hidden="true"
              className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: active ? readableText(color) : color }}
            />
            {label}
          </button>
        )
      })}
      {/* Espaciador: el padding derecho de un contenedor con scroll no siempre cuenta. */}
      <span aria-hidden="true" className="w-6 shrink-0 sm:hidden" />
    </div>
  )
}
