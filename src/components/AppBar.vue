<template>
  <div>
    <div class="navbar app-bar fixed top-0 left-0 right-0">
      <div class="flex-none">
        <button v-if="user" class="btn btn-square btn-ghost hamburger" @click="toggleDrawer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      <div
        :class="[
          'flex-1',
          { 'flex justify-center': isHomePage, 'flex justify-start': !isHomePage },
        ]"
      >
        <h3
          class="normal-case text-xl custom-heading-color title-text margin-0_5"
          style="user-select: none"
          @click="user ? toggleDrawer() : navigateTo('/')"
        >
          Death Notes
        </h3>
      </div>
      <div class="flex-none" v-if="user" @click="toggleUserMenu">
        <div class="username flex items-center space-x-2">
          <span class="text-white">{{ user.first_name }} {{ user.last_name }}</span>
          <button
            class="btn margin-0_5"
            style="background-color: transparent; box-shadow: none; border: none"
          >
            <span class="mdi mdi-account-circle"></span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="user && drawerOpen"
      class="drawer fixed top-16 h-full z-50"
      @click.self="toggleDrawer"
    >
      <ul class="menu p-4 overflow-y-auto w-80 text-base-content nav-drawer" @click.stop>
        <li><a class="custom-heading-color" @click="navigateTo('/dashboard')">Dashboard</a></li>
        <li>
          <a class="custom-heading-color" @click="navigateTo('/finalwords')">Your Final Words</a>
        </li>
        <li>
          <a class="custom-heading-color" @click="navigateTo('/timecapsules')"
            >Your Time Capsules</a
          >
        </li>
        <li>
          <a class="custom-heading-color" @click="navigateTo('/activitylog')">Activity Log</a>
        </li>
        <li>
          <a class="custom-heading-color" @click="navigateTo('/about')">About Us</a>
        </li>
      </ul>
    </div>

    <div
      v-if="user && userMenuOpen"
      class="absolute fixed right-0 mt-16 w-48 bg-base-100 shadow-lg rounded-lg z-50 max-w-full"
    >
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

<script lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useToast } from '@/composables/useToast'

const { success } = useToast()

export default {
  name: 'AppBar',
  data() {
    return {
      drawerOpen: false,
      userMenuOpen: false,
      isHomePage: this.$route.path === '/',
    }
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)

    const navigateTo = (path: string) => {
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
      authStore.logout()
      success('Logged out successfully')
    },
  },
}
</script>

<style scoped>
.custom-heading-color {
  color: var(--color-heading);
}

.custom-heading-color:hover {
  cursor: pointer;
}

.username:hover {
  cursor: pointer;
}

.hamburger:hover {
  background-color: var(--vt-c-black-soft);
}

.mdi {
  color: var(--vt-c-white-soft);
  font-size: medium;
}

.app-bar {
  height: 60px;
  z-index: 1000;
}

.drawer {
  top: 60px;
}

.mt-16 {
  margin-top: 60px;
}
</style>
