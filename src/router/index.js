import { createRouter, createWebHistory } from 'vue-router'
import routes from '../routes.js'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// SEO: 페이지별 메타 정보 업데이트
router.afterEach((to) => {
  const meta = to.meta
  if (meta?.title) {
    document.title = meta.title
  }
  if (meta?.description) {
    let descEl = document.querySelector('meta[name="description"]')
    if (!descEl) {
      descEl = document.createElement('meta')
      descEl.setAttribute('name', 'description')
      document.head.appendChild(descEl)
    }
    descEl.setAttribute('content', meta.description)
  }
})

export default router
