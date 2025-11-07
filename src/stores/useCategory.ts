import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import allCategoriesData from '@/dummy/category.json'

export const useCategoryStore = defineStore('category', () => {
  const search = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)

  const allCategories = ref(allCategoriesData.data.content)

  watch(search, () => {
    currentPage.value = 1
  })

  const filteredCategories = computed(() => {
    if (!search.value) {
      return allCategories.value
    }
    return allCategories.value.filter((category) =>
      category.name.toLowerCase().includes(search.value.toLowerCase())
    )
  })

  const totalCategories = computed(() => filteredCategories.value.length)

  const totalPages = computed(() => Math.ceil(totalCategories.value / pageSize.value))

  const paginatedCategories = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return filteredCategories.value.slice(startIndex, endIndex)
  })

  function setCurrentPage(page: number) {
    currentPage.value = page
  }

  return { search, currentPage, pageSize, totalCategories, totalPages, paginatedCategories, setCurrentPage }
})