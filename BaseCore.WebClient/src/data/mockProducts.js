const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600?text=No+Image'

export function productImages(slug, count = 4, customImage = '') {
  if (customImage && String(customImage).trim()) {
    const list = [customImage]
    while (list.length < count) {
      list.push(customImage)
    }
    return list
  }
  return Array.from({ length: count }, () => PLACEHOLDER_IMAGE)
}

// Xóa bỏ toàn bộ dữ liệu mẫu tĩnh. Chỉ nạp dữ liệu từ SQL Server Backend.
export const mockCategories = []
export const mockProducts = []

export function findProduct() {
  return null
}

export function relatedProducts() {
  return []
}
