import { AlertTriangle } from 'lucide-react'
import type { RevenueLoss, Restaurant } from '../../types/report'
import { formatCurrency } from '../../lib/score-utils'
import { useI18n } from '../../lib/i18n'
import feastBuffetImg from '../../assets/images/feast-buffet.jpg'

interface RevenueLossCardProps {
  revenueLoss: RevenueLoss
  restaurant: Restaurant
}

export function RevenueLossCard({ revenueLoss, restaurant }: RevenueLossCardProps) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col rounded-2xl bg-white border border-gray-200/60 shadow-sm overflow-hidden h-full">
      <div className="flex-1 p-5">
        <h2 className="text-lg font-bold text-gray-900 leading-snug tracking-tight">
          {t('couldBeLosing', {
            amount: formatCurrency(revenueLoss.amount),
            count: revenueLoss.problems.length,
            s: revenueLoss.problems.length > 1 ? 's' : '',
          })}
        </h2>

        <div className="mt-5 space-y-2">
          {revenueLoss.problems.map((problem) => (
            <div key={problem} className="flex items-start gap-2.5 rounded-lg bg-amber-50/80 border border-amber-100/60 px-3 py-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-[13px] text-amber-800 leading-snug">{problem}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-3 flex items-center gap-3">
        <img
          src={restaurant.imageUrl || feastBuffetImg}
          alt={restaurant.name}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
        />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-gray-900 truncate">{restaurant.name}</p>
          <p className="text-[11px] text-gray-400 truncate">{restaurant.website}</p>
        </div>
      </div>
    </div>
  )
}
