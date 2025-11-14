<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/useOrder'
import { computed } from 'vue'

const route = useRoute()
const orderStore = useOrderStore()

const orderId = Number(route.params.id)
const order = orderStore.getOrderById(orderId)

const subtotal = computed(() => {
  if (!order.value || !order.value.items) return 0
  return order.value.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
})

const discount = computed(() => {
  return 5000
})

const tax = computed(() => {
  if (!order.value) return 0
  return subtotal.value * 0.11
})

const total = computed(() => {
  if (!order.value) return 0
  return subtotal.value - discount.value + tax.value
})

const statusColor = (status: string) => {
  switch (status) {
    case 'NEW':
      return 'bg-blue-100 text-blue-800'
    case 'PAID':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div v-if="order" class="bg-white p-4 sm:p-6 rounded-lg shadow-xl border border-gray-200">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Order Details</h1>
      <span :class="`text-sm font-medium px-2 py-1 rounded-full ${statusColor(order.status)}`">{{
        order.status
      }}</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p class="text-sm text-gray-600">Receipt Number:</p>
        <p class="font-medium">{{ order.receiptNumber }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Order Date:</p>
        <p class="font-medium">{{ order.orderDate }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Customer Name:</p>
        <p class="font-medium">{{ order.customerName }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Table Number:</p>
        <p class="font-medium">{{ order.tableNumber }}</p>
      </div>
    </div>
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">Order Summary</h2>
      <div class="overflow-x-auto max-h-96 overflow-y-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in order.items" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ item.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                Rp {{ item.price.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                Rp {{ (item.price * item.quantity).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mt-6 flex justify-end">
      <div class="w-full max-w-sm">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Subtotal:</span>
          <span>Rp {{ subtotal.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Discount:</span>
          <span>- Rp {{ discount.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Tax (11%):</span>
          <span>Rp {{ tax.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>Rp {{ total.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-8">
    <h1 class="text-2xl font-bold">Order not found</h1>
  </div>
</template>
