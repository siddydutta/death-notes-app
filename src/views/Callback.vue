<template>
  <v-container>
    <h2>Authenticating...</h2>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const code = route.query.code
  if (!code) {
    console.error('No authorization code found')
    return
  }

  try {
    const response = await axios.post('https://api.deathnotes.tech/api/auth/microsoft/callback/', {
      code: code,
    })

    const { user, refresh, access } = response.data
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('refresh', refresh)
    localStorage.setItem('access', access)

    router.push('/')
  } catch (error) {
    console.error('OAuth authentication failed', error)
  }
})
</script>
