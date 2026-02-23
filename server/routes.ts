import { Router } from 'express'
import db from './db.js'
import { buildReport } from './compute-scores.js'
import { ingest } from './ingest.js'
import { extractReport } from './extract.js'

const router = Router()

// List all restaurants
router.get('/api/restaurants', (_req, res) => {
  const rows = db.prepare('SELECT slug, name, city, state, image_url FROM restaurants ORDER BY name').all()
  res.json(rows)
})

// Get full computed report for a restaurant
router.get('/api/reports/:slug', (req, res) => {
  const report = buildReport(req.params.slug)
  if (!report) {
    res.status(404).json({ error: 'Restaurant not found' })
    return
  }
  res.json(report)
})

// Analyze HTML → extract → ingest → return report
router.post('/api/analyze', async (req, res) => {
  try {
    const { html } = req.body
    if (!html || typeof html !== 'string') {
      res.status(400).json({ error: 'Request body must include "html" string' })
      return
    }
    const report = await extractReport(html)
    const { slug } = ingest(report)
    const computed = buildReport(slug)
    res.json(computed)
  } catch (err: any) {
    console.error('Analysis failed:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
