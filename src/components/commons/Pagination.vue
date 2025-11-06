<template>
  <div class="flex justify-between items-center mt-4">
    <div>
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
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded-l-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>
      <button
        v-for="page in pages"
        :key="page"
        @click="changePage(page)"
        :class="['px-3', 'py-1', 'border-t', 'border-b', 'bg-white', currentPage === page ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50']"
      >
        {{ page }}
      </button>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded-r-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      >
        Next
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
