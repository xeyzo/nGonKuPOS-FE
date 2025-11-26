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
