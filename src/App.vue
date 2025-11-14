<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TheSidebar from './components/commons/TheSidebar.vue'
import TheNavbar from './components/commons/TheNavbar.vue'
import DeleteConfirmationModal from './components/commons/DeleteConfirmationModal.vue'
import { useUiStore } from './stores/ui'
import { storeToRefs } from 'pinia'

const sidebarOpen = ref(window.innerWidth >= 1024)
const isLargeScreen = ref(window.innerWidth >= 1024)

const uiStore = useUiStore()
const {
  isModalOpen,
  isDeleteConfirmationModalOpen,
  deleteConfirmationTitle,
  deleteConfirmationMessage
} = storeToRefs(uiStore)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const handleResize = () => {
  const newIsLargeScreen = window.innerWidth >= 1024
  if (newIsLargeScreen && !isLargeScreen.value) {
    sidebarOpen.value = true
  } else if (!newIsLargeScreen && isLargeScreen.value) {
    sidebarOpen.value = false
  }
  isLargeScreen.value = newIsLargeScreen
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="flex h-screen bg-gray-100" :class="{ 'modal-open': isModalOpen }">
    <TheSidebar :sidebarOpen="sidebarOpen" :isLargeScreen="isLargeScreen" @toggle-sidebar="toggleSidebar" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <TheNavbar :sidebarOpen="sidebarOpen" :isLargeScreen="isLargeScreen" @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6">
        <router-view />
      </main>
    </div>
    <DeleteConfirmationModal
      :show="isDeleteConfirmationModalOpen"
      :title="deleteConfirmationTitle"
      :message="deleteConfirmationMessage"
      @close="uiStore.closeDeleteConfirmationModal"
      @confirm="uiStore.confirmDelete"
    />
  </div>
</template>

<style>
.modal-open {
  overflow: hidden;
}
</style>

<style>
.modal-open {
  overflow: hidden;
}
</style>
