import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import allCategoriesData from '@/dummy/category.json'

interface Category {
  id?: number;
  name: string;
  description?: string;
}

const LOCAL_STORAGE_KEY = 'categories';

export const useCategoryStore = defineStore('category', () => {
  const search = ref('')
  const currentPage = ref(1)
  const pageSize = ref(5)

  // Load categories from local storage or fallback to dummy data
  const allCategories = ref<Category[]>(loadCategoriesFromLocalStorage());

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

  function saveCategoriesToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allCategories.value));
  }

  function loadCategoriesFromLocalStorage(): Category[] {
    const storedCategories = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCategories) {
      try {
        return JSON.parse(storedCategories);
      } catch (e) {
        console.error("Error parsing categories from localStorage", e);
        // Fallback to dummy data if parsing fails
        return allCategoriesData.data.content;
      }
    }
    return allCategoriesData.data.content;
  }

  function addCategory(newCategory: Category) {
    const maxId = allCategories.value.reduce((max, category) => (category.id && category.id > max ? category.id : max), 0);
    const categoryWithId: Category = {
      id: maxId + 1,
      ...newCategory,
    };
    allCategories.value.push(categoryWithId);
    saveCategoriesToLocalStorage();
  }

  function updateCategory(updatedCategory: Category) {
    const index = allCategories.value.findIndex(cat => cat.id === updatedCategory.id);
    if (index !== -1) {
      allCategories.value[index] = updatedCategory;
      saveCategoriesToLocalStorage();
    }
  }

  function deleteCategory(id: number) {
    allCategories.value = allCategories.value.filter(category => category.id !== id);
    saveCategoriesToLocalStorage();
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
    deleteCategory, // Expose delete action
    // Expose modal state and actions
    showFormModal,
    selectedCategory,
    openAddModal,
    openEditModal,
    closeFormModal,
    handleSubmitForm,
  }
})