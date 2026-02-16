<script setup lang="ts">

import { useStore } from '@/stores/store'
import { ref } from 'vue'

const store = useStore()

interface Messages {
  channel_id : number,
  author : string,
  content : {
    type : string,
    value : string
  }
}
 

const type = ref('')
const value = ref('')
const messages = ref([])


const createMessage = () => fetch(`https://edu.tardigrade.land/msg/protected/channel/${channel_id}/message`,{
  method: "POST",
  headers:{
    "Content-Type": "application/json",
   'Authorization': `Bearer ${store.getToken()}`,
  },
  body: JSON.stringify({
          type: type.value,
          value: value.value,
        }),
})
.then(response => response.json())
.then(data  => {
    messages.value = data
    console.log(data)
}
  )
.catch(error => console.error('Error:', error))


const getMessages = () => fetch(`https://edu.tardigrade.land/msg/protected/channel/${channel_id}/message/${batch_offset}`,{
  method: "GET",
  headers:{
    "Content-Type": "application/json",
   'Authorization': `Bearer ${store.getToken()}`,
  },
})
.then(response => response.json())
.then(data => {
  messages.value = data
  console.log(data)
  console.log(store.token)
})
.catch(error => console.error('Error:', error))

</script>

<template>

    <div>
    <button @click="getMessages">Charger les messages</button>
    <li v-for="(m, index) of messages" :key="index" >
      {{ m }}
    </li>
  </div>
 <div>
    <form @submit.prevent="createMessage">
      <input type="text" v-model="type" placeholder="Type">
      <input type="text" v-model="value" placeholder="Value">
      <button type="submit">Create</button>    
    </form>   
  </div>
</template>

<style scoped>



</style>