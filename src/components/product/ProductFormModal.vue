<template>
  <BaseModal :show="show" :title="isEditing ? 'Edit Product' : 'Add New Product'" @close="close">
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="barcode" class="block text-gray-700 text-sm font-bold mb-2">Barcode:</label>
        <input type="text" id="barcode" v-model="formData.barcode" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      <div class="mb-4">
        <label for="productName" class="block text-gray-700 text-sm font-bold mb-2">Product Name:</label>
        <input type="text" id="productName" v-model="formData.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      <div class="mb-4">
        <label for="productDescription" class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
        <textarea id="productDescription" v-model="formData.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label for="costPrice" class="block text-gray-700 text-sm font-bold mb-2">Cost Price:</label>
          <input type="number" id="costPrice" v-model.number="formData.costPrice" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div>
          <label for="salePrice" class="block text-gray-700 text-sm font-bold mb-2">Sale Price:</label>
          <input type="number" id="salePrice" v-model.number="formData.salePrice" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label for="stock" class="block text-gray-700 text-sm font-bold mb-2">Stock:</label>
          <input type="number" id="stock" v-model.number="formData.stock" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div>
          <label for="picturePath" class="block text-gray-700 text-sm font-bold mb-2">Picture Path:</label>
          <input type="text" id="picturePath" v-model="formData.picturePath" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
      </div>
      <div class="mb-4">
        <label for="uom" class="block text-gray-700 text-sm font-bold mb-2">Unit of Measure:</label>
        <select id="uom" v-model.number="formData.uomId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="">Select UOM</option>
          <option v-for="uom in uomStore.allUoms" :key="uom.id" :value="uom.id">{{ uom.name }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="category" class="block text-gray-700 text-sm font-bold mb-2">Category:</label>
        <select id="category" v-model.number="formData.categoryId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="">Select Category</option>
          <option v-for="category in categoryStore.allCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>
      <div class="mb-4 flex items-center">
        <input type="checkbox" id="isActive" v-model="formData.isActive" class="mr-2 leading-tight" />
        <label for="isActive" class="text-sm text-gray-700">Is Active</label>
      </div>
    </form>
    <template #footer>
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="submitForm">{{ isEditing ? 'Update Product' : 'Add Product' }}</button>
      <button type="button" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="close">Cancel</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import BaseModal from '@/components/commons/BaseModal.vue';
import { useUomStore } from '@/stores/useUom';
import { useCategoryStore } from '@/stores/useCategory';

interface Product {
  id?: number;
  barcode: string;
  name: string;
  description?: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  picturePath?: string;
  isActive: boolean;
  uomId?: number;
  categoryId?: number;
}

const props = defineProps<{
  show: boolean;
  product: Product | null;
}>();

const emit = defineEmits(['close', 'submit-form']);

const uomStore = useUomStore();
const categoryStore = useCategoryStore();

const formData = ref<Product>({
  barcode: '',
  name: '',
  description: '',
  costPrice: 0,
  salePrice: 0,
  stock: 0,
  picturePath: '',
  isActive: true,
  uomId: undefined,
  categoryId: undefined,
});

const isEditing = computed(() => !!props.product && props.product.id !== undefined);

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.product) {
      formData.value = { ...props.product };
    } else {
      formData.value = {
        barcode: '',
        name: '',
        description: '',
        costPrice: 0,
        salePrice: 0,
        stock: 0,
        picturePath: '',
        isActive: true,
        uomId: undefined,
        categoryId: undefined,
      };
    }
  }
}, { immediate: true });

watch(() => props.product, (newVal) => {
  if (props.show && newVal) {
    formData.value = { ...newVal };
  } else if (props.show && !newVal) {
    formData.value = {
      barcode: '',
      name: '',
      description: '',
      costPrice: 0,
      salePrice: 0,
      stock: 0,
      picturePath: '',
      isActive: true,
      uomId: undefined,
      categoryId: undefined,
    };
  }
});

const submitForm = () => {
  emit('submit-form', { ...formData.value });
};

const close = () => {
  emit('close');
};
</script>