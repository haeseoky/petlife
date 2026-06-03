import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/draw', name: 'draw', component: () => import('../views/DrawView.vue') },
  { path: '/memory', name: 'memory', component: () => import('../views/MemoryView.vue') },
  { path: '/color', name: 'color', component: () => import('../views/ColorView.vue') },
  { path: '/reaction', name: 'reaction', component: () => import('../views/ReactionView.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
