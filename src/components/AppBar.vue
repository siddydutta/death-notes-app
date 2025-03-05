<template>
  <div>
    <div class="navbar bg-base-100">
      <div class="flex-none">
        <button class="btn btn-square btn-ghost" @click="toggleDrawer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <div class="flex-1 text-center">
        <a class="normal-case text-xl custom-heading-color">Death Notes</a>
      </div>
      <div class="flex-none" v-if="user">
        <div class="flex items-center space-x-2">
          <span class="text-white">{{ user.first_name }} {{ user.last_name }}</span>
          <button class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A7.5 7.5 0 1117.804 5.121 7.5 7.5 0 015.121 17.804z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12v.01" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v.01" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="drawerOpen" class="drawer fixed h-full z-50">
      <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
        <li><a class="custom-heading-color" @click="navigateTo('/dashboard')">Dashboard</a></li>
        <li><a class="custom-heading-color" @click="navigateTo('/finalwords')">Your Final Words</a></li>
        <li><a class="custom-heading-color" @click="navigateTo('/timecapsules')">Your Time Capsules</a></li>
        <li><a class="custom-heading-color" @click="navigateTo('/activitylog')">Activity Log</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AppBar',
  data() {
    return {
      drawerOpen: false,
    };
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const user = authStore.user

    const navigateTo = (path) => {
      router.push(path)
    }

    return {
      navigateTo,
      user,
    }
  },
  methods: {
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },
  },
};
</script>

<style scoped>
.custom-heading-color {
  color: var(--color-heading);
}
</style>