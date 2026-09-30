import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GENERATIONS } from '../utils/generations'
import { TYPES } from '../utils/typeColors'
import { useDebouncedValue } from './useDebouncedValue'

function parseGen(raw: string | null): number | null {
  const n = Number(raw)
  return GENERATIONS.some((g) => g.id === n) ? n : null
}

/**
 * Filtros de la Home guardados en la URL (`#/?q=pika&type=electric&gen=1`)
 * para poder compartirlos. El texto de búsqueda se aplica con debounce.
 */
export function usePokedexFilters() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const rawType = params.get('type')
  const type = rawType && rawType in TYPES ? rawType : null
  const gen = parseGen(params.get('gen'))

  const [text, setText] = useState(query)
  const debounced = useDebouncedValue(text)

  const update = (key: string, value: string | null) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )

  useEffect(() => {
    if (debounced.trim() !== query) update('q', debounced.trim() || null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  return {
    text,
    query,
    type,
    gen,
    hasFilters: !!(query || type || gen),
    setText,
    setType: (t: string | null) => update('type', t === type ? null : t),
    setGen: (g: number | null) => update('gen', g ? String(g) : null),
    clear: () => {
      setText('')
      setParams({}, { replace: true })
    },
  }
}
