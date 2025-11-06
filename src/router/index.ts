import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUiStore } from '@/stores/ui'

import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import OrderView from '../views/OrderView.vue'
import CategoryView from '../views/CategoryView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Dashboard' },
  },
  {
    path: '/product',
    name: 'Product',
    component: ProductView,
    meta: { title: 'Product', parent: 'Master Data' },
  },
  {
    path: '/order',
    name: 'Order',
    component: OrderView,
    meta: { title: 'Order', parent: 'Transaction' },
  },
  {
    path: '/category',
    name: 'Category',
    component: CategoryView,
    meta: { title: 'Category', parent: 'Master Data' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  const uiStore = useUiStore()
  if (to.meta.parent) {
    uiStore.setPageTitle(`${to.meta.parent} ${to.meta.title}`)
  } else {
    uiStore.setPageTitle(to.meta.title as string)
  }
})

export default router
