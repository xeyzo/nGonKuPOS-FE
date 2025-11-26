<template>
  <BaseModal :show="show" :title="isEditing ? 'Edit Product' : 'Add New Product'" @close="close">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="barcode">Barcode:</label>
        <input type="text" id="barcode" v-model="formData.barcode" required />
      </div>
      <div class="form-group">
        <label for="productName">Product Name:</label>
        <input type="text" id="productName" v-model="formData.name" required />
      </div>
      <div class="form-group">
        <label for="productDescription">Description:</label>
        <textarea id="productDescription" v-model="formData.description"></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="form-group">
          <label for="buyingPrice">Buying Price:</label>
          <input type="number" id="buyingPrice" v-model.number="formData.buyingPrice" required />
        </div>
        <div class="form-group">
          <label for="salePrice">Sale Price:</label>
          <input type="number" id="salePrice" v-model.number="formData.salePrice" required />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="form-group">
          <label for="stock">Stock:</label>
          <input type="number" id="stock" v-model.number="formData.stock" required />
        </div>
        <div class="form-group">
          <label for="picturePath">Picture Path:</label>
          <input type="text" id="picturePath" v-model="formData.picturePath" />
        </div>
      </div>
      <div class="form-group">
        <label for="uom">Unit of Measure:</label>
        <select id="uom" v-model.number="formData.uomId">
          <option :value="null">Select UOM</option>
          <option v-for="uom in uomStore.uoms" :key="uom.id" :value="uom.id">{{ uom.name }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="category">Category:</label>
        <select id="category" v-model.number="formData.categoryId">
          <option :value="null">Select Category</option>
          <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
      </div>
      <div class="form-group flex items-center">
        <input type="checkbox" id="isActive" v-model="formData.isActive" class="mr-2 leading-tight" />
        <label for="isActive">Is Active</label>
      </div>
    </form>
    <template #footer>
      <button type="submit" class="btn btn-primary" @click="submitForm">{{ isEditing ? 'Update Product' : 'Add Product' }}</button>
      <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
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
  buyingPrice: number;
  salePrice: number;
  stock: number;
  picturePath?: string;
  isActive: boolean;
  uomId?: number | null;
  categoryId?: number | null;
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
  buyingPrice: 0,
  salePrice: 0,
  stock: 0,
  picturePath: '',
  isActive: true,
  uomId: null,
  categoryId: null,
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
        buyingPrice: 0,
        salePrice: 0,
        stock: 0,
        picturePath: '',
        isActive: true,
        uomId: null,
        categoryId: null,
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
      buyingPrice: 0,
      salePrice: 0,
      stock: 0,
      picturePath: '',
      isActive: true,
      uomId: null,
      categoryId: null,
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

<style scoped>
.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  height: 80px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>