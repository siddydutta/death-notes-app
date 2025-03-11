<template>
  <div>
    <AppBar />
    <div class="home-container flex flex-col items-center min-h-screen text-white p-8">
      <h1 class="quote text-3xl mb-4 pt-6 margin-t-4">
        {{ isDelivered ? 'View' : 'Edit' }} your time capsule
      </h1>
      <div class="w-full md:w-2/3 text-center justify-center">
        <div v-if="isLoading" class="text-center">
          <LoadingSpinner text="Loading your time capsule..." />
        </div>
        <TimeCapsuleForm
          v-else
          :messageId="messageId"
          :initialData="initialData"
          :isDisabled="isDelivered"
          :submitButtonText="'Update'"
          @submit="updateTimeCapsule"
          @test="testTimeCapsule"
          @delete="deleteTimeCapsule"
          :isTestDisabled="isDelivered"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import TimeCapsuleForm from '@/components/TimeCapsuleForm.vue'
import { MessageStatus, type Message } from '@/types/Message'
import { deleteMessage, getMessage, patchMessage, testMessage } from '@/api/message'
import { useToast } from '@/composables/useToast'

export default {
  name: 'EditTimeCapsule',
  components: {
    AppBar,
    LoadingSpinner,
    TimeCapsuleForm,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { success, error } = useToast()

    const messageId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    const initialData = ref<Message | null>(null)
    const status = ref<MessageStatus>(MessageStatus.DELIVERED)
    const isDelivered = computed(() => status.value !== MessageStatus.SCHEDULED)
    const isLoading = ref<boolean>(true)

    const loadMessage = async () => {
      try {
        isLoading.value = true
        const existingMessage = await getMessage(messageId)
        initialData.value = existingMessage
        status.value = existingMessage.status || MessageStatus.DELIVERED
      } catch (err) {
        console.error('Error loading time capsule:', err)
        error('Error loading time capsule. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    const updateTimeCapsule = async (updatedMessage: Message) => {
      try {
        isLoading.value = true
        const message = await patchMessage(updatedMessage)
        initialData.value = message
        router.push(`/timecapsules/${messageId}`)
        success('Time capsule updated successfully!')
      } catch (err) {
        console.error('Error updating time capsule:', err)
        error('Error updating time capsule. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    const testTimeCapsule = async (message: Message) => {
      try {
        isLoading.value = true
        await testMessage(message)
        success('Test time capsule sent to you!')
      } catch (err) {
        console.error('Error testing time capsule:', err)
        error('Test time capsule failed!')
      } finally {
        isLoading.value = false
      }
    }

    const deleteTimeCapsule = async () => {
      try {
        isLoading.value = true
        await deleteMessage(messageId)
        router.push('/timecapsules')
        success('Time capsule deleted successfully!')
      } catch (err) {
        console.error('Error deleting time capsule:', err)
        error('Error deleting time capsule. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    onMounted(loadMessage)

    return {
      messageId,
      initialData,
      isDelivered,
      updateTimeCapsule,
      testTimeCapsule,
      deleteTimeCapsule,
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
