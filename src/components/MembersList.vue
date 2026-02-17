<script setup lang="ts">
import { useStore } from '@/stores/store'
import type { User } from '@/types/interface'
import { ref, watch } from 'vue'

const store = useStore()

const userList = ref<User[]>([])

const getAllUsers = async (usernames: string[]) => {
  try {
    const response = await fetch(
      `https://edu.tardigrade.land/msg/protected/user/meta?users=${usernames.join(',')}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${store.token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    const metaUsers: User[] = await response.json()

    userList.value = usernames.map((username) => {
      const found = metaUsers.find((u) => u.username === username)
      return found ?? { username }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    userList.value = []
  }
}

watch(
  () => store.selectedChannel,
  (channel) => {
    console.log('channel changed', channel)
    if (channel?.users) {
      getAllUsers(channel.users)
    } else {
      userList.value = []
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="members-container" ref="container">
    <div class="messages-header title-members">
      <span class="title">List members</span>
    </div>
    <div class="members-list" v-if="store.selectedChannel?.users">
      <div v-for="member in userList" :key="member.username" class="member-card">
        <div class="member-pp">
          <img
            class="dot"
            :src="member.img || 'https://placehold.net/avatar.svg'"
            alt="channel.name"
          />
        </div>
        <span class="channel-name">{{ member.display_name || member.username }}</span>

        <div class="channel-option">
          <font-awesome-icon v-if="store.selectedChannel.creator == member.username" icon="crown" />
          <font-awesome-icon
            v-else-if="store.selectedChannel.creator == store.username"
            icon="ellipsis-v"
          />
        </div>
      </div>
    </div>
    <div v-else>Select a channel to see members</div>
  </div>
</template>

<style scoped>
.members-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 25rem;
  height: 90vh;
  border: 3px var(--color-primary-dark) solid;
  border-radius: 15px;
  background-color: var(--color-accent);
  overflow: hidden;
  box-shadow: 10px 15px 4px #00000033;
  transform-origin: left;
  transition: width 1s ease;
  z-index: 1;

  .messages-header {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: #6b6cb2;
    color: white;
    border-bottom: 2px solid #5a5ba9;
  }

  .title-members {
    justify-content: space-between;

    .title {
      font-size: large;
      font-weight: 700;
    }
  }

  .member-card {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 2px 0;
    justify-content: space-between;

    &:hover {
      background-color: var(--color-hover-base) !important;
    }

    .member-name {
      display: flex;
      font-weight: 600;
      font-size: 0.95rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: wrap;
      max-width: 75%;
    }
  }
}

.dot {
  height: 40px;
  width: 40px;
  min-width: 40px;
  clip-path: circle();
  display: inline-block;
}
</style>
