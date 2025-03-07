import api from './http'
import type { Message } from '@/types/Message'

export const getMessage = async (id: string): Promise<Message> => {
  const response = await api.get(`/web/messages/${id}/`)
  return response.data as Message
}

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

export const postMessage = async (message: Message): Promise<Message> => {
  const response = await api.post('/web/messages/', message)
  return response.data as Message
}

export const patchMessage = async (message: Message): Promise<Message> => {
  const response = await api.patch(`/web/messages/${message.id}/`, message)
  return response.data as Message
}
