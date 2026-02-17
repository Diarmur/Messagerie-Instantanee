<script setup lang="ts">
import { reactive } from 'vue';

const emit = defineEmits(['close','create'])

export interface FormDataMessage {
    editType : string,
    editValue : string
}
const formData = reactive<FormDataMessage>({editType : '', editValue : ''})

const handleSubmit = () => {
  console.log(formData)

  emit('create', formData)

  formData.editType = ''
  formData.editValue = ''
}
</script>

<template>
  <div class="blur">
    <div class="popup-container">
      <div class="title-card">
        <span class="title">Edit Message</span>
        <span class="dot" @click.stop="emit('close')"></span>
      </div>
      <div class="create-form">
        <form @submit.prevent="handleSubmit">
          <p>Edit a channel</p>
          <p>Message type: </p>
          <select v-model="formData.editType" required>
            <option disabled value="">Select Type</option>
            <option value="Text">TEXT</option>
            <option value="Image">IMAGE</option>           
          </select>          
          <p>Message Value: <input type="text" required v-model="formData.editValue"/></p>

          <button type="submit">Edit</button>
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
