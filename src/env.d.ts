/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APP_ORIGIN?: string
  readonly PUBLIC_APP_VERSION?: string
  readonly PUBLIC_APP_COMMIT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
