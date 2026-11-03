import { formatPrice, discountPercent } from '@/lib/format'

const SIZES = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
}

export default function PriceTag({ price, priceOld, size = 'md', showBadge = false }) {
  const pct = discountPercent(price, priceOld)

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`font-bold text-heading ${SIZES[size]}`}>{formatPrice(price)}</span>
      {priceOld && priceOld > price && (
        <span className="text-sm text-muted line-through">{formatPrice(priceOld)}</span>
      )}
      {showBadge && pct > 0 && (
        <span className="rounded-full bg-error-50 px-2 py-0.5 text-xs font-semibold text-error-600 dark:bg-error-500/15 dark:text-error-500">
          -{pct}%
        </span>
      )}
    </div>
  )
}
