export type Generation = { id: number; label: string; region: string; from: number; to: number }

export const GENERATIONS: Generation[] = [
  { id: 1, label: 'I', region: 'Kanto', from: 1, to: 151 },
  { id: 2, label: 'II', region: 'Johto', from: 152, to: 251 },
  { id: 3, label: 'III', region: 'Hoenn', from: 252, to: 386 },
  { id: 4, label: 'IV', region: 'Sinnoh', from: 387, to: 493 },
  { id: 5, label: 'V', region: 'Teselia', from: 494, to: 649 },
  { id: 6, label: 'VI', region: 'Kalos', from: 650, to: 721 },
  { id: 7, label: 'VII', region: 'Alola', from: 722, to: 809 },
  { id: 8, label: 'VIII', region: 'Galar', from: 810, to: 905 },
  { id: 9, label: 'IX', region: 'Paldea', from: 906, to: 1025 },
]

const ROMAN: Record<string, number> = Object.fromEntries(
  GENERATIONS.map((g) => [g.label.toLowerCase(), g.id]),
)

/** "generation-iv" → 4 */
export function generationFromName(name: string): number {
  return ROMAN[name.replace('generation-', '')] ?? 0
}

export function isInGeneration(pokemonId: number, genId: number): boolean {
  const gen = GENERATIONS.find((g) => g.id === genId)
  return gen ? pokemonId >= gen.from && pokemonId <= gen.to : false
}
