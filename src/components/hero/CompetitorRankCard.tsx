import type { OverallCompetitor } from '../../types/report'
import cutleryIcon from '../../assets/icons/cutlery.svg'
import starIcon from '../../assets/icons/star.svg'

interface CompetitorRankCardProps {
  competitors: OverallCompetitor[]
}

export function CompetitorRankCard({ competitors }: CompetitorRankCardProps) {
  const ordinalSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-5 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 leading-tight mb-4">
        You're ranking below {competitors.length} competitors
      </h2>

      <div className="flex-1 overflow-y-auto space-y-0">
        {competitors.map((comp) => (
          <div
            key={comp.name}
            className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-b-0"
          >
            <img src={cutleryIcon} alt="" className="w-5 h-5 opacity-40 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 truncate">{comp.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">{comp.rating}</span>
                <img src={starIcon} alt="" className="w-3 h-3" />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-400 shrink-0">
              {ordinalSuffix(comp.rank)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
