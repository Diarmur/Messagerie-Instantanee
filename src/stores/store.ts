import { defineStore } from 'pinia'
import {  ref } from 'vue'

export const useStore = defineStore('store', () => {

const token = ref('')

const setToken = (newToken: string) => {
  token.value = newToken
}

const clearToken = () => {
  token.value = ''
}

  return { token, setToken, clearToken }
})