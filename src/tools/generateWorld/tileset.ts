import type { CanvasRenderingContext2D } from 'canvas'
import type { TiledTileSet } from './tiledTypes'
import { getPixelsFromIndex } from '@/utilities/positionCalculations'
import { loadImageAssetFromPng, readJsonAssetFile } from './files'
import { tileSetPath, tileSetImagePath } from './assetsPaths'

let tileSet: TiledTileSet | null = null

let tileSet2D: CanvasRenderingContext2D | null = null

export const getTileSet = () => {
  if (!tileSet) {
    tileSet = readJsonAssetFile<TiledTileSet>(tileSetPath)
  }

  return tileSet
}

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
