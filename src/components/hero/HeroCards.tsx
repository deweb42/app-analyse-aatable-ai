import type { HealthReport } from '../../types/report'
import { RevenueLossCard } from './RevenueLossCard'
import { CompetitorRankCard } from './CompetitorRankCard'
import { WhyFixCard } from './WhyFixCard'

interface HeroCardsProps {
  report: HealthReport
}

export function HeroCards({ report }: HeroCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <RevenueLossCard
        revenueLoss={report.revenueLoss}
        restaurant={report.restaurant}
      />
      <CompetitorRankCard competitors={report.competitorRankings} />
      <WhyFixCard caseStudy={report.caseStudies[0]} />
    </div>
  )
}
