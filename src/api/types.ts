export type PokemonSummary = { id: number; name: string }

export type Stat = { name: string; value: number }

export type Pokemon = {
  id: number
  name: string
  types: string[]
  heightM: number
  weightKg: number
  stats: Stat[]
  abilities: { name: string; hidden: boolean }[]
  artwork: string
  artworkShiny: string | null
  cry: string | null
}

export type Species = {
  id: number
  localName: string
  genus: string
  description: string
  generation: number
  evolutionChainId: number | null
}

/** Cómo se llega a una etapa evolutiva (null en la etapa base). */
export type EvolutionCondition =
  | { kind: 'level'; level: number }
  | { kind: 'item'; item: string }
  | { kind: 'trade'; item?: string }
  | { kind: 'friendship'; time?: 'day' | 'night' }
  | { kind: 'other' }

export type EvolutionNode = {
  id: number
  name: string
  condition: EvolutionCondition | null
  evolvesTo: EvolutionNode[]
}
