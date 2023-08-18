// TODO: load dynamically
import world from '@/assets/game/world.json'

export { world }
export { default as exteriors } from '@/assets/game/exteriors.json'
export { default as tilesetUrl } from '@/assets/game/exteriors_tileset.png'

export const findLayer = (name: string) => world.layers.find((layer) => layer.name === name)
