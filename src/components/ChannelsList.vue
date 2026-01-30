<script setup lang="ts">
import { useStore } from '@/stores/store';
import { ref } from 'vue'

const store = useStore();

const channels = ["channel 1","channel 2","channel 3","channel 4"]

const name = ref('');
const img = ref('');
const channel = ref([])

const getChannel = () => fetch("https://edu.tardigrade.land/msg/protected/user/channels",{
  method: "GET",
  headers:{
    "Content-Type": "application/json",
   'Authorization': `Bearer ${store.token}`,
  },
})
.then(response => response.json())
.then(data => {
  channel.value = data
  console.log(data)
  console.log(store.token)
})
.catch(error => console.error('Error:', error))

const createChannel = () => fetch("https://edu.tardigrade.land/msg/protected/channel",{
  method: "POST",
  headers:{
    "Content-Type": "application/json",
   'Authorization': `Bearer ${store.token}`,
  },
  body: JSON.stringify({
          name: name.value,
          img: img.value,
        }),
})
.then(response => response.json())
.then(data  => console.log(data)
  )
.catch(error => console.error('Error:', error))

</script>

<template>
  <div>
    <button @click="getChannel">Charger les channels</button>
    <li v-for="(c, key) of channel" :key="key" >
      {{ c }}
    </li>
  </div>
  
  <div >Liste channels
    <div v-for="(channel, key) of channels" v-bind:key="key" class="channel-card">
        {{ channel }}
    </div>

  </div>

  <div>
    <form @submit.prevent="createChannel">
      <input type="text" v-model="name" placeholder="Name">
      <input type="text" v-model="img" placeholder="Img">
      <button type="submit">Create</button>    
    </form>   
  </div>
</template>

<style scoped>
  .channel-card{
    display: flex;
    min-width: fit-content;
    height: 30px;
    border: 2px green solid;
  }
</style>
