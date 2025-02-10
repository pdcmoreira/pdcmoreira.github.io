import { resolve } from 'node:path'
import { loadConfig } from 'tsconfig-paths'

const pathsConfig = loadConfig()

if (!('absoluteBaseUrl' in pathsConfig)) {
  throw new Error('Error loading paths config.')
}

const { absoluteBaseUrl } = pathsConfig

export const resolveAbsolutePath = (...paths: string[]) => resolve(absoluteBaseUrl, ...paths)

export const resolvePath = (...paths: string[]) => resolve(...paths)
