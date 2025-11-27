<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center z-[9999]" @click.self="close">
    <div
      class="rounded-lg shadow-xl p-6 w-full max-w-md mx-auto my-8 max-h-[calc(100vh-4rem)] overflow-y-auto"
      :class="contentClass"
    >
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <slot name="header">
          <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
        </slot>
        <button @click="close" class="text-gray-500 hover:text-gray-700 text-2xl leading-none">
          &times;
        </button>
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
import { watch, onUnmounted } from 'vue'
import { useUiStore } from '@/stores/ui'

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    contentClass?: string
  }>(),
  {
    contentClass: 'bg-white'
  }
)

const emit = defineEmits(['close'])
const uiStore = useUiStore()

const close = () => {
  emit('close');
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    close();
  }
};

watch(() => props.show, (newVal) => {
  uiStore.setModalOpen(newVal);
  if (newVal) {
    window.addEventListener('keydown', handleKeydown);
  } else {
    window.removeEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>