import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import allProductsData from '@/dummy/product.json'

export const useProductStore = defineStore('product', () => {
  const search = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)

  const allProducts = ref(allProductsData.data.content)

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

  return { search, currentPage, pageSize, totalProducts, totalPages, paginatedProducts, setCurrentPage }
})
