import api from './http'
import { REDIRECT_URI } from '@/constants/config'

export const getLoginRedirect = async () => {
  const response = await api.get('/auth/microsoft/url/', {
    params: {
      redirect_uri: REDIRECT_URI,
    },
  })
  return response.data.auth_url
}

// TODO @siddydutta Add error handling
export const getAuthUser = async (code: string) => {
  const response = await api.post('/auth/microsoft/callback/', {
    code: code,
    redirect_uri: REDIRECT_URI,
  })
  return response.data
}

export const getAccessToken = async (refreshToken: string) => {
  const response = await api.post('/auth/token/refresh/', {
    refresh: refreshToken,
  })
  return response.data.access
}
