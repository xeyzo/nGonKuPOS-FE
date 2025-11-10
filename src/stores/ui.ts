import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const pageTitle = ref('Dashboard')
  const isModalOpen = ref(false)

  // Delete confirmation modal state
  const isDeleteConfirmationModalOpen = ref(false)
  const deleteConfirmationTitle = ref('')
  const deleteConfirmationMessage = ref('')
  let deleteConfirmationAction: (() => void) | null = null

  function setPageTitle(title: string) {
    pageTitle.value = title
  }

  function setModalOpen(isOpen: boolean) {
    isModalOpen.value = isOpen
  }

  function openDeleteConfirmationModal(title: string, message: string, onConfirm: () => void) {
    deleteConfirmationTitle.value = title
    deleteConfirmationMessage.value = message
    deleteConfirmationAction = onConfirm
    isDeleteConfirmationModalOpen.value = true
  }

  function closeDeleteConfirmationModal() {
    isDeleteConfirmationModalOpen.value = false
    deleteConfirmationTitle.value = ''
    deleteConfirmationMessage.value = ''
    deleteConfirmationAction = null
  }

  function confirmDelete() {
    if (deleteConfirmationAction) {
      deleteConfirmationAction()
    }
    closeDeleteConfirmationModal()
  }

  return {
    pageTitle,
    setPageTitle,
    isModalOpen,
    setModalOpen,
    isDeleteConfirmationModalOpen,
    deleteConfirmationTitle,
    deleteConfirmationMessage,
    openDeleteConfirmationModal,
    closeDeleteConfirmationModal,
    confirmDelete
  }
})
