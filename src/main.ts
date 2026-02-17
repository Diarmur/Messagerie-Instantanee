import './assets/main.css'
import { router } from './router'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { SnackbarService, Vue3Snackbar } from 'vue3-snackbar'
import 'vue3-snackbar/styles'
import ui from '@nuxt/ui/vue-plugin'
import { createApp } from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'

const app = createApp(App)
const pinia = createPinia()

library.add(fas)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(pinia)
app.use(router)
app.use(VueCookies)
app.use(SnackbarService)
app.use(ui)
app.component('vue3-snackbar', Vue3Snackbar)

app.mount('#app')
