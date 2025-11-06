<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Sidebar from './components/commons/Sidebar.vue';
import Navbar from './components/commons/Navbar.vue';

const sidebarOpen = ref(window.innerWidth >= 1024);
const isLargeScreen = ref(window.innerWidth >= 1024);

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
      <Sidebar :sidebarOpen="sidebarOpen" :isLargeScreen="isLargeScreen" @toggle-sidebar="toggleSidebar" />
    </div>
    <div class="flex-1">
      <Navbar :sidebarOpen="sidebarOpen" :isLargeScreen="isLargeScreen" @toggle-sidebar="toggleSidebar" />
      <main class="p-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
