import { RadialProgress } from './RadialProgress'

interface SectionHeaderProps {
  number: number
  title: string
  subtitle: string
  score: number
  maxScore: number
  scoreColor: string
}

export function SectionHeader({
  number,
  title,
  subtitle,
  score,
  maxScore,
  scoreColor,
}: SectionHeaderProps) {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 px-4 py-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-sm font-medium">
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 truncate">{title}</h2>
          <p className="text-sm text-gray-500 truncate">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <RadialProgress
            size="inline"
            score={score}
            maxScore={maxScore}
            strokeColor={scoreColor}
          />
          <span className="text-sm font-medium text-gray-700">
            {score}/{maxScore}
          </span>
        </div>
      </div>
    </div>
  )
}
