<template>
  <div>
    <AppBar />
    <div class="flex flex-col items-center min-h-screen text-white p-8">
      <div v-if="!userProfile" class="text-center">
        <LoadingSpinner text="Loading your final words..." />
      </div>
      <div v-else class="w-full md:w-2/3 lg:w-2/3 text-center">
        <div>
          <h2 class="quote text-3xl mb-4 pt-6 text-center">Profile</h2>
        </div>
        <form
          @submit.prevent="saveProfile"
          class="space-y-4 flex flex-col items-center justify-between pt-6"
        >
          <div class="mb-4 margin-1_5 flex items-center w-full md:w-2/3 lg:w-2/3">
            <label for="email" class="block text-lg mb-2 w-1/4 text-right pr-4">Email</label>
            <input
              type="email"
              id="email"
              v-model="userProfile.email"
              disabled
              class="input-box w-3/4"
            />
          </div>
          <div class="mb-4 margin-1_5 flex items-center w-full md:w-2/3 lg:w-2/3">
            <label for="firstName" class="block text-lg mb-2 w-1/4 text-right pr-4"
              >First Name</label
            >
            <input
              type="text"
              id="firstName"
              v-model="userProfile.first_name"
              class="input-box w-3/4"
            />
          </div>
          <div class="mb-4 margin-1_5 flex items-center w-full md:w-2/3 lg:w-2/3">
            <label for="lastName" class="block text-lg mb-2 w-1/4 text-right pr-4">Last Name</label>
            <input
              type="text"
              id="lastName"
              v-model="userProfile.last_name"
              class="input-box w-3/4"
            />
          </div>
          <div class="mb-4 margin-1_5 flex items-center w-full md:w-2/3 lg:w-2/3">
            <label for="interval" class="block text-lg mb-2 w-1/4 text-right pr-4">Interval</label>
            <input
              type="number"
              min="0"
              id="interval"
              v-model="userProfile.interval"
              class="input-box w-3/4 mr-6"
            />
          </div>
          <div class="mb-4 margin-1_5 flex items-left justify-center w-full md:w-2/3 lg:w-2/3">
            <span class="block text-lg mb-2 w-1/4 text-right pr-4"></span>
            <button
              type="submit"
              class="btn btn-primary btn-white-bg-black-text w-full save-button"
              :disabled="!isChanged"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import AppBar from '@/components/AppBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { User } from '@/types/User'
import { getUser, updateUser } from '@/api/user'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const userProfile = ref<User | null>(null)
const originalProfile = ref<User | null>(null)
const isChanged = ref<boolean>(false)
const authStore = useAuthStore()
const { success, error } = useToast()

const fetchUserData = async () => {
  try {
    userProfile.value = await getUser()
    originalProfile.value = { ...userProfile.value }
  } catch (err) {
    console.error('Error fetching user data:', err)
    error('Fetching user profile failed. Please try again.')
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
    success('Profile saved successfully.')
  } catch (err) {
    console.error('Error saving profile:', err)
    error('Saving profile failed. Please try again.')
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
.profile-container {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.input-box {
  width: 66.666667%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
  background-color: #333;
  color: white;
  text-align: center;
  margin: 0 auto;
  margin-right: 2.5rem;
}
.input-box:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.input-box:disabled:hover {
  border-color: red;
}

.save-button {
  width: 25%;
  padding: 0.5rem;
  margin: 0 auto;
  margin-right: 12.5rem;
}
</style>
