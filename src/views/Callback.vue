<template>
  <v-container>
    <h2>Authenticating...</h2>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
    await authStore.loginUser(code)
    router.push('/dashboard')
  } catch (error) {
    console.error('OAuth authentication failed', error)
  }
})
</script>
