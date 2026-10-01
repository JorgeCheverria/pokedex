import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  children: ReactNode
  variant?: 'outline' | 'glass'
}

const VARIANTS = {
  outline:
    'ring-1 ring-slate-900/10 hover:bg-slate-100 dark:ring-white/15 dark:hover:bg-slate-800',
  glass:
    'bg-white/80 shadow-sm backdrop-blur hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900',
}

/** Botón de solo icono, 40×40, con nombre accesible y tooltip nativo. */
export function IconButton({ label, children, variant = 'outline', className = '', ...props }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-poke-red ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
