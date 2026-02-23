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
    <div className="group flex items-center gap-3 rounded-lg bg-white/50 px-3 py-2 cursor-pointer hover:bg-white/80 transition-colors">
      <RadialProgress
        size="sm"
        score={score}
        maxScore={maxScore}
        strokeColor={strokeColor}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        <p className="text-xs" style={{ color: ratingColor }}>
          {rating}
        </p>
      </div>
      <div className="relative">
        <span className="text-sm text-gray-600 group-hover:opacity-0 transition-opacity duration-300">
          {score}/{maxScore}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  )
}
