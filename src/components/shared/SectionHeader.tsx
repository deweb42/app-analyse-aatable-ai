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
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 px-5 py-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold">
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-900 truncate">{title}</h2>
          <p className="text-xs text-gray-400 truncate">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
          <RadialProgress
            size="inline"
            score={score}
            maxScore={maxScore}
            strokeColor={scoreColor}
          />
          <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor }}>
            {score}/{maxScore}
          </span>
        </div>
      </div>
    </div>
  )
}
