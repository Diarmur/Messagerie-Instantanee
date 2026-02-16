import { defineStore } from 'pinia'

interface Channel {
  id: number
  name: string
  image: string | null
  creator: string
  theme: {
    primary_color: string
    primary_color_dark: string
    accent_color: string
    accent_text_color: string
  } | null
  users: string[]
}

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
