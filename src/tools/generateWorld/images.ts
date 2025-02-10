import { createCanvas, ImageData, type CanvasRenderingContext2D } from 'canvas'

export const createImage2D = (width: number, height: number) => {
  const canvas = createCanvas(width, height)

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error("Couldn't get canvas 2D context")
  }

  return context
}

export const copyPixels = (
  targetImage: CanvasRenderingContext2D,
  x: number,
  y: number,
  imageData: ImageData
) => {
  targetImage.putImageData(imageData, x, y)
}
