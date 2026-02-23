import type { CompetitorRanking } from '../../types/report'
import cutleryIcon from '../../assets/icons/cutlery.svg'
import starIcon from '../../assets/icons/star.svg'

interface CompetitorEntryProps {
  competitor: CompetitorRanking
  index: number
}

export function CompetitorEntry({ competitor, index }: CompetitorEntryProps) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="text-[11px] text-gray-300 w-3 text-right shrink-0 font-semibold tabular-nums">{index + 1}</span>
      <img src={cutleryIcon} alt="" className="w-3.5 h-3.5 shrink-0 opacity-40" />
      <span className="text-[12px] text-gray-700 truncate flex-1">{competitor.name}</span>
      <div className="flex items-center gap-0.5 shrink-0">
        <img src={starIcon} alt="" className="w-2.5 h-2.5" />
        <span className="text-[11px] text-gray-400 tabular-nums">{competitor.rating}</span>
      </div>
    </div>
  )
}
