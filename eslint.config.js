// https://github.com/antfu/eslint-config/tree/feat/support-eslint-9?tab=readme-ov-file
// ESLint 只检测到 eslint.config.js 作为平面配置项，
// 这意味着你需要在 package.json 中加入 type: module，或者在 eslint.config.js 中使用 CJS。
// 如果你想要明确的扩展名，如 .mjs 或 .cjs，甚至 eslint.config.ts，你可以安装 eslint-ts-patch 来解决这个问题。

// eslint.config.js
import { createRequire } from 'node:module'
import vue from 'eslint-plugin-vue'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'

/**
 * Creates a `require` function using the `createRequire` method from the `module` package.
 * This allows importing CommonJS modules in an ECMAScript module context.
 *
 * @constant
 * @type {Node.require}
 */
const require = createRequire(import.meta.url)
const vueParser = require('vue-eslint-parser')

const COMMON_RULES = {
  'no-console': 'warn',
  'no-debugger': 'warn',
  'prettier/prettier': 'error'
}

export default [
  // TypeScript 文件支持
  {
    // 该属性指定了 ESLint 应用此配置的文件范围。
    // **/*.ts 和 **/*.tsx 表示所有目录及其子目录中的 .ts 和 .tsx 文件。
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser, //  使用 @typescript-eslint/parser 作为解析器，专门解析 TypeScript 代码。
      parserOptions: {
        ecmaVersion: 'latest', // 支持最新的 ECMAScript 语法。
        sourceType: 'module' // 允许使用 ES 模块语法（import/export）。
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // 使用 @typescript-eslint 插件来提供 TypeScript 特有的 linting 规则。
      prettier // 使用 prettier 插件来格式化代码。
    },
    rules: {
      ...tsPlugin.configs?.recommended?.rules, // 引入 TypeScript 插件的推荐规则。
      ...COMMON_RULES // 通过扩展通用规则（如禁止 console 和 debugger，以及强制 Prettier 格式化），实现项目的统一代码风格。
    }
  },

  // Vue 文件支持
  {
    files: ['**/*.vue'], // 匹配所有 Vue 文件
    languageOptions: {
      parser: vueParser, // 使用 vue-eslint-parser 解析器来解析 Vue 文件。
      parserOptions: {
        parser: tsParser, // 使用 @typescript-eslint/parser 解析器来解析 Vue 文件中的 TypeScript 代码。
        ecmaVersion: 'latest', // 支持最新的 ECMAScript 语法。
        sourceType: 'module', // 允许使用 ES 模块语法（import/export）。
        extraFileExtensions: ['.vue'] // 允许解析 .vue 文件。
      }
    },
    plugins: {
      vue,
      prettier
    },
    rules: {
      ...vue.configs?.['vue3-recommended']?.rules,
      ...COMMON_RULES
    }
  },

  // JS 通用支持（可选）
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      prettier
    },
    rules: {
      ...COMMON_RULES
    }
  }
]
