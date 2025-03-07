import api from './http'
import type { Message } from '@/types/Message'

export const getMessages = async (
  params: string | null,
): Promise<{
  count: number
  next: string | null
  previous: string | null
  results: Message[]
}> => {
  const endpoint = params ? `/web/messages/${params}` : '/web/messages/'
  const response = await api.get(endpoint)
  return response.data as {
    count: number
    next: string | null
    previous: string | null
    results: Message[]
  }
}
