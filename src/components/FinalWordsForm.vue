<template>
  <form @submit.prevent="submitForm" class="space-y-4 margin-t-4">
    <div class="content-item margin-1 flex items-center">
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
        <div class="content-item flex flex-wrap mt-2">
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
    <div class="content-item margin-1 flex items-center">
      <label for="subject" class="block text-right w-1/7 pr-6">Subject:</label>
      <input
        id="subject"
        v-model="subject"
        placeholder="Enter Email Subject"
        class="input input-bordered w-6/7"
        :disabled="isDisabled"
      />
    </div>
    <div class="content-item margin-1 flex items-center">
      <label for="message" class="block text-right w-1/7 pr-6">Message:</label>
      <textarea
        id="message"
        v-model="message"
        placeholder="Write your message..."
        class="textarea textarea-bordered w-6/7"
        :disabled="isDisabled"
      ></textarea>
    </div>
    <div class="content-item margin-1 flex items-center">
      <label for="interval" class="block text-right w-1/7 pr-6">Interval:</label>
      <input
        id="interval"
        v-model="interval"
        type="number"
        placeholder="days"
        class="input input-bordered w-1/7 text-center"
        :disabled="isDisabled"
      />
    </div>
    <div class="flex justify-center submit-button">
      <button type="submit" class="btn btn-white-bg-black-text" :disabled="isDisabled">
        {{ submitButtonText }}
      </button>
      <button
        v-if="messageId && !isDisabled"
        type="button"
        class="btn btn-red-bg-white-text"
        @click="showDeleteConfirm = true"
      >
        Delete
      </button>
    </div>

    <ConfirmationModal
      :show="showDeleteConfirm"
      title="Confirm Deletion"
      message="Are you sure you want to delete these final words?"
      confirm-text="Delete"
      @confirm="onDeleteConfirmed"
      @cancel="showDeleteConfirm = false"
    />
  </form>
</template>

<script lang="ts">
import { ref, defineComponent, watch } from 'vue'
import { MessageType, type Message } from '@/types/Message'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

export default defineComponent({
  name: 'FinalWordsForm',
  components: {
    ConfirmationModal,
  },
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
  },
  emits: ['submit', 'delete'],
  setup(props, { emit }) {
    // Email validation using regex pattern
    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    const recipientsInput = ref<string>('')
    const recipients = ref<string[]>([])
    const subject = ref<string>('')
    const message = ref<string>('')
    const interval = ref<number | null>(null)
    const errorMessage = ref<string>('')
    const showDeleteConfirm = ref<boolean>(false)

    // Initialize form with data if editing an existing message
    watch(
      () => props.initialData,
      (newData) => {
        if (newData) {
          if (newData.recipients) {
            recipients.value = newData.recipients.split(',').filter((email) => email.trim())
          }
          subject.value = newData.subject || ''
          message.value = newData.text || ''
          interval.value = newData.delay || null
        }
      },
      { immediate: true },
    )

    // Process and validate email input, supporting comma-separated entries
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

    // Prepare form data for submission
    const submitForm = () => {
      const formData: Message = {
        type: MessageType.FINAL_WORD,
        recipients: recipients.value.join(','),
        subject: subject.value,
        text: message.value,
        delay: interval.value,
        scheduled_at: null,
      }

      if (props.messageId) {
        formData.id = props.messageId
      }

      emit('submit', formData)
    }

    const onDeleteConfirmed = () => {
      showDeleteConfirm.value = false
      emit('delete')
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
      submitForm,
      showDeleteConfirm,
      onDeleteConfirmed,
      props,
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
    padding-right: 0;
  }
  .content-item {
    flex-direction: column;
  }
  #interval {
    width: 25%;
  }
  .submit-button {
    margin-top: 4rem;
  }
}
</style>
