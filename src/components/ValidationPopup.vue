<script setup lang="ts">
import type { Channel } from '@/types/interface'

const emit = defineEmits(['close', 'delete'])

const props = defineProps<{
  channel?: Channel
}>()
</script>

<template>
  <div class="bg-blur">
    <div class="popup-container">
      <div class="title-card">
        <span class="title">Confirm deletion</span>
      </div>
      <div class="confirmation-container">
        <div class="text">
          Do you want to delete channel {{ props.channel?.name || 'placeholder' }} ?
        </div>

        <div class="buttons">
          <button class="delete-button" type="submit" @click="emit('delete')">Delete</button>
          <button class="cancel-button" type="submit" @click="emit('close')">Cancel</button>
        </div>
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
  z-index: 6;
}

.popup-container {
  position: relative;
  margin: 30px;
  width: 45rem;
  height: 10rem;
  border: 5px var(--color-primary-dark) solid;
  border-radius: 30px;
  background-color: var(--color-accent);
  overflow: hidden;

  .title-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20%;
    background-color: var(--color-primary-dark);
    padding: 0 1rem;
  }
}

.confirmation-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  height: 80%;

  .text {
    display: flex;
    justify-content: flex-start;
    width: 90%;
  }
}

.buttons {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 10px;

  .delete-button {
    background-color: var(--color-deletion);
    border-radius: 8px;
    color: white;
    border: none;
    height: 30px;
    width: 60px;
  }

  .cancel-button {
    background-color: var(--color-primary-dark);
    border-radius: 8px;
    color: white;
    border: none;
    height: 30px;
    width: 60px;
  }
}
</style>
