<script setup lang="ts">
import { ref } from 'vue'

interface Channels {
  channel_id: number
  name: string
}

const channels: Channels[] = []

for (let index = 1; index <= 15; index++) {
  channels.push({ channel_id: index, name: `Channel ${index}` })
}

function getIdCard(channel: Channels) {
  console.log(channel.channel_id)
}

const container = ref<HTMLElement | null>(null)

function switchSize() {
  container.value?.classList.toggle('big')
  console.log('toggle')
}
</script>

<template>
  <div class="channel-container" ref="container">
    <div class="title-card">
      <span class="title">Liste channels</span>
      <span class="dot" v-on:click="switchSize()"></span>
    </div>

    <div class="channel-list">
      <div
        v-for="(channel, key) of channels"
        v-bind:key="key"
        class="channel-card"
        @click="getIdCard(channel)"
      >
        <div>
          <span class="dot"></span>
          {{ channel.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.channel-container {
  display: flex;
  flex-direction: column;
  width: 16.25rem;
  height: 45rem;
  border: 5px #6b6cb2 solid;
  border-radius: 30px;
  background-color: #a0a9d6;
  overflow: hidden;
  box-shadow: 20px 30px 4px rgba(0, 0, 0, 0.2);
  transform-origin: left;
  transition: width 1s;

  &.big {
    width: 52rem;

    .channel-list {
      .channel-card {
        width: 33%;
        border-radius: 10px;
        padding-top: 18px;
        padding-bottom: 18px;
        div{
          font-size:large;
        }
      }
    }
  }

  .title-card {
    display: flex;
    align-items: center;
    height: 8%;
    background-color: #6b6cb2;

    .title {
      font-size: large;
      font-weight: 700;
      margin-left: 1rem;
    }
  }

  .channel-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* flex: 1; */
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .channel-card {
    display: flex;
    align-items: center;
    width: 100%;
    padding-top: 12px;
    padding-bottom: 12px;
    transition: width 1s ease;

    &:hover {
      background-color: #22335715;
    }

    div {
      display: flex;
      align-items: center;
      margin: 0 15px;
      gap: 6px;
      transition: font-size 0,4s ease;
    }
  }
}

.dot {
  height: 30px;
  width: 30px;
  background-color: #7e7b8e;
  border-radius: 50%;
  display: inline-block;
}

/* Scrollbar width */
::-webkit-scrollbar {
  width: 8px;
} /* Track (background) */
::-webkit-scrollbar-track {
  background: #00000000;
} /* Thumb (the draggable part) */
::-webkit-scrollbar-thumb {
  background: #486094;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #354669;
}
</style>
