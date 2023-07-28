import { getPixelsFromIndex } from './positionCalculations'
import { exteriors } from './worldLoader'

export const getBackgroundPositionFromIndex = (
  index: number,
  columns: number,
  tileWidth: number,
  tileHeight: number
) => {
  const [x, y] = getPixelsFromIndex(index, columns, tileWidth, tileHeight)

  return `${-x}px ${-y}px`
}

export const getPropertiesById = () =>
  exteriors.tiles.reduce((map, tile) => {
    map[tile.id] = tile.properties.reduce(
      (propertiesMap, property: { name: string; value: unknown }) => {
        propertiesMap[property.name] = property.value

        return propertiesMap
      },
      {} as { [key: string]: unknown }
    )

    return map
  }, {} as { [key: number]: { [key: string]: unknown } })

export const getTileInfoByIndex = (
  tileCount: number,
  columns: number,
  tileWidth: number,
  tileHeight: number
) => {
  const result: {
    [key: number]: {
      backgroundPosition: string
      properties: { [key: string]: unknown }
    }
  } = {}

  const propertiesById = getPropertiesById()

  for (let i = 0; i < tileCount; i++) {
    result[i] = {
      backgroundPosition: getBackgroundPositionFromIndex(i, columns, tileWidth, tileHeight),
      properties: propertiesById[i]
    }
  }

  return result
}
