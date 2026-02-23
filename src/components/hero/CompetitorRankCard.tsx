import type { OverallCompetitor, Restaurant } from '../../types/report'
import { useI18n } from '../../lib/i18n'
import cutleryIcon from '../../assets/icons/cutlery.svg'
import starIcon from '../../assets/icons/star.svg'

interface CompetitorRankCardProps {
  competitors: OverallCompetitor[]
  restaurant: Restaurant
  restaurantRating: number
}

export function CompetitorRankCard({ competitors, restaurant, restaurantRating }: CompetitorRankCardProps) {
  const { t, locale } = useI18n()

  const ordinalSuffix = (n: number) => {
    if (locale === 'fr') return n + (n === 1 ? 'er' : 'e')
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-200/60 shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-5 pb-2">
        <h2 className="text-lg font-bold text-gray-900 leading-snug tracking-tight">
          {t('rankingBelow', { count: competitors.length })}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-1">
        {competitors.map((comp) => (
          <div
            key={comp.name}
            className="flex items-center gap-2.5 py-[7px] border-b border-gray-50 last:border-b-0"
          >
            <span className="text-[11px] text-gray-300 w-3 text-right font-semibold tabular-nums">{comp.rank}</span>
            <img src={cutleryIcon} alt="" className="w-4 h-4 opacity-25 shrink-0" />
            <span className="text-[13px] text-gray-600 truncate flex-1">{comp.name}</span>
            <div className="flex items-center gap-0.5 shrink-0">
              <img src={starIcon} alt="" className="w-3 h-3" />
              <span className="text-[11px] text-gray-400 tabular-nums">{comp.rating}</span>
            </div>
            <span className="text-[11px] text-gray-300 font-medium w-7 text-right tabular-nums">
              {ordinalSuffix(comp.rank)}
            </span>
          </div>
        ))}
      </div>

      {/* Current restaurant row */}
      <div className="border-t-2 border-red-100 bg-gradient-to-r from-red-50/80 to-red-50/40 px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-red-400 w-3 text-right font-bold tabular-nums">{competitors.length + 1}</span>
          <div className="w-4 h-4 rounded-full bg-red-200 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          </div>
          <span className="text-[13px] text-red-700 font-semibold truncate flex-1">{restaurant.name}</span>
          <div className="flex items-center gap-0.5 shrink-0">
            <img src={starIcon} alt="" className="w-3 h-3" />
            <span className="text-[11px] text-red-400 tabular-nums">{restaurantRating}</span>
          </div>
          <span className="text-[11px] text-red-400 font-bold w-7 text-right tabular-nums">
            {ordinalSuffix(competitors.length + 1)}
          </span>
        </div>
      </div>
    </div>
  )
}
