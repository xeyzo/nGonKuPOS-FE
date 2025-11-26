<script setup lang="ts">
import { useProductStore } from '@/stores/useProduct';
import { useUiStore } from '@/stores/ui';
import Pagination from '@/components/commons/Pagination.vue';
import ProductFormModal from '@/components/product/ProductFormModal.vue';
import { formatPrice } from '@/utils/format';
import { storeToRefs } from 'pinia';

interface Product {
  id?: number;
  barcode: string;
  name: string;
  description?: string;
  buyingPrice: number;
  salePrice: number;
  stock: number;
  picturePath?: string;
  isActive: boolean;
  uomId?: number | null;
  categoryId?: number | null;
}

const productStore = useProductStore();
const uiStore = useUiStore();

const { showFormModal, selectedProduct, products, isLoading, currentPage, totalPages, totalElements, pageSize } = storeToRefs(productStore);

const handleDelete = (product: Product) => {
  uiStore.openDeleteConfirmationModal(
    'Delete Product',
    `Are you sure you want to delete ${product.name}?`,
    () => productStore.deleteProduct(product.id!)
  );
};
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-xl border border-gray-200">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div class="relative w-full sm:w-auto">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
        <input
          type="text"
          v-model="productStore.search"
          placeholder="Search Product"
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
        />
      </div>
      <button @click="productStore.openAddModal" class="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-5 py-2.5 w-full sm:w-auto">
        Add Product
      </button>
    </div>
    <div class="overflow-x-auto rounded-t-lg hidden sm:block">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-800">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Barcode</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Product Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Buying Price</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Sale Price</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Stock</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 border-t border-gray-200">
          <tr v-if="isLoading">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              Loading...
            </td>
          </tr>
          <tr v-else-if="products.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
              No data available
            </td>
          </tr>
          <tr v-else v-for="(product) in products" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.barcode }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatPrice(product.buyingPrice) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatPrice(product.salePrice) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.stock }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="productStore.openEditModal(product)" class="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                </svg>
                Edit
              </button>
              <button @click="handleDelete(product)" class="text-red-600 hover:text-red-900 inline-flex items-center">
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
        <div v-if="isLoading" class="text-center text-gray-500 py-4">
          Loading...
        </div>
        <div v-else-if="products.length === 0" class="text-center text-gray-500 py-4">
          No data available
        </div>
        <div v-else v-for="(product) in products" :key="product.id" class="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="font-bold text-gray-800">{{ product.name }}</span>
                    <span class="text-sm text-gray-500 block">{{ product.barcode }}</span>
                </div>
                <div class="text-right">
                    <span class="text-sm text-gray-600">Stock: {{ product.stock }}</span>
                </div>
            </div>
            <div class="text-sm text-gray-600 mb-4">
                <div class="flex justify-between">
                    <span>Buying Price:</span>
                    <span>{{ formatPrice(product.buyingPrice) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Sale Price:</span>
                    <span>{{ formatPrice(product.salePrice) }}</span>
                </div>
            </div>
            <div class="flex justify-end">
                <button @click="productStore.openEditModal(product)" class="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                    </svg>
                    Edit
                </button>
                <button @click="handleDelete(product)" class="text-red-600 hover:text-red-900 inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    </div>
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalElements"
      :page-size="pageSize"
      @page-changed="productStore.setCurrentPage"
    />
  </div>

  <ProductFormModal :show="showFormModal" :product="selectedProduct" @close="productStore.closeFormModal" @submit-form="productStore.handleSubmitForm" />
</template>