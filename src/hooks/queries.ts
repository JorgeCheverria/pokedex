import { useQuery } from '@tanstack/react-query'
import {
  fetchAbilityName,
  fetchItemName,
  fetchEvolutionChain,
  fetchPokemon,
  fetchPokemonIdsByType,
  fetchPokemonList,
  fetchSpecies,
} from '../api/pokeapi'

/** Los datos de la Pokédex son estáticos: se cachean para siempre en la sesión. */
const STATIC = { staleTime: Infinity, gcTime: Infinity } as const

export const queryKeys = {
  list: ['pokemon-list'] as const,
  byType: (type: string) => ['pokemon-by-type', type] as const,
  pokemon: (id: number | string) => ['pokemon', String(id)] as const,
  species: (id: number) => ['species', id] as const,
  evolution: (chainId: number) => ['evolution', chainId] as const,
  ability: (slug: string) => ['ability', slug] as const,
  item: (slug: string) => ['item', slug] as const,
}

/** Lista ligera (id + nombre) de los 1025 Pokémon: un solo request. */
export function usePokemonList() {
  return useQuery({ queryKey: queryKeys.list, queryFn: fetchPokemonList, ...STATIC })
}

/** Ids de Pokémon de un tipo; deshabilitado si no hay tipo. */
export function usePokemonIdsByType(type: string | null) {
  return useQuery({
    queryKey: queryKeys.byType(type ?? ''),
    queryFn: () => fetchPokemonIdsByType(type!),
    enabled: !!type,
    ...STATIC,
  })
}

export function usePokemon(idOrName: number | string | undefined) {
  return useQuery({
    queryKey: queryKeys.pokemon(idOrName ?? ''),
    queryFn: () => fetchPokemon(idOrName!),
    enabled: idOrName !== undefined && idOrName !== '',
    ...STATIC,
  })
}

export function useSpecies(id: number | undefined) {
  return useQuery({
    queryKey: queryKeys.species(id ?? 0),
    queryFn: () => fetchSpecies(id!),
    enabled: !!id,
    ...STATIC,
  })
}

export function useAbilityName(slug: string) {
  return useQuery({
    queryKey: queryKeys.ability(slug),
    queryFn: () => fetchAbilityName(slug),
    ...STATIC,
  })
}

export function useItemName(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.item(slug ?? ''),
    queryFn: () => fetchItemName(slug!),
    enabled: !!slug,
    ...STATIC,
  })
}

export function useEvolutionChain(chainId: number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.evolution(chainId ?? 0),
    queryFn: () => fetchEvolutionChain(chainId!),
    enabled: !!chainId,
    ...STATIC,
  })
}
