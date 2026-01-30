import { defineStore } from 'pinia'
import {  inject } from 'vue'
import type { VueCookies } from 'vue-cookies'

export const useStore = defineStore('store', () => {
    const cookies = inject<VueCookies>('$cookies');
    const token = cookies?.get('token')
  
    return { token }
})