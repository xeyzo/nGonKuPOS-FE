<template>
  <div class="flex flex-col sm:flex-row justify-between items-center mt-4">
    <div class="hidden sm:block">
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">{{ from }}</span>
        to
        <span class="font-medium">{{ to }}</span>
        of
        <span class="font-medium">{{ totalItems }}</span>
        results
      </p>
    </div>
    <div class="flex items-center">
      <button
        type="button"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded-l-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      >
        <span class="hidden sm:inline">Previous</span>
        <svg class="sm:hidden h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      <button
        type="button"
        v-for="page in pages"
        :key="page"
        @click="changePage(page)"
        :class="['hidden sm:inline-block px-3', 'py-1', 'border-t', 'border-b', 'bg-white', currentPage === page ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50']"
      >
        {{ page }}
      </button>
      <span class="sm:hidden px-3 py-1 border-t border-b bg-white text-gray-500">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        type="button"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded-r-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      >
        <span class="hidden sm:inline">Next</span>
        <svg class="sm:hidden h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['page-changed']);

const from = computed(() => (props.currentPage - 1) * props.pageSize + 1);
const to = computed(() => Math.min(props.currentPage * props.pageSize, props.totalItems));

const pages = computed(() => {
  const pages = [];
  for (let i = 1; i <= props.totalPages; i++) {
    pages.push(i);
  }
  return pages;
});

const changePage = (page: number) => {
  if (page > 0 && page <= props.totalPages) {
    emit('page-changed', page);
  }
};
</script>
