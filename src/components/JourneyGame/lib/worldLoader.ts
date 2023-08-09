// TODO: load dynamically
import world from '../assets/world.json'

export { world }
export { default as exteriors } from '../assets/exteriors.json'
export { default as tilesetUrl } from '../assets/exteriors_tileset.png'

export const findLayer = (name: string) => world.layers.find((layer) => layer.name === name)
