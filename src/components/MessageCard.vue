<template>
  <div
    :class="['card w-full p-4 m-2 border border-gray-700 rounded-lg card-margin', cardColorClass]"
  >
    <div class="card-body">
      <h3 class="card-title text-xl font-bold">{{ message.subject }}</h3>
      <p class="card-text">
        <strong>Recipients: </strong>
        {{ message.recipients.split(',')[0] }}
        <span
          class="tooltip"
          :data-tip="
            message.recipients.split(',').length > 1
              ? message.recipients.split(',').slice(1).join(', ')
              : ''
          "
        >
          <u>{{
            message.recipients.split(',').length > 1
              ? ` +${message.recipients.split(',').length - 1}`
              : ''
          }}</u>
        </span>
      </p>
      <p class="card-text">
        <strong>{{
          message.type === MessageType.FINAL_WORD ? 'Interval:' : 'Scheduled At:'
        }}</strong>
        {{
          message.type === MessageType.FINAL_WORD
            ? message.delay
            : formatDate(message.scheduled_at?.toString() || '')
        }}
      </p>
      <p class="card-text"><strong>Status:</strong> {{ message.status }}</p>
      <button
        v-if="message.id"
        class="btn btn-sm btn-white-bg-black-text mt-2"
        @click="handleSelect"
      >
        {{ message.status === MessageStatus.SCHEDULED ? '✏️ Edit' : '👁️ View' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MessageStatus, MessageType, type Message } from '@/types/Message'
import { formatDate } from '@/utils/dateUtils'

interface Props {
  message: Message
  index: number
}

const props = defineProps<Props>()
const emit = defineEmits(['edit'])

const cardColorClass = computed(() => {
  return props.index % 2 === 0 ? 'card-background-light' : 'card-background-dark'
})

const handleSelect = () => {
  if (props.message.id) {
    emit('edit', props.message.id)
  }
}
</script>
