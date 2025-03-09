<template>
  <button
    class="main-container btn btn-white-bg-black-text w-full md:w-auto"
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

<style scoped>
@media (max-width: 640px) {
  .main-container {
    margin-bottom: 2rem;
  }
}
</style>
