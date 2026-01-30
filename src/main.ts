import './assets/main.css'
import { router } from "./router";
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'

const pinia = createPinia()

createApp(App)
.use(router)
.use(pinia)
.use(VueCookies)
.mount('#app')
