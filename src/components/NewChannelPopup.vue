<script setup lang="ts">
import { reactive } from 'vue';

const emit = defineEmits(['close','create'])

const formData = reactive({
  name: '',
  img: '',
  members:''
})

const handleSubmit = () => {
  console.log(formData)

  emit('create', formData)

  formData.name = ''
  formData.img = ''
}
</script>

<template>
  <div class="blur">
    <div class="popup-container">
      <div class="title-card">
        <span class="title">Create a channel</span>
        <span class="dot" @click.stop="emit('close')"></span>
      </div>
      <div class="create-form">
        <form @submit.prevent="handleSubmit">
          <p>Create a channel</p>
          <p>Channel name: <input type="text" required v-model="formData.name"/></p>
          <p>Channel image: <input type="text" required v-model="formData.img"/></p>

          <p>Channel members: <input type="text" v-model="formData.members"/></p>
          <button type="submit">Add item</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.blur {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #00000046;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-container {
  margin: 30px;
  width: 40rem;
  height: 25rem;
  border: 5px #6b6cb2 solid;
  border-radius: 30px;
  background-color: #a0a9d6;
  overflow: hidden;

  .title-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 10%;
    background-color: #6b6cb2;
    padding: 0 1rem;
  }
}

.dot {
  height: 40px;
  width: 40px;
  min-width: 40px;
  background-color: #7e7b8e;
  border-radius: 50%;
  display: inline-block;
}
</style>
