<script setup lang="ts">

import { router } from '@/router';
import { useStore } from '@/stores/store';
import { ref, inject } from 'vue'
import type { VueCookies } from 'vue-cookies'

const cookies = inject<VueCookies>('$cookies');

const store = useStore();

const username = ref('');
const password = ref('');

const login = () => fetch("https://edu.tardigrade.land/msg/login",{
  method: "POST",
  headers:{
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
})
.then(response => response.json())
.then(data => {
  if (cookies && data.token) {
    cookies.set('token', data.token)
    store.setToken(data.token)
    console.log( store.token)
    router.push('/messages')
    
  }
})
.catch(error => console.error('Error:', error))

</script>

<template>
  <div>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="Username">
      <input type="password" v-model="password" placeholder="Password">
      <button type="submit">Login</button>    
    </form>   
  </div>
</template>

<style>
</style>