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

export type ChainLinkResponse = {
  species: z.infer<typeof namedResource>
  evolves_to: ChainLinkResponse[]
}

const chainLinkSchema: z.ZodType<ChainLinkResponse> = z.lazy(() =>
  z.object({ species: namedResource, evolves_to: z.array(chainLinkSchema) }),
)

export const evolutionResponseSchema = z.object({ chain: chainLinkSchema })

export const typeResponseSchema = z.object({
  pokemon: z.array(z.object({ pokemon: namedResource })),
})
