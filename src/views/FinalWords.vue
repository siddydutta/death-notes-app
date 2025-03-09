<template>
  <div>
    <AppBar />
    <div class="flex flex-col items-center min-h-screen text-white p-8 overflow-x-hidden">
      <h2 class="quote text-3xl mb-4 pt-6 margin-t-4 text-center">Your Final Words</h2>
      <div class="w-full max-w-6xl mx-auto">
        <div
          class="flex flex-col md:flex-row mt-4 space-y-2 md:space-y-0 md:space-x-2 justify-center items-center"
        >
          <EntriesPerPageDropdown
            v-model="limit"
            @change="(value) => fetchFinalWords(`?limit=${value}`)"
          />
          <SearchBar
            v-model="searchQuery"
            @search="(value) => fetchFinalWords(`?search=${value}`)"
            placeholder="Search by Recipient or Subject"
          />
          <ActionButton text="+ Add Final Words" additional-classes="m-16" @click="addMessage" />
        </div>

        <div class="flex justify-center w-full mt-4">
          <div v-if="isLoading" class="text-center">
            <LoadingSpinner text="Loading your final words..." />
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MessageCard
              v-for="(message, index) in finalWords"
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
          @page-change="fetchFinalWords"
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
const finalWords = ref<Message[]>([])
const nextPage = ref<string | undefined>(undefined)
const prevPage = ref<string | undefined>(undefined)
const limit = ref<number>(5)
const searchQuery = ref<string>('')
const router = useRouter()
const { error } = useToast()

const fetchFinalWords = async (params: string | null = null) => {
  try {
    isLoading.value = true
    if (!params) {
      params = `?type=${MessageType.FINAL_WORD}`
    } else {
      params += `&type=${MessageType.FINAL_WORD}`
    }
    const { next, previous, results } = await getMessages(params)
    finalWords.value = results
    nextPage.value = next
    prevPage.value = previous
  } catch (err) {
    console.error('Error fetching final words:', err)
    error('Failed to load final words. Please try again later.')
  } finally {
    isLoading.value = false
  }
}

const addMessage = () => {
  router.push('/finalwords/new')
}

const editMessage = (id: string) => {
  router.push(`/finalwords/${id}`)
}

onMounted(() => {
  fetchFinalWords(`?limit=${limit.value}`)
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
