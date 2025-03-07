<template>
  <div>
    <AppBar />
    <div class="home-container flex flex-col items-center justify-center min-h-screen text-white">
      <div class="w-full md:w-1/2 text-center">
        <h1 class="quote text-3xl mb-4">Time Capsules</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppBar from '@/components/AppBar.vue'

export default {
  name: 'TimeCapsules',
  components: {
    AppBar,
  },
}
</script>

<style scoped>
/* Add any styles if needed */
</style>
