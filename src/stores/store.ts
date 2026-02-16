import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('store', () => {
  const token = ref('')

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('jwt', newToken)
  }

  const getToken = () => {
    const savedToken = localStorage.getItem('jwt')
    if (savedToken) {
      token.value = savedToken
    }
    return token.value
  }

  const clearToken = () => {
    token.value = ''
    localStorage.removeItem('jwt')
  }

  return { token, setToken, clearToken, getToken }
})