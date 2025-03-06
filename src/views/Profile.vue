<template>
  <div>
    <AppBar />
    <div
      class="profile-container flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
    >
      <div v-if="!userProfile" class="text-center">
        <!-- TODO @siddydutta Use a loading component here -->
        <h2 class="text-2xl font-bold mb-4">Loading...</h2>
      </div>
      <div v-else class="w-full md:w-1/2 text-center">
        <h2 class="text-2xl font-bold mb-4">Profile</h2>
        <form @submit.prevent="saveProfile">
          <div class="mb-4">
            <label for="email" class="block text-lg mb-2">Email</label>
            <input type="email" id="email" v-model="userProfile.email" disabled class="input-box" />
          </div>
          <div class="mb-4">
            <label for="firstName" class="block text-lg mb-2">First Name</label>
            <input type="text" id="firstName" v-model="userProfile.first_name" class="input-box" />
          </div>
          <div class="mb-4">
            <label for="lastName" class="block text-lg mb-2">Last Name</label>
            <input type="text" id="lastName" v-model="userProfile.last_name" class="input-box" />
          </div>
          <div class="mb-4">
            <label for="interval" class="block text-lg mb-2">Interval</label>
            <input
              type="number"
              min="0"
              id="interval"
              v-model="userProfile.interval"
              class="input-box"
            />
          </div>
          <button type="submit" class="btn btn-primary" :disabled="!isChanged">Save</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import AppBar from '@/components/AppBar.vue'
import type { User } from '@/types/User'
import { getUser, updateUser } from '@/api/user'
import { useAuthStore } from '@/stores/auth'

const userProfile = ref<User | null>(null)
const originalProfile = ref<User | null>(null)
const isChanged = ref<boolean>(false)
const authStore = useAuthStore()

const fetchUserData = async () => {
  try {
    userProfile.value = await getUser()
    originalProfile.value = { ...userProfile.value }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

const saveProfile = async () => {
  try {
    if (!userProfile.value) {
      return
    }
    await updateUser(userProfile.value)
    await fetchUserData()
    await authStore.setUser({ ...userProfile.value })
  } catch (error) {
    console.error('Error saving profile:', error)
  }
}

watch(
  userProfile,
  (newProfile) => {
    if (newProfile && originalProfile.value) {
      isChanged.value = JSON.stringify(newProfile) !== JSON.stringify(originalProfile.value)
    }
  },
  { deep: true },
)

onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.input-box {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
  background-color: #333;
  color: white;
}
</style>
