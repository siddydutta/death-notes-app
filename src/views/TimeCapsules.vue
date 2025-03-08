<template>
  <div>
    <AppBar />
    <div class="flex flex-col items-center min-h-screen text-white p-8">
      <h2 class="quote text-3xl mb-4 pt-6 margin-2 text-center">Your Time Capsules</h2>
      <div class="w-full max-w-6xl mx-auto">
        <div
          class="flex flex-col md:flex-row mt-4 space-y-2 md:space-y-0 md:space-x-2 justify-center items-center"
        >
          <EntriesPerPageDropdown
            v-model="limit"
            @change="(value) => fetchTimeCapsules(`?limit=${value}`)"
          />
          <SearchBar
            v-model="searchQuery"
            @search="(value) => fetchTimeCapsules(`?search=${value}`)"
            placeholder="Search by Recipient or Subject"
          />
          <ActionButton text="+ Add Time Capsule" additional-classes="m-16" @click="addMessage" />
        </div>

        <div class="flex justify-center w-full mt-4">
          <div v-if="isLoading" class="text-center">
            <LoadingSpinner text="Loading your final words..." />
          </div>
          <div v-else class="flex flex-wrap justify-center w-full max-w-8xl">
            <MessageCard
              v-for="(message, index) in timeCapsules"
              :key="message.id"
              :message="message"
              :index="index"
              @edit="editMessage"
            />
          </div>
        </div>

        <PaginationControls
          :prev-page="prevPage"
          :next-page="nextPage"
          @page-change="fetchTimeCapsules"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import MessageCard from '@/components/MessageCard.vue'
import EntriesPerPageDropdown from '@/components/EntriesPerPageDropdown.vue'
import SearchBar from '@/components/SearchBar.vue'
import ActionButton from '@/components/ActionButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { getMessages } from '@/api/message'
import { type Message, MessageType } from '@/types/Message'
import { useToast } from '@/composables/useToast'

const isLoading = ref<boolean>(true)
const timeCapsules = ref<Message[]>([])
const nextPage = ref<string | undefined>(undefined)
const prevPage = ref<string | undefined>(undefined)
const limit = ref<number>(5)
const searchQuery = ref<string>('')
const router = useRouter()
const { error } = useToast()

const fetchTimeCapsules = async (params: string | null = null) => {
  try {
    isLoading.value = true
    if (!params) {
      params = `?type=${MessageType.TIME_CAPSULE}`
    } else {
      params += `&type=${MessageType.TIME_CAPSULE}`
    }
    const { next, previous, results } = await getMessages(params)
    timeCapsules.value = results
    nextPage.value = next
    prevPage.value = previous
    isLoading.value = false
  } catch (err) {
    console.error('Error fetching time capsules:', err)
    error('Failed to load time capsules. Please try again later.')
  } finally {
    isLoading.value = false
  }
}

const addMessage = () => {
  router.push('/timecapsules/new')
}

const editMessage = (id: string) => {
  router.push(`/timecapsules/${id}`)
}

onMounted(() => {
  fetchTimeCapsules(`?limit=${limit.value}`)
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
