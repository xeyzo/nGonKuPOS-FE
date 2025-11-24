import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { watchDebounced } from '@vueuse/core'
import axiosClient from '@/api/axiosClient'
import type { CategoryResponse, Category } from '@/interfaces/CategoryInterface'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const search = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)
  const totalElements = ref(0)
  const totalPages = ref(0)

  const showFormModal = ref(false)
  const selectedCategory = ref<Category | null>(null)

  async function fetchCategories() {
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

      console.log('Fetching categories with params:', params);
      const response = await axiosClient.get<CategoryResponse>('/categories', { params })

      const result = response.data.data

      categories.value = result.content
      totalElements.value = result.totalElements
      totalPages.value = result.totalPages

    } catch (err) {
      const apiError = err as ApiError
      console.error(apiError)
      error.value = apiError.response?.data?.message || 'Gagal mengambil data kategori'
    } finally {
      isLoading.value = false
    }
  }

  async function addCategory(newCategory: Category) {
    isLoading.value = true
    try {
      await axiosClient.post('/categories', newCategory)
      await fetchCategories()
    } catch (err) {
      error.value = 'Gagal menambah kategori'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateCategory(updatedCategory: Category) {
    if (!updatedCategory.id) return
    isLoading.value = true
    try {
      await axiosClient.put(`/categories/${updatedCategory.id}`, updatedCategory)
      await fetchCategories()
    } catch (err) {
      error.value = 'Gagal update kategori'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteCategory(id: number) {    
    isLoading.value = true
    try {
      await axiosClient.delete(`/categories/${id}`)
      await fetchCategories()
      
      if (categories.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
        await fetchCategories()
      }
    } catch {
      error.value = 'Gagal menghapus kategori'
    } finally {
      isLoading.value = false
    }
  }

  
  watchDebounced(search, () => {
    currentPage.value = 1
    fetchCategories()
  }, { debounce: 500, maxWait: 2000 })

  watch(currentPage, () => {
    fetchCategories()
  })

  function openAddModal() {
    selectedCategory.value = null
    showFormModal.value = true
  }

  function openEditModal(category: Category) {
    selectedCategory.value = { ...category } 
    showFormModal.value = true
  }

  function closeFormModal() {
    showFormModal.value = false
    selectedCategory.value = null
  }

  function handleSubmitForm(formData: Category) {
    if (formData.id) {
      updateCategory(formData)
        .then(() => closeFormModal())
        .catch(() => console.log('Gagal mengupdate kategori'))
    } else {
      addCategory(formData)
        .then(() => closeFormModal())
        .catch(() => console.log('Gagal menambah kategori'))
    }
  }

  function setCurrentPage(page: number) {
    currentPage.value = page
  }

  fetchCategories()

  return {
    // State
    categories, 
    isLoading,
    error,
    search,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    
    // Actions API
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    setCurrentPage,

    // Modal & UI
    showFormModal,
    selectedCategory,
    openAddModal,
    openEditModal,
    closeFormModal,
    handleSubmitForm,
  }
})