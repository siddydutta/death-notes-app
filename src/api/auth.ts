import api from './http'

export const getMicrosoftLoginUrl = async () => {
  const response = await api.get('/auth/microsoft/url/')
  return response.data.auth_url
}
