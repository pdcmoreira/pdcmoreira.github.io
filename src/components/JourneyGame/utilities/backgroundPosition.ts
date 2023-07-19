import { getPixelCoordinatesByIndex } from './coordinates'

export const getPixelBackgroundPositionByIndex = (
  index: number,
  cols: number,
  tileWidth: number,
  tileHeight: number
) => {
  const [x, y] = getPixelCoordinatesByIndex(index, cols, tileWidth, tileHeight)

  return `${-x}px ${-y}px`
}

export const getTileBackgroundPositionByIndex = (
  tileCount: number,
  cols: number,
  tileWidth: number,
  tileHeight: number
) => {
  const result: { [key: number]: string } = {}

  for (let i = 0; i < tileCount; i++) {
    result[i] = getPixelBackgroundPositionByIndex(i, cols, tileWidth, tileHeight)
  }

  return result
}
