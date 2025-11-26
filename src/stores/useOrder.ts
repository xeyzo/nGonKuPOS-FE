import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Order } from '@/interfaces/OrderInterface'
import axiosClient from '@/api/axiosClient'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const hasMore = ref(true)
  const loading = ref(false)
  const totalPages = ref(1)

  const fetchOrders = async () => {
    if (loading.value || !hasMore.value) return

    loading.value = true
    try {
      const response = await axiosClient.get('/orders', {
        params: {
          page: currentPage.value,
          size: pageSize.value
        }
      })

      const newOrders = response.data.data.content
      if (newOrders.length > 0) {
        orders.value.push(...newOrders)
        currentPage.value++
      }

      if (currentPage.value > response.data.data.totalPages) {
        hasMore.value = false
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      loading.value = false
    }
  }

  const createOrder = (order: Order) => {
    // allOrders.value.unshift(order)
    // orders.value.unshift(order)
  }

  const getOrderById = (id: number) => {
    // return computed(() => allOrders.value.find((order) => order.id === id))
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
