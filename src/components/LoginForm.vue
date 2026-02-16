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
    localStorage.setItem('jwt', data.token)
    store.setToken(data.token)
    console.log(store.token)
    router.push('/messages')
  }

  
})
.catch(error => console.error('Error:', error))

</script>

<template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h1 class="login-title">Login</h1>
      
      <div class="form-group">
        <input type="text" v-model="username" placeholder="Username" class="form-input" required>
      </div>
      
      <div class="form-group">
        <input type="password" v-model="password" placeholder="Password" class="form-input" required>
      </div>
      
      <button type="submit" class="login-button">Login</button>
    </form>   
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e3e8ef;
  padding: 20px;
}

.login-form {
  background-color: white;
  padding: 40px 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 30px;
  margin-top: 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 15px;
  border: none;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #999;
}

.form-input:focus {
  outline: none;
  background-color: #ebebeb;
}

.login-button {
  width: 100%;
  padding: 15px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: normal;
  cursor: pointer;
  margin-top: 10px;
}

.login-button:hover {
  background-color: #357ae8;
}

.login-button:active {
  background-color: #2c5dd6;
}
</style>