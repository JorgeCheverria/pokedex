import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export type TabItem = { id: string; label: string; content: ReactNode }

/** Tabs accesibles (patrón WAI-ARIA): flechas, Home y End mueven el foco. */
export function Tabs({ tabs, accent }: { tabs: TabItem[]; accent: string }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()

  const focusTab = (index: number) => {
    const next = (index + tabs.length) % tabs.length
    setActive(next)
    refs.current[next]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: tabs.length - 1,
    }
    if (e.key in moves) {
      e.preventDefault()
      e.stopPropagation()
      focusTab(moves[e.key])
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        onKeyDown={onKeyDown}
        className="flex gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            id={`${baseId}-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-poke-red ${
              i === active
                ? 'bg-white shadow dark:bg-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            style={i === active ? { boxShadow: `inset 0 -3px 0 ${accent}` } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          id={`${baseId}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="focus-visible:outline-none"
        >
          {i === active && tab.content}
        </div>
      ))}
    </div>
  )
}
