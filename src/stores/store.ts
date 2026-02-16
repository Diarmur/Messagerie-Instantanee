import type { Channel, User } from '@/types/interface'
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
    channels: null as Channel[] |null,
  }),

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUser(userData: User) {
      this.user = userData
    },

    setChannels(channels: Channel[]){
      this.channels = channels
    },

    clearToken() {
      this.token = null
    },

    clearAuth() {
      this.token = null
      this.user = null
    },

    clearChannels(){
      this.channels = null
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    username: (state) => state.user?.username || null,
    userId: (state) => state.user?.id || null,
  },
})
