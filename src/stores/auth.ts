import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    accessToken: localStorage.getItem('access') || null,
    refreshToken: localStorage.getItem('refresh') || null,
  }),

  actions: {
    async refreshAccessToken() {
      try {
        const response = await axios.post('https://api.deathnotes.tech/api/auth/token/refresh/', {
          refresh: this.refreshToken,
        })
        this.accessToken = response.data.access
        if (this.accessToken) {
          localStorage.setItem('access', this.accessToken)
        }
      } catch (error) {
        console.error('Token refresh failed', error)
        this.logout()
      }
    },

    logout() {
      localStorage.clear()
      this.user = null
      this.accessToken = null
      this.refreshToken = null
    },
  },
})
