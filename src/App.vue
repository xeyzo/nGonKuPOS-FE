<script setup lang="ts">
import { ref } from 'vue';
import TheSidebar from './components/commons/TheSidebar.vue';
import TheNavbar from './components/commons/TheNavbar.vue';
import DeleteConfirmationModal from './components/commons/DeleteConfirmationModal.vue';
import { useUiStore } from './stores/ui';
import { storeToRefs } from 'pinia';

const sidebarOpen = ref(window.innerWidth >= 1024);
const isLargeScreen = ref(window.innerWidth >= 1024);

const uiStore = useUiStore();
const { 
  isModalOpen, 
  isDeleteConfirmationModalOpen, 
  deleteConfirmationTitle, 
  deleteConfirmationMessage 
} = storeToRefs(uiStore);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const handleResize = () => {
  const newIsLargeScreen = window.innerWidth >= 1024;
  if (newIsLargeScreen && !isLargeScreen.value) {
    sidebarOpen.value = true;
  } else if (!newIsLargeScreen && isLargeScreen.value) {
    sidebarOpen.value = false;
  }
  isLargeScreen.value = newIsLargeScreen;
};

window.addEventListener('resize', handleResize);

</script>

<template>
  <div class="relative min-h-screen lg:flex" :class="{ 'modal-open': isModalOpen }">
    <div :class="sidebarOpen ? 'lg:w-64' : 'lg:w-0'" class="flex-shrink-0 transition-all duration-300 ease-in-out">
      <TheSidebar :sidebarOpen="sidebarOpen" :isLargeScreen="isLargeScreen" @toggle-sidebar="toggleSidebar" />
    </div>
    <div class="flex-1 transition-all duration-300 ease-in-out">
      <TheNavbar :sidebarOpen="sidebarOpen" :isLargeScreen="isLargeScreen" @toggle-sidebar="toggleSidebar" />
      <main class="p-4 sm:p-6">
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
