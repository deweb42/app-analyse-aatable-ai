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
      <span className="text-xs text-gray-400 w-4 text-right shrink-0">{index + 1}</span>
      <img src={cutleryIcon} alt="" className="w-4 h-4 shrink-0 opacity-60" />
      <span className="text-sm text-gray-800 truncate flex-1">{competitor.name}</span>
      <div className="flex items-center gap-0.5 shrink-0">
        <img src={starIcon} alt="" className="w-3 h-3" />
        <span className="text-xs text-gray-600">{competitor.rating}</span>
      </div>
    </div>
  )
}
