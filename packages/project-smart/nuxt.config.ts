// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import ConditionalCompile from 'vite-plugin-conditional-compile'
import { fileURLToPath, URL } from 'node:url'
import { loadEnv } from 'vite'

loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'NUXT_')

console.log('api', process.env.NUXT_PUBLIC_PRODUCT_API_KEY)
// 动态决定 base
const isProduction = process.env.NODE_ENV === 'production'
const isPreview = process.env.NODE_ENV === 'preview' || process.env.NUXT_PUBLIC_USER_NODE_ENV === 'preview'

let base = '/'
if (isProduction && !isPreview) {
  base = './' // 生产环境部署到子目录
} else if (process.env.NUXT_PUBLIC_BASE_URL) {
  base = process.env.NUXT_PUBLIC_BASE_URL // 使用环境变量
}

export default defineNuxtConfig({
  ssr: true, // 开启 SSR
  experimental: {
    payloadExtraction: true,
  },
  runtimeConfig: {
    public: {
      productApiKey: process.env.NUXT_PUBLIC_PRODUCT_API_KEY,
      baseUrl: '/',
      userNodeEnv: 'development',
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3001,
  },
  sourcemap: true,
  /**components: [
    {
      path: "~/components",
      //仅基于组件的名称自动导入组件，不以目录结构导入
      pathPrefix: false,
    },
  ],*/
  typescript: {
    typeCheck: true,
  },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/ui.css'],
  /**避免运行时找不到shared组件内部引用的@shared路径*/
  alias: {
    '@shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
  },
  vite: {
    plugins: [
      ConditionalCompile({
        env: {
          LOWCODE: false,
          PRODUCT: true,
        },
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: process.env.NUXT_PUBLIC_PRODUCT_API_KEY,
          changeOrigin: true,
        },
      },
      fs: {
        // 严格允许访问 shared 目录
        strict: false,
        allow: [fileURLToPath(new URL('../shared', import.meta.url))],
      },
    },
    resolve: {
      alias: {
        'public-shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
        '@shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
      },
    },
    /**optimizeDeps: {
      include: ['@shared'],
    },*/
  },
})
