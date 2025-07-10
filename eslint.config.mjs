import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  nuxt: true,
  parser: '@typescript-eslint/parser',
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
  ignores: [
    'eslint.config.mjs',
    '.vscode/**',
    '*.json',
    'node_modules/**',
    '.nuxt/**',
    'dist/**',
  ],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'import/newline-after-import': 'off',
    'import/order': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    '@typescript-eslint/no-invalid-this': 'off',
    'ts/no-invalid-this': 'off',
    'no-undef': 'off',
    'prettier/prettier': 'error',
    'quotes': ['warn', 'single', { avoidEscape: true }],
  },
})
