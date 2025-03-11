<template>
  <div>
    <AppBar />
    <div class="about-us flex flex-col items-center min-h-screen text-white p-8">
      <h1 class="quote text-3xl mb-4 pt-6 margin-t-4 text-center">About Us</h1>
      <div class="card-container flex flex-col items-center gap-4 w-full margin-1">
        <div class="card w-full md:w-2/3 p-6 rounded-lg shadow-lg about-card-light margin-0_5">
          <h2 class="text-2xl mb-2 text-center p-2 font-bold">What is Death Notes?</h2>
          <p class="text-center">
            Life is unpredictable, but your words don’t have to be lost with time. Death Notes is a
            service that ensures your messages reach the people who matter most—whether after your
            passing or in the future when the time is right.
          </p>
        </div>
        <div class="card w-full md:w-2/3 p-6 rounded-lg shadow-lg about-card-dark margin-0_5">
          <h2 class="text-2xl mb-2 text-center p-2">Our Services</h2>
          <h3 class="text-xl mb-2 text-center p-2">Final Words</h3>
          <p class="text-center">
            Leave heartfelt messages, important instructions, or last thoughts to be sent after your
            death. Whether it’s a goodbye, a confession, or words of wisdom, we ensure your message
            is delivered when you're no longer around.
          </p>
          <h3 class="text-xl mb-2 text-center pt-4 pb-2">Time Capsule</h3>
          <p class="text-center">
            Send a message to yourself or your loved ones at a future date. Whether it’s a note of
            encouragement, a reminder of a dream, or a message for a special occasion, the Time
            Capsule allows you to connect with the future in a meaningful way.
          </p>
        </div>
        <div class="card w-full md:w-2/3 p-6 rounded-lg shadow-lg about-card-light margin-0_5">
          <h2 class="text-2xl mb-2 text-center p-2">Why Death Notes?</h2>
          <p class="text-center">
            We believe that words hold power beyond time. Death Notes is designed to give you peace
            of mind, ensuring that no message goes unsaid. Whether for closure, guidance, or simply
            love that transcends time, we make sure your voice is heard—when it matters most.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppBar from '@/components/AppBar.vue'

export default {
  name: 'AboutView',
  components: {
    AppBar,
  },
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.card-container {
  width: 100%;
}
.about-us {
  font-family: 'Cormorant', serif;
}
</style>
