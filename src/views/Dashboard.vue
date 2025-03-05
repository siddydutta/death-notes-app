<template>
  <v-app>
    <!-- Main Content -->
    <v-main class="d-flex align-center justify-center">
      <v-container class="text-center">
        <h2 class="text-h5 font-weight-bold">
          You have written {{ homeStats?.total.FINAL_WORD }} messages and created
          {{ homeStats?.total.TIME_CAPSULE }} time capsules so far.
        </h2>
        <p class="text-subtitle-1">
          <strong>Last Check-In Date:</strong>{{ homeStats?.last_checkin }}
        </p>
        <p>
          {{ homeStats?.delivered.FINAL_WORD }} Final Words delivered.<br />{{
            homeStats?.delivered.TIME_CAPSULE
          }}
          Time Capsules delivered.
        </p>

        <v-row justify="center" class="mt-5">
          <v-col cols="12" sm="6">
            <v-btn block color="grey-darken-2" variant="flat" size="large">
              Write Final Words
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn block color="grey-darken-2" variant="flat" size="large">
              Create Time Capsule
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import type { HomeStats } from '@/types/HomeStats'
import { ref, onMounted } from 'vue'
import { getUserHome } from '@/api/user'

const homeStats = ref<HomeStats | null>(null)

const fetchData = async () => {
  try {
    homeStats.value = await getUserHome()
  } catch (error) {
    console.error('Error fetching user home data:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.v-main {
  background-color: #1e1e1e;
  color: white;
  min-height: 100vh;
}
</style>
