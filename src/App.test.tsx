import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as api from './api/pokeapi'
import type { Pokemon } from './api/types'
import { AppRoutes } from './App'
import { renderWithProviders } from './test/render'

vi.mock('./api/pokeapi')

const summaries = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: `poke-${i + 1}` }))

const fakePokemon = (id: number): Pokemon => ({
  id,
  name: `poke-${id}`,
  types: ['fire', 'flying'],
  heightM: 1,
  weightKg: 10,
  stats: [],
  abilities: [],
  artwork: '',
  artworkShiny: null,
  cry: null,
})

beforeEach(() => {
  vi.mocked(api.fetchPokemonList).mockResolvedValue(summaries)
  vi.mocked(api.fetchPokemon).mockImplementation(async (id) => fakePokemon(Number(id)))
})

describe('Home', () => {
  test('muestra header y la primera página de tarjetas', async () => {
    renderWithProviders(<AppRoutes />)

    expect(screen.getByText('Pokédex')).toBeInTheDocument()
    expect(await screen.findByText('30 Pokémon')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /#\d{3}/ })).toHaveLength(24)
  })

  test('cada tarjeta muestra número, nombre y tipos en español', async () => {
    renderWithProviders(<AppRoutes />)

    const card = await screen.findByRole('link', { name: 'Poke 1 #001' })
    expect(card).toHaveAttribute('href', '/pokemon/1')
    await waitFor(() => expect(card).toHaveTextContent('Fuego'))
    expect(card).toHaveTextContent('Volador')
  })

  test('muestra error y reintenta', async () => {
    vi.mocked(api.fetchPokemonList).mockRejectedValueOnce(new Error('offline'))
    renderWithProviders(<AppRoutes />)

    await userEvent.click(await screen.findByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('30 Pokémon')).toBeInTheDocument()
  })
})

describe('rutas', () => {
  test('detalle muestra el Pokémon', async () => {
    renderWithProviders(<AppRoutes />, '/pokemon/6')
    expect(await screen.findByRole('heading', { name: 'Poke 6' })).toBeInTheDocument()
  })

  test('ruta desconocida muestra 404', () => {
    renderWithProviders(<AppRoutes />, '/nada')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
