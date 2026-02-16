<script setup lang="ts">
import { useStore } from '@/stores/store'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const store = useStore()
const route = useRoute()

const channel_id = route.params.channelId
const batch_offset = ref(0)

interface Message {
  channel_id: number
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
  if (!type.value.trim() || !value.value.trim()) {
    error.value = 'Le type et le contenu sont requis'
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `https://edu.tardigrade.land/msg/protected/channel/${channel_id}/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify({
          type: type.value.trim(),
          value: value.value.trim(),
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
  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `https://edu.tardigrade.land/msg/protected/channel/${channel_id}/messages/${batch_offset.value}`,
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

onMounted(() => {
  getMessages()
})
</script>

<template>
  <div class="messages-container">
    <div v-if="messages.length > 0" class="messages-list">
      <div v-for="(message, index) of messages" :key="index" class="message-item">
        <div>
          <strong class="author">{{ message.author }}</strong>
          <span class="message-type">{{ message.content.type }}</span>
        </div>
        <div class="message-content">{{ message.content.value }}</div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>Aucun message dans ce canal</p>
    </div>
  </div>

  <div class="create-message">
    <form @submit.prevent="createMessage" class="message-form">
      <div class="form-group">
        <input
          type="text"
          v-model="type"
          placeholder="Type (text, image)"
          required
          class="form-input"
        />
        <input
          type="text"
          v-model="value"
          placeholder="Contenu du message"
          required
          class="form-input"
        />
        <button type="submit" class="send-btn">Envoyer</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.messages-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 2px solid #6b6cb2;
  border-radius: 15px;
  background-color: #f5f5f7;
  overflow: hidden;
}

.messages-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #6b6cb2;
  color: white;
  gap: 1rem;
}

.nav-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.9rem;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.error-message {
  padding: 1rem;
  background-color: #ffeaea;
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  margin: 1rem;
  text-align: center;
}

.retry-btn {
  background-color: #ff6b6b;
  color: white;
  margin-top: 0.5rem;
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
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #6b6cb2;
}



.author {
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
