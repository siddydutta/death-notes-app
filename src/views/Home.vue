<template>
  <div>
    <AppBar />
    <div class="home-container flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div class="w-full md:w-1/2 text-center">
        <h1 class="quote text-3xl mb-4">"Some words are too important to be left unsaid."</h1>
        <p class="description mb-4">
          In a world full of uncertainty, knowing your last words will be heard can be a great
          relief.
        </p>
        <button class="btn btn-primary m-2" @click="navigateTo('/read-more')">Read More</button>
        <button class="btn btn-secondary m-2" @click="loginUser">Dive In</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { getLoginRedirect } from '@/api/auth'
import AppBar from '@/components/AppBar.vue'

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

.quote {
  font-size: 2rem;
  margin-bottom: 20px;
}

.description {
  margin-bottom: 20px;
}

.btn-primary,
.btn-secondary {
  margin: 10px;
  width: 200px;
}
</style>
