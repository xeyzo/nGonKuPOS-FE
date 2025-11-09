<template>
  <header class="bg-white shadow-md p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <button @click="$emit('toggle-sidebar')" class="p-2 rounded-md hover:bg-gray-200">
          <svg v-if="!sidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 class="text-base sm:text-xl font-semibold ml-1 sm:ml-2 text-gray-800 uppercase tracking-wider truncate">{{ uiStore.pageTitle }}</h1>
      </div>
      <div class="flex items-center space-x-4">
        <button class="p-2 rounded-full hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div class="flex items-center">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User Avatar" class="w-8 h-8 rounded-full" />
          <span class="ml-2 hidden sm:inline">John Doe</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/ui';

defineProps({
  sidebarOpen: {
    type: Boolean,
    required: true,
  },
});
const uiStore = useUiStore();
</script>

<style scoped>
</style>