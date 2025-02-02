import stylistic from '@stylistic/eslint-plugin'
import { createConfigForNuxt } from '@nuxt/eslint-config'

const generalConfig = {
  name: '@courses/eslint-rules',
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    'no-console': 'warn',
    'unicorn/prefer-number-properties': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@stylistic/indent': ['error', 2],
    '@stylistic/brace-style': ['error', '1tbs'],
  },
}

const stylisticCustomConfig = {
  indent: 2,
  semi: false,
  quotes: 'single',
}

const stylisticResultConfig = stylistic.configs.customize(stylisticCustomConfig)

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: stylisticCustomConfig,
  },
}).append(stylisticResultConfig, generalConfig)
