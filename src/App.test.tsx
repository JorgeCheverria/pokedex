import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as api from './api/pokeapi'
import type { Pokemon } from './api/types'
import { renderApp } from './test/render'

vi.mock('./api/pokeapi')

const summaries = [
  ...Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: `poke-${i + 1}` })),
  { id: 152, name: 'chikorita' },
].map((p) => (p.id === 25 ? { id: 25, name: 'pikachu' } : p))

const fakePokemon = (id: number): Pokemon => ({
  id,
  name: summaries.find((p) => p.id === id)?.name ?? `poke-${id}`,
  types: ['fire', 'flying'],
  heightM: 1,
  weightKg: 10,
  stats: [],
  abilities: [],
  artwork: 'art.png',
  artworkShiny: null,
  cry: null,
})

const cards = () => screen.queryAllByRole('link', { name: /#\d{3}/ })

beforeEach(() => {
  vi.mocked(api.fetchPokemonList).mockResolvedValue(summaries)
  vi.mocked(api.fetchPokemon).mockImplementation(async (id) => fakePokemon(Number(id)))
  vi.mocked(api.fetchPokemonIdsByType).mockResolvedValue([4, 5])
})

describe('Home', () => {
  test('muestra header, contador y la primera página de tarjetas', async () => {
    renderApp()

    expect(screen.getByText('Pokédex')).toBeInTheDocument()
    expect(await screen.findByText('31 de 31 Pokémon')).toBeInTheDocument()
    expect(cards()).toHaveLength(24)
  })

  test('cada tarjeta muestra número, nombre y tipos en español', async () => {
    renderApp()

    const card = await screen.findByRole('link', { name: 'Poke 1 #001' })
    expect(card).toHaveAttribute('href', '/pokemon/1')
    await waitFor(() => expect(card).toHaveTextContent('Fuego'))
    expect(card).toHaveTextContent('Volador')
  })

  test('muestra error y reintenta', async () => {
    vi.mocked(api.fetchPokemonList).mockRejectedValueOnce(new Error('offline'))
    renderApp()

    await userEvent.click(await screen.findByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('31 de 31 Pokémon')).toBeInTheDocument()
  })
})

describe('filtros', () => {
  test('busca por nombre con debounce', async () => {
    renderApp()
    await screen.findByText('31 de 31 Pokémon')

    await userEvent.type(screen.getByRole('searchbox'), 'PIKA')

    expect(await screen.findByText('1 de 31 Pokémon')).toBeInTheDocument()
    expect(cards().map((c) => c.getAttribute('aria-label'))).toEqual(['Pikachu #025'])
  })

  test('filtra por tipo y el chip queda activo', async () => {
    renderApp()
    await screen.findByText('31 de 31 Pokémon')

    const chip = screen.getByRole('button', { name: 'Fuego' })
    await userEvent.click(chip)

    expect(await screen.findByText('2 de 31 Pokémon')).toBeInTheDocument()
    expect(api.fetchPokemonIdsByType).toHaveBeenCalledWith('fire')
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })

  test('filtra por generación', async () => {
    renderApp()
    await screen.findByText('31 de 31 Pokémon')

    await userEvent.selectOptions(screen.getByRole('combobox'), 'II · Johto')

    expect(await screen.findByText('1 de 31 Pokémon')).toBeInTheDocument()
    expect(cards()[0]).toHaveAccessibleName('Chikorita #152')
  })

  test('lee los filtros desde la URL', async () => {
    renderApp('/?type=fire&gen=1')

    expect(await screen.findByText('2 de 31 Pokémon')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('1')
  })

  test('sin resultados muestra estado vacío y permite limpiar', async () => {
    renderApp()
    await screen.findByText('31 de 31 Pokémon')
    const search = screen.getByRole('searchbox')

    await userEvent.type(search, 'zzz')
    await userEvent.click(await screen.findByRole('button', { name: 'Limpiar filtros' }))

    expect(await screen.findByText('31 de 31 Pokémon')).toBeInTheDocument()
    expect(search).toHaveValue('')
    expect(cards()).toHaveLength(24)
  })
})

describe('favoritos', () => {
  test('marcar favorito desde la tarjeta, contar en header y filtrar', async () => {
    renderApp()
    await screen.findByText('31 de 31 Pokémon')

    await userEvent.click(screen.getByRole('button', { name: 'Agregar Poke 3 a favoritos' }))
    await userEvent.click(screen.getByRole('button', { name: 'Agregar Poke 2 a favoritos' }))

    expect(screen.getByRole('link', { name: 'Favoritos (2)' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('pokedex:favorites')!)).toEqual([2, 3])

    await userEvent.click(screen.getByRole('button', { name: /Solo favoritos/ }))

    expect(await screen.findByText('2 de 31 Pokémon')).toBeInTheDocument()
    expect(cards().map((c) => c.getAttribute('aria-label'))).toEqual(['Poke 2 #002', 'Poke 3 #003'])
  })

  test('lee favoritos guardados y muestra mensaje si no hay', async () => {
    renderApp('/?fav=1')

    expect(await screen.findByText(/Aún no tienes favoritos/)).toBeInTheDocument()
  })

  test('link del header abre la vista de favoritos', async () => {
    localStorage.setItem('pokedex:favorites', '[25]')
    renderApp()
    await screen.findByText('31 de 31 Pokémon')

    await userEvent.click(screen.getByRole('link', { name: 'Favoritos (1)' }))

    expect(await screen.findByText('1 de 31 Pokémon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Solo favoritos/ })).toHaveAttribute('aria-pressed', 'true')
  })

  test('ignora datos corruptos en localStorage', async () => {
    localStorage.setItem('pokedex:favorites', '{"no": "es lista"')
    renderApp()

    expect(await screen.findByRole('link', { name: 'Favoritos (0)' })).toBeInTheDocument()
  })
})

describe('tema', () => {
  test('el botón alterna modo oscuro y lo guarda', async () => {
    renderApp()

    await userEvent.click(screen.getByRole('button', { name: 'Cambiar a modo oscuro' }))

    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('pokedex:theme')).toBe('"dark"')

    await userEvent.click(screen.getByRole('button', { name: 'Cambiar a modo claro' }))

    expect(document.documentElement).not.toHaveClass('dark')
  })
})

describe('accesibilidad', () => {
  test('skip link lleva el foco al contenido', async () => {
    renderApp()

    await userEvent.click(screen.getByRole('link', { name: 'Saltar al contenido' }))

    expect(screen.getByRole('main')).toHaveFocus()
  })
})

describe('rutas', () => {
  test('ir al detalle y volver mantiene la lista', async () => {
    renderApp()
    await userEvent.click(await screen.findByRole('link', { name: 'Poke 5 #005' }))
    expect(await screen.findByRole('heading', { name: 'Poke 5' })).toBeInTheDocument()

    await userEvent.click(screen.getByText('← Volver'))

    expect(await screen.findByText('31 de 31 Pokémon')).toBeInTheDocument()
    expect(cards()).toHaveLength(24)
  })

  test('detalle muestra el Pokémon', async () => {
    renderApp('/pokemon/6')
    expect(await screen.findByRole('heading', { name: 'Poke 6' })).toBeInTheDocument()
  })

  test('ruta desconocida muestra 404', () => {
    renderApp('/nada')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
