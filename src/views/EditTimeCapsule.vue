<template>
  <div>
    <AppBar />
    <div class="home-container flex flex-col items-center min-h-screen text-white p-8">
      <h1 class="quote text-3xl mb-4 pt-6 margin-2">
        {{ isDelivered ? 'View' : 'Edit' }} your time capsule
      </h1>
      <div class="w-full md:w-2/3 text-center justify-center">
        <form @submit.prevent="updateMessage" class="space-y-4">
          <div class="margin-1 flex items-center content-item">
            <label for="recipients" class="block text-right w-1/7 pr-6">Recipients:</label>
            <div class="w-6/7">
              <input
                id="recipients"
                v-model="recipientsInput"
                @keyup.enter="addRecipient"
                @blur="addRecipient"
                placeholder="Enter Email IDs"
                class="input input-bordered w-full"
                :disabled="isDelivered"
              />
              <div class="flex flex-wrap mt-2">
                <span
                  v-for="(recipient, index) in recipients"
                  :key="index"
                  class="badge badge-secondary mr-2 mb-2 margin-r-0_5 margin-t-0_5"
                >
                  {{ recipient }}
                  <button
                    type="button"
                    @click="removeRecipient(index)"
                    class="ml-1"
                    :disabled="isDelivered"
                  >
                    x
                  </button>
                </span>
              </div>
            </div>
          </div>
          <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
          <div class="margin-1 flex items-center content-item">
            <label for="subject" class="block text-right w-1/7 pr-6">Subject:</label>
            <input
              id="subject"
              v-model="subject"
              placeholder="Enter Email Subject"
              class="input input-bordered w-6/7"
              :disabled="isDelivered"
            />
          </div>
          <div class="margin-1 flex items-center content-item">
            <label for="message" class="block text-right w-1/7 pr-6">Message:</label>
            <textarea
              id="message"
              v-model="message"
              placeholder="Write your message..."
              class="textarea textarea-bordered w-6/7"
              :disabled="isDelivered"
            ></textarea>
          </div>
          <div class="margin-1 flex items-center content-item">
            <label for="scheduled_at" class="block text-right w-1/7 pr-6">Scheduled At:</label>
            <input
              id="scheduled_at"
              v-model="scheduledAt"
              type="date"
              class="input input-bordered w-1/5"
              :disabled="isDelivered"
            />
          </div>
          <div class="flex justify-center submit-button">
            <button type="submit" class="btn btn-white-bg-black-text" :disabled="isDelivered">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import { MessageStatus, MessageType, type Message } from '@/types/Message'
import { getMessage, patchMessage } from '@/api/message'
import { toDateString } from '@/utils/dateUtils'

export default {
  name: 'EditTimeCapsule',
  components: {
    AppBar,
  },
  setup() {
    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    const route = useRoute()
    const router = useRouter()
    const messageId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

    const recipientsInput = ref<string>('')
    const recipients = ref<string[]>([])
    const subject = ref<string>('')
    const message = ref<string>('')
    const scheduledAt = ref<string>('')
    const errorMessage = ref<string>('')
    const status = ref<MessageStatus>(MessageStatus.DELIVERED)
    const isDelivered = computed(() => status.value !== MessageStatus.SCHEDULED)

    const addRecipient = () => {
      const emails = recipientsInput.value
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email)

      const invalidEmails = emails.filter((email) => !validateEmail(email))
      if (invalidEmails.length > 0) {
        errorMessage.value = `Invalid email(s): ${invalidEmails.join(', ')}`
        return
      }
      recipients.value.push(...emails)
      recipientsInput.value = ''
      errorMessage.value = ''
    }

    const removeRecipient = (index: number) => {
      recipients.value.splice(index, 1)
    }

    const loadMessage = async () => {
      const existingMessage = await getMessage(messageId)
      recipients.value = existingMessage.recipients.split(',')
      subject.value = existingMessage.subject
      message.value = existingMessage.text
      scheduledAt.value = toDateString(existingMessage.scheduled_at)
      status.value = existingMessage.status || MessageStatus.DELIVERED
    }

    const updateMessage = async () => {
      const updatedMessage: Message = {
        id: messageId,
        type: MessageType.TIME_CAPSULE,
        recipients: recipients.value.join(','),
        subject: subject.value,
        text: message.value,
        delay: null,
        scheduled_at: new Date(scheduledAt.value),
      }
      await patchMessage(updatedMessage)
      router.push(`/timecapsules`)
    }

    onMounted(loadMessage)

    return {
      recipientsInput,
      recipients,
      subject,
      message,
      scheduledAt,
      isDelivered,
      errorMessage,
      addRecipient,
      removeRecipient,
      updateMessage,
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
  .block {
    display: block;
    width: 100%;
    text-align: center;
  }
  .content-item {
    flex-direction: column;
  }
  #scheduled_at {
    width: 50%;
  }
  .submit-button {
    margin-top: 4rem;
  }
}
</style>
