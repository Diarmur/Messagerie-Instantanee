import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    token: null as string | null,
  }),

  actions: {
    setToken(token: string) {
      this.token = token
    },

    clearToken() {
      this.token = null
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})
