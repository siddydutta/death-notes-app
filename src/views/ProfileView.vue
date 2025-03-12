<template>
  <div>
    <AppBar />
    <div class="flex flex-col items-center min-h-screen text-white p-8 main-container">
      <div v-if="!userProfile" class="text-center">
        <LoadingSpinner text="Loading your final words..." />
      </div>
      <div v-else class="w-full md:w-2/3 lg:w-2/3 text-center">
        <div>
          <h2 class="quote text-3xl mb-4 pt-6 margin-t-4 text-center">Profile</h2>
        </div>
        <form
          @submit.prevent="saveProfile"
          class="space-y-4 flex flex-col items-center justify-between pt-6"
        >
          <div class="mb-4 margin-1_5 flex items-center w-full md:w-2/3 lg:w-2/3 profile-field">
            <label for="email" class="block text-lg mb-2 w-1/4 text-right pr-4 sm:text-left"
              >Email</label
            >
            <input
              type="email"
              id="email"
              v-model="userProfile.email"
              disabled
              class="input-box w-3/4"
            />
          </div>
          <div class="mb-4 margin-1_5 flex items-center w-full md:w-2/3 lg:w-2/3 profile-field">
            <label for="firstName" class="block text-lg mb-2 w-1/4 text-right pr-4 sm:text-left"
              >First Name</label
            >
            <input
              type="text"
              id="firstName"
              v-model="userProfile.first_name"
              class="input-box w-3/4"
            />
          </div>
          <div class="mb-4 margin-1_5 flex items-center w-full md:w-2/3 lg:w-2/3 profile-field">
            <label for="lastName" class="block text-lg mb-2 w-1/4 text-right pr-4 sm:text-left"
              >Last Name</label
            >
            <input
              type="text"
              id="lastName"
              v-model="userProfile.last_name"
              class="input-box w-3/4"
            />
          </div>
          <div class="mb-4 margin-1_5 flex items-center w-full md:w-2/3 lg:w-2/3 profile-field">
            <label for="interval" class="block text-lg mb-2 w-1/4 text-right pr-4 sm:text-left"
              >Interval</label
            >
            <input
              type="number"
              min="0"
              id="interval"
              v-model="userProfile.interval"
              class="input-box w-3/4 mr-6"
            />
          </div>
          <div class="mb-4 margin-1_5 flex items-left justify-center w-full save-button">
            <button
              type="submit"
              class="btn btn-primary btn-white-bg-black-text w-full"
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

// Load user profile data from API
const fetchUserData = async () => {
  try {
    userProfile.value = await getUser()
    // Store a copy of the original profile to detect changes
    originalProfile.value = { ...userProfile.value }
  } catch (err) {
    console.error('Error fetching user data:', err)
    error('Fetching user profile failed. Please try again.')
  }
}

// Update user profile in API and local state
const saveProfile = async () => {
  try {
    if (!userProfile.value) {
      return
    }
    await updateUser(userProfile.value)
    await fetchUserData()
    // Update the user in auth store to reflect changes across the app
    await authStore.setUser({ ...userProfile.value })
    success('Profile saved successfully.')
  } catch (err) {
    console.error('Error saving profile:', err)
    error('Saving profile failed. Please try again.')
  }
}

// Track profile changes to enable/disable save button
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
}

@media (max-width: 640px) {
  .profile-field {
    flex-direction: column;
    align-items: flex-start;
  }
  .profile-field label {
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .profile-field .input-box {
    width: 100%;
    margin-right: 0;
  }
  .save-button {
    width: 50%;
    margin: 2rem 0 0 0;
    padding: 0;
  }
}
</style>
