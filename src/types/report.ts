export type RatingLevel = 'Poor' | 'Fair' | 'Good' | 'Excellent'

export interface HealthReport {
  restaurant: Restaurant
  overallScore: ScoreRating
  subScores: SubScore[]
  revenueLoss: RevenueLoss
  competitorRankings: OverallCompetitor[]
  keywordCards: KeywordCard[]
  sections: ReportSection[]
  auditSummary: AuditSummary
  googleProfile: GoogleBusinessProfile
  caseStudies: CaseStudy[]
  ctaText: string
  ctaBanner: CTABanner
}

export interface AuditSummary {
  totalReviewed: number
  needsWork: number
  subtitle: string
}

export interface CTABanner {
  label: string
  title: string
  buttonText: string
}

export interface OverallCompetitor {
  name: string
  rating: number
  rank: number
}

export interface Restaurant {
  name: string
  website: string
  city: string
  state: string
  placeId: string
  imageUrl: string
}

export interface ScoreRating {
  score: number
  maxScore: number
  rating: RatingLevel
  strokeColor: string
}

export interface SubScore extends ScoreRating {
  name: string
}

export interface RevenueLoss {
  amount: number
  problems: string[]
}

export interface KeywordCard {
  keyword: string
  city: string
  fullKeyword: string
  mapPackRank: number | null
  organicRank: number | null
  winner: string | null
  competitors: CompetitorRanking[]
  organicResults: OrganicResult[]
}

export interface OrganicResult {
  site: string
  title: string
  favicon?: string
}

export interface CompetitorRanking {
  name: string
  rating: number
  mapRank: number | null
  organicRank: number | null
}

export interface ReportSection {
  id: string
  number: number
  title: string
  subtitle: string
  score: number
  maxScore: number
  scoreColor: string
  infoBox?: InfoBox
  categories: CheckCategory[]
}

export interface InfoBox {
  title: string
  text: string
}

export interface CheckCategory {
  name: string
  items: CheckItem[]
}

export interface CheckItem {
  title: string
  description?: string
  status: 'pass' | 'fail' | 'warning'
  findings?: string
  expected?: string
}

export interface GoogleBusinessProfile {
  name: string
  rating: number
  reviewCount: number
  description: string
  phone: string
  website: string
  hasHours: boolean
  hasPhone: boolean
  hasPriceRange: boolean
  categories: string[]
}

export interface CaseStudy {
  name: string
  initialScore: number
  finalScore: number
  result: string
  desktopImage: string
  tabletImage: string
}
