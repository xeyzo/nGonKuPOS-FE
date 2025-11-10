import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import allProductsData from '@/dummy/product.json'

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
  uomId?: number | null;
  categoryId?: number | null;
}

const LOCAL_STORAGE_KEY = 'products';

export const useProductStore = defineStore('product', () => {
  const search = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)

  // Load products from local storage or fallback to dummy data
  const allProducts = ref<Product[]>(loadProductsFromLocalStorage());

  // Modal State
  const showFormModal = ref(false);
  const selectedProduct = ref<Product | null>(null);

  watch(search, () => {
    currentPage.value = 1
  })

  const filteredProducts = computed(() => {
    if (!search.value) {
      return allProducts.value
    }
    return allProducts.value.filter((product) =>
      product.name.toLowerCase().includes(search.value.toLowerCase())
    )
  })

  const totalProducts = computed(() => filteredProducts.value.length)

  const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize.value))

  const paginatedProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return filteredProducts.value.slice(startIndex, endIndex)
  })

  function setCurrentPage(page: number) {
    currentPage.value = page
  }

  function saveProductsToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProducts.value));
  }

  function loadProductsFromLocalStorage(): Product[] {
    const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedProducts) {
      try {
        return JSON.parse(storedProducts);
      } catch (e) {
        console.error("Error parsing products from localStorage", e);
        // Fallback to dummy data if parsing fails
        return allProductsData.data.content;
      }
    }
    return allProductsData.data.content;
  }

  function addProduct(newProduct: Product) {
    const maxId = allProducts.value.reduce((max, product) => (product.id && product.id > max ? product.id : max), 0);
    const productWithId: Product = {
      id: maxId + 1,
      ...newProduct,
      isActive: newProduct.isActive ?? true, // Ensure isActive has a default if not provided
    };
    allProducts.value.push(productWithId);
    saveProductsToLocalStorage();
  }

  function updateProduct(updatedProduct: Product) {
    const index = allProducts.value.findIndex(prod => prod.id === updatedProduct.id);
    if (index !== -1) {
      allProducts.value[index] = updatedProduct;
      saveProductsToLocalStorage();
    }
  }

  function deleteProduct(id: number) {
    allProducts.value = allProducts.value.filter(product => product.id !== id);
    saveProductsToLocalStorage();
  }

  // Modal Actions
  function openAddModal() {
    selectedProduct.value = null;
    showFormModal.value = true;
  }

  function openEditModal(product: Product) {
    selectedProduct.value = product;
    showFormModal.value = true;
  }

  function closeFormModal() {
    showFormModal.value = false;
    selectedProduct.value = null;
  }

  function handleSubmitForm(formData: Product) {
    if (formData.id) {
      updateProduct(formData);
    }
    else {
      addProduct(formData);
    }
    closeFormModal();
  }

  return {
    search,
    currentPage,
    pageSize,
    allProducts,
    totalProducts,
    totalPages,
    paginatedProducts,
    setCurrentPage,
    addProduct,
    updateProduct,
    deleteProduct,
    filteredProducts,
    // Expose modal state and actions
    showFormModal,
    selectedProduct,
    openAddModal,
    openEditModal,
    closeFormModal,
    handleSubmitForm,
  }
})
