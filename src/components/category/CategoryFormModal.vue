<template>
  <BaseModal :show="show" :title="isEditing ? 'Edit Category' : 'Add New Category'" @close="close">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="categoryName">Category Name:</label>
        <input type="text" id="categoryName" v-model="formData.name" required />
      </div>
      <div class="form-group">
        <label for="categoryDescription">Description:</label>
        <textarea id="categoryDescription" v-model="formData.description"></textarea>
      </div>
    </form>
    <template #footer>
      <button type="submit" class="btn btn-primary" @click="submitForm">{{ isEditing ? 'Update Category' : 'Add Category' }}</button>
      <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import BaseModal from '@/components/commons/BaseModal.vue';

interface Category {
  id?: number; // ID is optional for new categories
  name: string;
  description?: string;
}

const props = defineProps<{
  show: boolean;
  category: Category | null; // Will be null for add, and a Category object for edit
}>();

const emit = defineEmits(['close', 'submit-form']);

const formData = ref<Category>({ name: '', description: '' });

const isEditing = computed(() => !!props.category && props.category.id !== undefined);

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.category) {
      // Editing existing category
      formData.value = { ...props.category };
    } else {
      // Adding new category
      formData.value = { name: '', description: '' };
    }
  }
}, { immediate: true }); // immediate: true to run on initial render if show is true

const submitForm = () => {
  emit('submit-form', { ...formData.value });
  // No need to call close() here, BaseModal will emit close after form submission
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
