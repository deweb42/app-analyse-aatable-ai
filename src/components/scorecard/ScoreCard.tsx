import type { HealthReport } from '../../types/report'
import { getRatingColor } from '../../lib/score-utils'
import { RadialProgress } from '../shared/RadialProgress'
import { CTAButton } from '../shared/CTAButton'
import { SubScoreRow } from './SubScoreRow'

interface ScoreCardProps {
  report: HealthReport
}

export function ScoreCard({ report }: ScoreCardProps) {
  const ratingColor = getRatingColor(report.overallScore.rating)

  return (
    <div className="relative h-full rounded-lg border-2 border-[#F4C9C1] bg-gradient-to-t from-[#F4C9C1] to-[#F9E5E1] p-6 flex flex-col overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      <div className="relative flex flex-col items-center flex-1">
        {/* Restaurant info */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-semibold text-gray-900">
            {report.restaurant.name}
          </h1>
          <p className="text-sm text-gray-600">
            {report.restaurant.city}, {report.restaurant.state}
          </p>
        </div>

        {/* Main score ring */}
        <div className="mb-4">
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
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">Online health grade</p>
          <p className="text-lg font-semibold" style={{ color: ratingColor }}>
            {report.overallScore.rating}
          </p>
        </div>

        {/* Dashed divider */}
        <div
          className="w-full h-px mb-6"
          style={{
            background:
              'repeating-linear-gradient(90deg, #090a0b, #090a0b 7px, transparent 0, transparent 10px)',
            opacity: 0.2,
          }}
        />

        {/* Sub-scores */}
        <div className="w-full space-y-3 mb-6">
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
          <CTAButton text={report.ctaText} className="w-full justify-center" />
        </div>
      </div>
    </div>
  )
}
