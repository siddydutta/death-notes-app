<template>
  <v-container class="home-container">
    <v-row>
      <v-col cols="12" md="6">
        <h1 class="quote">"Some words are too important to be left unsaid."</h1>
        <p class="description">
          In a world full of uncertainty, knowing your last words will be heard can be a great
          relief.
        </p>
        <v-btn class="read-more" @click="navigateTo('/read-more')">Read More</v-btn>
        <v-btn class="login-btn" @click="loginUser">Dive In</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { getLoginRedirect } from '@/api/auth'

const authStore = useAuthStore()
const router = useRouter()

const loginUser = async () => {
  if (authStore.user) {
    router.push('/dashboard')
    return
  }

  try {
    const url = await getLoginRedirect()
    window.location.href = url
  } catch (error) {
    console.error('Error fetching login redirect URL:', error)
  }
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  text-align: center;
  background-color: #1e1e1e;
  color: white;
  padding: 40px;
}

.read-more,
.login-btn {
  margin: 10px;
  width: 200px;
}
</style>
