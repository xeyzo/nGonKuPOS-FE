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

  // Modal State
  const showFormModal = ref(false);
  const selectedCategory = ref<Category | null>(null);

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
    const categoryWithId: Category = {
      id: Math.floor(Math.random() * 100000),
      ...newCategory,
    };
    allCategories.value.push(categoryWithId);
    filterCategories();
  }

  function updateCategory(updatedCategory: Category) {
    const index = allCategories.value.findIndex(cat => cat.id === updatedCategory.id);
    if (index !== -1) {
      allCategories.value[index] = updatedCategory;
      filterCategories();
    }
  }

  function filterCategories() {
    // Trigger re-evaluation of computed properties
  }

  // Modal Actions
  function openAddModal() {
    selectedCategory.value = null;
    showFormModal.value = true;
  }

  function openEditModal(category: Category) {
    selectedCategory.value = category;
    showFormModal.value = true;
  }

  function closeFormModal() {
    showFormModal.value = false;
    selectedCategory.value = null;
  }

  function handleSubmitForm(formData: Category) {
    if (formData.id) {
      updateCategory(formData);
    } else {
      addCategory(formData);
    }
    closeFormModal();
  }

  return {
    search,
    currentPage,
    pageSize,
    allCategories,
    totalCategories,
    totalPages,
    paginatedCategories,
    setCurrentPage,
    addCategory,
    updateCategory,
    filterCategories,
    // Expose modal state and actions
    showFormModal,
    selectedCategory,
    openAddModal,
    openEditModal,
    closeFormModal,
    handleSubmitForm,
  }
})