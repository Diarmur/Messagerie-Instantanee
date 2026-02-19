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
    cookies.set('username', username.value)
    localStorage.setItem('jwt', data.token)
    store.setToken(data.token)
    store.setUser({
      id: 0,
      username: username.value
    })
    console.log(store.token)
    router.push('/')
  }
})
.catch(error => console.error('Error:', error))

</script>

<template>
  <div class="login-wrapper">
    <form @submit.prevent="login">
      <div class="login-container">
        <h2 class="login-title">Login</h2>
        
        <input type="text" v-model="username" placeholder="Username" class="login-input">
        <input type="password" v-model="password" placeholder="Password" class="login-input">
        <button type="submit" class="login-button">Login</button>
        
      </div>    
    </form>   
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.login-container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-title {
  margin: 0 0 30px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.login-input {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  box-sizing: border-box;
}

.login-input::placeholder {
  color: #999;
}

.login-input:focus {
  outline: none;
  background-color: #eeeeee;
}

.login-button {
  width: 100%;
  padding: 15px;
  background-color: #6b9cfc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #5a8ee8;
}

.register-link {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #6b9cfc;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
