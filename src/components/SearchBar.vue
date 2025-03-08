<template>
  <div class="flex items-center justify-center md:justify-start w-full md:w-1/3 margin-2">
    <span class="mdi mdi-magnify text-2xl pr-2"></span>
    <input
      type="text"
      v-model="searchValue"
      @input="onInput"
      :placeholder="placeholder"
      class="input w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search',
  },
})

const emit = defineEmits(['update:modelValue', 'search'])

const searchValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    searchValue.value = newValue
  },
)

const onInput = () => {
  emit('update:modelValue', searchValue.value)
  emit('search', searchValue.value)
}
</script>
