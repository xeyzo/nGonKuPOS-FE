export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  categoryName?: string
}
export interface Order {
  id: number
  receiptNumber: string | null
  orderDate: string
  status: string
  outletName: string
  customerName: string
  tableNumber: string
  paymentMethod: string
  discountTotal: number
  subtotal: number
  taxTotal: number
  totalAmount: number
  paidAmount: number
  changeAmount: number
  notes: string
  items: OrderItem[]
}

// New interfaces for the API payload
export interface OrderItemPayload {
  productId: number
  quantity: number
  discount: number
}

export interface PaymentPayload {
  paymentMethod: string
  amount: number
  notes: string
}

export interface OrderPayload {
  outletName: string
  customerName: string
  tableNumber: string
  discountTotal: number
  notes: string
  items: OrderItemPayload[]
  payments: PaymentPayload[]
}