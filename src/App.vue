<script setup lang="ts">
import { onMounted, inject } from 'vue'
import { useStore } from '@/stores/store'
import type { VueCookies } from 'vue-cookies'

const cookies = inject<VueCookies>('$cookies')
const store = useStore()

onMounted(() => {
  const token = cookies?.get('token')
  if (token) {
    store.setToken(token)
    console.log('Token loaded from cookie:', token)
  } else {
    console.log('No token found in cookies')
  }
})
</script>

<template>
  <router-view />

</template>

<style scoped>

</style>
