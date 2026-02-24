import { useMemo } from 'react'
import type { HealthReport, OverallCompetitor, RevenueLoss } from '../../types/report'
import { RevenueLossCard } from './RevenueLossCard'
import { CompetitorRankCard } from './CompetitorRankCard'
import { WhyFixCard } from './WhyFixCard'

interface HeroCardsProps {
  report: HealthReport
}

/** Estimate monthly revenue loss from audit failures */
function computeRevenueLoss(report: HealthReport): RevenueLoss {
  const problems: string[] = []

  for (const section of report.sections) {
    for (const cat of section.categories) {
      for (const item of cat.items) {
        if (item.status === 'fail') {
          problems.push(item.title)
        }
      }
    }
  }

  // ~$45 per fail item as estimated loss
  const amount = problems.length * 45

  // Show up to 3 most impactful problems
  return { amount, problems: problems.slice(0, 3) }
}

/** Build competitor ranking from keyword cards (deduplicated, sorted by frequency) */
function computeCompetitors(report: HealthReport): OverallCompetitor[] {
  const restaurantName = report.restaurant.name.toLowerCase()
  const freq = new Map<string, { rating: number; count: number }>()

  for (const card of report.keywordCards) {
    for (const comp of card.competitors) {
      // Skip the restaurant itself
      if (comp.name.toLowerCase() === restaurantName) continue

      const existing = freq.get(comp.name)
      if (existing) {
        existing.count++
        existing.rating = Math.max(existing.rating, comp.rating)
      } else {
        freq.set(comp.name, { rating: comp.rating, count: 1 })
      }
    }
  }

  return [...freq.entries()]
    .sort((a, b) => b[1].count - a[1].count || b[1].rating - a[1].rating)
    .slice(0, 8)
    .map(([name, { rating }], i) => ({ name, rating, rank: i + 1 }))
}

export function HeroCards({ report }: HeroCardsProps) {
  const revenueLoss = useMemo(() => computeRevenueLoss(report), [report])
  const competitors = useMemo(() => computeCompetitors(report), [report])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <RevenueLossCard
        revenueLoss={revenueLoss}
        restaurant={report.restaurant}
      />
      <CompetitorRankCard
        competitors={competitors}
        restaurant={report.restaurant}
        restaurantRating={report.googleProfile.rating}
      />
      <WhyFixCard caseStudies={report.caseStudies} />
    </div>
  )
}
