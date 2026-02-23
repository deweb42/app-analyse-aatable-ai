import { ArrowRight } from 'lucide-react'
import type { RatingLevel } from '../../types/report'
import { getRatingColor } from '../../lib/score-utils'
import { RadialProgress } from '../shared/RadialProgress'

interface SubScoreRowProps {
  name: string
  score: number
  maxScore: number
  rating: RatingLevel
  strokeColor: string
}

export function SubScoreRow({ name, score, maxScore, rating, strokeColor }: SubScoreRowProps) {
  const ratingColor = getRatingColor(rating)

  return (
    <div className="group flex items-center gap-3 rounded-xl bg-white/40 backdrop-blur-sm px-3 py-2.5 cursor-pointer hover:bg-white/70 transition-all duration-200">
      <RadialProgress
        size="sm"
        score={score}
        maxScore={maxScore}
        strokeColor={strokeColor}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-900 truncate">{name}</p>
        <p className="text-[11px] font-medium" style={{ color: ratingColor }}>
          {rating}
        </p>
      </div>
      <div className="relative w-10 text-right">
        <span className="text-[13px] text-gray-500 tabular-nums group-hover:opacity-0 transition-opacity duration-200">
          {score}/{maxScore}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
    </div>
  )
}
