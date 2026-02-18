<script setup lang="ts">
import { reactive, ref } from 'vue'
import ValidationPopup from './ValidationPopup.vue'
import ColorPickerComponent from './ColorPickerComponent.vue'
import type { Channel, ChannelTheme } from '@/types/interface'
// import ColorPicker from 'primevue/colorpicker'

const emit = defineEmits(['close', 'create', 'delete'])

const showPopup = ref(false)
const selectedChannel = ref<Channel | undefined>(undefined)

const default_color = ref<ChannelTheme>({
  primary_color: '#FF0000',
  primary_color_dark: '#11C72C',
  accent_color: '#0051FF',
  text_color: '#000000',
  accent_text_color: '#A4A4A4',
})
const props = defineProps<{
  modification?: boolean
  channel?: Channel
}>()

const formData = reactive({
  name: '',
  img: '',
  members: '',
  primary_color: '',
  primary_color_dark: '',
  accent_color: '',
  text_color: '',
  accent_text_color: '',
})

if (props.modification && props.channel) {
  formData.name = props.channel.name || ''
  formData.img = props.channel.img || ''
}

const handleSubmit = () => {
  emit('create', formData)

  formData.name = ''
  formData.img = ''
  formData.members = ''
  formData.primary_color = ''
  formData.primary_color_dark = ''
  formData.accent_color = ''
  formData.text_color = ''
  formData.accent_text_color = ''
}

function triggerPopup(channel: Channel) {
  showPopup.value = !showPopup.value
  selectedChannel.value = channel
}
</script>

<template>
  <div class="bg-blur">
    <ValidationPopup
      v-if="showPopup"
      type="channel"
      :channel="channel"
      @close="triggerPopup"
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
        <form @submit.prevent="handleSubmit">
          <p class="form-title">{{ props.modification ? 'Update channel' : 'Create a channel' }}</p>
          <div class="form-field">
            <p>
              Channel name:
              <input type="text" required v-model="formData.name" placeholder="My Channel" />
            </p>
            <p>
              Channel image:
              <input type="text" v-model="formData.img" placeholder="url.com/my-img.jpg" />
            </p>
            <p>
              Channel members:
              <input type="text" v-model="formData.members" placeholder="j.doe,j.roe..." />
            </p>
            <div class="color-picker" v-if="props.modification">
              <ColorPickerComponent
                name="Primary color"
                :default="channel?.theme?.primary_color || default_color.primary_color"
                v-model="formData.primary_color"
              />
              <ColorPickerComponent
                name="Primary color dark"
                :default="channel?.theme?.primary_color_dark || default_color.primary_color_dark"
                v-model="formData.primary_color_dark"
              />
              <ColorPickerComponent
                name="Accent color"
                :default="channel?.theme?.accent_color || default_color.accent_color"
                v-model="formData.accent_color"
              />
              <ColorPickerComponent
                name="Text color"
                :default="channel?.theme?.text_color || default_color.text_color"
                v-model="formData.text_color"
              />
            </div>
          </div>
          <button type="submit">{{ props.modification ? 'Update' : 'Add item' }}</button>
        </form>
      </div>
      <div class="delete-button" v-if="props.modification && props.channel">
        <button
          type="submit"
          v-on:click="triggerPopup(props.channel)"
          @delete="emit('delete')"
          @close="triggerPopup"
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
  z-index: 2;
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
  margin: 15px 0 0 30px;
  form {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .form-title {
      font-weight: 600;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
      p {
        display: flex;
        flex-direction: column;
      }

      input[type='text'] {
        width: 33%;
        height: 30px;
        border-radius: 5px 5px 0 0;
        border-bottom: solid 2px var(--color-primary);
        background-color: #var(--color-accent-color);
        padding: 3px;

        &:focus {
          outline: none;
        }
      }

      .color-picker {
        display: flex;
        flex-direction: row;
        gap: 2px;
        flex-wrap: wrap;
      }
    }
  }

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
