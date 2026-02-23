import { readFileSync } from 'fs'
import db from './db.js'
import type { HealthReport } from '../src/types/report.js'

export function ingest(report: HealthReport) {
  const r = report.restaurant
  const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')

  // Upsert restaurant
  db.prepare(`
    INSERT INTO restaurants (slug, name, website, city, state, place_id, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      name=excluded.name, website=excluded.website, city=excluded.city,
      state=excluded.state, place_id=excluded.place_id, image_url=excluded.image_url
  `).run(slug, r.name, r.website, r.city, r.state, r.placeId, r.imageUrl)

  // Build raw_json (everything except sections criteria)
  const rawData = {
    revenueLoss: report.revenueLoss,
    competitorRankings: report.competitorRankings,
    keywordCards: report.keywordCards,
    googleProfile: report.googleProfile,
    caseStudies: report.caseStudies,
    ctaText: report.ctaText,
    ctaBanner: report.ctaBanner,
    // Preserve per-section display data
    sectionMeta: report.sections.map(s => ({
      id: s.id,
      scoreColor: s.scoreColor,
      infoBox: s.infoBox,
    })),
  }

  const { lastInsertRowid: reportId } = db.prepare(
    `INSERT INTO reports (restaurant_slug, raw_json) VALUES (?, ?)`
  ).run(slug, JSON.stringify(rawData))

  // Insert criteria
  const insertCriterion = db.prepare(`
    INSERT INTO criteria (report_id, section_id, section_number, section_title, section_subtitle, category_name, title, description, status, findings, expected)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertAll = db.transaction(() => {
    for (const section of report.sections) {
      for (const cat of section.categories) {
        for (const item of cat.items) {
          insertCriterion.run(
            reportId, section.id, section.number, section.title, section.subtitle,
            cat.name, item.title, item.description ?? null, item.status,
            item.findings ?? null, item.expected ?? null
          )
        }
      }
    }
  })
  insertAll()

  return { slug, reportId }
}

// CLI mode
if (process.argv[1]?.endsWith('ingest.ts') || process.argv[1]?.endsWith('ingest.js')) {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: npx tsx server/ingest.ts <path-to-json>')
    process.exit(1)
  }
  const data = JSON.parse(readFileSync(filePath, 'utf-8')) as HealthReport
  const { slug, reportId } = ingest(data)
  console.log(`Ingested "${data.restaurant.name}" → slug="${slug}", reportId=${reportId}`)
}
