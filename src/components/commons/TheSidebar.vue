<template>
  <aside
    :class="sidebarOpen ? 'w-64 p-4' : 'w-0'"
    class="bg-gray-900 text-white min-h-screen transition-all duration-300 ease-in-out overflow-hidden flex flex-col"
  >
    <div class="flex items-center justify-center mb-4">
      <img src="@/assets/img/Gemini_Generated_Image_it7c11it7c11it7c.png" alt="NgonKu POS Logo" class="w-16 h-16" />
    </div>
    <h2 class="text-lg font-bold mb-4 text-center">NgonKu POS</h2>
    <div class="flex flex-col justify-between flex-grow">
      <nav class="flex flex-col space-y-2">
        <router-link to="/" class="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</router-link>
        <div>
          <button @click="masterDataOpen = !masterDataOpen" class="w-full flex justify-between items-center py-2 px-4 rounded hover:bg-gray-700">
            <span>Master Data</span>
            <svg :class="{'rotate-180': masterDataOpen}" class="w-4 h-4 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="masterDataOpen" class="pl-4">
            <router-link to="/product" class="block py-2 px-4 rounded hover:bg-gray-700">Product</router-link>
            <router-link to="/category" class="block py-2 px-4 rounded hover:bg-gray-700">Category</router-link>
            <router-link to="/uom" class="block py-2 px-4 rounded hover:bg-gray-700">UoM</router-link>
          </div>
        </div>
        <div>
          <button @click="transactionDataOpen = !transactionDataOpen" class="w-full flex justify-between items-center py-2 px-4 rounded hover:bg-gray-700">
            <span>Transaction</span>
            <svg :class="{'rotate-180': transactionDataOpen}" class="w-4 h-4 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="transactionDataOpen" class="pl-4">
            <router-link to="/order" class="block py-2 px-4 rounded hover:bg-gray-700">Order</router-link>
          </div>
        </div>
      </nav>
      <div class="p-4">
        <p class="text-center text-xs text-gray-400">
          &copy; 2025 dev nGon-Ku. All rights reserved.
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

defineProps({
  sidebarOpen: {
    type: Boolean,
    required: true,
  },
  isLargeScreen: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['toggle-sidebar']);

const masterDataOpen = ref(false);
const transactionDataOpen = ref(false);

const route = useRoute();

watchEffect(() => {
  if (route.meta.parent === 'Master Data') {
    masterDataOpen.value = true;
  } else if (route.meta.parent === 'Transaction') {
    transactionDataOpen.value = true;
  }
});

</script>

<style scoped>
.router-link-exact-active {
  background-color: #4a5568;
}
</style>