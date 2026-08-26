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
  base = '/product-center/' // 生产环境部署到子目录
} else if (process.env.NUXT_PUBLIC_BASE_URL) {
  base = process.env.NUXT_PUBLIC_BASE_URL // 使用环境变量
}

export default defineNuxtConfig({
  ssr: true, // 开启 SSR
  experimental: {
    payloadExtraction: true,
  },
  app: {
    baseURL: base,
  },
  runtimeConfig: {
    public: {
      productApiKey: process.env.NUXT_PUBLIC_PRODUCT_API_KEY,
      userNodeEnv: process.env.NUXT_PUBLIC_USER_NODE_ENV,
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
    optimizeDeps: {
      include: ['@vuepic/vue-datepicker', 'date-fns'],
    },
  },
  hooks: {
    'vite:extendConfig'(config, { isClient }) {
      if (isClient) {
        const rollupOptions = config.build?.rollupOptions
        if (!rollupOptions) return

        let output = rollupOptions.output
        if (Array.isArray(output)) {
          // 如果是数组，找到第一个有效的 output 配置
          output = output.find((o) => o && typeof o === 'object') || {}
        }
        if (!output || typeof output !== 'object') {
          output = {}
        }

        output.manualChunks = (id: string) => {
          //拆分shared包，避免shared包过大导致首屏加载慢
          if (id.includes('/shared/src') || id.includes('src/stores')) {
            if (id.includes('shared/src/schema')) {
              return 'shared-schema'
            }
            if (id.includes('shared/src/utils')) {
              return 'shared-utils'
            }
            return 'shared-core'
          }
          if (id.includes('/node_modules/')) {
            if (id.includes('lodash-es') || id.includes('@vuepic/vue-datepicker') || id.includes('date-fns')) {
              return 'vendor-utils'
            }
            if (id.includes('/node_modules/vue/') || id.includes('/node_modules/vue-router') || id.includes('/node_modules/pinia')) {
              return 'vendor-vue'
            }
            return 'vendor'
          }
        }
      }
    },
  },
})
