import { createRouter, createWebHistory } from 'vue-router'
import MessagePage from './components/pages/MessagePage.vue'

const routes = [
  {
    path: '/messages',
    name: 'messages',
    component: MessagePage,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})
