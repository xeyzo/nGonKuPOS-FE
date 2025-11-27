<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/commons/BaseModal.vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps<{
  show: boolean
  totalAmount: number
}>()

const emit = defineEmits(['close', 'confirm'])

const paymentMethod = ref('Cash')
const paidAmount = ref(0)
const notes = ref('')

const changeAmount = computed(() => {
  return paidAmount.value - props.totalAmount
})

const isConfirmDisabled = computed(() => {
  return paidAmount.value < props.totalAmount
})

const close = () => {
  emit('close')
}

const confirm = () => {
  if (!isConfirmDisabled.value) {
    emit('confirm', {
      paymentMethod: paymentMethod.value,
      paidAmount: paidAmount.value,
      notes: notes.value
    })
    resetForm()
  }
}

const resetForm = () => {
  paymentMethod.value = 'Cash'
  paidAmount.value = 0
  notes.value = ''
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      paidAmount.value = props.totalAmount
    }
  }
)
</script>

<template>
  <BaseModal :show="show" title="Checkout" content-class="bg-[#fef1d6]" @close="close">
    <div class="space-y-4">
      <div class="p-4 border rounded-lg bg-gray-50">
        <div class="flex justify-between items-center text-lg font-semibold">
          <span>Total Amount:</span>
          <span>{{ formatCurrency(totalAmount) }}</span>
        </div>
      </div>

      <div>
        <label for="paymentMethod" class="block text-sm font-medium text-gray-700"
          >Payment Method</label
        >
        <select
          id="paymentMethod"
          v-model="paymentMethod"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option>Cash</option>
          <option>Card</option>
        </select>
      </div>
      <div>
        <label for="paidAmount" class="block text-sm font-medium text-gray-700">Paid Amount</label>
        <input
          type="number"
          id="paidAmount"
          v-model.number="paidAmount"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div v-if="changeAmount > 0" class="p-4 border rounded-lg bg-green-50 text-green-700">
        <div class="flex justify-between items-center text-md font-semibold">
          <span>Change:</span>
          <span>{{ formatCurrency(changeAmount) }}</span>
        </div>
      </div>
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          v-model="notes"
          rows="3"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        ></textarea>
      </div>
    </div>
    <template #footer>
      <button
        @click="confirm"
        :disabled="isConfirmDisabled"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm disabled:bg-gray-400"
      >
        Confirm Payment
      </button>
      <button
        @click="close"
        type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
      >
        Cancel
      </button>
    </template>
  </BaseModal>
</template>
