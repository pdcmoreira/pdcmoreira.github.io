import type { TiledLayer } from './tiledTypes'

export const isImageLayer = (layer: TiledLayer) =>
  !!(layer.type === 'tilelayer' && layer.data && layer.class !== 'utility')
