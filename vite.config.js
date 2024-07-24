import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'url';
export default defineConfig({
    plugins: [
        vue(),
        AutoImport('vue','vue-router'),
        Components({
            dirs: ['components'], // 定义插件自动导入组件的文件夹，components是默认的
        })
    ],
    server: {
        port: 3000
    },
    build: {
        outDir: 'dist',
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'components': fileURLToPath(new URL('./src/components', import.meta.url)),
            'views': fileURLToPath(new URL('./src/views', import.meta.url)),
            'assets': fileURLToPath(new URL('./src/assets', import.meta.url))
        }
    }
})
