<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="close">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <slot name="header">
          <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
        </slot>
        <button @click="close" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
      </div>
      <div class="mb-4">
        <slot></slot>
      </div>
      <div class="flex justify-end space-x-2">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  title?: string;
}>();

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>