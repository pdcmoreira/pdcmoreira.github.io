import { dirname } from 'node:path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { loadImage, type CanvasRenderingContext2D } from 'canvas'
import { createImage2D } from './images'
import { resolveAbsolutePath } from './resolvePath'
import { assetsPath, publicPath } from './settings'

const defaultEncoding: BufferEncoding = 'utf8'

export const loadImageAssetFromPng = async (filePath: string) => {
  filePath = resolveAbsolutePath(assetsPath, filePath)

  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const img = await loadImage(filePath)

  const context = createImage2D(img.width, img.height)

  context.drawImage(img, 0, 0)

  return context
}

export const writeAssetPng = (filePath: string, image: CanvasRenderingContext2D) =>
  writePng(resolveAbsolutePath(assetsPath, filePath), image)

export const writePublicPng = (filePath: string, image: CanvasRenderingContext2D) =>
  writePng(resolveAbsolutePath(publicPath, filePath), image)

export const readAssetFile = (filePath: string, fileEncoding: BufferEncoding = defaultEncoding) =>
  readFileSync(resolveAbsolutePath(assetsPath, filePath), fileEncoding)

export const readJsonAssetFile = <T>(filePath: string) => JSON.parse(readAssetFile(filePath)) as T

export const writeAssetFile = (filePath: string, data: string) => {
  filePath = resolveAbsolutePath(assetsPath, filePath)

  ensureDir(filePath)

  writeFileSync(filePath, data)
}

export const writeJsonAssetFile = (filePath: string, data: unknown) =>
  writeAssetFile(filePath, JSON.stringify(data, null, 2))

const ensureDir = (absoluteFilePath: string) =>
  mkdirSync(dirname(absoluteFilePath), { recursive: true })

const writePng = (absoluteFilePath: string, image: CanvasRenderingContext2D) => {
  ensureDir(absoluteFilePath)

  writeFileSync(absoluteFilePath, image.canvas.toBuffer('image/png'))
}
