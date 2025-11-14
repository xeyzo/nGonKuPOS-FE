<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ordersData from '@/dummy/order.json'

interface Order {
  id: number
  receiptNumber: string | null
  orderDate: string
  status: string
  outletName: string
  customerName: string
  tableNumber: string
  discountTotal: number
  subtotal: number
  taxTotal: number
  totalAmount: number
  paidAmount: number
  changeAmount: number
  notes: string
}

const router = useRouter()
const orders = ref<Order[]>(ordersData.data.content)
const search = ref('')

const filteredOrders = computed(() => {
  if (!search.value) {
    return orders.value
  }
  return orders.value.filter(
    (order) =>
      (order.receiptNumber && order.receiptNumber.toLowerCase().includes(search.value.toLowerCase())) ||
      order.customerName.toLowerCase().includes(search.value.toLowerCase())
  )
})

const createOrder = () => {
  router.push('/order/create')
}

const viewOrder = (id: number) => {
  router.push(`/order/${id}`)
}

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
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-xl border border-gray-200">
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div class="relative w-full sm:w-auto">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            class="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </span>
        <input
          type="text"
          v-model="search"
          placeholder="Search Order"
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
        />
      </div>
      <button
        @click="createOrder"
        class="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-5 py-2.5 w-full sm:w-auto"
      >
        Create Order
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:bg-gray-100"
        @click="viewOrder(order.id)"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-gray-800">{{ order.receiptNumber }}</span>
          <span
            :class="`text-sm font-medium px-2 py-1 rounded-full ${statusColor(order.status)}`"
            >{{ order.status }}</span
          >
        </div>
        <div class="text-sm text-gray-600 mb-1">
          Customer: <span class="font-medium">{{ order.customerName }}</span>
        </div>
        <div class="text-sm text-gray-600 mb-1">
          Table: <span class="font-medium">{{ order.tableNumber }}</span>
        </div>
        <div class="text-sm text-gray-600 mb-4">
          Date: <span class="font-medium">{{ order.orderDate }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-gray-800"
            >Rp {{ order.totalAmount.toLocaleString() }}</span
          >
          <button class="text-blue-600 hover:text-blue-900 inline-flex items-center">
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>