export type RatingLevel = 'Poor' | 'Fair' | 'Good' | 'Excellent'

export interface HealthReport {
  restaurant: Restaurant
  overallScore: ScoreRating
  subScores: SubScore[]
  revenueLoss: RevenueLoss
  keywordCards: KeywordCard[]
  sections: ReportSection[]
  googleProfile: GoogleBusinessProfile
  caseStudies: CaseStudy[]
  ctaText: string
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
  categories: CheckCategory[]
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
