export const createImage2D = (width: number, height: number, willReadFrequently = false) => {
  const canvas = document.createElement('canvas')

  canvas.width = width

  canvas.height = height

  const context = canvas.getContext('2d', { willReadFrequently })

  if (!context) {
    throw new Error("Couldn't get canvas 2D context")
  }

  return context
}

export const copyPixels = (
  targetCanvas: CanvasRenderingContext2D,
  x: number,
  y: number,
  imageData: ImageData
) => {
  targetCanvas.putImageData(imageData, x, y)
}
