import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

//Auth API
export const authApi = {
    login: (username, password) => api.post('/auth/login', { username, password }),
    register: (data) => api.post('/auth/register', data),
};

// User API
export const userApi = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Product API
export const productApi = {
    getAll: (params) => api.get('/products', { params }),
    search: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

// Category API
export const categoryApi = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Order API
export const orderApi = {
    create: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
};

export const category2Api = {
    getAll: () => api.get('/categories2'),
    getById: (id) => api.get(`/categories2/${id}`),
    create: (data) => api.post('/categories2', data),
    update: (id, data) => api.put(`/categories2/${id}`, data),
    delete: (id) => api.delete(`/categories2/${id}`),
};

export const product2Api = {
    getAll: (params) => api.get('/product2', { params }),
    search: (params) => api.get('/product2', { params }),
    getById: (id) => api.get(`/product2/${id}`),
    create: (data) => api.post('/product2', data),
    update: (id, data) => api.put(`/product2/${id}`, data),
    delete: (id) => api.delete(`/product2/${id}`),
};

export default api;








//aaaaaaaaaaa
export function slugify(text) {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export const CATEGORY_ALIASES = {
  electronics: ['electronics', 'eletronicos', 'dien-tu', 'dien-thoai', 'tech', 'gadgets', '1'],
  clothing: ['clothing', 'thoi-trang', 'quan-ao', 'fashion', 'moda', 'clothes', 'apparel', '2'],
  books: ['books', 'sach', 'livros', 'publications', '3'],
  'home-garden': ['home-garden', 'home', 'garden', 'casa', 'gia-dung', 'nha-cua', '4'],
  sports: ['sports', 'esportes', 'the-thao', 'fitness', '5'],
  beauty: ['beauty', 'beleza', 'lam-dep', 'my-pham', '6'],
  accessories: ['accessories', 'acessorios', 'phu-kien', '7'],
}

export const DEFAULT_DATABASE_CATEGORIES = [
  { id: 1, slug: 'electronics', name: 'Điện tử', icon: 'package', description: 'Laptop, điện thoại & thiết bị công nghệ' },
  { id: 2, slug: 'clothing', name: 'Thời trang', icon: 'tag', description: 'Quần áo & phụ kiện thời trang nam nữ' },
  { id: 3, slug: 'books', name: 'Sách & Ấn phẩm', icon: 'bookmark', description: 'Sách chuyên ngành, lập trình & văn học' },
  { id: 4, slug: 'home-garden', name: 'Nhà cửa & Đời sống', icon: 'home', description: 'Nội thất, gia dụng & làm vườn' },
  { id: 5, slug: 'sports', name: 'Thể thao & Dã ngoại', icon: 'zap', description: 'Dụng cụ thể dục thể thao & dã ngoại' },
]

export function getCategoryDisplayName(category) {
  if (!category) return ''
  const slug = String(category?.slug || category?.category || category?.name || category || '').toLowerCase().trim()
  const id = String(category?.id || category?.categoryId || '')
  if (slug === 'electronics' || slug.includes('dien-tu') || slug.includes('electronic') || id === '1') return 'Điện tử'
  if (slug === 'clothing' || slug.includes('thoi-trang') || slug.includes('cloth') || id === '2') return 'Thời trang'
  if (slug === 'books' || slug.includes('sach') || slug.includes('book') || id === '3') return 'Sách & Ấn phẩm'
  if (slug === 'home-garden' || slug.includes('nha-cua') || slug.includes('gia-dung') || slug.includes('home') || id === '4') return 'Nhà cửa & Đời sống'
  if (slug === 'sports' || slug.includes('the-thao') || slug.includes('sport') || id === '5') return 'Thể thao & Dã ngoại'
  return category?.name || category?.categoryName || String(category)
}

export function isCategoryMatch(item, target) {
  if (!target) return true
  const t = String(target).toLowerCase().trim()
  const cSlug = String(item?.slug || item?.category || '').toLowerCase().trim()
  const cName = slugify(item?.name || item?.categoryName || '')
  const cId = item?.categoryId || item?.id ? String(item.categoryId || item.id) : ''

  if (cSlug === t || (cSlug && t.includes(cSlug)) || (t && cSlug.includes(t))) return true
  if (cName === t || (cName && t.includes(cName)) || (t && cName.includes(t))) return true
  if (cId === t) return true

  for (const [canonical, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (canonical === t || aliases.includes(t)) {
      if (canonical === cSlug || aliases.includes(cSlug) || aliases.includes(cId) || (cName && aliases.includes(cName))) {
        return true
      }
    }
  }

  return false
}

function getCategoryIcon(name) {
  const n = (name || '').toLowerCase()
  if (n.includes('điện thoại') || n.includes('phone') || n.includes('electronic') || n.includes('laptop') || n.includes('gadget')) return 'package'
  if (n.includes('thời trang') || n.includes('quần') || n.includes('áo') || n.includes('cloth') || n.includes('fashion')) return 'tag'
  if (n.includes('nhà') || n.includes('gia dụng') || n.includes('home') || n.includes('garden')) return 'home'
  if (n.includes('thể thao') || n.includes('sport') || n.includes('fitness')) return 'zap'
  if (n.includes('sách') || n.includes('book')) return 'bookmark'
  if (n.includes('mỹ phẩm') || n.includes('sắc đẹp') || n.includes('beauty')) return 'star'
  return 'gift'
}

export function mapBackendCategoryToFrontend(c) {
  const id = Number(c?.id ?? c?.Id ?? 0)
  const name = String(c?.name ?? c?.Name ?? `Danh mục ${id}`)
  const description = String(c?.description ?? c?.Description ?? '')
  const slug = slugify(name) || `cat-${id}`

  return {
    id,
    name,
    slug,
    icon: getCategoryIcon(name),
    description,
  }
}

export function mapBackendProductToFrontend(p, categoryNameMap = {}) {
  const id = Number(p?.id ?? p?.Id ?? 0)
  const name = String(p?.name ?? p?.Name ?? 'Sản phẩm')
  const price = Number(p?.price ?? p?.Price ?? 0)
  const stock = Number(p?.stock ?? p?.Stock ?? 0)
  const imageUrl = String(p?.imageUrl ?? p?.ImageUrl ?? p?.image ?? p?.Image ?? '')
  const description = String(p?.description ?? p?.Description ?? '')
  const rawCatId = p?.categoryId ?? p?.CategoryId
  const categoryId = rawCatId != null && !isNaN(Number(rawCatId)) ? Number(rawCatId) : undefined

  const categoryName = categoryId && categoryNameMap[categoryId]
    ? categoryNameMap[categoryId]
    : (p?.category?.name || p?.Category?.Name || '')

  const categorySlug = slugify(categoryName) || (categoryId ? `cat-${categoryId}` : '')
  const baseSlug = slugify(name) || `product-${id}`
  const slug = `${baseSlug}-${id}`

  return {
    id,
    name,
    slug,
    price,
    priceOld: p?.priceOld ?? p?.PriceOld ? Number(p?.priceOld ?? p?.PriceOld) : undefined,
    category: categorySlug,
    categoryName,
    categoryId,
    brand: p?.brand || p?.Brand || '',
    rating: p?.rating || p?.Rating ? Number(p?.rating || p?.Rating) : 0,
    reviewsCount: p?.reviewsCount || p?.ReviewsCount ? Number(p?.reviewsCount || p?.ReviewsCount) : 0,
    stock,
    description,
    imageUrl,
    featured: Boolean(p?.featured ?? p?.Featured ?? false),
    bestseller: Boolean(p?.bestseller ?? p?.Bestseller ?? false),
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    let errorDetail = response.statusText
    try {
      const errorJson = await response.json()
      errorDetail = errorJson.message || errorJson.error || JSON.stringify(errorJson)
    } catch {}

    throw new Error(errorDetail || `Yêu cầu thất bại với mã ${response.status}`)
  }

  if (response.status === 204) return {}
  return response.json()
}

function extractItems(res) {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.items)) return res.items
  if (Array.isArray(res.Items)) return res.Items
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.records)) return res.records
  return []
}

