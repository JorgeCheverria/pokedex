import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as api from './api/pokeapi'
import type { Pokemon } from './api/types'
import { AppRoutes } from './App'
import { renderWithProviders } from './test/render'

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
  artwork: '',
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
    renderWithProviders(<AppRoutes />)

    expect(screen.getByText('Pokédex')).toBeInTheDocument()
    expect(await screen.findByText('31 de 31 Pokémon')).toBeInTheDocument()
    expect(cards()).toHaveLength(24)
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

    expect(await screen.findByText('31 de 31 Pokémon')).toBeInTheDocument()
  })
})

describe('filtros', () => {
  test('busca por nombre con debounce', async () => {
    renderWithProviders(<AppRoutes />)
    await screen.findByText('31 de 31 Pokémon')

    await userEvent.type(screen.getByRole('searchbox'), 'PIKA')

    expect(await screen.findByText('1 de 31 Pokémon')).toBeInTheDocument()
    expect(cards().map((c) => c.getAttribute('aria-label'))).toEqual(['Pikachu #025'])
  })

  test('filtra por tipo y el chip queda activo', async () => {
    renderWithProviders(<AppRoutes />)
    await screen.findByText('31 de 31 Pokémon')

    const chip = screen.getByRole('button', { name: 'Fuego' })
    await userEvent.click(chip)

    expect(await screen.findByText('2 de 31 Pokémon')).toBeInTheDocument()
    expect(api.fetchPokemonIdsByType).toHaveBeenCalledWith('fire')
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })

  test('filtra por generación', async () => {
    renderWithProviders(<AppRoutes />)
    await screen.findByText('31 de 31 Pokémon')

    await userEvent.selectOptions(screen.getByRole('combobox'), 'II · Johto')

    expect(await screen.findByText('1 de 31 Pokémon')).toBeInTheDocument()
    expect(cards()[0]).toHaveAccessibleName('Chikorita #152')
  })

  test('lee los filtros desde la URL', async () => {
    renderWithProviders(<AppRoutes />, '/?type=fire&gen=1')

    expect(await screen.findByText('2 de 31 Pokémon')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('1')
  })

  test('sin resultados muestra estado vacío y permite limpiar', async () => {
    renderWithProviders(<AppRoutes />)
    await screen.findByText('31 de 31 Pokémon')
    const search = screen.getByRole('searchbox')

    await userEvent.type(search, 'zzz')
    await userEvent.click(await screen.findByRole('button', { name: 'Limpiar filtros' }))

    expect(await screen.findByText('31 de 31 Pokémon')).toBeInTheDocument()
    expect(search).toHaveValue('')
    expect(cards()).toHaveLength(24)
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
