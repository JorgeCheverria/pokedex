import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import * as api from '../api/pokeapi'
import type { Pokemon, Species } from '../api/types'
import { renderApp } from '../test/render'

vi.mock('../api/pokeapi', async (importOriginal) => {
  const original = await importOriginal<typeof import('../api/pokeapi')>()
  return {
    ...original,
    fetchPokemonList: vi.fn(),
    fetchPokemon: vi.fn(),
    fetchSpecies: vi.fn(),
    fetchEvolutionChain: vi.fn(),
    fetchPokemonIdsByType: vi.fn(),
    fetchAbilityName: vi.fn(),
    fetchItemName: vi.fn(),
  }
})

const names: Record<number, string> = { 24: 'arbok', 25: 'pikachu', 26: 'raichu', 172: 'pichu' }

const pokemon = (id: number): Pokemon => ({
  id,
  name: names[id],
  types: ['electric'],
  heightM: 0.4,
  weightKg: 6,
  stats: [
    { name: 'hp', value: 35 },
    { name: 'speed', value: 90 },
  ],
  abilities: [
    { name: 'static', hidden: false },
    { name: 'lightning-rod', hidden: true },
  ],
  artwork: `art-${id}.png`,
  artworkShiny: `shiny-${id}.png`,
  cry: null,
})

const species = (id: number): Species => ({
  id,
  localName: names[id].charAt(0).toUpperCase() + names[id].slice(1),
  genus: 'Pokémon Ratón',
  description: 'Levanta su cola para vigilar los alrededores.',
  generation: 1,
  evolutionChainId: 10,
})

beforeEach(() => {
  vi.mocked(api.fetchPokemonList).mockResolvedValue(
    Object.entries(names).map(([id, name]) => ({ id: Number(id), name })),
  )
  vi.mocked(api.fetchPokemon).mockImplementation(async (id) => pokemon(Number(id)))
  vi.mocked(api.fetchSpecies).mockImplementation(async (id) => species(id))
  vi.mocked(api.fetchAbilityName).mockImplementation(async (slug) =>
    slug === 'lightning-rod' ? 'Pararrayos' : 'Electricidad Estática',
  )
  vi.mocked(api.fetchEvolutionChain).mockResolvedValue({
    id: 172,
    name: 'pichu',
    condition: null,
    evolvesTo: [
      {
        id: 25,
        name: 'pikachu',
        condition: { kind: 'friendship' },
        evolvesTo: [
          { id: 26, name: 'raichu', condition: { kind: 'item', item: 'thunder-stone' }, evolvesTo: [] },
        ],
      },
    ],
  })
  vi.mocked(api.fetchItemName).mockResolvedValue('Piedra Trueno')
})

const openPikachu = async () => {
  renderApp('/pokemon/25')
  await screen.findByRole('heading', { name: 'Pikachu' })
}

describe('Detail', () => {
  test('muestra hero, descripción, datos y habilidades', async () => {
    await openPikachu()

    expect(screen.getAllByText('#025').length).toBeGreaterThan(0)
    expect(await screen.findByText(/Levanta su cola/)).toBeInTheDocument()
    expect(screen.getByText('0,4 m')).toBeInTheDocument()
    expect(screen.getByText('6 kg')).toBeInTheDocument()
    expect(screen.getByText('I · Kanto')).toBeInTheDocument()
    expect(await screen.findByText('Pararrayos')).toHaveTextContent(/Pararrayos\s*\(oculta\)/)
    expect(screen.getByText('Electricidad Estática')).toBeInTheDocument()
  })

  test('tab Stats muestra barras y total', async () => {
    await openPikachu()

    await userEvent.click(screen.getByRole('tab', { name: 'Stats' }))

    expect(screen.getByRole('tab', { name: 'Stats' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('meter', { name: 'PS' })).toHaveAttribute('aria-valuenow', '35')
    expect(screen.getByText('125')).toBeInTheDocument()
  })

  test('tabs se recorren con flechas del teclado', async () => {
    await openPikachu()
    screen.getByRole('tab', { name: 'Info' }).focus()

    await userEvent.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'Stats' })).toHaveFocus()
    expect(screen.getByRole('heading', { name: 'Pikachu' })).toBeInTheDocument()
  })

  test('tab Evolución muestra la cadena y marca el actual', async () => {
    await openPikachu()

    await userEvent.click(screen.getByRole('tab', { name: 'Evolución' }))
    const panel = screen.getByRole('tabpanel')

    const links = await within(panel).findAllByRole('link')
    expect(links[0]).toHaveTextContent('#172Pichu')
    expect(links[1]).toHaveTextContent('#025PikachuAmistad')
    expect(links[1]).toHaveAttribute('aria-current', 'page')
    expect(await within(links[2]).findByText('Piedra Trueno')).toBeInTheDocument()
  })

  test('navega al siguiente con la flecha derecha', async () => {
    await openPikachu()
    expect(await screen.findByRole('link', { name: /Siguiente/ })).toHaveTextContent('Raichu')

    fireEvent.keyDown(window, { key: 'ArrowRight' })

    expect(await screen.findByRole('heading', { name: 'Raichu' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Anterior/ })).toHaveTextContent('Pikachu')
  })

  test('botón shiny cambia el artwork', async () => {
    await openPikachu()

    await userEvent.click(screen.getByRole('button', { name: 'Versión Shiny' }))

    expect(screen.getByRole('img', { name: 'Pikachu (shiny)' })).toHaveAttribute('src', 'shiny-25.png')
  })

  test('favorito desde el detalle actualiza el contador del header', async () => {
    await openPikachu()

    await userEvent.click(screen.getByRole('button', { name: 'Agregar Pikachu a favoritos' }))

    expect(screen.getByRole('button', { name: 'Quitar Pikachu de favoritos' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Favoritos (1)' })).toBeInTheDocument()
  })

  test('id fuera de rango muestra 404', () => {
    renderApp('/pokemon/9999')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
