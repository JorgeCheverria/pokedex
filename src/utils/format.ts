/** 25 → "#025" */
export const formatId = (id: number): string => `#${String(id).padStart(3, '0')}`

/** "mr-mime" → "Mr Mime" */
export const formatName = (name: string): string =>
  name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

export const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
}

export const statLabel = (name: string): string => STAT_LABELS[name] ?? name
