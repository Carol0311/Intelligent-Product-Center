interface ImportMetaEnv {
  VITE_LOWCODE_API_KEY: string
  VITE_BASE_URL: string
  DEV: boolean
  PROD: boolean
  VITE_USER_NODE_ENV: string
  VITE_PRODUCT_CENTER: string
  LOWCODE: boolean
  PRODUCT: boolean
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
