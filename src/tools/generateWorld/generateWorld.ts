import type { World } from '@/types'
import { writeJsonAssetFile } from './files'
import { generatedWorldPath } from './assetsPaths'

export const generateWorld = async (
  world: World,
  backgroundTileUrl: string,
  layersUrls: string[]
) => {
  const worldData: World = {
    ...world,
    backgroundTileUrl,
    layersUrls
  }

  writeJsonAssetFile(generatedWorldPath, worldData)
}
