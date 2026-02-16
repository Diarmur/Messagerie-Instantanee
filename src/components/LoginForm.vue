<script setup lang="ts">
import { router } from '@/router'
import { useStore } from '@/stores/store'
import { ref, inject } from 'vue'
import type { VueCookies } from 'vue-cookies'

const cookies = inject<VueCookies>('$cookies')
const store = useStore()

const username = ref('')
const password = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)

interface LoginResponse {
  token: string
}

const login = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('https://edu.tardigrade.land/msg/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const data: LoginResponse = await response.json()

    if (cookies && data.token) {
      // Store token and username in cookies
      cookies.set('token', data.token, '3h')
      cookies.set('username', username.value, '3h')

      // Store in Pinia store
      store.setToken(data.token)
      store.setUser({
        id: 0,
        username: username.value,
      })

      // Navigate to messages
      router.push('/messages')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <form @submit.prevent="login">
      <div v-if="error" class="error-message">{{ error }}</div>

      <input
        type="text"
        v-model="username"
        placeholder="Username"
        :disabled="isLoading"
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        :disabled="isLoading"
      />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.error-message {
  color: #d32f2f;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 4px;
}
</style>
