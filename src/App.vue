<script setup lang="ts">
import { onMounted, inject } from 'vue'
import { useStore } from '@/stores/store'
import type { VueCookies } from 'vue-cookies'

const cookies = inject<VueCookies>('$cookies')
const store = useStore()

onMounted(() => {
  const token = cookies?.get('token')
  const username = cookies?.get('username')

  if (token && username && !store.user) {
    store.setToken(token)
    store.setUser({
      id: 0,
      username: username,
    })
  }

  if (token) {
    store.setToken(token)
  }
})
</script>

<template>
  <router-view />
  <vue3-snackbar bottom right :duration="4000"></vue3-snackbar>
</template>

<style>

</style>
