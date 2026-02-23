import type { HealthReport } from '../../types/report'
import { ScoreCard } from '../scorecard/ScoreCard'
import { CTAButton } from '../shared/CTAButton'

interface SidebarProps {
  report: HealthReport
}

export function Sidebar({ report }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block h-full w-full lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:min-w-82 lg:p-2 lg:pr-0">
        <ScoreCard report={report} />
      </aside>

      {/* Mobile bottom bar */}
      <div className="fixed right-0 bottom-0 left-0 z-100 m-2 rounded-lg bg-white shadow-lg border border-gray-200 p-3 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-gray-900">{report.overallScore.score}</span>
            <span className="text-sm text-gray-500">/ {report.overallScore.maxScore}</span>
            <span
              className="text-sm font-medium ml-1"
              style={{ color: report.overallScore.strokeColor }}
            >
              {report.overallScore.rating}
            </span>
          </div>
          <CTAButton text={report.ctaText} />
        </div>
      </div>
    </>
  )
}
