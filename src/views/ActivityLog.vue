<template>
  <div>
    <AppBar />
    <div class="flex flex-col items-center min-h-screen text-white p-8">
      <h2 class="text-2xl font-bold text-center mb-4">Activity Log</h2>
      <div v-if="isLoading" class="text-center">
        <!-- TODO @siddydutta Use a loading component here -->
        <h2 class="text-2xl mb-4 margin-1_5">Loading...</h2>
      </div>
      <div v-else class="w-full max-w-6xl mx-auto">
        <!-- Entries per page dropdown -->
        <div
          class="flex flex-col md:flex-row mt-4 space-y-2 md:space-y-0 md:space-x-2 justify-center items-center"
        >
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

        <div class="flex justify-center w-full mt-4">
          <div class="overflow-x-auto w-full max-w-6xl">
            <table class="table-auto w-full table-border">
              <thead>
                <tr class="table-header">
                  <th class="px-4 py-2 cursor-pointer w-1/4" @click="toggleSortOrder('timestamp')">
                    Date {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </th>
                  <th class="px-4 py-2 w-1/4">Activity</th>
                  <th class="px-4 py-2 w-3/4">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(activity, index) in activityLog"
                  :key="activity.id"
                  :class="index % 2 === 0 ? 'tr-background-light' : 'tr-background-dark'"
                  class="tr-border"
                >
                  <td class="px-4 py-2 text-center">{{ formatDate(activity.timestamp) }}</td>
                  <td class="px-4 py-2 text-center">
                    <span
                      :class="[
                        getActivityClass(activity.type),
                        index % 2 === 0 ? 'badge-shadow-light-bg' : 'badge-shadow-dark-bg',
                      ]"
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
                  <td class="px-4 py-2 text-center">{{ activity.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <PaginationControls
          :prev-page="prevPage"
          :next-page="nextPage"
          @page-change="fetchActivityLog"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppBar from '@/components/AppBar.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import { getActivity } from '@/api/activity'
import { ActivityType, type Activity } from '@/types/Activity'
import { formatDate } from '@/utils/dateUtils'

const isLoading = ref<boolean>(true)
const activityLog = ref<Activity[]>([])
const nextPage = ref<string | undefined>(undefined)
const prevPage = ref<string | undefined>(undefined)
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
.badge-shadow-light-bg {
  box-shadow: 0 2px 2px #3d3d3d;
}
.badge-shadow-dark-bg {
  box-shadow: 0 4px 6px #2f2f2f;
}
</style>
