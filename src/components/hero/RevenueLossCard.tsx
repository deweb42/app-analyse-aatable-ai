import { AlertTriangle } from 'lucide-react'
import type { RevenueLoss, Restaurant } from '../../types/report'
import { formatCurrency } from '../../lib/score-utils'
import feastBuffetImg from '../../assets/images/feast-buffet.jpg'

interface RevenueLossCardProps {
  revenueLoss: RevenueLoss
  restaurant: Restaurant
}

export function RevenueLossCard({ revenueLoss, restaurant }: RevenueLossCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-white border border-gray-200 p-5 h-full">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 leading-tight">
          You could be losing ~{formatCurrency(revenueLoss.amount)}/month due to{' '}
          {revenueLoss.problems.length} problem
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        {revenueLoss.problems.map((problem) => (
          <div key={problem} className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-600 truncate">{problem}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <img
          src={restaurant.imageUrl || feastBuffetImg}
          alt={restaurant.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{restaurant.name}</p>
          <p className="text-xs text-gray-500 truncate">{restaurant.website}</p>
        </div>
      </div>
    </div>
  )
}
