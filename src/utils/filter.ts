import type { PokemonSummary } from '../api/types'
import { isInGeneration } from './generations'

export type Filters = {
  query: string
  typeIds: ReadonlySet<number> | null
  gen: number | null
}

/** "Mr. Mimé" → "mr-mime" (mismo formato que los nombres de PokéAPI). */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[.'’]/g, '')
    .replace(/\s+/g, '-')
}

function matchesQuery(p: PokemonSummary, query: string): boolean {
  const digits = query.replace(/^#/, '')
  if (/^\d+$/.test(digits)) return String(p.id).startsWith(String(Number(digits)))
  return p.name.includes(normalize(query))
}

/** Aplica búsqueda, tipo y generación; los criterios vacíos no filtran. */
export function filterPokemon(list: PokemonSummary[], f: Filters): PokemonSummary[] {
  const query = f.query.trim()
  return list.filter(
    (p) =>
      (!query || matchesQuery(p, query)) &&
      (!f.typeIds || f.typeIds.has(p.id)) &&
      (!f.gen || isInGeneration(p.id, f.gen)),
  )
}
