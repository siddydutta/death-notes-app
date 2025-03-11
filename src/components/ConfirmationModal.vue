<template>
  <div
    v-if="show"
    class="confirmation-modal fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
  >
    <div>
      <h3 class="quote text-3xl mb-4 pt-6 margin-t-4">{{ title }}</h3>
      <h4 class="quote text-3l mb-4 pt-6">{{ message }}</h4>
      <div class="pt-4">
        <button type="button" class="btn btn-white-bg-black-text" @click="cancel">
          {{ cancelText }}
        </button>
        <button type="button" class="btn btn-red-bg-white-text" @click="confirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfirmationModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Confirm Action',
    },
    message: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
  },
  emits: ['confirm', 'cancel'],
  setup(_, { emit }) {
    const confirm = () => {
      emit('confirm')
    }

    const cancel = () => {
      emit('cancel')
    }

    return {
      confirm,
      cancel,
    }
  },
})
</script>
