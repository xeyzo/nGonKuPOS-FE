import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const pageTitle = ref('Dashboard')

  function setPageTitle(title: string) {
    pageTitle.value = title
  }

  return { pageTitle, setPageTitle }
})
