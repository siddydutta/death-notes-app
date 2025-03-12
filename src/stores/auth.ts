import { defineStore } from 'pinia'
import { getAccessToken, getAuthUser } from '@/api/auth'
import type { User } from '@/types/User'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Initialize user and tokens from local storage if available
    user: (() => {
      const user = localStorage.getItem('user')
      return user ? (JSON.parse(user) as User) : null
    })(),
    accessToken: localStorage.getItem('access') ?? null,
    refreshToken: localStorage.getItem('refresh') ?? null,
  }),

  actions: {
    async loginUser(code: string) {
      try {
        // Exchange authorization code for user data and tokens
        const { user, access, refresh } = await getAuthUser(code)
        this.user = user
        this.accessToken = access
        this.refreshToken = refresh

        // Persist authentication state to survive page reloads
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('access', access)
        localStorage.setItem('refresh', refresh)
      } catch (error) {
        console.error('Login failed', error)
      }
    },

    async setUser(user: User) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    async refreshAccessToken() {
      try {
        if (!this.refreshToken) {
          throw new Error('No refresh token found')
        }
        const access = await getAccessToken(this.refreshToken)
        this.accessToken = access
        if (this.accessToken) {
          localStorage.setItem('access', this.accessToken)
        }
      } catch (error) {
        console.error('Token refresh failed', error)
        this.logout()
      }
    },

    logout() {
      // Clear all auth data and redirect to home page
      localStorage.clear()
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      router.push('/')
    },
  },
})
