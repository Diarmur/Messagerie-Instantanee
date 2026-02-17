<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Channel } from '@/types/interface'
import ValidationPopup from './ValidationPopup.vue'
// import ColorPicker from 'primevue/colorpicker'

const emit = defineEmits(['close', 'create', 'delete'])

const showPopup = ref(false)
const selectedChannel = ref<Channel | undefined>(undefined)

const props = defineProps<{
  modification?: boolean
  channel?: Channel
}>()

const formData = reactive({
  name: '',
  img: '',
  members: '',
  primary_color:'',
})

if (props.modification && props.channel) {
  formData.name = props.channel.name || ''
  formData.img = props.channel.img || ''
}

const handleSubmit = () => {
  console.log(formData);

  emit('create', formData)

  formData.name = ''
  formData.img = ''
  formData.members = ''
  formData.primary_color = ''
}

function popupCreate(channel: Channel) {
  showPopup.value = !showPopup.value
  selectedChannel.value = channel
}
</script>

<template>
  <div class="bg-blur">
    <ValidationPopup
      v-if="showPopup"
      :channel="channel"
      @close="popupCreate"
      @delete="emit('delete')"
    />
    <div class="popup-container">
      <div class="title-card">
        <span class="title">{{ props.modification ? 'Update channel' : 'Create a channel' }}</span>
        <div class="button-container">
          <font-awesome-icon icon="x" class="x-cross" @click.stop="emit('close')" />
        </div>
      </div>
      <div class="form">
        <Form @submit.prevent="handleSubmit">
          <p>{{ props.modification ? 'Update channel' : 'Create a channel' }}</p>
          <p>Channel name: <input type="text" required v-model="formData.name" /></p>
          <p>Channel image: <input type="text" v-model="formData.img" /></p>
          <p>Channel members: <input type="text" v-model="formData.members" /></p>
          <!-- <ColorPicker name="color" v-model="formData.primary_color"/> -->
          <button type="submit">{{ props.modification ? 'Update' : 'Add item' }}</button>
        </Form>
      </div>
      <div class="delete-button" v-if="props.modification && props.channel">
        <button
          type="submit"
          v-on:click="popupCreate(props.channel)"
          @delete="emit('delete')"
          @close="popupCreate"
        >
          Delete
        </button>
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
  z-index: 3;
}
.popup-container {
  position: relative;
  margin: 30px;
  width: 40rem;
  height: 25rem;
  border: 5px var(--color-primary-dark) solid;
  border-radius: 30px;
  background-color: var(--color-accent);
  overflow: hidden;

  .title-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 10%;
    background-color: var(--color-primary-dark);
    padding: 0 1rem;

    .button-container {
      height: 27px;
      width: 27px;
      clip-path: circle();
      display: flex;
      justify-content: center;
      align-items: center;

      .x-cross {
        height: 20px;
        width: 20px;
        min-width: 20px;
      }
      &:hover {
        background-color: var(--color-hover-base);
      }
    }
  }
}

.form {
  button {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: var(--color-primary-dark);
    border-radius: 8px;
    color: white;
    border: none;
    height: 30px;
    width: 60px;
  }
}

.delete-button {
  position: absolute;
  bottom: 20px;
  left: 20px;

  button {
    background-color: var(--color-deletion);
    border-radius: 8px;
    color: white;
    border: none;
    height: 30px;
    width: 60px;
  }
}
</style>
