import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '@/views/Home.vue'
import Callback from '@/views/Callback.vue'
import Dashboard from '@/views/Dashboard.vue'
import FinalWords from '@/views/FinalWords.vue'
import TimeCapsules from '@/views/TimeCapsules.vue'
import ActivityLog from '@/views/ActivityLog.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/callback', component: Callback },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/finalwords',
      component: FinalWords,
      meta: { requiresAuth: true },
    },
    {
      path: '/timecapsules',
      component: TimeCapsules,
      meta: { requiresAuth: true },
    },
    {
      path: '/activitylog',
      component: ActivityLog,
      meta: { requiresAuth: true },
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.accessToken) {
    next('/')
  } else {
    next()
  }
})

export default router
