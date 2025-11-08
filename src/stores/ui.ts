import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const pageTitle = ref('Dashboard')
  const isModalOpen = ref(false)

  function setPageTitle(title: string) {
    pageTitle.value = title
  }

  function setModalOpen(isOpen: boolean) {
    isModalOpen.value = isOpen
  }

  return { pageTitle, setPageTitle, isModalOpen, setModalOpen }
})
