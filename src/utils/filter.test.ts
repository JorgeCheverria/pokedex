import { describe, expect, test } from 'vitest'
import { filterPokemon, normalize, type Filters } from './filter'

const list = [
  { id: 1, name: 'bulbasaur' },
  { id: 25, name: 'pikachu' },
  { id: 122, name: 'mr-mime' },
  { id: 250, name: 'ho-oh' },
  { id: 252, name: 'treecko' },
]
const none: Filters = { query: '', typeIds: null, gen: null }
const ids = (f: Partial<Filters>) => filterPokemon(list, { ...none, ...f }).map((p) => p.id)

describe('normalize', () => {
  test('quita acentos, puntos y espacios', () => {
    expect(normalize('  Mr. Mimé ')).toBe('mr-mime')
    expect(normalize('PIKA')).toBe('pika')
  })
})

describe('filterPokemon', () => {
  test('sin filtros devuelve todo', () => {
    expect(ids({})).toEqual([1, 25, 122, 250, 252])
  })

  test('busca por nombre parcial sin importar mayúsculas ni acentos', () => {
    expect(ids({ query: 'PIKA' })).toEqual([25])
    expect(ids({ query: 'mr mimé' })).toEqual([122])
  })

  test('busca por número con o sin # y ceros a la izquierda', () => {
    expect(ids({ query: '#025' })).toEqual([25, 250, 252])
    expect(ids({ query: '1' })).toEqual([1, 122])
  })

  test('filtra por generación', () => {
    expect(ids({ gen: 1 })).toEqual([1, 25, 122])
    expect(ids({ gen: 3 })).toEqual([252])
  })

  test('filtra por tipo usando el set de ids', () => {
    expect(ids({ typeIds: new Set([25, 252]) })).toEqual([25, 252])
  })

  test('combina todos los criterios', () => {
    expect(ids({ query: '2', gen: 2, typeIds: new Set([250]) })).toEqual([250])
  })
})
