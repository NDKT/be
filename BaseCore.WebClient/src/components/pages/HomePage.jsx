import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productImages } from '@/data/mockProducts'
import { categoryApi, productApi, mapBackendCategoryToFrontend, mapBackendProductToFrontend } from '@/services/api'
import { useUiStore } from '@/stores/ui'
import ProductCard from '@/components/product/ProductCard'
import CategoryCard from '@/components/catalog/CategoryCard'
import SectionHeader from '@/components/ui/SectionHeader'
import IconBase from '@/components/ui/IconBase'

const BENEFITS = [
  { icon: 'truck', title: 'Giao hàng toàn quốc', desc: 'Miễn phí cho đơn từ 299.000₫' },
  { icon: 'shield-check', title: 'Bảo mật tuyệt đối', desc: 'Chứng thực bảo mật chuẩn SSL' },
  { icon: 'refresh', title: 'Đổi trả miễn phí', desc: '30 ngày đổi mới nếu phát sinh lỗi' },
  { icon: 'clock', title: 'Hỗ trợ 24/7', desc: 'Đội ngũ CSKH chuyên nghiệp' },
]

export default function HomePage() {
  const notify = useUiStore((s) => s.notifySuccess)
  const [email, setEmail] = useState('')
  const [productsList, setProductsList] = useState([])
  const [categoriesList, setCategoriesList] = useState([])

  useEffect(() => {
    let active = true
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.allSettled([
          categoryApi.getAll(),
          productApi.getAll({ pageSize: 12 }),
        ])

        let catMap = {}
        if (catRes.status === 'fulfilled' && Array.isArray(catRes.value)) {
          const mappedCats = catRes.value.map(mapBackendCategoryToFrontend)
          catMap = catRes.value.reduce((acc, c) => ({ ...acc, [String(c.id ?? c.Id)]: c.name ?? c.Name }), {})
          if (active) setCategoriesList(mappedCats)
        }

        if (prodRes.status === 'fulfilled') {
          const rawItems = prodRes.value?.items || (Array.isArray(prodRes.value) ? prodRes.value : [])
          const mappedProds = rawItems.map((p) => mapBackendProductToFrontend(p, catMap))
          if (active) setProductsList(mappedProds)
        }
      } catch (err) {
        console.error('[HomePage] Lỗi nạp dữ liệu từ backend:', err)
      }
    }
    loadData()
    return () => {
      active = false
    }
  }, [])

  const featured = (productsList.some((p) => p.featured)
    ? productsList.filter((p) => p.featured)
    : productsList
  ).slice(0, 8)

  const bestsellers = (productsList.some((p) => p.bestseller)
    ? productsList.filter((p) => p.bestseller)
    : productsList
  ).slice(0, 4)

  function subscribe(e) {
    e.preventDefault()
    if (!email.trim()) return
    notify('Cảm ơn bạn đã đăng ký nhận tin!')
    setEmail('')
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-gray-900 dark:via-gray-dark dark:to-gray-900">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-500/10" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <IconBase name="zap" size={14} />
              Bộ sưu tập 2026
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-heading sm:text-4xl lg:text-5xl">
              Tất cả những gì bạn cần, hội tụ tại một nơi
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted">
              Sản phẩm chọn lọc chất lượng cao, giao hàng siêu tốc và giá tốt nhất từ hệ thống BaseCore.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="flex h-12 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white shadow-theme-md transition hover:bg-brand-600"
              >
                <IconBase name="cart" size={18} />
                Mua sắm ngay
              </Link>
              <Link
                to="/products?sort=price-asc"
                className="flex h-12 items-center rounded-lg border border-themed bg-white px-6 text-sm font-medium text-body transition hover:bg-gray-50 dark:bg-gray-dark dark:hover:bg-gray-800"
              >
                Xem khuyến mãi
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {productsList.slice(0, 4).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug || p.id}`}
                  className={`overflow-hidden rounded-2xl border border-themed shadow-theme-md transition hover:scale-105 ${
                    i % 2 ? 'mt-8' : ''
                  }`}
                >
                  <img
                    src={productImages(p.slug, 1, p.imageUrl)[0]}
                    alt={p.name}
                    className="aspect-square w-full object-cover"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-themed bg-white dark:bg-gray-dark">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
                <IconBase name={b.icon} size={22} />
              </span>
              <div>
                <p className="text-sm font-semibold text-heading">{b.title}</p>
                <p className="text-xs text-muted">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader
          title="Danh mục nổi bật"
          actionText="Xem tất cả"
          actionLink="/products"
          className="mb-8"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categoriesList.map((c) => (
            <CategoryCard key={c.id || c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-white dark:bg-gray-dark">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeader
            title="Sản phẩm tiêu biểu"
            actionText="Xem tất cả"
            actionLink="/products"
            className="mb-8"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-12 text-white sm:px-12">
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10" />
          <div className="relative max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Khuyến mãi đặc biệt</p>
            <h2 className="mt-3 text-3xl font-bold">Sản phẩm bán chạy nhất</h2>
            <Link
              to="/products"
              className="mt-6 inline-flex h-11 items-center rounded-lg bg-white px-6 text-sm font-medium text-brand-600 transition hover:bg-gray-100"
            >
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-white dark:bg-gray-dark">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeader
            title="Sản phẩm bán chạy"
            actionText="Xem tất cả"
            actionLink="/products?sort=rating"
            className="mb-8"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-themed bg-gray-50 p-8 text-center dark:bg-gray-900/40 sm:p-12">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <IconBase name="mail" size={26} />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-heading">Đăng ký nhận ưu đãi</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên của bạn.</p>
          <form onSubmit={subscribe} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn..."
              className="h-12 flex-1 rounded-lg border border-themed bg-white px-4 text-sm text-body outline-none focus:border-brand-300 focus-ring dark:bg-gray-900"
            />
            <button
              type="submit"
              className="cursor-pointer h-12 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
