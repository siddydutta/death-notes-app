<template>
  <div>
    <AppBar />
    <div class="home-container flex flex-col items-center min-h-screen text-white">
      <h1 class="quote text-3xl mb-4 pt-6 margin-t-6">Create a Time Capsule</h1>
      <div class="w-full md:w-2/3 text-center justify-center">
        <div v-if="isLoading" class="text-center">
          <LoadingSpinner text="Creating your time capsule..." />
        </div>
        <TimeCapsuleForm v-else :submitButtonText="'Create'" @submit="createMessage" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import TimeCapsuleForm from '@/components/TimeCapsuleForm.vue'
import { type Message } from '@/types/Message'
import { postMessage } from '@/api/message'
import { useToast } from '@/composables/useToast'
import { ref } from 'vue'

export default {
  name: 'NewTimeCapsule',
  components: {
    AppBar,
    LoadingSpinner,
    TimeCapsuleForm,
  },
  setup() {
    const router = useRouter()
    const { success, error } = useToast()
    const isLoading = ref<boolean>(false)

    const createMessage = async (messageData: Message) => {
      try {
        isLoading.value = true
        const message = await postMessage(messageData)
        router.push(`/timecapsules/${message.id}`)
        success('Time capsule created successfully!')
      } catch (err) {
        console.error('Error creating time capsule:', err)
        error('Error creating time capsule. Please try again.')
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
