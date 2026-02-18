<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '@/stores/store'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'vue3-snackbar/styles'
import NewChannelPopup from './NewPopup.vue'
import type {
  Channel,
  NewChannel,
  UpdateChannel,
  ChannelFormData,
  ChannelTheme,
} from '@/types/interface'
import { useSnackbar } from 'vue3-snackbar'
const snackbar = useSnackbar()

const store = useStore()

const channels = ref<Channel[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const container = ref<HTMLElement | null>(null)
const showPopup = ref(false)
const isModification = ref(false)
const selectedChannel = ref<Channel | undefined>(undefined)

onMounted(() => {
  getChannels()
  store.setChannels(channels.value)
})

const getChannels = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch('https://edu.tardigrade.land/msg/protected/user/channels', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data = await response.json()
    channels.value = data
    return channels.value
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

function getIdCard(channel: Channel) {
  store.setSelectedChannel(channel)
  changeColor(channel)
}

const changeColor = (channel: Channel) => {
  const root = document.documentElement
  if (channel.theme) {
    console.log(channel.theme)

    root.style.setProperty('--color-primary', channel.theme?.primary_color)
    root.style.setProperty('--color-primary-dark', channel.theme?.primary_color_dark)
    root.style.setProperty('--color-accent', channel.theme?.accent_color)
    root.style.setProperty('--color-text', channel.theme?.text_color)
  }
}

const createChannel = async (newChannel: NewChannel) => {
  try {
    const response = await fetch('https://edu.tardigrade.land/msg/protected/channel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.token}`,
      },
      body: JSON.stringify({
        name: newChannel.name,
        img: newChannel.img,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create channel')
    }
    const data = await response.json()
    if (newChannel.members) addMembers(newChannel.members, data)
    snackbar.add({
      type: 'success',
      text: 'Channel created',
    })

    return data
  } catch (error) {
    throw error
  }
}

const updateChannel = async (updatedChannel: UpdateChannel) => {
  try {
    const response = await fetch(
      `https://edu.tardigrade.land/msg/protected/channel/${updatedChannel.channelId}/update_metadata`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify({
          name: updatedChannel.name,
          img: updatedChannel.img,
          theme: updatedChannel.theme,
        }),
      },
    )

    if (!response.ok) {
      throw new Error('Failed to update channel')
    }

    const data = await response.json()
    if (updatedChannel.members) addMembers(updatedChannel.members, updatedChannel.channelId)
    snackbar.add({
      type: 'success',
      text: 'Channel updated',
    })
    return data
  } catch (error) {
    throw error
  }
}

const deleteChannel = async () => {
  try {
    if (selectedChannel.value?.id == null) {
      throw new Error('No channel id provided')
    }
    const response = await fetch(
      `https://edu.tardigrade.land/msg/protected/channel/${selectedChannel.value.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error('Failed to delete channel')
    }
    snackbar.add({
      type: 'success',
      text: 'Channel deleted',
    })

    await getChannels()
    showPopup.value = false
    isModification.value = false
    selectedChannel.value = undefined
  } catch (error) {
    console.error('Error deleting channel:', error)
    throw error
  }
}

function switchSize() {
  container.value?.classList.toggle('big')
}

function triggerPopup(modification: boolean, channel?: Channel) {
  showPopup.value = !showPopup.value
  selectedChannel.value = channel
  isModification.value = modification
}

const handleClose = async (formData: ChannelFormData) => {
  console.log(formData);

  const theme = convertColorsToTheme(formData)
  try {
    if (isModification.value && selectedChannel.value) {
      await updateChannel({
        channelId: selectedChannel.value.id,
        name: formData.name,
        img: formData.img,
        members: formData.members,
        theme,
      })
      changeColor({ ...selectedChannel.value, theme })
    } else {
      await createChannel({
        name: formData.name,
        img: formData.img,
        members: formData.members || '',
      })
    }

    await getChannels()

    showPopup.value = false
    isModification.value = false
    selectedChannel.value = undefined
  } catch (err: unknown) {
    console.error('Error handling channel operation:', error)
    error.value = err instanceof Error ? err.message : 'Failed to save channel'
  }
}

const addMembers = async (members: string, channelId: number) => {
  isLoading.value = true
  const membersList = members.split(',')

  try {
    const updatePromises = membersList.map(async (user) => {
      const response = await fetch(
        `https://edu.tardigrade.land/msg/protected/channel/${channelId}/user/${user}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.token}`,
          },
        },
      )
      const data = await response.json()

      if (!response.ok) {
        if (response.status == 400) {
          snackbar.add({
            type: 'error',
            text: `Unknown user "${user}"`,
          })
        } else {
          throw new Error(`Failed to add user ${user}`)
        }
      }

      return { user, success: true, data }
    })
    await Promise.all(updatePromises)

    getChannels()
    return true
  } catch (error) {
    console.error('Error updating items:', error)

    return false
  } finally {
    isLoading.value = false
  }
}

