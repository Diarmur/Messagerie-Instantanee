<script setup lang="ts">
import { onMounted, inject } from 'vue'
import { useStore } from '@/stores/store'
import { router } from '@/router'
import type { VueCookies } from 'vue-cookies'

const cookies = inject<VueCookies>('$cookies')
const store = useStore()
let interval: number | null = null

const refreshToken = async () => {
  if (!store.token) return

  try {
    const response = await fetch('https://edu.tardigrade.land/msg/protected/extend_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.token}`,

      },
      body: JSON.stringify({
        token: store.token,
        admin: false,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      if (data.token) {
        store.setToken(data.token)
        cookies?.set('token', data.token)
        localStorage.setItem('jwt', data.token)
      }
    } else {
  console.error('Failed to refresh token')
  store.clearAuth()
  cookies?.remove('token')
  cookies?.remove('username')
  localStorage.removeItem('jwt')

  if (interval) {
    clearInterval(interval)
    interval = null
  }

  router.push('/login')
}

  } catch (error) {
  console.error('Error refreshing token:', error)

  if (interval) {
    clearInterval(interval)
    interval = null
  }
}
}

onMounted(() => {
  const token = cookies?.get('token')
  const username = cookies?.get('username')

  if (token && username && !store.user) {
    store.setToken(token)
    store.setUser({
      username: username,
    })
  }

 if (token) {
    store.setToken(token)

    if (token && !interval) {
    //rafraichi le token chaque 2h
    interval = window.setInterval(refreshToken, 2 * 60 * 60 * 1000)
  }

  }

})

</script>

<template>
  <UApp>
    <router-view />
    <vue3-snackbar bottom right :duration="4000"></vue3-snackbar>
  </UApp>
</template>

<style></style>
