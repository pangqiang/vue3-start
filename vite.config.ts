import { defineConfig, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'url'

// 使用 defineConfig 提供类型推导
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'] // 自动导入 Vue 和 Vue Router 的 API
    }),
    Components({
      dirs: ['components'] // 定义插件自动导入组件的文件夹，默认是 components
    })
  ],
  server: {
    port: 3000 // 指定开发服务器的端口号
  },
  build: {
    outDir: 'dist' // 指定构建输出目录
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // 设置路径别名
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      composables: fileURLToPath(new URL('./src/composables', import.meta.url)),
      views: fileURLToPath(new URL('./src/views', import.meta.url)),
      assets: fileURLToPath(new URL('./src/assets', import.meta.url))
    }
  }
} as UserConfigExport) // 添加类型标注，明确配置的类型
