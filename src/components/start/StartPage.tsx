import { motion } from 'motion/react'
import type { HealthReport } from '../../types/report'
import { LanguageToggle } from '../shared/LanguageToggle'
import { EarningHero } from './EarningHero'
import { WebsitePreview } from './WebsitePreview'
import { ScoreComparison } from './ScoreComparison'
import { ImprovementSections } from './ImprovementSections'
import { SocialProof } from './SocialProof'
import { StartCTASection } from './StartCTASection'
import { Sparkles, CheckCircle2 } from 'lucide-react'

interface StartPageProps {
  report: HealthReport
  slug: string
}

export default function StartPage({ report }: StartPageProps) {
  const currentScore = report.overallScore.score
  const projectedScore = Math.min(100, currentScore + 35)
  const estimatedEarnings = report.revenueLoss.amount * 2

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-suisse">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 bg-white/95 backdrop-blur-sm border-b border-gray-100/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900">AI Website Builder</span>
        </div>
        <LanguageToggle />
      </header>

      {/* Success badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex justify-center pt-6"
      >
        <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200/60 rounded-full px-3 py-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <span className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">
            {report.restaurant.name}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-16 space-y-6">
        <EarningHero amount={estimatedEarnings} />

        <WebsitePreview
          restaurantName={report.restaurant.name}
          cuisineTypes={report.businessInfo?.cuisineTypes ?? []}
        />

        <ScoreComparison
          currentScore={currentScore}
          projectedScore={projectedScore}
          maxScore={report.overallScore.maxScore}
          currentColor={report.overallScore.strokeColor}
        />

        <ImprovementSections report={report} />

        <SocialProof caseStudies={report.caseStudies} />

        <StartCTASection domain={report.restaurant.website} />
      </div>
    </div>
  )
}
