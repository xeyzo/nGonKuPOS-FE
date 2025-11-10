<template>
  <BaseModal :show="show" :title="title" @close="close">
    <p>{{ message }}</p>
    <template #footer>
      <button @click="confirm" class="btn btn-danger">Delete</button>
      <button @click="close" class="btn btn-secondary">Cancel</button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/commons/BaseModal.vue';

defineProps<{
  show: boolean;
  title: string;
  message: string;
}>();

const emit = defineEmits(['close', 'confirm']);

const close = () => {
  emit('close');
};

const confirm = () => {
  emit('confirm');
};
</script>

<style scoped>
.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
