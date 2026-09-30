import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="font-mono text-6xl font-bold text-slate-300">404</p>
      <p className="font-medium">Este Pokémon escapó de la Pokédex.</p>
      <Link to="/" className="font-semibold text-poke-red hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}
