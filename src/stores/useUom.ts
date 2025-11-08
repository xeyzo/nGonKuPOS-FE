import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import allUomsData from '@/dummy/uom.json'

export const useUomStore = defineStore('uom', () => {
  const search = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)

  const allUoms = ref(allUomsData.data.content)

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

  return { search, currentPage, pageSize, totalUoms, totalPages, paginatedUoms, setCurrentPage }
})
