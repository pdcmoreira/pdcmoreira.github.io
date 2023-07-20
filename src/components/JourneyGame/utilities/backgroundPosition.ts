import { getPixelCoordinatesByIndex } from './coordinates'

export const getPixelBackgroundPositionByIndex = (
  index: number,
  columns: number,
  tileWidth: number,
  tileHeight: number
) => {
  const [x, y] = getPixelCoordinatesByIndex(index, columns, tileWidth, tileHeight)

  return `${-x}px ${-y}px`
}

export const getTileBackgroundPositionByIndex = (
  tileCount: number,
  columns: number,
  tileWidth: number,
  tileHeight: number
) => {
  const result: { [key: number]: string } = {}

  for (let i = 0; i < tileCount; i++) {
    result[i] = getPixelBackgroundPositionByIndex(i, columns, tileWidth, tileHeight)
  }

  return result
}
