// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    overrides: [
      {
        file: ['~/components/**/*vue', '~/layouts/**/*.vue', '~/pages/**/*.vue'],
        rules: {
          'vue/multi-word-component-names': 'off',
        },
      },
    ],
  }
)
