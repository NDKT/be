import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { orderApi } from '@/services/api'

function genOrderId() {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `BC-${n}`
}

function mapBackendStatus(status) {
  if (!status) return 'placed'
  const s = String(status).toLowerCase()
  if (s === 'completed' || s === 'delivered') return 'delivered'
  if (s === 'shipping' || s === 'shipped') return 'shipped'
  if (s === 'paid') return 'paid'
  return 'placed'
}

export const useOrdersStore = create(
  persist(
    (set, get) => ({
      orders: [],
      lastOrderId: null,
      isLoading: false,

      async placeOrder(order) {
        let backendId = undefined
        const localId = genOrderId()

        try {
          const validItems = (order.items || []).map((i) => ({
            productId: Number(i.productId) || 1,
            quantity: Number(i.qty) || 1,
          }))

          const res = await orderApi.create({
            items: validItems,
            shippingAddress: order.shippingAddress,
          })

          if (res?.order?.id || res?.id) {
            backendId = res?.order?.id || res?.id
          }
        } catch (err) {
          console.warn('Backend order placement warning:', err?.message || err)
        }

        const id = backendId ? `BC-${backendId}` : localId
        const full = {
          ...order,
          id,
          backendOrderId: backendId,
          createdAt: new Date().toISOString(),
          status: order.payment === 'cod' ? 'placed' : 'paid',
        }

        set({ orders: [full, ...get().orders], lastOrderId: id })
        return id
      },

      async fetchMyOrders() {
        const token = localStorage.getItem('token')
        if (!token) return

        set({ isLoading: true })
        try {
          const backendOrders = await orderApi.getMyOrders()
          if (Array.isArray(backendOrders)) {
            const mappedOrders = backendOrders.map((bo) => ({
              id: `BC-${bo.id || bo.Id}`,
              backendOrderId: bo.id || bo.Id,
              createdAt: bo.orderDate || bo.OrderDate || new Date().toISOString(),
              items: (bo.orderDetails || bo.OrderDetails || []).map((d) => ({
                id: d.id || d.Id,
                productId: d.productId || d.ProductId,
                name: d.product?.name || d.Product?.Name || `Sản phẩm #${d.productId || d.ProductId}`,
                price: d.unitPrice || d.UnitPrice || 0,
                qty: d.quantity || d.Quantity || 1,
              })),
              subtotal: bo.totalAmount || bo.TotalAmount || 0,
              discount: 0,
              shipping: 0,
              total: bo.totalAmount || bo.TotalAmount || 0,
              payment: 'cod',
              status: mapBackendStatus(bo.status || bo.Status),
              shippingAddress: bo.shippingAddress || bo.ShippingAddress || '',
            }))

            set({ orders: mappedOrders, isLoading: false })
            return
          }
        } catch (err) {
          console.error('Không thể tải đơn hàng từ máy chủ:', err?.message || err)
        } finally {
          set({ isLoading: false })
        }
      },

      getOrder(id) {
        return get().orders.find((o) => o.id === id || String(o.backendOrderId) === String(id))
      },
    }),
    { name: 'shop-orders' }
  )
)
