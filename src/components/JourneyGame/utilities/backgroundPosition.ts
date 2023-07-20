import { getPixelsFromIndex } from './positionCalculations'

export const getBackgroundPositionFromIndex = (
  index: number,
  columns: number,
  tileWidth: number,
  tileHeight: number
) => {
  const [x, y] = getPixelsFromIndex(index, columns, tileWidth, tileHeight)

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
    result[i] = getBackgroundPositionFromIndex(i, columns, tileWidth, tileHeight)
  }

  return result
}
