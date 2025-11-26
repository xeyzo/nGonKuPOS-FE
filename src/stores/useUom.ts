import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { watchDebounced } from '@vueuse/core'
import axiosClient from '@/api/axiosClient'
import type { UomResponse, Uom } from '@/interfaces/UomInterface'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export const useUomStore = defineStore('uom', () => {
  const uoms = ref<Uom[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const search = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)
  const totalElements = ref(0)
  const totalPages = ref(0)

  const showFormModal = ref(false)
  const selectedUom = ref<Uom | null>(null)

  async function fetchUoms() {
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

      const response = await axiosClient.get<UomResponse>('/uom', { params })

      const result = response.data.data

      uoms.value = result.content
      totalElements.value = result.totalElements
      totalPages.value = result.totalPages

    } catch (err) {
      const apiError = err as ApiError
      console.error(apiError)
      error.value = apiError.response?.data?.message || 'Gagal mengambil data UOM'
    } finally {
      isLoading.value = false
    }
  }

  async function addUom(newUom: Uom) {
    isLoading.value = true
    try {
      await axiosClient.post('/uom', newUom)
      await fetchUoms()
    } catch (err) {
      error.value = 'Gagal menambah UOM'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateUom(updatedUom: Uom) {
    if (!updatedUom.id) return
    isLoading.value = true
    try {
      await axiosClient.put(`/uom/${updatedUom.id}`, updatedUom)
      await fetchUoms()
    } catch (err) {
      error.value = 'Gagal update UOM'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUom(id: number) {    
    isLoading.value = true
    try {
      await axiosClient.delete(`/uom/${id}`)
      await fetchUoms()
      
      if (uoms.value.length === 1 && currentPage.value > 1) {
        currentPage.value--
        await fetchUoms()
      }
    } catch {
      error.value = 'Gagal menghapus UOM'
    } finally {
      isLoading.value = false
    }
  }

  
  watchDebounced(search, () => {
    currentPage.value = 1
    fetchUoms()
  }, { debounce: 500, maxWait: 2000 })

  watch(currentPage, () => {
    fetchUoms()
  })

  function openAddModal() {
    selectedUom.value = null
    showFormModal.value = true
  }

  function openEditModal(uom: Uom) {
    selectedUom.value = { ...uom } 
    showFormModal.value = true
  }

  function closeFormModal() {
    showFormModal.value = false
    selectedUom.value = null
  }

  function handleSubmitForm(formData: Uom) {
    if (formData.id) {
      updateUom(formData)
        .then(() => closeFormModal())
        .catch(() => console.log('Gagal mengupdate UOM'))
    } else {
      addUom(formData)
        .then(() => closeFormModal())
        .catch(() => console.log('Gagal menambah UOM'))
    }
  }

  function setCurrentPage(page: number) {
    currentPage.value = page
  }

  fetchUoms()

  return {
    // State
    uoms, 
    isLoading,
    error,
    search,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    
    // Actions API
    fetchUoms,
    addUom,
    updateUom,
    deleteUom,
    setCurrentPage,

    // Modal & UI
    showFormModal,
    selectedUom,
    openAddModal,
    openEditModal,
    closeFormModal,
    handleSubmitForm,
  }
})
