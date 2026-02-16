<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '@/stores/store'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import NewChannelPopup from './NewChannelPopup.vue'

interface ChannelTheme {
  primary_color: string
  primary_color_dark: string
  accent_color: string
  accent_text_color: string
}

interface Channel {
  id: number
  name: string
  image: string | null
  creator: string
  theme: ChannelTheme | null
  users: string[]
}

interface NewChannel {
  name: string
  img: string
  members: string
}

const store = useStore()
const router = useRouter()

const channels = ref<Channel[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const container = ref<HTMLElement | null>(null)
const showPopup = ref(false)

const getChannel = async () => {
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
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

const createChannel = (newChannel: NewChannel) =>
  fetch('https://edu.tardigrade.land/msg/protected/channel', {
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
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error))

// const inviteMember = (newChannel: NewChannel) =>
//   fetch('https://edu.tardigrade.land/msg/protected/channel', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${store.token}`,
//     },
//     body: JSON.stringify({
//       name: newChannel.name,
//       img: newChannel.img,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((error) => console.error('Error:', error))

function getIdCard(channel: Channel) {
  console.log('ID du channel:', channel.id)
  console.log('Créateur:', channel.creator)
  router.push(`/messages/${channel.id}`)
}

function switchSize() {
  container.value?.classList.toggle('big')
}

function popupCreate() {
  showPopup.value = !showPopup.value
}

const handleClose = (formData: NewChannel) => {
  console.log('Received data:', formData)
  createChannel(formData)
  // if (formData.members) {
  //   const members = formData.members.split(',')
  // }
  getChannel()
  showPopup.value = false
}

onMounted(() => {
  getChannel()
})
</script>

<template>
  <div class="channel-container" ref="container">
    <NewChannelPopup v-if="showPopup" @create="handleClose" @close="popupCreate" />
    <div class="title-card">
      <span class="title">List channels</span>
      <font-awesome-icon icon="arrow-right" class="arrow" @click="switchSize" />
    </div>

    <div class="channel-list">
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="getChannel" class="retry-button">Retry</button>
      </div>

      <div v-else-if="channels.length === 0" class="empty-message">
        <p>No channel available</p>
        <button @click="getChannel" class="retry-button">reload</button>
      </div>

      <div
        v-else
        v-for="channel in channels"
        :key="channel.id"
        class="channel-card"
        :style="{
          backgroundColor: channel.theme?.primary_color
            ? `${channel.theme.primary_color}15`
            : undefined,
        }"
        @click="getIdCard(channel)"
      >
        <div class="channel-content">
          <div class="channel-icon">
            <img
              v-if="channel.image"
              :src="channel.image"
              :alt="channel.name"
              class="channel-image"
            />
            <span
              v-else
              class="dot"
              :style="{
                backgroundColor: channel.theme?.accent_color || '#7e7b8e',
              }"
            ></span>
          </div>

          <div class="channel-info">
            <span
              class="channel-name"
              :style="{
                color: channel.theme?.primary_color_dark || undefined,
              }"
            >
              {{ channel.name }}
            </span>
            <div class="channel-meta">
              <span class="channel-creator">par {{ channel.creator }}</span>
              <span
                class="user-count"
                :style="{
                  backgroundColor: channel.theme?.accent_color || '#486094',
                  color: channel.theme?.accent_text_color || 'white',
                }"
              >
                {{ channel.users.length }} 👤
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pop-up" v-on:click="popupCreate"><font-awesome-icon icon="plus" /></div>
  </div>
</template>

<style scoped>
.channel-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 16.25rem;
  height: 45rem;
  border: 5px #6b6cb2 solid;
  border-radius: 30px;
  background-color: #a0a9d6;
  overflow: hidden;
  box-shadow: 20px 30px 4px rgba(0, 0, 0, 0.2);
  transform-origin: left;
  transition: width 1s ease;

  &.big {
    width: 52rem;

    .channel-card {
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
        width: 50px;
        height: 50px;
      }

      .channel-info {
        align-items: center;
      }

      .channel-name {
        font-size: 1.1rem;
      }

      .channel-creator {
        font-size: 0.85rem;
      }
    }
  }

  .title-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 8%;
    background-color: #6b6cb2;
    padding: 0 1rem;

    .title {
      font-size: large;
      font-weight: 700;
    }

    .dot {
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.1);
        background-color: #908fa3;
      }
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
      background-color: rgba(34, 51, 87, 0.12) !important;
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
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .channel-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      flex: 1;
    }

    .channel-name {
      font-weight: 600;
      font-size: 0.95rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .channel-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .channel-creator {
      font-size: 0.75rem;
      color: rgba(0, 0, 0, 0.5);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-count {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: #486094;
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
    color: #486094;
  }

  .empty-message {
    color: #486094;
  }

  .retry-button {
    padding: 8px 16px;
    background-color: #6b6cb2;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #5a5b9a;
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
    z-index: 2;
    width: 50px;
    height: 50px;
    bottom: 10px;
    right: 10px;
    background-color: #6b6cb2;
    border-radius: 10px;

    &:hover {
      background-color: #5d5f9a;
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
  background-color: #7e7b8e;
  border-radius: 50%;
  display: inline-block;
}

svg.arrow {
  height: 25px;
  min-width: 40px;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #486094;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #354669;
}
</style>
