import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

// Create a singleton instance for the toasts
const toasts = reactive<Toast[]>([])
let nextId = 1

// Provides toast notification functionality throughout the application
export function useToast() {
  const addToast = (message: string, type: ToastType, duration = 3000) => {
    const id = nextId++
    toasts.push({ id, message, type, duration })

    // Auto remove if duration is not 0
    if (duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: number) => {
    const index = toasts.findIndex((toast) => toast.id === id)
    if (index !== -1) {
      toasts.splice(index, 1)
    }
  }

  // Convenience methods for different toast types
  const success = (message: string, duration?: number) => {
    return addToast(message, 'success', duration)
  }

  const error = (message: string, duration?: number) => {
    return addToast(message, 'error', duration)
  }

  const info = (message: string, duration?: number) => {
    return addToast(message, 'info', duration)
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  }
}
