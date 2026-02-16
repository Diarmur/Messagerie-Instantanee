import { defineStore,  } from 'pinia'
import type { Channel } from '@/components/ChannelsList.vue'

export const useStore = defineStore('main', {
  state: () => ({
    token: null as string | null,
    selectedChannel: null as Channel | null,
  }),

  actions: {
    setToken(token: string) {
      this.token = token
    },

    clearToken() {
      this.token = null
    },

    setSelectedChannel(channel: Channel) {
      this.selectedChannel = channel
    },

    clearSelectedChannel() {
      this.selectedChannel = null
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})
