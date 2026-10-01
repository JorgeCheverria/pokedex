import type { z } from 'zod'
import {
  evolutionResponseSchema,
  listResponseSchema,
  namesResponseSchema,
  pokemonResponseSchema,
  speciesResponseSchema,
  typeResponseSchema,
  type ChainLinkResponse,
  type EvolutionDetailResponse,
} from './schemas'
import type { EvolutionCondition, EvolutionNode, Pokemon, PokemonSummary, Species } from './types'
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

async function fetchLocalizedName(resource: 'ability' | 'item', slug: string): Promise<string> {
  const d = await fetchJson(`/${resource}/${slug}`, namesResponseSchema)
  return pickLocalized(d.names)?.name ?? slug
}

/** Nombre localizado de una habilidad ("lightning-rod" → "Pararrayos"). */
export const fetchAbilityName = (slug: string) => fetchLocalizedName('ability', slug)

/** Nombre localizado de un objeto ("water-stone" → "Piedra Agua"). */
export const fetchItemName = (slug: string) => fetchLocalizedName('item', slug)

/**
 * Traduce los `evolution_details` a una condición simple. Si hay varios
 * métodos (p. ej. Leafeon: lugar especial en juegos viejos, piedra en los
 * nuevos) se prefiere el que usa un objeto, que es el vigente.
 */
export function toCondition(details: EvolutionDetailResponse[] = []): EvolutionCondition | null {
  if (details.length === 0) return null
  const d = details.find((x) => x.item) ?? details[0]
  const trigger = d.trigger?.name
  if (trigger === 'trade') return { kind: 'trade', item: d.held_item?.name }
  if (d.item) return { kind: 'item', item: d.item.name }
  if (d.min_level) return { kind: 'level', level: d.min_level }
  if (d.min_happiness) {
    const time = d.time_of_day === 'day' || d.time_of_day === 'night' ? d.time_of_day : undefined
    return { kind: 'friendship', time }
  }
  return { kind: 'other' }
}

function toEvolutionNode(link: ChainLinkResponse): EvolutionNode {
  return {
    id: idFromUrl(link.species.url),
    name: link.species.name,
    condition: toCondition(link.evolution_details),
    evolvesTo: link.evolves_to.map(toEvolutionNode),
  }
}

export async function fetchEvolutionChain(chainId: number): Promise<EvolutionNode> {
  const d = await fetchJson(`/evolution-chain/${chainId}`, evolutionResponseSchema)
  return toEvolutionNode(d.chain)
}
