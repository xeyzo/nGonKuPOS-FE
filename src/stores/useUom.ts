import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import allUomsData from '@/dummy/uom.json'
import type { Uom } from '@/components/uom/UomFormModal.vue'

const LOCAL_STORAGE_KEY = 'uoms';

export const useUomStore = defineStore('uom', () => {
  const search = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)
  const isFormModalOpen = ref(false)
  const editingUom = ref<Uom | null>(null)

  const allUoms = ref<Uom[]>(loadUomsFromLocalStorage());

  watch(search, () => {
    currentPage.value = 1
  })

  const filteredUoms = computed(() => {
    if (!search.value) {
      return allUoms.value
    }
    return allUoms.value.filter((uom) =>
      uom.name.toLowerCase().includes(search.value.toLowerCase())
    )
  })

  const totalUoms = computed(() => filteredUoms.value.length)

  const totalPages = computed(() => Math.ceil(totalUoms.value / pageSize.value))

  const paginatedUoms = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return filteredUoms.value.slice(startIndex, endIndex)
  })

  function setCurrentPage(page: number) {
    currentPage.value = page
  }

  function saveUomsToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allUoms.value));
  }

  function loadUomsFromLocalStorage(): Uom[] {
    const storedUoms = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedUoms) {
      try {
        return JSON.parse(storedUoms);
      } catch (e) {
        console.error("Error parsing uoms from localStorage", e);
        return allUomsData.data.content;
      }
    }
    return allUomsData.data.content;
  }

  function openFormModal(uom: Uom | null = null) {
    editingUom.value = uom
    isFormModalOpen.value = true
  }

  function closeFormModal() {
    isFormModalOpen.value = false
    editingUom.value = null
  }

  function addUom(uom: Uom) {
    const maxId = allUoms.value.reduce((max, uom) => (uom.id && uom.id > max ? uom.id : max), 0);
    const newUom = { ...uom, id: maxId + 1 }
    allUoms.value.unshift(newUom)
    saveUomsToLocalStorage();
    closeFormModal()
  }

  function updateUom(updatedUom: Uom) {
    const index = allUoms.value.findIndex((uom) => uom.id === updatedUom.id)
    if (index !== -1) {
      allUoms.value[index] = updatedUom
      saveUomsToLocalStorage();
    }
    closeFormModal()
  }

  function deleteUom(uomId: number) {
    allUoms.value = allUoms.value.filter((uom) => uom.id !== uomId)
    saveUomsToLocalStorage();
  }

  return {
    search,
    currentPage,
    pageSize,
    totalUoms,
    totalPages,
    paginatedUoms,
    setCurrentPage,
    isFormModalOpen,
    editingUom,
    openFormModal,
    closeFormModal,
    addUom,
    updateUom,
    deleteUom
  }
})
