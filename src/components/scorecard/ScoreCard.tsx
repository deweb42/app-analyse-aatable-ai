import type { HealthReport } from '../../types/report'
import { getRatingColor } from '../../lib/score-utils'
import { useI18n } from '../../lib/i18n'
import { RadialProgress } from '../shared/RadialProgress'
import { CTAButton } from '../shared/CTAButton'
import { SubScoreRow } from './SubScoreRow'

interface ScoreCardProps {
  report: HealthReport
  slug?: string
}

export function ScoreCard({ report, slug }: ScoreCardProps) {
  const { t } = useI18n()
  const ratingColor = getRatingColor(report.overallScore.rating)

  return (
    <div className="relative h-full rounded-2xl border border-[#EDBEAF] bg-gradient-to-b from-[#FDF4F1] via-[#F9E5E1] to-[#F2C4BA] p-5 flex flex-col overflow-hidden">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative flex flex-col items-center flex-1">
        {/* Restaurant info */}
        <div className="text-center mb-4">
          <h1 className="text-base font-semibold text-gray-900 tracking-tight">
            {report.restaurant.name}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {report.restaurant.city}, {report.restaurant.state}
          </p>
        </div>

        {/* Main score ring */}
        <div className="mb-2">
          <RadialProgress
            size="lg"
            score={report.overallScore.score}
            maxScore={report.overallScore.maxScore}
            strokeColor={report.overallScore.strokeColor}
            showLabel
            animate
          />
        </div>

        {/* Rating label */}
        <div className="text-center mb-5">
          <p className="text-[11px] text-gray-400 tracking-widest uppercase font-medium">{t('healthGrade')}</p>
          <p className="text-base font-bold mt-0.5" style={{ color: ratingColor }}>
            {t(report.overallScore.rating)}
          </p>
        </div>

        {/* Dashed divider */}
        <div
          className="w-full h-px mb-4"
          style={{
            background:
              'repeating-linear-gradient(90deg, #090a0b 0, #090a0b 6px, transparent 6px, transparent 11px)',
            opacity: 0.12,
          }}
        />

        {/* Sub-scores */}
        <div className="w-full space-y-1 mb-5">
          {report.subScores.map((sub) => (
            <SubScoreRow
              key={sub.name}
              name={sub.name}
              score={sub.score}
              maxScore={sub.maxScore}
              rating={sub.rating}
              strokeColor={sub.strokeColor}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto w-full">
          <CTAButton text={report.ctaText} className="w-full justify-center py-2.5 rounded-xl" onClick={slug ? () => { window.location.href = `/improve/${slug}` } : undefined} />
        </div>
      </div>
    </div>
  )
}
