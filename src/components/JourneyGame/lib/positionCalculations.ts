export const getPositionFromIndex = (index: number, columns: number): [x: number, y: number] => [
  (index - 1) % columns,
  Math.floor((index - 1) / columns)
]

export const getPositionFromPixels = (
  x: number,
  y: number,
  tileWidth: number,
  tileHeight: number
): [x: number, y: number] => [Math.floor(x / tileWidth), Math.floor(y / tileHeight)]

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
): [x: number, y: number] => [x * tileWidth, y * tileHeight]

export const getPixelsFromIndex = (
  index: number,
  columns: number,
  tileWidth: number,
  tileHeight: number
): [x: number, y: number] =>
  getPixelsFromPosition(...getPositionFromIndex(index, columns), tileWidth, tileHeight)
