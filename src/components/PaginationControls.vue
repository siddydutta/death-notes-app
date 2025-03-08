<template>
  <div class="flex justify-center items-center mt-4 space-x-2">
    <button
      class="btn btn-sm btn-white-bg-black-text"
      :disabled="!prevPage"
      @click="$emit('page-change', prevPage)"
    >
      Previous
    </button>
    <button
      class="btn btn-sm btn-white-bg-black-text"
      :disabled="!nextPage"
      @click="$emit('page-change', nextPage)"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  prevPage: {
    type: String,
    default: null,
  },
  nextPage: {
    type: String,
    default: null,
  },
})

defineEmits(['page-change'])
</script>
