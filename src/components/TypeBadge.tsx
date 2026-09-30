import { readableText, typeInfo } from '../utils/typeColors'

type Props = { type: string; size?: 'sm' | 'md' }

export function TypeBadge({ type, size = 'sm' }: Props) {
  const { label, color } = typeInfo(type)
  const sizing = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-sm'
  return (
    <span
      className={`${sizing} inline-block rounded-full font-bold tracking-wide uppercase shadow-sm`}
      style={{ backgroundColor: color, color: readableText(color) }}
    >
      {label}
    </span>
  )
}
