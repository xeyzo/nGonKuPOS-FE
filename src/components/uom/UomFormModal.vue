<template>
  <BaseModal :show="show" :title="isEditing ? 'Edit UoM' : 'Add New UoM'" @close="close">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="uomCode">UoM Code:</label>
        <input type="text" id="uomCode" v-model="formData.code" required />
      </div>
      <div class="form-group">
        <label for="uomName">UoM Name:</label>
        <input type="text" id="uomName" v-model="formData.name" required />
      </div>
      <div class="form-group">
        <label for="uomSymbol">UoM Symbol:</label>
        <input type="text" id="uomSymbol" v-model="formData.symbol" required />
      </div>
      <div class="form-group">
        <label for="uomDescription">Description:</label>
        <textarea id="uomDescription" v-model="formData.description"></textarea>
      </div>
      <div class="form-group flex items-center">
        <input type="checkbox" id="isActive" v-model="formData.isActive" class="mr-2 leading-tight" />
        <label for="isActive">Is Active</label>
      </div>
    </form>
    <template #footer>
      <button type="submit" class="btn btn-primary" @click="submitForm">{{ isEditing ? 'Update UoM' : 'Add UoM' }}</button>
      <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import BaseModal from '@/components/commons/BaseModal.vue';
import type { Uom } from '@/interfaces/UomInterface';

const props = defineProps<{
  show: boolean;
  uom: Uom | null;
}>();

const emit = defineEmits(['close', 'submit-form']);

const getInitialFormData = (): Uom => ({
  name: '',
  code: '',
  symbol: '',
  description: '',
  isActive: true,
});

const formData = ref<Uom>(getInitialFormData());

const isEditing = computed(() => !!props.uom && props.uom.id !== undefined);

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.uom) {
      formData.value = { ...props.uom };
    } else {
      formData.value = getInitialFormData();
    }
  }
}, { immediate: true });

watch(() => props.uom, (newVal) => {
  if (props.show && newVal) {
    formData.value = { ...newVal };
  } else if (props.show && !newVal) {
    formData.value = getInitialFormData();
  }
});

const submitForm = () => {
  emit('submit-form', { ...formData.value });
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
textarea,
input[type="checkbox"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="checkbox"] {
  width: auto;
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
