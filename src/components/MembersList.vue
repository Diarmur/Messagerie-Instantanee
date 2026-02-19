<script setup lang="ts">
import { useStore } from '@/stores/store'
import type { User } from '@/types/interface'
import { ref, watch } from 'vue'
import { useSnackbar } from 'vue3-snackbar'
const snackbar = useSnackbar()

const store = useStore()

const showPopup = ref(false)
const selectedUser = ref('')
const userList = ref<User[]>([])

const getAllUsersMeta = async (usernames: string[]) => {
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

const banUser = async (username: string) => {
  try {
    if (!store.selectedChannel) throw new Error(`No channel selected`)

    const response = await fetch(
      `https://edu.tardigrade.land/msg/protected/channel/${store.selectedChannel.id}/user/${username}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.token}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to delete user ${username}`)
    }
    if (username == store.username) {
      store.selectedChannel = null
    }
    snackbar.add({
      type: 'success',
      text: 'User deleted',
    })
    if (store.selectedChannel?.users) {
      store.selectedChannel.users = store.selectedChannel.users.filter((u) => u !== username)
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    snackbar.add({
      type: 'error',
      text: `Error deleting user: ${error}`,
    })
  }
}

function triggerPopup(username: string, deletion: boolean) {
  selectedUser.value = username
  showPopup.value = !showPopup.value
  if (deletion) banUser(username)
}

watch(
  () => store.selectedChannel,
  (channel) => {
    if (channel?.users) {
      getAllUsersMeta(channel.users)
    } else {
      userList.value = []
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <ValidationPopup
    v-if="showPopup"
    :type="selectedUser"
    @close="triggerPopup(selectedUser, false)"
    @delete="triggerPopup(selectedUser, true)"
  />
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
            alt="member name"
          />
        </div>
        <div class="member-info">
          <span class="member-name">{{ member.display_name || member.username }}</span>
          <span v-if="member.status" class="member-status">{{ member.status }}</span>
        </div>

        <div class="member-option">
          <font-awesome-icon v-if="store.selectedChannel.creator == member.username" icon="crown" />
          <font-awesome-icon
            v-else-if="store.selectedChannel.creator == store.username || store.username == member.username"
            v-on:click="triggerPopup(member.username, false)"
            icon="ellipsis-v"
          />
        </div>
      </div>
    </div>
    <div class="no-channel" v-else><p>Select a channel to see members</p></div>
  </div>
</template>

<style scoped>
.members-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 25rem;
  min-width: 11rem;
  height: 90vh;
  border: 3px var(--color-primary) solid;
  border-radius: 15px;
  background-color: var(--color-accent);
  overflow: hidden;
  box-shadow: 10px 15px 4px #00000033;
  transform-origin: left;
  transition: width 1s ease;

  .members-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .messages-header {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: var(--color-primary);
    color: white;
    border-bottom: 2px solid var(--color-primary);
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
    gap: 2px;

    &:hover {
      background-color: var(--color-hover-base) !important;
    }

    .member-info {
      flex-grow: 2;
    }

    .member-name {
      display: flex;
      font-weight: 600;
      font-size: 0.95rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: wrap;
    }

    .member-status {
      color: #66676c;
      font-size: 14px;
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

.no-channel {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
  }
}
</style>
