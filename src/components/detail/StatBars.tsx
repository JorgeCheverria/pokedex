import { useEffect, useState } from 'react'
import type { Stat } from '../../api/types'
import { statLabel } from '../../utils/format'

const MAX_STAT = 255

/** Color por rango: bajo rojo → alto verde azulado. */
function statColor(value: number): string {
  if (value < 50) return '#ef4444'
  if (value < 80) return '#f59e0b'
  if (value < 110) return '#22c55e'
  return '#14b8a6'
}

export function StatBars({ stats }: { stats: Stat[] }) {
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const total = stats.reduce((sum, s) => sum + s.value, 0)

  return (
    <dl className="flex flex-col gap-2.5">
      {stats.map((s) => (
        <div key={s.name} className="grid grid-cols-[5.5rem_2.5rem_1fr] items-center gap-2">
          <dt className="text-sm font-medium text-slate-500">{statLabel(s.name)}</dt>
          <dd className="text-right font-mono text-sm font-semibold">{s.value}</dd>
          <dd
            className="h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
            role="meter"
            aria-label={statLabel(s.name)}
            aria-valuenow={s.value}
            aria-valuemin={0}
            aria-valuemax={MAX_STAT}
          >
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{
                width: animate ? `${(s.value / MAX_STAT) * 100}%` : '0%',
                backgroundColor: statColor(s.value),
              }}
            />
          </dd>
        </div>
      ))}
      <div className="mt-1 grid grid-cols-[5.5rem_2.5rem_1fr] items-center gap-2 border-t border-slate-900/10 pt-2.5 dark:border-white/10">
        <dt className="text-sm font-bold">Total</dt>
        <dd className="text-right font-mono text-sm font-bold">{total}</dd>
      </div>
    </dl>
  )
}
