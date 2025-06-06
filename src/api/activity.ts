import api from './http'
import type { Activity } from '@/types/Activity'

export const checkIn = async (): Promise<boolean> => {
  await api.post('/web/checkin/')
  return true
}

export const getActivity = async (
  params: string | null,
): Promise<{
  count: number
  next: string
  previous: string
  results: Activity[]
}> => {
  const endpoint = params ? `/web/activity/${params}` : '/web/activity/'
  const response = await api.get(endpoint)
  return response.data as {
    count: number
    next: string
    previous: string
    results: Activity[]
  }
}
