import type { CanvasRenderingContext2D } from 'canvas'
import type { TiledTileSet } from './tiledTypes'
import { getPixelsFromIndex } from '@/utilities/positionCalculations'
import { loadImageAssetFromPng } from './files'
import tileSetJson from '@/assets/game/world/exteriors.json'
import { tileSetImagePath } from './assetsPaths'

let tileSet2D: CanvasRenderingContext2D | null = null

export const tileSet = tileSetJson as TiledTileSet

export const getTileSet2D = async () => {
  if (!tileSet2D) {
    tileSet2D = await loadImageAssetFromPng(tileSetImagePath)
  }

  return tileSet2D
}

export const getTileImageData = (
  tileSet2D: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => tileSet2D.getImageData(x, y, width, height)

export const getTileImageDataFromIndex = (
  tileSet2D: CanvasRenderingContext2D,
  index: number,
  columns: number,
  width: number,
  height: number
) => tileSet2D.getImageData(...getPixelsFromIndex(index, columns, width, height), width, height)
