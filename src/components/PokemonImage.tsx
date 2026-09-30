import { useState } from 'react'

type Props = { src: string; alt: string; className?: string; eager?: boolean }

/** Imagen con placeholder silueta mientras carga y fallback si falla. */
export function PokemonImage({ src, alt, className = '', eager = false }: Props) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <div className={`relative aspect-square ${className}`}>
      {status !== 'loaded' && (
        <div
          aria-hidden="true"
          className={`absolute inset-[15%] rounded-full bg-slate-200/70 dark:bg-slate-700/60 ${
            status === 'loading' ? 'animate-pulse' : ''
          }`}
        />
      )}
      {status !== 'error' && (
        <img
          ref={(img) => {
            if (img?.complete && img.naturalWidth > 0) setStatus('loaded')
          }}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`relative h-full w-full object-contain drop-shadow-md transition-opacity duration-300 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
