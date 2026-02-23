import db from './db.js'
import type {
  HealthReport, ReportSection, CheckCategory, CheckItem,
  SubScore, ScoreRating, RatingLevel,
} from '../src/types/report.js'

function getRatingLevel(score: number, max: number): RatingLevel {
  const pct = score / max
  if (pct >= 0.8) return 'Excellent'
  if (pct >= 0.6) return 'Good'
  if (pct >= 0.4) return 'Fair'
  return 'Poor'
}

function getRatingColor(rating: RatingLevel): string {
  switch (rating) {
    case 'Poor': return '#D65353'
    case 'Fair': return '#F89412'
    case 'Good': return '#57AA30'
    case 'Excellent': return '#57AA30'
  }
}

const SECTION_NAMES: Record<string, string> = {
  'search-results': 'Search Results',
  'website-experience': 'Website Experience',
  'local-listings': 'Local Listings',
}

export function buildReport(slug: string): HealthReport | null {
  // Get latest report for this restaurant
  const restaurant = db.prepare('SELECT * FROM restaurants WHERE slug = ?').get(slug) as any
  if (!restaurant) return null

  const reportRow = db.prepare(
    'SELECT * FROM reports WHERE restaurant_slug = ? ORDER BY id DESC LIMIT 1'
  ).get(slug) as any
  if (!reportRow) return null

  const rawJson = JSON.parse(reportRow.raw_json)
  const sectionMetaMap = new Map(
    (rawJson.sectionMeta ?? []).map((m: any) => [m.id, m])
  )

  // Get all criteria for this report
  const criteria = db.prepare(
    'SELECT * FROM criteria WHERE report_id = ? ORDER BY id'
  ).all(reportRow.id) as any[]

  // Group criteria by section, then by category
  const sectionMap = new Map<string, {
    id: string; number: number; title: string; subtitle: string;
    categories: Map<string, CheckItem[]>;
  }>()

  for (const c of criteria) {
    if (!sectionMap.has(c.section_id)) {
      sectionMap.set(c.section_id, {
        id: c.section_id,
        number: c.section_number,
        title: c.section_title,
        subtitle: c.section_subtitle,
        categories: new Map(),
      })
    }
    const section = sectionMap.get(c.section_id)!
    if (!section.categories.has(c.category_name)) {
      section.categories.set(c.category_name, [])
    }
    const item: CheckItem = {
      title: c.title,
      status: c.status,
      ...(c.description && { description: c.description }),
      ...(c.findings && { findings: c.findings }),
      ...(c.expected && { expected: c.expected }),
    }
    section.categories.get(c.category_name)!.push(item)
  }

  // Compute scores per section
  const scoreBySectionId = db.prepare(`
    SELECT section_id, status, COUNT(*) as cnt
    FROM criteria WHERE report_id = ?
    GROUP BY section_id, status
  `).all(reportRow.id) as { section_id: string; status: string; cnt: number }[]

  const sectionScores = new Map<string, { pass: number; total: number }>()
  for (const row of scoreBySectionId) {
    if (!sectionScores.has(row.section_id)) {
      sectionScores.set(row.section_id, { pass: 0, total: 0 })
    }
    const s = sectionScores.get(row.section_id)!
    s.total += row.cnt
    if (row.status === 'pass') s.pass += row.cnt
  }

  // Build sections
  const sections: ReportSection[] = []
  for (const [sectionId, sData] of sectionMap) {
    const scores = sectionScores.get(sectionId) ?? { pass: 0, total: 0 }
    const rating = getRatingLevel(scores.pass, scores.total)
    const meta = sectionMetaMap.get(sectionId) as any

    const categories: CheckCategory[] = []
    for (const [name, items] of sData.categories) {
      categories.push({ name, items })
    }

    sections.push({
      id: sData.id,
      number: sData.number,
      title: sData.title,
      subtitle: sData.subtitle,
      score: scores.pass,
      maxScore: scores.total,
      scoreColor: meta?.scoreColor ?? getRatingColor(rating),
      ...(meta?.infoBox && { infoBox: meta.infoBox }),
      categories,
    })
  }
  sections.sort((a, b) => a.number - b.number)

  // Build subScores
  const subScores: SubScore[] = sections.map(s => {
    const rating = getRatingLevel(s.score, s.maxScore)
    return {
      name: SECTION_NAMES[s.id] ?? s.title,
      score: s.score,
      maxScore: s.maxScore,
      rating,
      strokeColor: getRatingColor(rating),
    }
  })

  // Overall
  const totalPass = subScores.reduce((sum, s) => sum + s.score, 0)
  const totalMax = subScores.reduce((sum, s) => sum + s.maxScore, 0)
  const overallRating = getRatingLevel(totalPass, totalMax)
  const overallScore: ScoreRating = {
    score: totalPass,
    maxScore: totalMax,
    rating: overallRating,
    strokeColor: overallRating === 'Poor' ? '#FF0101' : getRatingColor(overallRating),
  }

  // needsWork = fail + warning count
  const needsWork = criteria.filter(c => c.status === 'fail' || c.status === 'warning').length

  return {
    restaurant: {
      name: restaurant.name,
      website: restaurant.website ?? '',
      city: restaurant.city ?? '',
      state: restaurant.state ?? '',
      placeId: restaurant.place_id ?? '',
      imageUrl: restaurant.image_url ?? '',
    },
    overallScore,
    subScores,
    revenueLoss: rawJson.revenueLoss,
    competitorRankings: rawJson.competitorRankings,
    keywordCards: rawJson.keywordCards,
    sections,
    auditSummary: {
      totalReviewed: totalMax,
      needsWork,
      subtitle: 'See what\'s wrong and how to improve',
    },
    googleProfile: rawJson.googleProfile,
    caseStudies: rawJson.caseStudies,
    ctaText: rawJson.ctaText,
    ctaBanner: rawJson.ctaBanner,
  }
}
