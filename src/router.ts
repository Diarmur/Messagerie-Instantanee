import { createRouter, createWebHistory } from 'vue-router'
import MessagePage from './components/pages/MessagePage.vue'
import LoginPage from './components/pages/LoginPage.vue'

const routes = [
  {
    path: '/messages',
    name: 'messages',
    component: MessagePage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})
