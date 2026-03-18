import { Buffer } from 'buffer'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/style/main.scss'

// Polyfill Buffer for browser (required by @shelby-protocol/sdk)
;(globalThis as any).Buffer = Buffer

const app = createApp(App)

app.use(router)
app.mount('#app')
