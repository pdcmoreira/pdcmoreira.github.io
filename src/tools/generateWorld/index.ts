import { generateBackgroundTile } from './generateBackgroundTile'
import { generateLayerImages } from './generateLayerImages'
import { generateWorld } from './generateWorld'
import { processWorld } from './processWorld'

// Generate the world's data and images based on the Tiled map
;(async () => {
  const { world, imageLayers } = processWorld()

  const backgroundTileUrl = await generateBackgroundTile(world)

  const layersUrls = await generateLayerImages(world, imageLayers)

  await generateWorld(world, backgroundTileUrl, layersUrls)
})()
