<template>
  <div class="flex items-center justify-center md:justify-start">
    <label :for="id" class="mr-2 margin-1">Show</label>
    <select :id="id" v-model="selectedValue" @change="handleChange" class="select select-bordered">
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <span class="ml-2 margin-1">entries</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  options: {
    type: Array as () => number[],
    default: () => [5, 10, 15],
  },
  modelValue: {
    type: Number,
    default: 5,
  },
  id: {
    type: String,
    default: 'entries',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectedValue = ref<number>(props.modelValue)

const handleChange = () => {
  emit('update:modelValue', selectedValue.value)
  emit('change', selectedValue.value)
}

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue
  },
)

onMounted(() => {
  // Ensure the component initializes with the default value
  if (selectedValue.value !== props.modelValue) {
    selectedValue.value = props.modelValue
    emit('update:modelValue', selectedValue.value)
  }
})
</script>
