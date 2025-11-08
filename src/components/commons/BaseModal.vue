<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click.self="close">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md flex flex-col max-h-[90vh]">
      <div class="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
        <slot name="header">
          <h3 class="text-2xl font-semibold text-gray-800">{{ title }}</h3>
        </slot>
        <button class="text-gray-500 hover:text-gray-700 text-3xl leading-none font-semibold" @click="close">&times;</button>
      </div>
      <div class="flex-grow overflow-y-auto mb-4">
        <slot></slot>
      </div>
      <div class="flex justify-end gap-x-3 pt-4 border-t border-gray-200">
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
