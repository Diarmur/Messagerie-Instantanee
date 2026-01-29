<script setup lang="ts">

const channels = ["channel 1","channel 2","channel 3","channel 4"]

</script>

<template>
  <div >Liste channels
    <div v-for="(channel, key) of channels" v-bind:key="key" class="channel-card">
        {{ channel }}
    </div>

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
