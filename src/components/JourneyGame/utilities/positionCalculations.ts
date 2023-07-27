export const getPositionFromIndex = (index: number, columns: number): [number, number] => [
  (index % columns) - 1,
  Math.floor(index / columns)
]

export const getPositionFromPixels = (
  x: number,
  y: number,
  tileWidth: number,
  tileHeight: number
): [number, number] => [Math.floor(x / tileWidth), Math.floor(y / tileHeight)]

export const getIndexFromPosition = (x: number, y: number, columns: number) => y * columns + x + 1

export const getIndexFromPixels = (
  x: number,
  y: number,
  tileWidth: number,
  tileHeight: number,
  columns: number
) => getIndexFromPosition(...getPositionFromPixels(x, y, tileWidth, tileHeight), columns)

export const getPixelsFromPosition = (
  x: number,
  y: number,
  tileWidth: number,
  tileHeight: number
): [number, number] => [x * tileWidth, y * tileHeight]

export const getPixelsFromIndex = (
  index: number,
  columns: number,
  tileWidth: number,
  tileHeight: number
): [number, number] =>
  getPixelsFromPosition(...getPositionFromIndex(index, columns), tileWidth, tileHeight)

export const getCollidingPositionFromPixels = (
  pointX: number,
  pointY: number,
  tileWidth: number,
  tileHeight: number
): [number, number] => [Math.floor(pointX / tileWidth), Math.floor(pointY / tileHeight)]

export const getCollidingIndex = (
  pointX: number,
  pointY: number,
  tileWidth: number,
  tileHeight: number,
  columns: number
) =>
  getIndexFromPosition(
    ...getCollidingPositionFromPixels(pointX, pointY, tileWidth, tileHeight),
    columns
  )
