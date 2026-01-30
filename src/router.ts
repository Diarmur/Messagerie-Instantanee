import { createRouter, createWebHistory } from 'vue-router'
import MessagePageView from './components/pages/MessagePageView.vue'
import NotFoundView from './components/pages/NotFoundView.vue'

const routes = [
  {
    path: '/messages',
    name: 'messages',
    component: MessagePageView,
  },
  {
    path: '/404',
    name: 'Not found',
    component: NotFoundView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundView',
    component: NotFoundView,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})
