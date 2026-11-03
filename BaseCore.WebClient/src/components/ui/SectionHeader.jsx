import { Link } from 'react-router-dom'
import IconBase from './IconBase'

export default function SectionHeader({ title, subtitle, actionText, actionLink, className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          {actionText}
          <IconBase name="arrow-right" size={16} />
        </Link>
      )}
    </div>
  )
}
