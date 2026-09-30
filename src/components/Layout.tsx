import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <>
      <a
        href="#contenido"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('contenido')?.focus()
        }}
        className="sr-only z-30 rounded-full bg-poke-red px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-6 focus:outline-none">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-6xl px-4 pt-4 pb-10 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        <p>
          Datos de{' '}
          <a href="https://pokeapi.co" className="font-semibold underline hover:text-poke-red">
            PokéAPI
          </a>{' '}
          ·{' '}
          <a
            href="https://github.com/JorgeCheverria/pokedex"
            className="font-semibold underline hover:text-poke-red"
          >
            Código en GitHub
          </a>
        </p>
        <p>
          Pokémon y sus nombres son marcas de Nintendo, Game Freak y The Pokémon Company. Proyecto
          personal sin fines de lucro.
        </p>
      </footer>
      <ScrollRestoration />
    </>
  )
}
