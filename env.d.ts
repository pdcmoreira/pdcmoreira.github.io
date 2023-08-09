/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEBUG_ENABLED: boolean
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
