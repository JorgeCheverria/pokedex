import type { z } from 'zod'
import {
  abilityResponseSchema,
  evolutionResponseSchema,
  listResponseSchema,
  pokemonResponseSchema,
  speciesResponseSchema,
  typeResponseSchema,
  type ChainLinkResponse,
} from './schemas'
import type { EvolutionNode, Pokemon, PokemonSummary, Species } from './types'
import { artworkUrl } from '../utils/sprites'
import { generationFromName } from '../utils/generations'

export const API_BASE = 'https://pokeapi.co/api/v2'
export const MAX_POKEMON_ID = 1025
const PREFERRED_LANGS = ['es', 'en'] as const

async function fetchJson<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`PokéAPI ${res.status} en ${path}`)
  return schema.parse(await res.json())
}

/** Extrae el id numérico del final de una URL de PokéAPI. */
export function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/)
  if (!match) throw new Error(`URL sin id: ${url}`)
  return Number(match[1])
}

function toSummaries(items: { name: string; url: string }[]): PokemonSummary[] {
  return items
    .map((item) => ({ id: idFromUrl(item.url), name: item.name }))
    .filter((p) => p.id <= MAX_POKEMON_ID)
}

export async function fetchPokemonList(): Promise<PokemonSummary[]> {
  const data = await fetchJson(`/pokemon?limit=${MAX_POKEMON_ID}`, listResponseSchema)
  return toSummaries(data.results)
}

export async function fetchPokemonIdsByType(type: string): Promise<number[]> {
  const data = await fetchJson(`/type/${type}`, typeResponseSchema)
  return toSummaries(data.pokemon.map((p) => p.pokemon)).map((p) => p.id)
}

export async function fetchPokemon(idOrName: number | string): Promise<Pokemon> {
  const d = await fetchJson(`/pokemon/${idOrName}`, pokemonResponseSchema)
  const art = d.sprites.other['official-artwork']
  return {
    id: d.id,
    name: d.name,
    types: [...d.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    heightM: d.height / 10,
    weightKg: d.weight / 10,
    stats: d.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    abilities: d.abilities.map((a) => ({ name: a.ability.name, hidden: a.is_hidden })),
    artwork: art.front_default ?? artworkUrl(d.id),
    artworkShiny: art.front_shiny,
    cry: d.cries?.latest ?? null,
  }
}

/** Devuelve la entrada más reciente en español, o en inglés si no hay. */
export function pickLocalized<T extends { language: { name: string } }>(
  entries: T[],
): T | undefined {
  for (const lang of PREFERRED_LANGS) {
    const found = entries.findLast((e) => e.language.name === lang)
    if (found) return found
  }
  return undefined
}

/** Limpia saltos de línea y form-feeds que trae el flavor text. */
export function cleanFlavorText(text: string): string {
  return text.replace(/[\f\n\r­]+/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function fetchSpecies(id: number): Promise<Species> {
  const d = await fetchJson(`/pokemon-species/${id}`, speciesResponseSchema)
  return {
    id: d.id,
    localName: pickLocalized(d.names)?.name ?? '',
    genus: pickLocalized(d.genera)?.genus ?? '',
    description: cleanFlavorText(pickLocalized(d.flavor_text_entries)?.flavor_text ?? ''),
    generation: generationFromName(d.generation.name),
    evolutionChainId: d.evolution_chain ? idFromUrl(d.evolution_chain.url) : null,
  }
}

/** Nombre localizado de una habilidad ("lightning-rod" → "Pararrayos"). */
export async function fetchAbilityName(slug: string): Promise<string> {
  const d = await fetchJson(`/ability/${slug}`, abilityResponseSchema)
  return pickLocalized(d.names)?.name ?? slug
}

function toEvolutionNode(link: ChainLinkResponse): EvolutionNode {
  return {
    id: idFromUrl(link.species.url),
    name: link.species.name,
    evolvesTo: link.evolves_to.map(toEvolutionNode),
  }
}

export async function fetchEvolutionChain(chainId: number): Promise<EvolutionNode> {
  const d = await fetchJson(`/evolution-chain/${chainId}`, evolutionResponseSchema)
  return toEvolutionNode(d.chain)
}
