import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import allCategoriesData from '@/dummy/category.json'

interface Category {
  id?: number;
  name: string;
  description?: string;
}

export const useCategoryStore = defineStore('category', () => {
  const search = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)

  const allCategories = ref<Category[]>(allCategoriesData.data.content)

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

  function addCategory(newCategory: Category) {
    // Assign a dummy ID for now, in a real app this would come from the backend
    const categoryWithId: Category = {
      id: Math.floor(Math.random() * 100000),
      ...newCategory,
    };
    allCategories.value.push(categoryWithId);
    // After adding, we might want to go to the last page or the first page
    // For simplicity, let's just ensure the list is re-filtered
    filterCategories();
  }

  function updateCategory(updatedCategory: Category) {
    const index = allCategories.value.findIndex(cat => cat.id === updatedCategory.id);
    if (index !== -1) {
      allCategories.value[index] = updatedCategory;
      filterCategories();
    }
  }

  // This function is already implicitly called by computed properties,
  // but we can make it explicit if needed for external triggers.
  function filterCategories() {
    // Trigger re-evaluation of computed properties
    // By simply accessing filteredCategories, it will re-evaluate
    // Or, if we want to force a refresh of the current page, we can do:
    // currentPage.value = 1;
  }


  return {
    search,
    currentPage,
    pageSize,
    allCategories, // Expose allCategories for direct manipulation if needed, though actions are preferred
    totalCategories,
    totalPages,
    paginatedCategories,
    setCurrentPage,
    addCategory,
    updateCategory,
    filterCategories,
  }
})