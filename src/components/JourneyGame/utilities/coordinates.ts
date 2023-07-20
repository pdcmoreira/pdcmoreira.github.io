export const getMatrixCoordinates = (index: number, columns: number): [number, number] => [
  Math.floor(index / columns),
  (index % columns) - 1
]

export const getPixelCoordinates = (
  row: number,
  col: number,
  tileWidth: number,
  tileHeight: number
): [number, number] => [col * tileWidth, row * tileHeight]

export const getPixelCoordinatesByIndex = (
  index: number,
  columns: number,
  tileWidth: number,
  tileHeight: number
) => getPixelCoordinates(...getMatrixCoordinates(index, columns), tileWidth, tileHeight)
