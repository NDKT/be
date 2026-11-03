import { Link } from 'react-router-dom'
import { getCategoryDisplayName } from '@/services/api'
import IconBase from '@/components/ui/IconBase'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="surface-card group flex flex-col items-center justify-center rounded-2xl border p-6 text-center transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-theme-md"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-500/15 dark:text-brand-400">
        <IconBase name={category.icon || 'tag'} size={28} />
      </span>
      <h3 className="mt-4 font-semibold text-heading group-hover:text-brand-600">
        {getCategoryDisplayName(category)}
      </h3>
      {category.description && (
        <p className="mt-1 text-xs text-muted">
          {category.description}
        </p>
      )}
    </Link>
  )
}
