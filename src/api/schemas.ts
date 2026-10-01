import { z } from 'zod'

const namedResource = z.object({ name: z.string(), url: z.string() })

export const listResponseSchema = z.object({
  results: z.array(namedResource),
})

export const pokemonResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  types: z.array(z.object({ slot: z.number(), type: namedResource })),
  stats: z.array(z.object({ base_stat: z.number(), stat: namedResource })),
  abilities: z.array(z.object({ is_hidden: z.boolean(), ability: namedResource })),
  sprites: z.object({
    other: z.object({
      'official-artwork': z.object({
        front_default: z.string().nullable(),
        front_shiny: z.string().nullable(),
      }),
    }),
  }),
  cries: z.object({ latest: z.string().nullable() }).optional(),
})

const localized = <T extends z.ZodRawShape>(shape: T) =>
  z.object({ ...shape, language: namedResource })

export const speciesResponseSchema = z.object({
  id: z.number(),
  names: z.array(localized({ name: z.string() })),
  genera: z.array(localized({ genus: z.string() })),
  flavor_text_entries: z.array(localized({ flavor_text: z.string() })),
  generation: namedResource,
  evolution_chain: z.object({ url: z.string() }).nullable(),
})

const evolutionDetailSchema = z.object({
  trigger: namedResource.nullish(),
  min_level: z.number().nullish(),
  item: namedResource.nullish(),
  held_item: namedResource.nullish(),
  min_happiness: z.number().nullish(),
  time_of_day: z.string().nullish(),
})

export type EvolutionDetailResponse = z.infer<typeof evolutionDetailSchema>

export type ChainLinkResponse = {
  species: z.infer<typeof namedResource>
  evolution_details?: EvolutionDetailResponse[]
  evolves_to: ChainLinkResponse[]
}

const chainLinkSchema: z.ZodType<ChainLinkResponse> = z.lazy(() =>
  z.object({
    species: namedResource,
    evolution_details: z.array(evolutionDetailSchema).optional(),
    evolves_to: z.array(chainLinkSchema),
  }),
)

export const evolutionResponseSchema = z.object({ chain: chainLinkSchema })

/** Recursos con nombres localizados (habilidades, objetos…). */
export const namesResponseSchema = z.object({
  names: z.array(localized({ name: z.string() })),
})

export const typeResponseSchema = z.object({
  pokemon: z.array(z.object({ pokemon: namedResource })),
})
