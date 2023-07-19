export const getMatrixCoordinates = (index: number, cols: number): [number, number] => [
  Math.floor(index / cols),
  (index % cols) - 1
]

export const getPixelCoordinates = (
  row: number,
  col: number,
  tileWidth: number,
  tileHeight: number
): [number, number] => [col * tileWidth, row * tileHeight]

export const getPixelCoordinatesByIndex = (
  index: number,
  cols: number,
  tileWidth: number,
  tileHeight: number
) => getPixelCoordinates(...getMatrixCoordinates(index, cols), tileWidth, tileHeight)
