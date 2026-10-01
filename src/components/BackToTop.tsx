import { useEffect, useState } from 'react'
import { ArrowUpIcon } from './icons'

const SHOW_AFTER_PX = 1200

/** Botón flotante para volver a los filtros tras hacer scroll en la lista. */
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goTop = () => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Volver arriba"
      title="Volver arriba"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed right-4 bottom-5 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-1 ring-white/10 transition duration-300 hover:scale-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-poke-red motion-reduce:transition-none dark:bg-white dark:text-slate-900 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUpIcon />
    </button>
  )
}
