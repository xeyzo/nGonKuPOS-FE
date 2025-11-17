<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore, type Order, type OrderItem } from '@/stores/useOrder'
import productsData from '@/dummy/product.json'
import categoriesData from '@/dummy/category.json'
import ThePagination from '@/components/commons/ThePagination.vue'

interface Product {
  id: number
  name: string
  salePrice: number
  categoryId: number | null
}

interface Category {
  id: number
  name: string
}

const router = useRouter()
const orderStore = useOrderStore()

const products = ref<Product[]>(productsData.data.content)
const categories = ref<Category[]>(categoriesData.data.content)
const order = ref<{
  customerName: string
  tableNumber: string
  items: OrderItem[]
}>({
  customerName: '',
  tableNumber: '',
  items: []
})

const selectedCategory = ref<number | null>(categories.value[0]?.id ?? null)

const filteredProducts = computed(() => {
  if (selectedCategory.value === null) {
    return []
  }
  return products.value.filter((product) => product.categoryId === selectedCategory.value)
})

const currentPage = ref(1)
const pageSize = ref(8)

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize.value)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

const onPageChanged = (page: number) => {
  currentPage.value = page
}

const addProductToOrder = (product: Product) => {
  const existingItem = order.value.items.find((item) => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    order.value.items.push({
      id: product.id,
      name: product.name,
      price: product.salePrice,
      quantity: 1
    })
  }
}

const increaseQuantity = (item: OrderItem) => {
  item.quantity++
}

const decreaseQuantity = (item: OrderItem) => {
  item.quantity--
  if (item.quantity === 0) {
    order.value.items = order.value.items.filter((i) => i.id !== item.id)
  }
}

const removeItem = (itemToRemove: OrderItem) => {
  order.value.items = order.value.items.filter((item) => item.id !== itemToRemove.id)
}

const subtotal = computed(() => {
  return order.value.items.reduce((total, item) => total + item.price * item.quantity, 0)
})

const discount = computed(() => (subtotal.value > 0 ? 5000 : 0))
const taxPercentage = ref(0.11)

const taxAmount = computed(() => {
  return subtotal.value * taxPercentage.value
})

const totalAmount = computed(() => {
  return subtotal.value - discount.value + taxAmount.value
})

const submitOrder = () => {
  const newOrder: Order = {
    id: Date.now(),
    receiptNumber: `ORD-${Date.now()}`,
    orderDate: new Date().toISOString().split('T')[0] ?? '',
    status: 'NEW',
    outletName: 'POS Cafe Alpha',
    customerName: order.value.customerName,
    tableNumber: order.value.tableNumber,
    totalAmount: totalAmount.value,
    items: order.value.items,
    discountTotal: discount.value,
    subtotal: subtotal.value,
    taxTotal: taxAmount.value,
    paidAmount: 0,
    changeAmount: 0,
    notes: ''
  }
  orderStore.createOrder(newOrder)
  router.push('/order')
}

const selectCategory = (categoryId: number) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
}
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-xl border border-gray-200 h-full">
    <h1 class="text-2xl font-bold mb-6">Create Order</h1>
    <form @submit.prevent="submitOrder" class="flex flex-col h-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="form-group">
          <label for="customerName" class="block text-sm font-medium text-gray-700"
            >Customer Name:</label
          >
          <input
            type="text"
            id="customerName"
            v-model="order.customerName"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="form-group">
          <label for="tableNumber" class="block text-sm font-medium text-gray-700"
            >Table Number:</label
          >
          <input
            type="text"
            id="tableNumber"
            v-model="order.tableNumber"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div class="flex-grow flex md:flex-row flex-col gap-6 overflow-hidden min-h-0 md:items-start">
        <div class="md:w-2/3 flex flex-col min-h-0">
          <h2 class="text-xl font-bold mb-4">Products</h2>
          <div class="mb-4 border-b border-gray-200">
            <nav class="-mb-px flex overflow-x-auto" aria-label="Tabs">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="selectCategory(category.id)"
                :class="[
                  'whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm mr-4',
                  selectedCategory === category.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ category.name }}
              </button>
            </nav>
          </div>
          <div class="flex-grow overflow-y-auto pr-4 pb-4">
            <div
              v-if="paginatedProducts.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <div
                v-for="product in paginatedProducts"
                :key="product.id"
                class="border p-4 rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col items-center"
                @click="addProductToOrder(product)"
              >
                <img
                  src="@/assets/img/Gemini_Generated_Image_it7c11it7c11it7c.png"
                  alt="Product Image"
                  class="h-24 w-24 object-cover mb-4 rounded-md"
                />
                <h3 class="font-bold text-center">{{ product.name }}</h3>
                <p class="text-center">Rp {{ product.salePrice.toLocaleString() }}</p>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 mt-8">
              <p>No products found in this category.</p>
            </div>
            <ThePagination
              v-if="filteredProducts.length > pageSize"
              :currentPage="currentPage"
              :totalPages="totalPages"
              :totalItems="filteredProducts.length"
              :pageSize="pageSize"
              @page-changed="onPageChanged"
              class="mt-4 pr-4"
            />
          </div>
        </div>

        <div class="md:w-1/3 flex flex-col bg-gray-50 rounded-lg shadow-inner">
          <h2 class="text-xl font-bold p-6 pb-4">Order Summary</h2>
          <div class="overflow-y-auto px-6" style="max-height: 250px">
            <div
              v-if="order.items.length === 0"
              class="flex items-center justify-center h-full py-10"
            >
              <div class="text-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p class="mt-2">Your cart is empty</p>
                <p class="text-sm">Add products to get started</p>
              </div>
            </div>
            <ul v-else class="space-y-3">
              <li
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
              >
                <div class="flex items-center">
                  <div>
                    <p class="font-semibold text-gray-800">{{ item.name }}</p>
                    <p class="text-sm text-gray-500">@ Rp {{ item.price.toLocaleString() }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="flex items-center border border-gray-200 rounded-md">
                    <button
                      type="button"
                      @click="decreaseQuantity(item)"
                      class="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                    >
                      -
                    </button>
                    <span class="px-4 py-1 text-gray-800 font-medium text-sm">{{
                      item.quantity
                    }}</span>
                    <button
                      type="button"
                      @click="increaseQuantity(item)"
                      class="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                  <p class="w-24 text-right font-semibold text-gray-800 ml-4">
                    Rp {{ (item.price * item.quantity).toLocaleString() }}
                  </p>
                  <button
                    @click="removeItem(item)"
                    class="ml-3 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div class="p-6 pt-4">
            <div class="space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rp {{ subtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Discount</span>
                <span class="text-green-600">- Rp {{ discount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tax ({{ taxPercentage * 100 }}%)</span>
                <span>Rp {{ taxAmount.toLocaleString() }}</span>
              </div>
              <div
                class="flex justify-between font-bold text-xl text-gray-800 border-t border-gray-200 pt-3 mt-3"
              >
                <span>Total</span>
                <span>Rp {{ totalAmount.toLocaleString() }}</span>
              </div>
            </div>
            <button
              type="submit"
              :disabled="order.items.length === 0"
              class="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>