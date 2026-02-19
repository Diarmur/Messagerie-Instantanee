import { createRouter, createWebHistory } from 'vue-router'
import MessagePageView from './components/pages/MessagePageView.vue'
import NotFoundView from './components/pages/NotFoundView.vue'
import LoginPage from './components/pages/LoginPage.vue'
import { useStore } from './stores/store'

const routes = [
  {
    path: '/',
    name: 'messages',
    component: MessagePageView,
    meta: { requiresAuth: true }
   
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
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false }

  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

router.beforeEach((to, from, next) => {
  const auth = useStore()
  const authenticated = auth.token
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authenticated ) {
    next('/login');  
  } else {
    next();
  }
})