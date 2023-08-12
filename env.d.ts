/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEBUG_ENABLED: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
