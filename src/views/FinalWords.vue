<template>
  <div>
    <AppBar />
    <div class="flex flex-col items-center min-h-screen text-white p-8">
      <h2 class="text-2xl font-bold text-center mb-4">Your Final Words</h2>
      <div class="w-full md:w-2/3 lg:w-2/3 text-center">
        <!-- Entries per page dropdown -->
        <div class="flex items-center justify-between mb-4 w-full max-w-4xl margin-1_5">
          <div class="flex items-center">
            <label for="entries" class="mr-2">Show</label>
            <select
              id="entries"
              v-model="limit"
              @change="fetchFinalWords(`?limit=${limit}`)"
              class="select select-bordered margin-1"
            >
              <option v-for="option in [5, 10, 15]" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <span class="ml-2">entries</span>
          </div>
          <div class="flex items-center">
            <input
              type="text"
              v-model="searchQuery"
              @input="fetchFinalWords(`?search=${searchQuery}`)"
              placeholder="Search by Recipient or Subject"
              class="input input-bordered margin-1"
            />
          </div>
          <button class="btn btn-primary" @click="addMessage">+ Add Message</button>
        </div>

        <div>
          <div v-if="isLoading" class="text-center">
            <!-- TODO @siddydutta Use a loading component here -->
            <h2 class="text-2xl mb-4 margin-1_5">Loading...</h2>
          </div>
          <div v-else class="overflow-x-auto w-full max-w-4xl">
            <table class="table-auto w-full border border-gray-700">
              <thead>
                <tr class="bg-gray-800 text-gray-300">
                  <th class="px-4 py-2 cursor-pointer" @click="toggleSortOrder('recipients')">
                    Recipients {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </th>
                  <th class="px-4 py-2 cursor-pointer" @click="toggleSortOrder('subject')">
                    Subject {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </th>
                  <th class="px-4 py-2 cursor-pointer" @click="toggleSortOrder('interval')">
                    Interval {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </th>
                  <th class="px-4 py-2 cursor-pointer" @click="toggleSortOrder('status')">
                    Status {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </th>
                  <th class="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="message in finalWords"
                  :key="message.id"
                  class="border-b border-gray-700"
                >
                  <td class="px-4 py-2">{{ message.recipients }}</td>
                  <td class="px-4 py-2">{{ message.subject }}</td>
                  <td class="px-4 py-2">{{ message.delay }}</td>
                  <td class="px-4 py-2">{{ message.status }}</td>
                  <td class="px-4 py-2">
                    <button class="btn btn-sm btn-secondary" @click="editMessage(message.id)">
                      ✏️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-center items-center mt-4 space-x-2 margin-1_5">
          <button
            class="btn btn-sm btn-secondary btn-white-bg-black-text"
            :disabled="!prevPage"
            @click="fetchFinalWords(prevPage)"
          >
            Previous
          </button>
          <button
            class="btn btn-sm btn-secondary btn-white-bg-black-text"
            :disabled="!nextPage"
            @click="fetchFinalWords(nextPage)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppBar from '@/components/AppBar.vue'
import { getMessages } from '@/api/message'
import { type Message, MessageType } from '@/types/Message'

const isLoading = ref<boolean>(true)
const finalWords = ref<Message[]>([])
const nextPage = ref<string | null>(null)
const prevPage = ref<string | null>(null)
const limit = ref<number>(10)
const sortOrder = ref<string>('desc')
const searchQuery = ref<string>('')
const router = useRouter()

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
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching final words:', error)
  }
}

const toggleSortOrder = (field: string) => {
  if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc'
    field = `-${field}`
  } else {
    sortOrder.value = 'asc'
  }
  fetchFinalWords(`?limit=${limit.value}&ordering=${field}`)
}

const addMessage = () => {
  router.push('/finalwords/new')
}

const editMessage = (id: string) => {
  router.push(`/finalwords/${id}`)
}

onMounted(() => {
  fetchFinalWords()
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
