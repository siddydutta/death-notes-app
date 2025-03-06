<template>
  <div>
    <div class="navbar app-bar">
      <div class="flex-none">
        <button v-if="user" class="btn btn-square btn-ghost" @click="toggleDrawer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <div :class="['flex-1', { 'flex justify-center': isHomePage, 'flex justify-start': !isHomePage }]">
        <h3 class="normal-case text-xl custom-heading-color title-text">Death Notes</h3>
      </div>
      <div class="flex-none" v-if="user" @click="toggleUserMenu">
        <div class="flex items-center space-x-2">
          <span class="text-white">{{ user.first_name }} {{ user.last_name }}</span>
          <button class="btn margin-0_5">
            <span class="mdi mdi-account-circle"></span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="user && drawerOpen" class="drawer fixed h-full z-50">
      <ul class="menu p-4 overflow-y-auto w-80 text-base-content nav-drawer">
        <li><a class="custom-heading-color" @click="navigateTo('/dashboard')">Dashboard</a></li>
        <li>
          <a class="custom-heading-color" @click="navigateTo('/finalwords')">Your Final Words</a>
        </li>
        <li>
          <a class="custom-heading-color" @click="navigateTo('/timecapsules')">Your Time Capsules</a>
        </li>
        <li>
          <a class="custom-heading-color" @click="navigateTo('/activitylog')">Activity Log</a>
        </li>
      </ul>
    </div>

    <div v-if="user && userMenuOpen" class="absolute right-0 mt-2 w-48 bg-base-100 shadow-lg rounded-lg z-50 max-w-full">
      <ul class="menu p-4 overflow-y-auto w-full bg-base-100 text-base-content nav-drawer">
      <li>
        <a class="custom-heading-color" @click="navigateTo('/profile')">
          <span class="mdi mdi-cog"></span> Settings
        </a>
      </li>
      <li>
        <a class="custom-heading-color" @click="logout">
          <span class="mdi mdi-logout"></span> Logout
        </a>
      </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
// import './main.css'

export default {
  name: 'AppBar',
  data() {
    return {
      drawerOpen: false,
      userMenuOpen: false,
      isHomePage: this.$route.path === '/'
    }
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

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
      this.drawerOpen = !this.drawerOpen
      this.userMenuOpen = false
    },
    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen
      this.drawerOpen = false
    },
    logout() {
      const authStore = useAuthStore()
      authStore.logout().then(() => {
        router.push('/')
      })
    }
  },
}
</script>

<style scoped>
.custom-heading-color {
  color: var(--color-heading);
}

.custom-heading-color:hover {
  background-color: var(--vt-c-white-soft);
  color: var(--vt-c-black);
  font-weight: bold;
}

.mdi {
  color: var(--vt-c-white-soft);
  font-size: medium;
}
</style>
