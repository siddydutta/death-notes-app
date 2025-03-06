<template>
  <div>
    <AppBar />
    <div
      class="home-container flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white"
    >
      <h2 class="text-2xl font-bold text-center mb-4">Activity Log</h2>
      <div v-if="isLoading" class="text-center">
        <!-- TODO @siddydutta Use a loading component here -->
        <h2 class="text-2xl font-bold mb-4">Loading...</h2>
      </div>
      <div v-else>
        <!-- Entries per page dropdown -->
        <div class="flex items-center justify-end mb-4">
          <label for="entries" class="mr-2">Show</label>
          <select
            id="entries"
            v-model="limit"
            @change="fetchActivityLog(`?limit=${limit}`)"
            class="select select-bordered"
          >
            <option v-for="option in [5, 10, 15]" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <span class="ml-2">entries</span>
        </div>

        <div class="overflow-x-auto">
          <table class="table-auto w-full border border-gray-700">
            <thead>
              <tr class="bg-gray-800 text-gray-300">
                <th class="px-4 py-2">Date</th>
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
                    class="badge px-3 py-1 text-sm rounded-full"
                  >
                    {{ activity.type }}
                  </span>
                </td>
                <td class="px-4 py-2">{{ activity.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <!-- TODO @siddydutta Use a pagination component here -->
        <div class="flex justify-center items-center mt-4 space-x-2">
          <button
            class="btn btn-sm btn-secondary"
            :disabled="!prevPage"
            @click="fetchActivityLog(prevPage)"
          >
            Previous
          </button>
          <button
            class="btn btn-sm btn-secondary"
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
      return 'bg-blue-500 text-white'
    case ActivityType.MESSAGE_DELIVERED:
      return 'bg-yellow-500 text-black'
    case ActivityType.MESSAGE_DELETED:
      return 'bg-green-500 text-white'
    case ActivityType.CHECKED_IN:
      return 'bg-purple-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
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
