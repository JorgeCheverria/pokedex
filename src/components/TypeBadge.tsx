import { typeInfo } from '../utils/typeColors'

type Props = { type: string; size?: 'sm' | 'md' }

export function TypeBadge({ type, size = 'sm' }: Props) {
  const { label, color } = typeInfo(type)
  const sizing = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-sm'
  return (
    <span
      className={`${sizing} inline-block rounded-full font-semibold tracking-wide text-white uppercase shadow-sm`}
      style={{ backgroundColor: color, textShadow: '0 1px 1px rgb(0 0 0 / 0.35)' }}
    >
      {label}
    </span>
  )
}
