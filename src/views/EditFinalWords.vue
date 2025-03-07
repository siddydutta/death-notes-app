<template>
  <div>
    <AppBar />
    <div class="home-container flex flex-col items-center justify-center min-h-screen text-white">
      <div class="w-full md:w-1/2 text-center">
        <h1 class="quote text-3xl mb-4">Edit your final words</h1>
        <form @submit.prevent="updateMessage" class="space-y-4">
          <div>
            <label for="recipients" class="block text-left">Recipients:</label>
            <input
              id="recipients"
              v-model="recipientsInput"
              @keyup.enter="addRecipient"
              @blur="addRecipient"
              placeholder="Enter Email IDs"
              class="input input-bordered w-full"
            />
            <div class="flex flex-wrap mt-2">
              <span
                v-for="(recipient, index) in recipients"
                :key="index"
                class="badge badge-secondary mr-2 mb-2"
              >
                {{ recipient }}
                <button type="button" @click="removeRecipient(index)" class="ml-1">x</button>
              </span>
            </div>
          </div>
          <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
          <div>
            <label for="subject" class="block text-left">Subject:</label>
            <input
              id="subject"
              v-model="subject"
              placeholder="Enter Email Subject"
              class="input input-bordered w-full"
            />
          </div>
          <div>
            <label for="message" class="block text-left">Message:</label>
            <textarea
              id="message"
              v-model="message"
              placeholder="Write your message..."
              class="textarea textarea-bordered w-full"
            ></textarea>
          </div>
          <div>
            <label for="interval" class="block text-left">Interval:</label>
            <input
              id="interval"
              v-model="interval"
              type="number"
              placeholder="days"
              class="input input-bordered w-full"
            />
          </div>
          <button type="submit" class="btn btn-primary w-full">Update</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import { MessageType, type Message } from '@/types/Message'
import { getMessage, patchMessage } from '@/api/message'

export default {
  name: 'EditFinalWords',
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
    const interval = ref<number | null>(null)
    const errorMessage = ref<string>('')

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
      interval.value = existingMessage.delay
    }

    const updateMessage = async () => {
      const updatedMessage: Message = {
        id: messageId,
        type: MessageType.FINAL_WORD,
        recipients: recipients.value.join(','),
        subject: subject.value,
        text: message.value,
        delay: interval.value,
        scheduled_at: null,
      }
      await patchMessage(updatedMessage)
      router.push('/finalwords')
    }

    onMounted(loadMessage)

    return {
      recipientsInput,
      recipients,
      subject,
      message,
      interval,
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
</style>
