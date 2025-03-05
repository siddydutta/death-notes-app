<template>
    <div>
      <AppBar />
      <div class="home-container flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div class="w-full md:w-1/2 text-center">
          <h1 class="quote text-3xl mb-4">Activity Log</h1>
        </div>
      </div>
    </div>
  </template>

<script>
import AppBar from '@/components/AppBar.vue';

export default {
    name: 'ActivityLog',
    components: {
        AppBar
    }
}
</script>

<style scoped>
/* Add any styles if needed */
</style>