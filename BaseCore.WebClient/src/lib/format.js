/**
 * Định dạng giá tiền chuẩn Việt Nam Đồng (VND)
 */
export function formatPrice(value) {
  const num = Number(value) || 0
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num)
}

export function discountPercent(price, priceOld) {
  if (!priceOld || priceOld <= price) return 0
  return Math.round(((priceOld - price) / priceOld) * 100)
}
