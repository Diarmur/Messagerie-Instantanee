<script setup lang="ts">
import ChannelsList from '../ChannelsList.vue'
</script>

<template>
  <div class="container">
    <ChannelsList />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
