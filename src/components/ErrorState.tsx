type Props = { message?: string; onRetry?: () => void }

export function ErrorState({ message = 'No se pudo conectar con la Pokédex.', onRetry }: Props) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="text-5xl" aria-hidden="true">
        😵‍💫
      </span>
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-poke-red px-5 py-2 font-semibold text-white shadow transition hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-poke-red"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
