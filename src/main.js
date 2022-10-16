import { createApp } from 'vue'

import './style.css'
import '@/assets/font/iconfont.css'
import App from './App.vue'
import router from './router'
import './router/permission'

const app = createApp(App)
app.config.globalProperties.returnCitySN = window.returnCitySN
app.use(router)
app.mount('#app')
