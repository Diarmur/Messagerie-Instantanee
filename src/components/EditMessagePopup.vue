<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits(['close','edit'])

export interface FormDataMessage {
  editType: string
  editValue: string
}
const formData = reactive<FormDataMessage>({ editType: '', editValue: '' })

const handleSubmit = () => {
  emit('edit', formData)

  formData.editType = ''
  formData.editValue = ''
}
</script>

<template>
  <div class="bg-blur">
    <div class="popup-container">
      <div class="title-card">
        <span class="title">Edit Message</span>

        <div class="button-container">
          <font-awesome-icon icon="x" class="x-cross" @click.stop="emit('close')" />
        </div>
      </div>
      <div class="form">
        <form @submit.prevent="handleSubmit">
          <p class="form-title">Edit a channel</p>
          <div class="form-field">
            <p>Message type:</p>
            <select v-model="formData.editType" required>
              <option disabled value="">Select Type</option>
              <option value="Text">TEXT</option>
              <option value="Image">IMAGE</option>
            </select>
            <p>Message Value: <input type="text" required v-model="formData.editValue" /></p>
          </div>

          <button type="submit">Edit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-blur {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #00000046;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.popup-container {
  .title-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 10%;
    background-color: var(--color-primary);
    padding: 0 1rem;
  }

  .title-card{
    color: var(--color-accent);
  }
}
</style>
