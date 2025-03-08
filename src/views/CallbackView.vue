<template>
  <div
    class="callback-container flex flex-col items-center justify-center min-h-screen text-white p-8"
  >
    <LoadingSpinner text="Authenticating..." />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { success, error } = useToast()

onMounted(async () => {
  try {
    const code = route.query.code
    if (!code) {
      throw new Error('No authorization code found')
    }
    await authStore.loginUser(code.toString())
    router.push('/dashboard')
    success('Successfully authenticated!')
  } catch (err) {
    console.error('Authentication failed', err)
    error('Failed to authenticate. Please try again.')
    router.push('/')
  }
})
</script>

<style scoped>
.callback-container {
  background-color: transparent;
}

.min-h-screen {
  min-height: 100vh;
}
</style>
