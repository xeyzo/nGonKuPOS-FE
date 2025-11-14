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
  const orders = ref<Order[]>(ordersData.data.content)

  const createOrder = (order: Order) => {
    orders.value.unshift(order)
  }

  const getOrderById = (id: number) => {
    return computed(() => orders.value.find((order) => order.id === id))
  }

  return {
    orders,
    createOrder,
    getOrderById
  }
})
