import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { watchDebounced } from '@vueuse/core'
import axiosClient from '@/api/axiosClient'

// 1. INTERFACES (Sesuai struktur JSON kamu)
export interface Category {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean; // Menyesuaikan field JSON kamu
  picturePath?: string;
}

// Interface untuk respon backend (Spring Boot Style)
interface BackendResponse {
  status: number;
  message: string;
  data: {
    content: Category[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export const useCategoryStore = defineStore('category', () => {
  // --- STATE ---
  const categories = ref<Category[]>([]) // Data list kategori
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Pagination & Search State
  const search = ref('')
  const currentPage = ref(1) // UI biasanya mulai dari 1
  const pageSize = ref(5)
  const totalElements = ref(0)
  const totalPages = ref(0)

  // Modal State (Tetap dipertahankan)
  const showFormModal = ref(false)
  const selectedCategory = ref<Category | null>(null)

  // --- ACTIONS (API CALLS) ---

  // 1. GET ALL (Fetch Data)
  async function fetchCategories() {
    isLoading.value = true
    error.value = null
    
    try {
      // Kirim parameter page & size ke backend
      // Catatan: Backend Java biasanya page mulai dari 0, jadi (currentPage - 1)
      const params: { page: number, size: number, search?: string } = {
        page: currentPage.value - 1,
        size: pageSize.value
      }
      if (search.value) {
        params.search = search.value
      }

      console.log('Fetching categories with params:', params);
      const response = await axiosClient.get<BackendResponse>('/categories', { params })

      // Ambil data sesuai struktur JSON kamu: response.data.data.content
      const result = response.data.data

      categories.value = result.content
      totalElements.value = result.totalElements
      totalPages.value = result.totalPages

    } catch (err: any) {
      console.error(err)
      error.value = err.response?.data?.message || 'Gagal mengambil data kategori'
    } finally {
      isLoading.value = false
    }
  }

  // 2. ADD (Create)
  async function addCategory(newCategory: Category) {
    isLoading.value = true
    try {
      await axiosClient.post('/categories', newCategory)
      await fetchCategories() // Refresh data setelah simpan
    } catch (err: any) {
      error.value = 'Gagal menambah kategori'
      throw err // Lempar error biar component tau
    } finally {
      isLoading.value = false
    }
  }

  // 3. UPDATE
  async function updateCategory(updatedCategory: Category) {
    if (!updatedCategory.id) return
    isLoading.value = true
    try {
      await axiosClient.put(`/categories/${updatedCategory.id}`, updatedCategory)
      await fetchCategories() // Refresh data
    } catch (err: any) {
      error.value = 'Gagal update kategori'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 4. DELETE
  async function deleteCategory(id: number) {
    if (!confirm('Yakin ingin menghapus?')) return // Konfirmasi sederhana
    
    isLoading.value = true
    try {
      await axiosClient.delete(`/categories/${id}`)
      await fetchCategories()
      
      // Reset ke halaman 1 jika data di halaman ini habis
      if (categories.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
        await fetchCategories()
      }
    } catch (err: any) {
      error.value = 'Gagal menghapus kategori'
    } finally {
      isLoading.value = false
    }
  }

  // --- WATCHERS ---
  
  // Jika search berubah (dengan debounce), reset ke halaman 1 dan fetch ulang
  watchDebounced(search, () => {
    currentPage.value = 1
    fetchCategories()
  }, { debounce: 500, maxWait: 2000 })

  // Jika halaman berubah, fetch ulang
  watch(currentPage, () => {
    fetchCategories()
  })

  // --- MODAL ACTIONS (UI Logic) ---
  function openAddModal() {
    selectedCategory.value = null
    showFormModal.value = true
  }

  function openEditModal(category: Category) {
    // Copy object agar tidak reaktif langsung ke list sebelum disave
    selectedCategory.value = { ...category } 
    showFormModal.value = true
  }

  function closeFormModal() {
    showFormModal.value = false
    selectedCategory.value = null
  }

  function handleSubmitForm(formData: Category) {
    // Logic pemilah antara Edit atau Add
    if (formData.id) {
      updateCategory(formData)
        .then(() => closeFormModal())
        .catch(err => alert(err)) // Handle error sederhana
    } else {
      addCategory(formData)
        .then(() => closeFormModal())
        .catch(err => alert(err))
    }
  }

  function setCurrentPage(page: number) {
    currentPage.value = page
  }

  fetchCategories()

  return {
    // State
    categories, // Ini pengganti allCategories / filteredCategories
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