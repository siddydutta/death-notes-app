<template>
  <div>
    <AppBar />
    <div class="home-container flex flex-col items-center min-h-screen text-white">
      <h1 class="quote text-3xl mb-4 pt-6 margin-2">Write a message with your final words</h1>
      <div class="w-full md:w-2/3 text-center justify-center">
        
        <form @submit.prevent="createMessage" class="space-y-4">
          <div class="margin-1 flex items-center">
            <label for="recipients" class="block text-right w-1/7 pr-6">Recipients:</label>
            <div class="w-6/7">
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
            class="badge badge-secondary mr-2 mb-2 margin-r-0_5 margin-t-0_5"
          >
            {{ recipient }}
            <button type="button" @click="removeRecipient(index)" class="ml-1">x</button>
          </span>
              </div>
            </div>
          </div>
          <div v-if="errorMessage" class="text-red-500">{{ errorMessage }}</div>
          <div class="margin-1 flex items-center">
            <label for="subject" class="block text-right w-1/7 pr-6">Subject:</label>
            <input
              id="subject"
              v-model="subject"
              placeholder="Enter Email Subject"
              class="input input-bordered w-6/7"
            />
          </div>
          <div class="margin-1 flex items-center">
            <label for="message" class="block text-right w-1/7 pr-6">Message:</label>
            <textarea
              id="message"
              v-model="message"
              placeholder="Write your message..."
              class="textarea textarea-bordered w-6/7"
            ></textarea>
          </div>
          <div class="margin-1 flex items-center">
            <label for="interval" class="block text-right w-1/7 pr-6">Interval:</label>
            <input
              id="interval"
              v-model="interval"
              type="number"
              placeholder="days"
              class="input input-bordered w-6/7"
            />
          </div>
          <div class="flex justify-center">
            <button type="submit" class="btn btn-white-bg-black-text">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import AppBar from '@/components/AppBar.vue'
import { MessageType, type Message } from '@/types/Message'
import { postMessage } from '@/api/message'
import { useRouter } from 'vue-router'

export default {
  name: 'NewFinalWords',
  components: {
    AppBar,
  },
  setup() {
    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    const router = useRouter()

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

    const createMessage = async () => {
      const newMessage: Message = {
        type: MessageType.FINAL_WORD,
        recipients: recipients.value.join(','),
        subject: subject.value,
        text: message.value,
        delay: interval.value,
        scheduled_at: null,
      }
      await postMessage(newMessage)
      router.push('/finalwords')
    }

    return {
      recipientsInput,
      recipients,
      subject,
      message,
      interval,
      errorMessage,
      addRecipient,
      removeRecipient,
      createMessage,
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
