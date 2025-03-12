<template>
  <form @submit.prevent="submitForm" class="space-y-4 margin-t-4">
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
        <button
          v-if="!isDisabled"
          type="button"
          class="btn btn-red-bg-white-text"
          @click="showDeleteConfirm = true"
        >
          Delete
        </button>
      </div>
    </div>

    <ConfirmationModal
      :show="showDeleteConfirm"
      title="Confirm Deletion"
      message="Are you sure you want to delete this time capsule?"
      confirm-text="Delete"
      @confirm="onDeleteConfirmed"
      @cancel="showDeleteConfirm = false"
    />
  </form>
</template>

<script lang="ts">
import { ref, defineComponent, watch } from 'vue'
import { MessageType, type Message } from '@/types/Message'
import { toDateString } from '@/utils/dateUtils'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

export default defineComponent({
  name: 'TimeCapsuleForm',
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
    isTestDisabled: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['submit', 'test', 'delete'],
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
    const scheduledAt = ref<string>('')
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
          if (newData.scheduled_at) {
            scheduledAt.value = toDateString(newData.scheduled_at)
          }
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

    // Prepare data for test email
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

    const onDeleteConfirmed = () => {
      showDeleteConfirm.value = false
      emit('delete')
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
  #scheduled_at {
    width: 50%;
  }
  .submit-button {
    margin-top: 4rem;
  }
}
</style>