// Auth API
// export const authApi = {
//   async login(username, password) {
//     const data = await request('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ username, password }),
//     })
//     if (data?.token) {
//       localStorage.setItem('token', data.token)
//     }
//     return data
//   },

//   async register(payload) {
//     return request('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(payload),
//     })
//   },
// }

// // Product API
// export const productApi = {
//   async getAll(params = {}) {
//     const query = new URLSearchParams()
//     if (params.keyword) query.append('keyword', params.keyword)
//     if (params.categoryId) query.append('categoryId', params.categoryId.toString())
//     if (params.page) query.append('page', params.page.toString())
//     if (params.pageSize) query.append('pageSize', params.pageSize.toString())

//     const qs = query.toString()
//     const endpointSuffix = qs ? `?${qs}` : ''

//     // 1. Thử /products
//     try {
//       const res = await request(`/products${endpointSuffix}`, { method: 'GET' })
//       const items = extractItems(res)
//       if (items.length > 0) {
//         return {
//           items,
//           totalCount: res?.totalCount ?? res?.TotalCount ?? items.length,
//           page: res?.page ?? res?.Page ?? 1,
//           pageSize: res?.pageSize ?? res?.PageSize ?? items.length,
//           totalPages: res?.totalPages ?? res?.TotalPages ?? 1,
//         }
//       }
//     } catch (err) {
//       console.warn('[API JS] Kiểm tra /products:', err.message)
//     }

