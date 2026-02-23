import type { HealthReport } from '../../types/report'
import { useI18n } from '../../lib/i18n'
import { ScoreCard } from '../scorecard/ScoreCard'
import { CTAButton } from '../shared/CTAButton'
import { RadialProgress } from '../shared/RadialProgress'

interface SidebarProps {
  report: HealthReport
}

export function Sidebar({ report }: SidebarProps) {
  const { t } = useI18n()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block h-full w-full lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:min-w-[280px] lg:max-w-[280px] lg:p-2 lg:pr-0">
        <ScoreCard report={report} />
      </aside>

      {/* Mobile bottom bar */}
      <div className="fixed right-0 bottom-0 left-0 z-100 m-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10 border border-gray-200/50 p-3.5 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RadialProgress
              size="sm"
              score={report.overallScore.score}
              maxScore={report.overallScore.maxScore}
              strokeColor={report.overallScore.strokeColor}
            />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900 tabular-nums">{report.overallScore.score}</span>
                <span className="text-xs text-gray-400">/ {report.overallScore.maxScore}</span>
              </div>
              <span
                className="text-xs font-semibold"
                style={{ color: report.overallScore.strokeColor }}
              >
                {t(report.overallScore.rating)}
              </span>
            </div>
          </div>
          <CTAButton text={report.ctaText} />
        </div>
      </div>
    </>
  )
}
