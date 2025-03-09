<template>
  <div>
    <AppBar />
    <div class="home-container flex flex-col items-center min-h-screen text-white p-8">
      <h2 class="quote text-3xl mb-4 pt-6 margin-t-6 text-center">
        You have written {{ homeStats?.total.FINAL_WORD }} messages and created
        {{ homeStats?.total.TIME_CAPSULE }} time capsules so far.
      </h2>
      <div class="w-full md:w-1/2 text-center justify-center">
        <h3 class="text-lg mb-4 margin-2">
          <strong>Last Check-In Date:</strong> {{ toDateTimeString(homeStats?.last_checkin) }}
        </h3>
        <p class="mb-4 margin-2">
          {{ homeStats?.delivered.TIME_CAPSULE }} Time Capsules delivered.
        </p>
        <div class="flex flex-col items-center mt-5 space-y-4 margin-0_5">
          <button
            class="btn btn-primary m-2 w-full md:w-1/2 btn-white-bg-black-text"
            @click="writeFinalWords"
          >
            Write Final Words
          </button>
          <button
            class="btn btn-primary m-2 w-full md:w-1/2 btn-white-bg-black-text"
            @click="createTimeCapsule"
          >
            Create Time Capsule
          </button>
          <button
            id="check-in"
            class="btn btn-primary m-2 w-full md:w-1/3 btn-white-bg-black-text"
            @click="handleCheckIn"
          >
            Check-In
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserHome } from '@/api/user'
import type { HomeStats } from '@/types/HomeStats'
import AppBar from '@/components/AppBar.vue'
import { checkIn } from '@/api/activity'
import { toDateTimeString } from '@/utils/dateUtils'
import { useToast } from '@/composables/useToast'

const homeStats = ref<HomeStats | null>(null)
const router = useRouter()
const { success, error } = useToast()

const fetchData = async () => {
  try {
    homeStats.value = await getUserHome()
  } catch (err) {
    console.error('Error fetching user home data:', err)
    error('Failed to load data. Please try again later.')
  }
}

const writeFinalWords = () => {
  router.push('/finalwords/new')
}

const createTimeCapsule = () => {
  router.push('/timecapsules/new')
}

const handleCheckIn = async () => {
  try {
    await checkIn()
    await fetchData()
    success('Check-in successful!')
  } catch (err) {
    console.error('Error during check-in:', err)
    error('Check-in failed. Please try again.')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

#check-in {
  margin: 2rem;
}
#check-in:hover {
  margin: 2rem;
}
</style>
