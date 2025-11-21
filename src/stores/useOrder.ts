import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ordersData from '@/dummy/order.json'

export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}
export interface Order {
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
  items: OrderItem[]
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const allOrders = ref<Order[]>(ordersData.data.content)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const hasMore = ref(true)
  const loading = ref(false)

  const totalPages = computed(() => Math.ceil(allOrders.value.length / pageSize.value))

  const fetchOrders = () => {
    if (currentPage.value > totalPages.value) {
      hasMore.value = false
      return
    }
    loading.value = true
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    const newOrders = allOrders.value.slice(start, end)
    orders.value.push(...newOrders)
    currentPage.value++
    if (orders.value.length >= allOrders.value.length) {
      hasMore.value = false
    }
    loading.value = false
  }

  const createOrder = (order: Order) => {
    allOrders.value.unshift(order)
    orders.value.unshift(order)
  }

  const getOrderById = (id: number) => {
    return computed(() => allOrders.value.find((order) => order.id === id))
  }

  const resetOrders = () => {
    orders.value = []
    currentPage.value = 1
    hasMore.value = true
  }

  return {
    orders,
    fetchOrders,
    createOrder,
    getOrderById,
    hasMore,
    loading,
    resetOrders
  }
})
