import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Recuerda cuántos elementos había cargados por cada combinación de filtros,
 * para que al volver del detalle la lista tenga la misma altura y
 * ScrollRestoration pueda devolver al usuario a su posición.
 */
const countCache = new Map<string, number>()

/**
 * Cuenta cuántos elementos mostrar; crece en `pageSize` cada vez que el
 * sentinel entra al viewport. Se reinicia cuando cambia `resetKey`.
 */
export function useInfiniteCount(total: number, pageSize: number, resetKey = '') {
  const [count, setCount] = useState(() => countCache.get(resetKey) ?? pageSize)
  const [prevKey, setPrevKey] = useState(resetKey)
  const observer = useRef<IntersectionObserver | null>(null)

  if (prevKey !== resetKey) {
    setPrevKey(resetKey)
    setCount(countCache.get(resetKey) ?? pageSize)
  }

  useEffect(() => {
    countCache.set(resetKey, count)
  }, [resetKey, count])

  const hasMore = count < total

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      observer.current?.disconnect()
      if (!node || !hasMore || typeof IntersectionObserver === 'undefined') return
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) setCount((c) => c + pageSize)
        },
        { rootMargin: '600px 0px' },
      )
      observer.current.observe(node)
    },
    [hasMore, pageSize],
  )

  useEffect(() => () => observer.current?.disconnect(), [])

  return { count: Math.min(count, total), hasMore, sentinelRef }
}

/** Solo para tests. */
export const clearInfiniteCountCache = () => countCache.clear()
