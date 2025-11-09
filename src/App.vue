<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import TheSidebar from './components/commons/TheSidebar.vue';
import TheNavbar from './components/commons/TheNavbar.vue';
import { useUiStore } from './stores/ui';
import { storeToRefs } from 'pinia';

const sidebarOpen = ref(window.innerWidth >= 1024);
const isLargeScreen = ref(window.innerWidth >= 1024);

const uiStore = useUiStore();
const { isModalOpen } = storeToRefs(uiStore);

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

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<template>
  <div class="relative min-h-screen lg:flex">
    <div :class="sidebarOpen ? 'lg:w-64' : 'lg:w-0'" class="flex-shrink-0 transition-all duration-300 ease-in-out">
      <TheSidebar :sidebarOpen="sidebarOpen" :isLargeScreen="isLargeScreen" @toggle-sidebar="toggleSidebar" />
    </div>
    <div class="flex-1 transition-all duration-300 ease-in-out">
      <TheNavbar :sidebarOpen="sidebarOpen" :isLargeScreen="isLargeScreen" @toggle-sidebar="toggleSidebar" />     
        <router-view />
    </div>
  </div>
</template>

<style scoped>
</style>
