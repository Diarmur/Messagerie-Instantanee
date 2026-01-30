import './assets/main.css'
import { router } from "./router";

import { createApp } from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'


createApp(App)
.use(router)
.use(VueCookies)
.mount('#app')
