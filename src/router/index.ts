import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUiStore } from '@/stores/ui'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Dashboard' },
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('../views/ProductView.vue'),
    meta: { title: 'Product', parent: 'Master Data' },
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/OrderView.vue'),
    meta: { title: 'Order', parent: 'Transaction' },
  },
  {
    path: '/order/create',
    name: 'OrderCreate',
    component: () => import('../views/OrderFormView.vue'),
    meta: { title: 'Create Order', parent: 'Transaction' },
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('../views/OrderDetailView.vue'),
    meta: { title: 'Order Details', parent: 'Transaction' },
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('../views/CategoryView.vue'),
    meta: { title: 'Category', parent: 'Master Data' },
  },
  {
    path: '/uom',
    name: 'UoM',
    component: () => import('../views/UomView.vue'),
    meta: { title: 'UoM', parent: 'Master Data' },
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
