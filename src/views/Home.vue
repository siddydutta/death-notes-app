<template>
  <v-container class="home-container">
    <v-row>
      <v-col cols="12" md="6">
        <h1 class="quote">"Some words are too important to be left unsaid."</h1>
        <p class="description">
          In a world full of uncertainty, knowing your last words will be heard can be a great
          relief.
        </p>
        <v-btn class="read-more" @click="navigateTo('/read-more')">Read More</v-btn>
        <v-btn class="login-btn" @click="redirectToMicrosoft">Dive In</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { getMicrosoftLoginUrl } from '@/api/auth'

const redirectToMicrosoft = async () => {
  try {
    const url = await getMicrosoftLoginUrl()
    window.location.href = url
  } catch (error) {
    console.error('Error fetching Microsoft OAuth URL:', error)
  }
}

const navigateTo = (path) => {
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

.read-more,
.login-btn {
  margin: 10px;
  width: 200px;
}
</style>
