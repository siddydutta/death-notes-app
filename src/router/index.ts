import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HomeView from '@/views/HomeView.vue'
import CallbackView from '@/views/CallbackView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import FinalWords from '@/views/FinalWords.vue'
import NewFinalWords from '@/views/NewFinalWords.vue'
import EditFinalWords from '@/views/EditFinalWords.vue'
import TimeCapsules from '@/views/TimeCapsules.vue'
import NewTimeCapsule from '@/views/NewTimeCapsule.vue'
import EditTimeCapsule from '@/views/EditTimeCapsule.vue'
import ActivityLog from '@/views/ActivityLog.vue'
import AboutView from '@/views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/callback', component: CallbackView },
    { path: '/about', component: AboutView },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/finalwords',
      component: FinalWords,
      meta: { requiresAuth: true },
    },
    {
      path: '/finalwords/new',
      component: NewFinalWords,
      meta: { requiresAuth: true },
    },
    {
      path: '/finalwords/:id',
      component: EditFinalWords,
      meta: { requiresAuth: true },
    },
    {
      path: '/timecapsules',
      component: TimeCapsules,
      meta: { requiresAuth: true },
    },
    {
      path: '/timecapsules/new',
      component: NewTimeCapsule,
      meta: { requiresAuth: true },
    },
    {
      path: '/timecapsules/:id',
      component: EditTimeCapsule,
      meta: { requiresAuth: true },
    },
    {
      path: '/activitylog',
      component: ActivityLog,
      meta: { requiresAuth: true },
    },
  ],
})

// Global navigation guard to protect authenticated routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.accessToken) {
    next('/')
  } else {
    next()
  }
})

export default router
