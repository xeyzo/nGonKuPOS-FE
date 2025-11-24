import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { watchDebounced } from '@vueuse/core'
import axiosClient from '@/api/axiosClient'
import type { ProductResponse, Product } from '@/interfaces/ProductInterface'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const search = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)
  const totalElements = ref(0)
  const totalPages = ref(0)

  const showFormModal = ref(false)
  const selectedProduct = ref<Product | null>(null)

  async function fetchProducts() {
    isLoading.value = true
    error.value = null
    
    try {
      const params: { page: number, size: number, search?: string } = {
        page: currentPage.value - 1,
        size: pageSize.value
      }
      if (search.value) {
        params.search = search.value
      }

      console.log('Fetching products with params:', params);
      const response = await axiosClient.get<ProductResponse>('/products', { params })

      const result = response.data.data

      products.value = result.content
      totalElements.value = result.totalElements
      totalPages.value = result.totalPages

    } catch (err) {
      const apiError = err as ApiError
      console.error(apiError)
      error.value = apiError.response?.data?.message || 'Gagal mengambil data produk'
    } finally {
      isLoading.value = false
    }
  }

  async function addProduct(newProduct: Product) {
    isLoading.value = true
    try {
      await axiosClient.post('/products', newProduct)
      await fetchProducts()
    } catch (err) {
      error.value = 'Gagal menambah produk'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateProduct(updatedProduct: Product) {
    if (!updatedProduct.id) return
    isLoading.value = true
    try {
      await axiosClient.put(`/products/${updatedProduct.id}`, updatedProduct)
      await fetchProducts()
    } catch (err) {
      error.value = 'Gagal update produk'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteProduct(id: number) {    
    isLoading.value = true
    try {
      await axiosClient.delete(`/products/${id}`)
      await fetchProducts()
      
      if (products.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
        await fetchProducts()
      }
    } catch {
      error.value = 'Gagal menghapus produk'
    } finally {
      isLoading.value = false
    }
  }

  
  watchDebounced(search, () => {
    currentPage.value = 1
    fetchProducts()
  }, { debounce: 500, maxWait: 2000 })

  watch(currentPage, () => {
    fetchProducts()
  })

  function openAddModal() {
    selectedProduct.value = null
    showFormModal.value = true
  }

  function openEditModal(product: Product) {
    selectedProduct.value = { ...product } 
    showFormModal.value = true
  }

  function closeFormModal() {
    showFormModal.value = false
    selectedProduct.value = null
  }

  function handleSubmitForm(formData: Product) {
    if (formData.id) {
      updateProduct(formData)
        .then(() => closeFormModal())
        .catch(() => console.log('Gagal mengupdate produk'))
    } else {
      addProduct(formData)
        .then(() => closeFormModal())
        .catch(() => console.log('Gagal menambah produk'))
    }
  }

  function setCurrentPage(page: number) {
    currentPage.value = page
  }

  fetchProducts()

  return {
    // State
    products, 
    isLoading,
    error,
    search,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    
    // Actions API
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setCurrentPage,

    // Modal & UI
    showFormModal,
    selectedProduct,
    openAddModal,
    openEditModal,
    closeFormModal,
    handleSubmitForm,
  }
})
