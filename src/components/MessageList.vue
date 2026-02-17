<script setup lang="ts">
import { useStore } from '@/stores/store'
import { ref, onMounted, watch, computed } from 'vue'
import EditMessagePopup from './EditMessagePopup.vue'
import type { FormDataMessage } from './EditMessagePopup.vue'

const store = useStore()
const selectedMessage = ref<Message | undefined>(undefined)
const channel_id = computed(() => store.selectedChannel?.id)
const selectedChannel = computed(() => store.selectedChannel)
const batch_offset = ref(0)

const showPopup = ref(false)

interface Message {
  channel_id: number
  timestamp: number
  author: string
  content: {
    type: string
    value: string
  }
}

const type = ref('')
const value = ref('')
const messages = ref<Message[]>([])


const loading = ref(false)
const error = ref<string | null>(null)

const createMessage = async () => {
  if (!channel_id.value) {
    error.value = 'Veuillez sélectionner un channel'
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `https://edu.tardigrade.land/msg/protected/channel/${channel_id.value}/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify({
          type: type.value,
          value: value.value,
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data = await response.json()
    console.log('Message créé:', data)

    type.value = ''
    value.value = ''
    await getMessages()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors de la création du message'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}


const getMessages = async () => {
  if (!channel_id.value) {
    messages.value = []
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `https://edu.tardigrade.land/msg/protected/channel/${channel_id.value}/messages/${batch_offset.value}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data = await response.json()
    messages.value = data
    console.log('Messages chargés:', data)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des messages'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

const updateMessage = async (formData: FormDataMessage) => {
 try {
  console.log(formData)
    const response = await fetch(
      `https://edu.tardigrade.land/msg/protected/channel/${channel_id.value}/message/moderate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.token}`,
        },
        body: JSON.stringify({
          channel_id: channel_id.value,
          timestamp: selectedMessage.value?.timestamp,
          author: selectedMessage.value?.author,
          content: {
            type: formData.editType,
            value: formData.editValue,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const data = await response.json()
    console.log('Message modifié:', data)

    await getMessages()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors de la modification du message'
    console.error('Error:', err)
  }
}

function popupEdit(message : Message) {
  showPopup.value = !showPopup.value
  selectedMessage.value = message


}

const handleClose = (formData: FormDataMessage) => {
  console.log('Received data:', formData)
  updateMessage(formData)
  
  getMessages()
  showPopup.value = false
}

watch(channel_id, (newChannelId) => {
  if (newChannelId) {
    getMessages()
  }
})

onMounted(() => {
  if (channel_id.value) {
    getMessages()
  }
})
</script>

<template>
  <EditMessagePopup v-if="showPopup" @create="handleClose" @close="popupEdit" />
  <div class="messages-container">
    <div v-if="selectedChannel" class="messages-header">
      <div class="channel-info">
        <h2 class="channel-name">{{ selectedChannel.name }}</h2>
        <span class="channel-creator">par {{ selectedChannel.creator }}</span>
      </div>
    </div>
    
    <div v-if="!selectedChannel" class="no-channel-selected">
      <span>Sélectionnez un channel pour voir les messages</span>
    </div>
    <div v-if="loading" class="loading">
      <p>Chargement...</p>
    </div>
    <div v-else-if="messages.length > 0" class="messages-list">
      <div v-for="(message, index) of messages" :key="index" class="message-item">
        <div class="message-header">
          <strong class="author">{{ message.author }}</strong>
          <span class="message-type">{{ message.content.type }}</span>
          <div v-show="selectedChannel?.creator === store.username" class="pop-up" v-on:click="popupEdit(message)"><font-awesome-icon icon="pen" class="pen"/>></div>
        </div>
        <div class="message-content">
          <div v-if="message.content.type === 'Image'">
            <img :src="message.content.value" alt="Image" class="message-image">
          </div>
          <div v-else>
            {{ message.content.value }}
          </div>             

        </div>
      </div>
    </div>

    <div v-else-if="selectedChannel" class="empty-state">
      <p>Aucun message dans ce channel</p>
    </div>
    
    <div v-if="selectedChannel" class="create-message">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <form @submit.prevent="createMessage" class="message-form">
        <div class="form-group">
          <select v-model="type" required>
            <option disabled value="">Select Type</option>
            <option value="Text">TEXT</option>
            <option value="Image">IMAGE</option>           
          </select>
          <p> {{ type }}</p>
                  
          <input
            type="text"
            v-model="value"
            placeholder="Contenu du message"
            required
            class="form-input message-input"
          />
          <button type="submit" class="send-btn">Envoyer</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.messages-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  border: 2px solid #6b6cb2;
  border-radius: 15px;
  background-color: #f5f5f7;
  overflow: hidden;
}

.pen{
  color: black;
}
.messages-header {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #6b6cb2;
  color: white;
  border-bottom: 2px solid #5a5ba9;
}

.channel-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.channel-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}

.channel-creator {
  font-size: 0.85rem;
  opacity: 0.8;
}

.no-channel-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7e7b8e;
  font-size: 1.1rem;
  gap: 0.5rem;
}

.no-channel-selected p {
  font-weight: bold;
  font-size: 1.2rem;
}

.no-channel-selected span {
  font-size: 0.9rem;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  gap: 0.8rem;
  display: flex;
  flex-direction: column;
}

.message-item {
  background: white;
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.author {
  color: #6b6cb2;
  font-weight: 600;
}

.message-type {
  background-color: #e8e8f7;
  color: #5a5ba9;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.message-content {
  color: #333;
  line-height: 1.4;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7e7b8e;
  font-size: 1.1rem;
}

.create-message {
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e0e0e0;
}

.error-message {
  padding: 0.5rem;
  background-color: #ffeaea;
  border: 1px solid #ff6b6b;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  text-align: center;
  font-size: 0.85rem;
  color: #d63031;
}

.message-form {
  width: 100%;
}

.form-group {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.form-input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #6b6cb2;
}

.type-input {
  flex: 0 0 120px;
}

.message-input {
  flex: 1;
}

.send-btn {
  background-color: #6b6cb2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.send-btn:hover:not(:disabled) {
  background-color: #5a5ba9;
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message-item {
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #6b6cb2;
}



.author, p {
  color: #333;
  font-size: 0.95rem;
}

.message-type {
  background-color: #6b6cb2;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.message-content {
  color: #555;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  margin: 0.5rem 0;
  object-fit: contain;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.create-message {
  border-top: 1px solid #ddd;
  background-color: white;
  padding: 1rem;
}

.message-form {
  width: 100%;
}

.form-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.form-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}

.form-input:focus {
  outline: none;
  border-color: #6b6cb2;
  box-shadow: 0 0 0 2px rgba(107, 108, 178, 0.2);
}

.send-btn {
  padding: 10px 20px;
  background-color: #6b6cb2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.send-btn:hover {
  background-color: #5a5b9a;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
