<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useOrderStore } from '@/stores/useOrder'
import { useProductStore } from '@/stores/useProduct'
import { useCategoryStore } from '@/stores/useCategory'
import { computed, onMounted } from 'vue'

const route = useRoute()
const orderStore = useOrderStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

onMounted(() => {
  // Ensure master data is loaded for enrichment
  if (productStore.allProducts.length === 0) {
    productStore.fetchAllProducts()
  }
  if (categoryStore.allCategories.length === 0) {
    categoryStore.fetchAllCategories()
  }
})

const orderId = Number(route.params.id)
const order = orderStore.getOrderById(orderId)

const enrichedOrderItems = computed(() => {
  if (!order.value || !order.value.items) return []
  if (productStore.allProducts.length === 0 || categoryStore.allCategories.length === 0) {
    // Return original items if master data is not ready
    return order.value.items
  }

  return order.value.items.map((item) => {
    if (item.categoryName) return item // Already enriched

    const product = productStore.allProducts.find((p) => p.id === item.id)
    if (!product) return { ...item, categoryName: 'Product not found' }

    const category = categoryStore.allCategories.find((c) => c.id === product.categoryId)
    return {
      ...item,
      categoryName: category ? category.name : 'Uncategorized'
    }
  })
})

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
  <div
    v-if="order"
    class="bg-white p-4 sm:p-6 rounded-lg shadow-xl border border-gray-200 h-full flex flex-col"
  >
    <!-- Non-growing top part -->
    <div>
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
    </div>

    <!-- Growing middle part -->
    <div class="mt-8 flex-grow min-h-0 flex flex-col">
      <h2 class="text-xl font-bold mb-4">Order Summary</h2>
      <div class="overflow-y-auto flex-grow">
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
            <tr v-for="item in enrichedOrderItems" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                <div class="text-sm text-gray-500">{{ item.categoryName }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap">Rp {{ item.price.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                Rp {{ (item.price * item.quantity).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Non-growing bottom part -->
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
        <div class="mt-4 border-t pt-4">
          <h3 class="font-bold text-lg mb-2">Payment Details</h3>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Payment Method:</span>
            <span>{{ order.paymentMethod }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Paid Amount:</span>
            <span>Rp {{ order.paidAmount.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Change:</span>
            <span>Rp {{ order.changeAmount.toLocaleString() }}</span>
          </div>
          <div v-if="order.notes" class="mt-2">
            <span class="text-gray-600">Notes:</span>
            <p class="text-sm">{{ order.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-8">
    <h1 class="text-2xl font-bold">Order not found</h1>
  </div>
</template>