//     // 2. Thử /product2
//     try {
//       const res2 = await request(`/product2${endpointSuffix}`, { method: 'GET' })
//       const items2 = extractItems(res2)
//       if (items2.length > 0) {
//         return {
//           items: items2,
//           totalCount: res2?.totalCount ?? res2?.TotalCount ?? items2.length,
//           page: res2?.page ?? res2?.Page ?? 1,
//           pageSize: res2?.pageSize ?? res2?.PageSize ?? items2.length,
//           totalPages: res2?.totalPages ?? res2?.TotalPages ?? 1,
//         }
//       }
//     } catch (err) {
//       console.warn('[API JS] Kiểm tra /product2:', err.message)
//     }

//     return { items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 }
//   },

//   async getById(id) {
//     try {
//       return await request(`/products/${id}`, { method: 'GET' })
//     } catch {
//       return await request(`/product2/${id}`, { method: 'GET' })
//     }
//   },

//   async create(data) {
//     return request('/products', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     })
//   },

//   async update(id, data) {
//     return request(`/products/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     })
//   },

//   async delete(id) {
//     return request(`/products/${id}`, {
//       method: 'DELETE',
//     })
//   },
// }

// // Category API
// export const categoryApi = {
//   async getAll() {
//     const list = []
//     const seenIds = new Set()

//     try {
//       const res = await request('/categories', { method: 'GET' })
//       extractItems(res).forEach((c) => {
//         const id = c.id ?? c.Id
//         if (id && !seenIds.has(id)) {
//           seenIds.add(id)
//           list.push(c)
//         }
//       })
//     } catch (err) {
//       console.warn('[API JS] /categories:', err.message)
//     }

//     try {
//       const res2 = await request('/categories2', { method: 'GET' })
//       extractItems(res2).forEach((c) => {
//         const id = c.id ?? c.Id
//         if (id && !seenIds.has(id)) {
//           seenIds.add(id)
//           list.push(c)
//         }
//       })
//     } catch (err) {
//       console.warn('[API JS] /categories2:', err.message)
//     }

//     return list
//   },

//   async create(data) {
//     return request('/categories', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     })
//   },

//   async update(id, data) {
//     return request(`/categories/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     })
//   },

//   async delete(id) {
//     return request(`/categories/${id}`, {
//       method: 'DELETE',
//     })
//   },
// }

// Order API
// export const orderApi = {
//   async getAll() {
//     try {
//       const res = await request('/orders/all', { method: 'GET' })
//       return extractItems(res)
//     } catch {
//       const res2 = await request('/orders', { method: 'GET' })
//       return extractItems(res2)
//     }
//   },

//   async getMyOrders() {
//     return request('/orders', { method: 'GET' })
//   },

//   async getById(id) {
//     return request(`/orders/${id}`, { method: 'GET' })
//   },

//   async create(data) {
//     return request('/orders', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     })
//   },

//   async updateStatus(id, status) {
//     return request(`/orders/${id}/status`, {
//       method: 'PUT',
//       body: JSON.stringify({ status }),
//     })
//   },

//   async cancel(id) {
//     return request(`/orders/${id}/cancel`, {
//       method: 'PUT',
//     })
//   },
// }

// // User API
// export const userApi = {
//   async getAll(params = {}) {
//     const query = new URLSearchParams()
//     if (params.keyword) query.append('keyword', params.keyword)
//     if (params.page) query.append('page', params.page.toString())
//     if (params.pageSize) query.append('pageSize', params.pageSize.toString())
//     const qs = query.toString()

//     try {
//       const res = await request(`/users${qs ? `?${qs}` : ''}`, { method: 'GET' })
//       return {
//         items: res?.data || extractItems(res),
//         totalCount: res?.totalCount || 0,
//         page: res?.page || 1,
//         pageSize: res?.pageSize || 10,
//         totalPages: res?.totalPages || 1,
//       }
//     } catch (err) {
//       console.warn('[API JS] /users error:', err.message)
//       return { items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 }
//     }
//   },

//   async create(data) {
//     return request('/users', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     })
//   },

//   async update(id, data) {
//     return request(`/users/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     })
//   },

//   async delete(id) {
//     return request(`/users/${id}`, {
//       method: 'DELETE',
//     })
//   },
// }
