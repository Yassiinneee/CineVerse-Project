import { ref, watch } from 'vue'

type Theme = 'dark' | 'light'

const currentTheme = ref<Theme>('dark')

export function useTheme() {
  function applyTheme(theme: Theme) {
    const root = document.documentElement
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light')
    } else {
      root.removeAttribute('data-theme')
    }
  }

  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  }

  function initTheme() {
    const saved = localStorage.getItem('cineverse-theme') as Theme | null
    if (saved) {
      currentTheme.value = saved
    }
    applyTheme(currentTheme.value)
  }

  watch(currentTheme, (theme) => {
    applyTheme(theme)
    localStorage.setItem('cineverse-theme', theme)
  })

  return { currentTheme, toggleTheme, initTheme }
}
