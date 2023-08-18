import tileSet from '@/assets/game/exteriors.json'
import tileSetImageUrl from '@/assets/game/exteriors_tileset.png'
import world from '@/assets/game/world.json'

export { tileSet, tileSetImageUrl, world }

export const tileSetColumns = tileSet.columns

export const worldColumns = world.width

export const worldWidthPx = world.width * world.tilewidth

export const worldHeightPx = world.height * world.tileheight

export const findLayer = (name: string) => world.layers.find((layer) => layer.name === name)
