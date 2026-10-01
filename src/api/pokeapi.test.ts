import { afterEach, describe, expect, test, vi } from 'vitest'
import {
  cleanFlavorText,
  fetchAbilityName,
  toCondition,
  fetchEvolutionChain,
  fetchPokemon,
  fetchPokemonIdsByType,
  fetchPokemonList,
  fetchSpecies,
  idFromUrl,
  pickLocalized,
} from './pokeapi'

const res = (name: string, id: number, kind = 'pokemon') => ({
  name,
  url: `https://pokeapi.co/api/v2/${kind}/${id}/`,
})
const lang = (name: string) => ({ name, url: '' })

function mockFetch(body: unknown, ok = true, status = 200) {
  const fn = vi.fn().mockResolvedValue({ ok, status, json: () => Promise.resolve(body) })
  vi.stubGlobal('fetch', fn)
  return fn
}

afterEach(() => vi.unstubAllGlobals())

describe('helpers', () => {
  test('idFromUrl extrae el id con o sin barra final', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/1025')).toBe(1025)
  })

  test('idFromUrl lanza error si no hay id', () => {
    expect(() => idFromUrl('https://pokeapi.co/api/v2/pokemon/')).toThrow()
  })

  test('pickLocalized prefiere español y cae a inglés', () => {
    const entries = [{ v: 'en', language: lang('en') }, { v: 'es', language: lang('es') }]
    expect(pickLocalized(entries)?.v).toBe('es')
    expect(pickLocalized([{ v: 'en', language: lang('en') }])?.v).toBe('en')
    expect(pickLocalized([{ v: 'ja', language: lang('ja') }])).toBeUndefined()
  })

  test('cleanFlavorText quita saltos y form-feeds', () => {
    expect(cleanFlavorText('Levanta su\ncola\fpara  vigilar.')).toBe('Levanta su cola para vigilar.')
  })
})

describe('fetchers', () => {
  test('fetchPokemonList descarta formas alternativas (id > 1025)', async () => {
    const fetchFn = mockFetch({ results: [res('bulbasaur', 1), res('pikachu-rock-star', 10080)] })

    const list = await fetchPokemonList()

    expect(fetchFn).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=1025')
    expect(list).toEqual([{ id: 1, name: 'bulbasaur' }])
  })

  test('fetchPokemonIdsByType devuelve solo ids válidos', async () => {
    mockFetch({ pokemon: [{ pokemon: res('charmander', 4) }, { pokemon: res('x', 10034) }] })
    await expect(fetchPokemonIdsByType('fire')).resolves.toEqual([4])
  })

  test('fetchPokemon mapea al modelo de la app', async () => {
    mockFetch({
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      types: [{ slot: 1, type: res('electric', 13, 'type') }],
      stats: [{ base_stat: 35, stat: res('hp', 1, 'stat') }],
      abilities: [{ is_hidden: true, ability: res('lightning-rod', 31, 'ability') }],
      sprites: { other: { 'official-artwork': { front_default: 'art.png', front_shiny: null } } },
      cries: { latest: 'cry.ogg' },
    })

    const p = await fetchPokemon(25)

    expect(p).toMatchObject({
      id: 25,
      types: ['electric'],
      heightM: 0.4,
      weightKg: 6,
      stats: [{ name: 'hp', value: 35 }],
      abilities: [{ name: 'lightning-rod', hidden: true }],
      artwork: 'art.png',
      cry: 'cry.ogg',
    })
  })

  test('fetchSpecies usa textos en español y resuelve generación y cadena', async () => {
    mockFetch({
      id: 25,
      names: [{ name: 'Pikachu', language: lang('es') }],
      genera: [{ genus: 'Pokémon Ratón', language: lang('es') }],
      flavor_text_entries: [{ flavor_text: 'Levanta su\ncola.', language: lang('es') }],
      generation: res('generation-i', 1, 'generation'),
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/10/' },
    })

    const s = await fetchSpecies(25)

    expect(s).toEqual({
      id: 25,
      localName: 'Pikachu',
      genus: 'Pokémon Ratón',
      description: 'Levanta su cola.',
      generation: 1,
      evolutionChainId: 10,
    })
  })

  test('fetchEvolutionChain convierte la cadena en árbol', async () => {
    const link = (name: string, id: number, next: unknown[] = []) => ({
      species: res(name, id, 'pokemon-species'),
      evolves_to: next,
    })
    mockFetch({ chain: link('pichu', 172, [link('pikachu', 25, [link('raichu', 26)])]) })

    const tree = await fetchEvolutionChain(10)

    expect(tree.id).toBe(172)
    expect(tree.evolvesTo[0].evolvesTo[0]).toEqual({
      id: 26,
      name: 'raichu',
      condition: null,
      evolvesTo: [],
    })
  })

  test('fetchAbilityName devuelve el nombre en español', async () => {
    mockFetch({
      names: [
        { name: 'Lightning Rod', language: lang('en') },
        { name: 'Pararrayos', language: lang('es') },
      ],
    })
    await expect(fetchAbilityName('lightning-rod')).resolves.toBe('Pararrayos')
  })

  test('lanza error si la API responde con error HTTP', async () => {
    mockFetch({}, false, 404)
    await expect(fetchPokemon('missingno')).rejects.toThrow('PokéAPI 404')
  })

  test('lanza error si la respuesta no cumple el schema', async () => {
    mockFetch({ id: 'no-es-numero' })
    await expect(fetchPokemon(1)).rejects.toThrow()
  })
})

describe('toCondition', () => {
  const t = (name: string) => ({ name, url: '' })

  test('etapa base sin detalles devuelve null', () => {
    expect(toCondition([])).toBeNull()
    expect(toCondition(undefined)).toBeNull()
  })

  test('nivel, objeto, intercambio y amistad', () => {
    expect(toCondition([{ trigger: t('level-up'), min_level: 16 }])).toEqual({ kind: 'level', level: 16 })
    expect(toCondition([{ trigger: t('use-item'), item: t('water-stone') }])).toEqual({
      kind: 'item',
      item: 'water-stone',
    })
    expect(toCondition([{ trigger: t('trade'), held_item: t('metal-coat') }])).toEqual({
      kind: 'trade',
      item: 'metal-coat',
    })
    expect(toCondition([{ trigger: t('level-up'), min_happiness: 160, time_of_day: 'night' }])).toEqual({
      kind: 'friendship',
      time: 'night',
    })
  })

  test('con varios métodos prefiere el que usa objeto (Leafeon)', () => {
    expect(
      toCondition([{ trigger: t('level-up') }, { trigger: t('use-item'), item: t('leaf-stone') }]),
    ).toEqual({ kind: 'item', item: 'leaf-stone' })
  })

  test('método desconocido es "other"', () => {
    expect(toCondition([{ trigger: t('spin') }])).toEqual({ kind: 'other' })
  })
})
