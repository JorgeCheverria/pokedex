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

export type EvolutionNode = {
  id: number
  name: string
  evolvesTo: EvolutionNode[]
}
