interface ImportMetaEnv {
  VITE_LOWCODE_API_KEY: string
  VITE_BASE_URL: string
  DEV: boolean
  PROD: boolean
  NUXT_PUBLIC_PRODUCT_API_KEY: string
  NUXT_PUBLIC_BASE_URL: string
  NUXT_PUBLIC_USER_NODE_ENV: string
}

interface ImportMeta {
  env: ImportMetaEnv
}
declare module '*.css' {
  const content: string
  export default content
}

declare module '*.scss' {
  const content: string
  export default content
}

declare module '*.sass' {
  const content: string
  export default content
}