const convertColorsToTheme = (formData: ChannelFormData): ChannelTheme => {
  console.log(formData);

  return {
    primary_color: formData.primary_color,
    primary_color_dark: formData.primary_color_dark,
    accent_color: formData.accent_color,
    text_color: formData.text_color,
    accent_text_color: formData.accent_text_color,
  }
}
</script>

<template>
  <div class="channel-container" ref="container">
    <NewChannelPopup
      v-if="showPopup"
      :modification="isModification"
      :channel="selectedChannel"
      @create="handleClose"
      @close="triggerPopup"
      @delete="deleteChannel"
    />
    <div class="messages-header title-channel">
      <span class="title">List channels</span>
      <font-awesome-icon icon="arrow-right" class="arrow" @click="switchSize" />
    </div>

    <div class="channel-list">
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="getChannels" class="retry-button">Retry</button>
      </div>

      <div v-else-if="channels.length === 0" class="empty-message">
        <p>No channel available</p>
        <button @click="getChannels" class="retry-button">reload</button>
      </div>

      <div
        v-else
        v-for="channel in channels"
        :key="channel.id"
        class="channel-card"
        @click="getIdCard(channel)"
      >
        <div class="channel-content">
          <div class="channel-icon">
            <img
              class="dot"
              :src="channel.img || 'https://placehold.net/building-400x400.png'"
              alt="channel.name"
            />
          </div>

          <div class="channel-info">
            <div class="channel-data">
              <span class="channel-name">
                {{ channel.name }}
              </span>
              <div class="channel-meta">
                <span class="channel-creator">par {{ channel.creator }}</span>
                <span class="user-count"> {{ channel.users.length }} 👤 </span>
              </div>
            </div>
            <div
              class="channel-option"
              v-if="channel.creator == store.username"
              v-on:click="triggerPopup(true, channel)"
            >
              <font-awesome-icon icon="ellipsis-v" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pop-up" v-on:click="triggerPopup(false)"><font-awesome-icon icon="plus" /></div>
  </div>
</template>

<style scoped>
.channel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 25rem;
  height: 90vh;
  border: 3px var(--color-primary) solid;
  border-radius: 15px;
  background-color: var(--color-accent);
  overflow: hidden;
  box-shadow: 10px 15px 4px #00000033;
  transform-origin: left;
  transition: width 1s ease;

  &.big {
    width: 80rem;

    svg.arrow {
      transform: rotate(-180deg);
    }

    .channel-card {
      position: relative;
      width: calc(33.333% - 4px);
      padding: 20px 15px;

      border-radius: 8px;

      .channel-content {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }

      .channel-image {
        width: 60px;
        height: 60px;
      }

      .dot {
        width: 65px;
        height: 65px;
      }

      .channel-info {
        align-items: center;
      }

      .channel-data {
        justify-content: center;
        align-items: center;
      }

      .channel-option {
        position: absolute;
        top: 5px;
        right: 5px;
      }

      .channel-name {
        font-size: 1.1rem;
      }

      .channel-creator {
        font-size: 0.85rem;
      }
    }
  }

  .messages-header {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: var(--color-primary);
    color: white;
    border-bottom: 2px solid var(--color-primary);
  }

  .title-channel {
    justify-content: space-between;

    .title {
      font-size: large;
      font-weight: 700;
    }

    svg.arrow {
      height: 25px;
      min-width: 40px;
      transition: transform 0.5s;
    }
  }

  .channel-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .channel-card {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 2px 0;

    &:hover {
      background-color: var(--color-hover-base) !important;
    }

    .channel-content {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .channel-icon {
      flex-shrink: 0;
    }

    .channel-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ffffff4d;
    }

    .channel-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      min-width: 0;
      flex: 1;
    }

    .channel-data {
      display: flex;
      justify-content: center;
      flex-direction: column;
    }

    .channel-option {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      width: 30px;
      clip-path: circle();

      &:hover {
        background-color: #64667e54;
      }
    }

    .channel-name {
      display: flex;
      font-weight: 600;
      font-size: 0.95rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: wrap;
      max-width: 75%;
    }

    .channel-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .channel-creator {
      font-size: 0.75rem;
      color: #00000080;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-count {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: var(--color-primary-dark);
      color: white;
      font-weight: 600;
      white-space: nowrap;
    }
  }

  .error-message,
  .loading-message,
  .empty-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 2rem 1rem;
    text-align: center;
    gap: 1rem;
  }

  .error-message {
    color: #d32f2f;
  }

  .loading-message {
    color: var(--color-primary-dark);
  }

  .empty-message {
    color: var(--color-primary-dark);
  }

  .retry-button {
    padding: 8px 16px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-primary-dark);
    }

    &:active {
      background-color: #4a4b7a;
    }
  }

  .pop-up {
    position: absolute;
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    bottom: 10px;
    right: 10px;
    background-color: var(--color-primary);
    border-radius: 10px;

    &:hover {
      background-color: var(--color-primary-dark);
    }

    svg {
      height: 80%;
    }
  }
}

.dot {
  height: 40px;
  width: 40px;
  min-width: 40px;
  clip-path: circle();
  display: inline-block;
}
</style>
