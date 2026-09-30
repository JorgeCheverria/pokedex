import { describe, expect, test } from 'vitest'
import { formatId, formatName, statLabel } from './format'
import { GENERATIONS, generationFromName, isInGeneration } from './generations'
import { TYPE_NAMES, typeInfo } from './typeColors'

describe('format', () => {
  test('formatId rellena a 3 dígitos', () => {
    expect(formatId(1)).toBe('#001')
    expect(formatId(1025)).toBe('#1025')
  })

  test('formatName capitaliza y separa guiones', () => {
    expect(formatName('mr-mime')).toBe('Mr Mime')
  })

  test('statLabel traduce y deja pasar desconocidos', () => {
    expect(statLabel('special-attack')).toBe('At. Esp.')
    expect(statLabel('foo')).toBe('foo')
  })
})

describe('generations', () => {
  test('las 9 generaciones cubren 1..1025 sin huecos', () => {
    expect(GENERATIONS[0].from).toBe(1)
    expect(GENERATIONS.at(-1)!.to).toBe(1025)
    GENERATIONS.slice(1).forEach((g, i) => expect(g.from).toBe(GENERATIONS[i].to + 1))
  })

  test('generationFromName convierte romanos', () => {
    expect(generationFromName('generation-iv')).toBe(4)
    expect(generationFromName('generation-ix')).toBe(9)
    expect(generationFromName('otra')).toBe(0)
  })

  test('isInGeneration respeta los límites', () => {
    expect(isInGeneration(151, 1)).toBe(true)
    expect(isInGeneration(152, 1)).toBe(false)
    expect(isInGeneration(1, 99)).toBe(false)
  })
})

describe('typeColors', () => {
  test('hay 18 tipos con color hex y label', () => {
    expect(TYPE_NAMES).toHaveLength(18)
    TYPE_NAMES.forEach((t) => expect(typeInfo(t).color).toMatch(/^#[0-9A-F]{6}$/i))
  })

  test('tipo desconocido usa fallback', () => {
    expect(typeInfo('stellar').label).toBe('???')
  })
})
