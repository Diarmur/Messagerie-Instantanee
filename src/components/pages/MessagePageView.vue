<script setup lang="ts">
import ChannelsList from '../ChannelsList.vue'
import MembersList from '../MembersList.vue';
import MessageList from '../MessageList.vue'

</script>

<template>
  <div class="container">
    <ChannelsList />
    <MessageList />
    <MembersList />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100vh;
  width: 100%;
  gap: 1rem;
}
</style>
