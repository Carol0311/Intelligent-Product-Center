import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import ConditionalCompile from 'vite-plugin-conditional-compile'

export const viteConfigObj = {
  plugins: [
    ConditionalCompile({
      env: {
        LOWCODE: true,
        PRODUCT: false,
      },
    }),
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'public-shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
    },
  },
}
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  // 动态决定 base
  const isProduction = process.env.NODE_ENV === 'production'
  const isPreview =
    process.env.NODE_ENV === 'preview' || process.env.VITE_USER_NODE_ENV === 'preview'

  let base = '/'
  if (isProduction && !isPreview) {
    base = './' // 生产环境部署到子目录
  } else if (env.VITE_BASE_URL) {
    base = env.VITE_BASE_URL // 使用环境变量
  }
  return {
    ...viteConfigObj,
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks(id) {
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
              if (
                id.includes('lodash-es') ||
                id.includes('@vuepic/vue-datepicker') ||
                id.includes('date-fns')
              ) {
                return 'vendor-utils'
              }
              if (
                id.includes('/node_modules/vue/') ||
                id.includes('/node_modules/vue-router') ||
                id.includes('/node_modules/pinia')
              ) {
                return 'vendor-vue'
              }
              return 'vendor'
            }
          },
        },
      },
    },
    server: {
      /**host: 'localhost',
      port: 5137,*/
      proxy: {
        '/api': {
          target: env.VITE_LOWCODE_API_KEY,
          changeOrigin: true,
        },
        '/product': {
          target: env.VITE_PRODUCT_API_KEY,
          changeOrigin: true,
        },
      },
      fs: {
        // 严格允许访问 shared 目录
        strict: false,
        allow: [fileURLToPath(new URL('../shared', import.meta.url))],
      },
    },
    optimizeDeps: {
      // 确保 shared 不在 exclude 中
      exclude: [],
      // 或者显式 include
      include: ['@vuepic/vue-datepicker', 'date-fns', '@shared'],
    },
  }
})
