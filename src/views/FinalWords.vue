<template>
  <div>
    <AppBar />
    <div class="flex flex-col items-center min-h-screen text-white p-8">
      <h2 class="quote text-3xl mb-4 pt-6 margin-2 text-center">Your Final Words</h2>
      <div class="w-full max-w-6xl mx-auto">
        <!-- Entries per page dropdown, Search, and Add Message -->
        <div class="flex flex-col md:flex-row mt-4 space-y-2 md:space-y-0 md:space-x-2 justify-center items-center">
          <div class="flex items-center justify-center md:justify-start">
            <label for="entries" class="mr-2 margin-1">Show</label>
            <select id="entries" v-model="limit" @change="fetchFinalWords(`?limit=${limit}`)"
              class="select select-bordered">
              <option v-for="option in [5, 10, 15]" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <span class="ml-2 margin-1">entries</span>
          </div>
          <div class="flex items-center justify-center md:justify-start w-full md:w-1/3 margin-2">
            <span class="mdi mdi-magnify text-2xl pr-2"></span>
            <input type="text" v-model="searchQuery" @input="fetchFinalWords(`?search=${searchQuery}`)"
              placeholder="Search by Recipient or Subject" class="input input-bordered w-full" />
          </div>
            <button class="btn btn-primary btn-white-bg-black-text w-full md:w-auto m-16" @click="addMessage">+ Add Message</button>
        </div>

        <div class="flex justify-center w-full mt-4">
          <div v-if="isLoading" class="text-center">
            <!-- TODO @siddydutta Use a loading component here -->
            <h2 class="text-2xl mb-4">Loading...</h2>
          </div>
          <div v-else class="overflow-x-auto w-full max-w-6xl">
            <table class="table-auto w-full border border-white-800">
              <thead>
                <tr class="table-header">
                  <th class="px-4 py-2 cursor-pointer" @click="toggleSortOrder('recipients')">
                    Recipients {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </th>
                  <th class="px-24 py-2 cursor-pointer w-1/2" @click="toggleSortOrder('subject')">
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
                <tr v-for="message in finalWords" :key="message.id" class="border-b border-gray-700">
                  <td class="px-4 py-2 w-1/3">{{ message.recipients }}</td>
                  <td class="px-4 py-2 w-1/2">{{ message.subject }}</td>
                  <td class="px-4 py-2 w-1/5 text-center">{{ message.delay }}</td>
                  <td class="px-4 py-2 w-1/5">{{ message.status }}</td>
                  <td class="px-4 py-2 w-1/5">
                    <button v-if="message.id" class="btn btn-sm btn-secondary btn-white-bg-black-text" @click="editMessage(message.id)">
                      ✏️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-center items-center mt-4 space-x-2">
          <button class="btn btn-sm btn-secondary btn-white-bg-black-text" :disabled="!prevPage" @click="fetchFinalWords(prevPage)">
            Previous
          </button>
          <button class="btn btn-sm btn-secondary btn-white-bg-black-text" :disabled="!nextPage" @click="fetchFinalWords(nextPage)">
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
