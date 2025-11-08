<template>
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-xl border border-gray-200">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div class="relative w-full sm:w-auto">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input
          type="text"
          v-model="categoryStore.search"
          placeholder="Search Category"
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
        />
      </div>
      <button @click="openAddModal" class="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-5 py-2.5 w-full sm:w-auto">
        Add Category
      </button>
    </div>
    <div class="overflow-x-auto rounded-t-lg hidden sm:block">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-800">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Category Code</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Category Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Category Sequence</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 border-t border-gray-200">
          <tr v-for="(category, index) in categoryStore.paginatedCategories" :key="category.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ category.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ (categoryStore.currentPage - 1) * categoryStore.pageSize + index + 1 }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="openEditModal(category)" class="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                </svg>
                Edit
              </button>
              <button class="text-red-600 hover:text-red-900 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                </svg>
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="sm:hidden">
      <div v-for="(category, index) in categoryStore.paginatedCategories" :key="category.id" class="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-gray-800">{{ category.name }}</span>
          <span class="text-sm text-gray-500">#{{ category.id }}</span>
        </div>
        <div class="text-sm text-gray-600 mb-4">
          Sequence: {{ (categoryStore.currentPage - 1) * categoryStore.pageSize + index + 1 }}
        </div>
        <div class="flex justify-end">
          <button @click="openEditModal(category)" class="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
            </svg>
            Edit
          </button>
          <button class="text-red-600 hover:text-red-900 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
    <Pagination
      :current-page="categoryStore.currentPage"
      :total-pages="categoryStore.totalPages"
      :total-items="categoryStore.totalCategories"
      :page-size="categoryStore.pageSize"
      @page-changed="categoryStore.setCurrentPage"
    />
  </div>

  <CategoryFormModal :show="showFormModal" :category="selectedCategory" @close="closeFormModal" @submit-form="handleSubmitForm" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCategoryStore } from '@/stores/useCategory';
import Pagination from '@/components/commons/Pagination.vue';
import CategoryFormModal from '@/components/category/CategoryFormModal.vue';

interface Category {
  id?: number;
  name: string;
  description?: string;
}

const categoryStore = useCategoryStore();

const showFormModal = ref(false);
const selectedCategory = ref<Category | null>(null);

const openAddModal = () => {
  selectedCategory.value = null; // Ensure no category is selected for add operation
  showFormModal.value = true;
};

const openEditModal = (category: Category) => {
  selectedCategory.value = category;
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
  selectedCategory.value = null; // Clear selected category on close
};

const handleSubmitForm = (formData: Category) => {
  if (formData.id) {
    // This is an update operation
    console.log('Updating category:', formData);
    const index = categoryStore.categories.findIndex(cat => cat.id === formData.id);
    if (index !== -1) {
      categoryStore.categories[index] = formData;
      categoryStore.filterCategories();
    }
  } else {
    // This is an add operation
    const categoryWithId: Category = {
      id: Math.floor(Math.random() * 100000), // Dummy ID
      ...formData,
    };
    console.log('Adding category:', categoryWithId);
    categoryStore.categories.push(categoryWithId);
    categoryStore.filterCategories();
  }
  closeFormModal();
};
</script>

