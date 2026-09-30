export type TypeInfo = { label: string; color: string }

/** Paleta clásica por tipo + nombre en español. */
export const TYPES: Record<string, TypeInfo> = {
  normal: { label: 'Normal', color: '#A8A878' },
  fire: { label: 'Fuego', color: '#F08030' },
  water: { label: 'Agua', color: '#6890F0' },
  grass: { label: 'Planta', color: '#78C850' },
  electric: { label: 'Eléctrico', color: '#F8D030' },
  ice: { label: 'Hielo', color: '#98D8D8' },
  fighting: { label: 'Lucha', color: '#C03028' },
  poison: { label: 'Veneno', color: '#A040A0' },
  ground: { label: 'Tierra', color: '#E0C068' },
  flying: { label: 'Volador', color: '#A890F0' },
  psychic: { label: 'Psíquico', color: '#F85888' },
  bug: { label: 'Bicho', color: '#A8B820' },
  rock: { label: 'Roca', color: '#B8A038' },
  ghost: { label: 'Fantasma', color: '#705898' },
  dragon: { label: 'Dragón', color: '#7038F8' },
  dark: { label: 'Siniestro', color: '#705848' },
  steel: { label: 'Acero', color: '#B8B8D0' },
  fairy: { label: 'Hada', color: '#EE99AC' },
}

export const TYPE_NAMES = Object.keys(TYPES)

const FALLBACK: TypeInfo = { label: '???', color: '#68A090' }

export const typeInfo = (type: string): TypeInfo => TYPES[type] ?? FALLBACK
