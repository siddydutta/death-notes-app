<template>
  <div>
    <AppBar />
    <div class="flex min-h-screen">
      <div
        class="home-background w-2/5 bg-cover bg-center hidden sm:block"
        :style="{ backgroundImage: `url(${homeBackground})` }"
      ></div>

      <div class="w-full sm:w-3/5 flex flex-col items-center justify-center text-white">
        <div class="w-full md:w-3/4 text-center">
          <h1 class="quote text-3xl mb-4">"Some words are too important to be left unsaid."</h1>
          <p class="description mb-4">
            In a world full of uncertainty, knowing your last words will be heard can be a great
            relief.
          </p>
          <div class="flex flex-col items-center mt-5 space-y-4">
            <button
              class="btn btn-primary m-2 w-full md:w-1/2 btn-white-bg-black-text"
              @click="navigateTo('/about')"
            >
              Read More
            </button>
            <button
              class="btn btn-primary m-2 w-full md:w-1/2 btn-white-bg-black-text"
              @click="loginUser"
            >
              Dive In
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { getLoginRedirect } from '@/api/auth'
import AppBar from '@/components/AppBar.vue'
import homeBackground from '@/assets/images/home_background.jpg'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const router = useRouter()
const { info, error } = useToast()

if (authStore.user) {
  router.push('/dashboard')
}

const loginUser = async () => {
  if (authStore.user) {
    router.push('/dashboard')
    return
  }

  try {
    info('Redirecting for login...')
    const url = await getLoginRedirect()
    window.location.href = url
  } catch (err) {
    console.error('Error fetching login redirect URL:', err)
    error('Something went wrong!')
  }
}

const navigateTo = (path: string) => {
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

@media (max-width: 640px) {
  .home-background {
    display: none;
  }
}
</style>
