<template>
  <div v-if="visible" :class="['toast-container', type]">
    <div class="toast-content">
      <div class="toast-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else>i</span>
      </div>
      <div class="toast-message">{{ message }}</div>
    </div>
    <button class="toast-close" @click="close">×</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}>()

const visible = ref(true)
let timer: number | null = null

const close = () => {
  visible.value = false
  if (props.onClose) {
    props.onClose()
  }
}

onMounted(() => {
  if (props.duration !== 0) {
    timer = window.setTimeout(() => {
      close()
    }, props.duration || 3000)
  }
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  min-width: 280px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  animation: slide-in 0.3s ease-out;
  font-family: 'Montserrat', sans-serif;
}

.toast-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 12px;
  font-weight: bold;
}

.toast-message {
  flex: 1;
}

.toast-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0 0 0 16px;
  margin: 0;
  opacity: 0.7;
}

.toast-close:hover {
  opacity: 1;
}

.success {
  background-color: #2d3428;
  border-left: 5px solid #b4f8c8;
  color: #b4f8c8;
}

.success .toast-icon {
  background-color: #087529;
  color: #b4f8c8;
}

.error {
  background-color: #3a2828;
  border-left: 5px solid #ffaebc;
  color: #ffaebc;
}

.error .toast-icon {
  background-color: #85051a;
  color: #ffaebc;
}

.info {
  background-color: #283139;
  border-left: 5px solid #a0e7e5;
  color: #a0e7e5;
}

.info .toast-icon {
  background-color: #005e5a;
  color: #a0e7e5;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
