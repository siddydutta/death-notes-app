import type { User } from '@/types/User'
import type { HomeStats } from '@/types/HomeStats'
import api from './http'

export const getUser = async (): Promise<User> => {
  const response = await api.get('/web/user/')
  return response.data as User
}

export const getUserHome = async (): Promise<HomeStats> => {
  const response = await api.get('/web/home/')
  return response.data as HomeStats
}

export const updateUser = async (data: User): Promise<User> => {
  const response = await api.patch('/web/user/', data)
  return response.data as User
}
