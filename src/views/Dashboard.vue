<template>
  <div>
    <AppBar />
    <div
      class="home-container flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
    >
      <div class="w-full md:w-1/2 text-center">
        <h2 class="text-2xl font-bold mb-4">
          You have written {{ homeStats?.total.FINAL_WORD }} messages and created
          {{ homeStats?.total.TIME_CAPSULE }} time capsules so far.
        </h2>
        <p class="text-lg mb-4">
          <strong>Last Check-In Date:</strong> {{ homeStats?.last_checkin }}
        </p>
        <p class="mb-4">
          {{ homeStats?.delivered.FINAL_WORD }} Final Words delivered.<br />
          {{ homeStats?.delivered.TIME_CAPSULE }} Time Capsules delivered.
        </p>
        <div class="flex justify-center mt-5 space-x-4">
          <button class="btn btn-primary" @click="writeFinalWords">Write Final Words</button>
          <button class="btn btn-secondary" @click="createTimeCapsule">Create Time Capsule</button>
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

const homeStats = ref<HomeStats | null>(null)
const router = useRouter()

const fetchData = async () => {
  try {
    homeStats.value = await getUserHome()
  } catch (error) {
    console.error('Error fetching user home data:', error)
  }
}

const writeFinalWords = () => {
  router.push('/write-final-words')
}

const createTimeCapsule = () => {
  router.push('/create-time-capsule')
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
