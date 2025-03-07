<template>
  <div>
    <AppBar />
    <div class="flex flex-col items-center min-h-screen text-white p-8">
      <h2 class="text-2xl font-bold text-center mb-4">Activity Log</h2>
      <div v-if="isLoading" class="text-center">
        <!-- TODO @siddydutta Use a loading component here -->
        <h2 class="text-2xl mb-4 margin-1_5">Loading...</h2>
      </div>
      <div v-else class="w-full md:w-2/3 lg:w-2/3 text-center">
        <!-- Entries per page dropdown -->
        <div class="flex justify-center items-center mt-4 space-x-2 margin-1_5">
          <div class="flex items-center">
        <label for="entries" class="mr-2">Show</label>
        <select
          id="entries"
          v-model="limit"
          @change="fetchActivityLog(`?limit=${limit}`)"
          class="select select-bordered margin-1"
        >
          <option v-for="option in [5, 10, 15]" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span class="ml-2">entries</span>
          </div>
        </div>

        <div class="flex justify-center w-full">
          <div class="overflow-x-auto w-full max-w-4xl">
        <table class="table-auto w-full border border-gray-700">
          <thead>
            <tr class="bg-gray-800 text-gray-300">
          <th class="px-4 py-2 cursor-pointer" @click="toggleSortOrder('timestamp')">
            Date {{ sortOrder === 'asc' ? '▲' : '▼' }}
          </th>
          <th class="px-4 py-2">Activity</th>
          <th class="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
          v-for="activity in activityLog"
          :key="activity.id"
          class="border-b border-gray-700"
            >
          <td class="px-4 py-2">{{ formatDate(activity.timestamp) }}</td>
          <td class="px-4 py-2">
            <span
              :class="getActivityClass(activity.type)"
              class="badge px-4 py-2 text-sm rounded-full"
            >
              {{
            activity.type
              .replace('_', ' ')
              .toLowerCase()
              .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
              }}
            </span>
          </td>
          <td class="px-4 py-2">{{ activity.description }}</td>
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
        @click="fetchActivityLog(prevPage)"
          >
        Previous
          </button>
          <button
        class="btn btn-sm btn-secondary btn-white-bg-black-text"
        :disabled="!nextPage"
        @click="fetchActivityLog(nextPage)"
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
import AppBar from '@/components/AppBar.vue'
import { getActivity } from '@/api/activity'
import { ActivityType, type Activity } from '@/types/Activity'

const isLoading = ref<boolean>(true)
const activityLog = ref<Activity[]>([])
const nextPage = ref<string | null>(null)
const prevPage = ref<string | null>(null)
const limit = ref<number>(10)
const sortOrder = ref<string>('desc')

const fetchActivityLog = async (params: string | null = null) => {
  try {
    isLoading.value = true
    const { next, previous, results } = await getActivity(params)
    activityLog.value = results
    nextPage.value = next
    prevPage.value = previous
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching activity log:', error)
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const getActivityClass = (type: string): string => {
  switch (type) {
    case ActivityType.MESSAGE_CREATED:
      return 'activity-type-message-created'
    case ActivityType.MESSAGE_DELIVERED:
      return 'activity-type-message-delivered'
    case ActivityType.MESSAGE_DELETED:
      return 'activity-type-message-deleted'
    case ActivityType.CHECKED_IN:
      return 'activity-type-checked-in'
    default:
      return 'bg-gray-500 text-white'
  }
}

const toggleSortOrder = (field: string) => {
  if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc'
    field = `-${field}`
  } else {
    sortOrder.value = 'asc'
  }
  fetchActivityLog(`?limit=${limit.value}&ordering=${field}`)
}

onMounted(() => {
  fetchActivityLog()
})
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
