<template>
  <div>
    <AppBar />
    <div class="home-container flex flex-col items-center min-h-screen text-white p-8">
      <h1 class="quote text-3xl mb-4 pt-6 margin-t-4">Edit your final words</h1>
      <div class="w-full md:w-2/3 text-center justify-center">
        <div v-if="isLoading" class="text-center">
          <LoadingSpinner text="Loading your final words..." />
        </div>
        <FinalWordsForm
          v-else
          :messageId="messageId"
          :initialData="initialData"
          submitButtonText="Update"
          @submit="updateMessage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import FinalWordsForm from '@/components/FinalWordsForm.vue'
import { type Message } from '@/types/Message'
import { getMessage, patchMessage } from '@/api/message'
import { useToast } from '@/composables/useToast'

export default {
  name: 'EditFinalWords',
  components: {
    AppBar,
    LoadingSpinner,
    FinalWordsForm,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { success, error } = useToast()
    const messageId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    const initialData = ref<Message | null>(null)
    const isLoading = ref<boolean>(true)

    const loadMessage = async () => {
      try {
        isLoading.value = true
        const existingMessage = await getMessage(messageId)
        initialData.value = existingMessage
      } catch (err) {
        console.error('Error loading final words:', err)
        error('Error loading final words. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    const updateMessage = async (updatedMessage: Message) => {
      try {
        isLoading.value = true
        await patchMessage(updatedMessage)
        router.push(`/finalwords/${messageId}`)
        success('Final words updated successfully!')
      } catch (err) {
        console.error('Error updating final words:', err)
        error('Error updating final words. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    onMounted(loadMessage)

    return {
      messageId,
      initialData,
      updateMessage,
      isLoading,
    }
  },
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
.input,
.textarea {
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
}
.input:focus,
.textarea:focus {
  border-color: #777;
}
.btn-primary {
  background-color: #444;
  border-color: #555;
}
.btn-primary:hover {
  background-color: #555;
  border-color: #666;
}
@media (max-width: 640px) {
  .quote {
    text-align: center;
  }
}
</style>
