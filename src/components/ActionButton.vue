<template>
  <button
    class="btn btn-white-bg-black-text w-full md:w-auto"
    :class="additionalClasses"
    @click="$emit('click')"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: '',
  },
  additionalClasses: {
    type: String,
    default: '',
  },
})

defineEmits(['click'])
</script>
