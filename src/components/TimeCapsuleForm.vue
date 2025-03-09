<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <div class="margin-1 flex items-center content-item">
      <label for="recipients" class="block text-right w-1/7 pr-6">Recipients:</label>
      <div class="w-6/7">
        <input
          id="recipients"
          v-model="recipientsInput"
          @keydown.enter.prevent="addRecipient"
          @blur="addRecipient"
          placeholder="Enter Email IDs"
          class="input input-bordered w-full"
          :disabled="isDisabled"
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
              :disabled="isDisabled"
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
        :disabled="isDisabled"
      />
    </div>
    <div class="margin-1 flex items-center content-item">
      <label for="message" class="block text-right w-1/7 pr-6">Message:</label>
      <textarea
        id="message"
        v-model="message"
        placeholder="Write your message..."
        class="textarea textarea-bordered w-6/7"
        :disabled="isDisabled"
      ></textarea>
    </div>
    <div class="margin-1 flex items-center content-item">
      <label for="scheduled_at" class="block text-right w-1/7 pr-6">Scheduled At:</label>
      <input
        id="scheduled_at"
        v-model="scheduledAt"
        type="date"
        class="input input-bordered w-1/5"
        :disabled="isDisabled"
      />
    </div>
    <div class="flex justify-center submit-button">
      <div class="space-x-4">
        <button type="submit" class="btn btn-white-bg-black-text" :disabled="isDisabled">
          {{ submitButtonText }}
        </button>
        <button
          v-if="!isTestDisabled"
          type="button"
          class="btn btn-white-bg-black-text"
          @click="testMessage"
          :disabled="isTestDisabled"
        >
          Test
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { ref, defineComponent, watch } from 'vue'
import { MessageType, type Message } from '@/types/Message'
import { toDateString } from '@/utils/dateUtils'

export default defineComponent({
  name: 'TimeCapsuleForm',
  props: {
    messageId: {
      type: String,
      default: null,
    },
    initialData: {
      type: Object as () => Message | null,
      default: () => null,
    },
    submitButtonText: {
      type: String,
      default: 'Submit',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isTestDisabled: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['submit', 'test'],
  setup(props, { emit }) {
    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    const recipientsInput = ref<string>('')
    const recipients = ref<string[]>([])
    const subject = ref<string>('')
    const message = ref<string>('')
    const scheduledAt = ref<string>('')
    const errorMessage = ref<string>('')

    watch(
      () => props.initialData,
      (newData) => {
        if (newData) {
          if (newData.recipients) {
            recipients.value = newData.recipients.split(',').filter((email) => email.trim())
          }
          subject.value = newData.subject || ''
          message.value = newData.text || ''
          if (newData.scheduled_at) {
            scheduledAt.value = toDateString(newData.scheduled_at)
          }
        }
      },
      { immediate: true },
    )

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

    const submitForm = () => {
      const formData: Message = {
        type: MessageType.TIME_CAPSULE,
        recipients: recipients.value.join(','),
        subject: subject.value,
        text: message.value,
        delay: null,
        scheduled_at: new Date(scheduledAt.value),
      }

      if (props.messageId) {
        formData.id = props.messageId
      }

      emit('submit', formData)
    }

    const testMessage = () => {
      const formData: Message = {
        id: props.messageId,
        type: MessageType.TIME_CAPSULE,
        recipients: recipients.value.join(','),
        subject: subject.value,
        text: message.value,
        delay: null,
        scheduled_at: new Date(scheduledAt.value),
      }
      emit('test', formData)
    }

    return {
      recipientsInput,
      recipients,
      subject,
      message,
      scheduledAt,
      errorMessage,
      addRecipient,
      removeRecipient,
      submitForm,
      testMessage,
    }
  },
})
</script>

<style scoped>
@media (max-width: 640px) {
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
