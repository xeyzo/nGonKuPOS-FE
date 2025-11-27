import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Order, OrderPayload } from '@/interfaces/OrderInterface'
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
      console.log(`Fetching orders page ${currentPage.value}...`)
      const response = await axiosClient.get('/orders', {
        params: {
          page: currentPage.value,
          size: pageSize.value
        }
      })

      const responseData = response.data.data
      const newOrders = responseData.content
      console.log(`Received ${newOrders.length} orders.`)

      if (newOrders.length > 0) {
        orders.value.push(...newOrders)
        currentPage.value++
      }

      if (currentPage.value > responseData.totalPages) {
        hasMore.value = false
        console.log('No more orders to fetch.')
      }
      totalPages.value = responseData.totalPages
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      loading.value = false
    }
  }

  const createOrder = (payload: OrderPayload, orderDataForUI: any) => {
    console.log('--- Sending Order Payload to API ---')
    console.log(JSON.stringify(payload, null, 2))
    console.log('------------------------------------')

    const newOrderForUI: Order = {
      id: Date.now(),
      receiptNumber: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString().split('T')[0] ?? '',
      status: 'PAID',
      outletName: payload.outletName,
      customerName: payload.customerName,
      tableNumber: payload.tableNumber,
      totalAmount: orderDataForUI.totalAmount,
      items: orderDataForUI.items,
      paymentMethod: orderDataForUI.paymentMethod,
      discountTotal: orderDataForUI.discountTotal,
      subtotal: orderDataForUI.subtotal,
      taxTotal: orderDataForUI.taxTotal,
      paidAmount: orderDataForUI.paidAmount,
      changeAmount: orderDataForUI.changeAmount,
      notes: payload.notes
    }
    orders.value.unshift(newOrderForUI)
  }

  const getOrderById = (id: number) => {
    return computed(() => orders.value.find((order) => order.id === id))
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
    resetOrders,
    totalPages,
    currentPage
  }
})