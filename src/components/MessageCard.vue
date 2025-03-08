<template>
  <div
    :class="[
      cardColorClass,
      'card w-full md:w-1/2 lg:w-1/3 p-4 m-2 border border-gray-700 rounded-lg margin-t-0_5',
    ]"
  >
    <div class="card-body">
      <h3 class="card-title text-xl font-bold">{{ message.subject }}</h3>
      <p class="card-text"><strong>Recipients:</strong> {{ message.recipients }}</p>
      <p class="card-text"><strong>Interval:</strong> {{ message.delay }}</p>
      <p class="card-text"><strong>Status:</strong> {{ message.status }}</p>
      <button
        v-if="message.id"
        class="btn btn-sm btn-white-bg-black-text mt-2"
        @click="handleEditClick"
      >
        ✏️ Edit
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type Message } from '@/types/Message'

interface Props {
  message: Message
  index: number
}

const props = defineProps<Props>()
const emit = defineEmits(['edit'])

const cardColorClass = computed(() => {
  return props.index % 2 === 0 ? 'card-background-light' : 'card-background-dark'
})

const handleEditClick = () => {
  if (props.message.id) {
    emit('edit', props.message.id)
  }
}
</script>
