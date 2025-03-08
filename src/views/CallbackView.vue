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

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const code = route.query.code
  if (!code) {
    console.error('No authorization code found')
    return
  }
  try {
    await authStore.loginUser(code.toString())
    router.push('/dashboard')
  } catch (error) {
    console.error('OAuth authentication failed', error)
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
