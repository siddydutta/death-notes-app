<template>
  <div>
    <AppBar />
    <div class="home-container flex flex-col items-center min-h-screen text-white p-8">
      <h1 class="quote text-3xl mb-4 pt-6 margin-2">Write a message with your final words</h1>
      <div class="w-full md:w-2/3 text-center justify-center">
        <div v-if="isLoading" class="text-center">
          <LoadingSpinner text="Creating your final words..." />
        </div>
        <FinalWordsForm v-else submitButtonText="Create" @submit="createMessage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppBar from '@/components/AppBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import FinalWordsForm from '@/components/FinalWordsForm.vue'
import { type Message } from '@/types/Message'
import { postMessage } from '@/api/message'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { ref } from 'vue'

export default {
  name: 'NewFinalWords',
  components: {
    AppBar,
    LoadingSpinner,
    FinalWordsForm,
  },
  setup() {
    const router = useRouter()
    const { success, error } = useToast()
    const isLoading = ref<boolean>(false)

    const createMessage = async (newMessage: Message) => {
      try {
        isLoading.value = true
        const message = await postMessage(newMessage)
        router.push(`/finalwords/${message.id}`)
        success('Final words created successfully!')
      } catch (err) {
        console.error('Error creating final words:', err)
        error('Error creating final words. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    return {
      createMessage,
      isLoading,
    }
  },
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
@media (max-width: 640px) {
  .quote {
    text-align: center;
  }
}
</style>
