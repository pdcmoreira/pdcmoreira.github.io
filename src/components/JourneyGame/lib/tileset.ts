import { createImage2D } from './canvas'
import { getPixelsFromIndex } from './positionCalculations'

export const loadTileSet2D = async (url: string) => {
  const img = new Image()

  img.src = url

  if (!img.complete) {
    await new Promise((resolve) => {
      img.onload = resolve
    })
  }

  const context = createImage2D(img.width, img.height)

  if (!context) {
    throw new Error("Couldn't get canvas 2D context")
  }

  context.drawImage(img, 0, 0)

  return context
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
