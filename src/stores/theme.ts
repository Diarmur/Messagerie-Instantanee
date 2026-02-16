// import { defineStore } from 'pinia'

// export const useThemeStore = defineStore('theme', {
//   state: () => ({
//     mode: localStorage.getItem('theme-mode') || 'light', // light or dark
//     theme: JSON.parse(localStorage.getItem('theme')) || {
//       primary_color: '#E91E63',
//       primary_color_dark: '#C2185B',
//       accent_color: '#00BCD4',
//       text_color: '#212121',
//       accent_text_color: '#FFFFFF'
//     }
//   }),

//   actions: {
//     toggleMode() {
//       this.mode = this.mode === 'light' ? 'dark' : 'light'
//       this.applyTheme()
//     },

//     setColor(colorName, colorValue) {
//       this.theme[colorName] = colorValue
//       this.applyTheme()
//       this.saveToLocalStorage()
//     },

//     setTheme(themeObject) {
//       this.theme = { ...this.theme, ...themeObject }
//       this.applyTheme()
//       this.saveToLocalStorage()
//     },

//     applyTheme() {
//       const root = document.documentElement

//       // Set mode
//       root.setAttribute('data-theme', this.mode)

//       // Convert theme object to CSS variables
//       root.style.setProperty('--color-primary', this.theme.primary_color)
//       root.style.setProperty('--color-primary-dark', this.theme.primary_color_dark)
//       root.style.setProperty('--color-accent', this.theme.accent_color)
//       root.style.setProperty('--color-text', this.theme.text_color)
//       root.style.setProperty('--color-accent-text', this.theme.accent_text_color)
//     },

//     saveToLocalStorage() {
//       localStorage.setItem('theme-mode', this.mode)
//       localStorage.setItem('theme', JSON.stringify(this.theme))
//     },

//     initTheme() {
//       this.applyTheme()
//     },

//     resetToDefaults() {
//       this.theme = {
//         primary_color: '#E91E63',
//         primary_color_dark: '#6b6cb2',
//         accent_color: '#a0a9d6',
//         text_color: '#212121',
//         accent_text_color: '#FFFFFF',
//         color_deletion:'#e32727',
//       }
//       this.applyTheme()
//       this.saveToLocalStorage()
//     }
//   },

//   getters: {
//     isDark: (state) => state.mode === 'dark'
//   }
// })
