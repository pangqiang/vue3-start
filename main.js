import { createApp } from 'vue';
import App from '@/views/app.vue';
import router from './src/router/index.js'

console.log('router',router)
createApp(App).use(router).mount('#app')
