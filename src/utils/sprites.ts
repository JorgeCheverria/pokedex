const SPRITES_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

/** Artwork oficial derivado del id, sin necesidad de pedir el detalle. */
export const artworkUrl = (id: number): string =>
  `${SPRITES_BASE}/other/official-artwork/${id}.png`
