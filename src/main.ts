import './assets/main.css'
import { router } from './router'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { createApp } from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'

const app = createApp(App)
const pinia = createPinia()

// ✅ Ajoute l'icône plus
library.add(fas)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(pinia)
app.use(router)
app.use(VueCookies)

app.mount('#app')
