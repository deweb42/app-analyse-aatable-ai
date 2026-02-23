#!/usr/bin/env npx tsx
/**
 * Extract health report data from Owner.com HTML files using Gemini AI.
 *
 * Usage: npx tsx src/lib/extract-report.ts <path-to-html>
 *
 * Outputs a JSON file conforming to the HealthReport interface
 * into src/data/<business-name>.json
 */

import { readFileSync, writeFileSync } from 'fs'
import { basename } from 'path'
import { GoogleGenAI } from '@google/genai'

const SCHEMA_PROMPT = `You are a data extraction assistant. Given an HTML file from Owner.com's restaurant health report (grader.owner.com), extract ALL data into a structured JSON format.

Return a JSON object with this exact structure:
{
  "restaurant": { "name": string, "website": string, "city": string, "state": string, "placeId": string, "imageUrl": string },
  "overallScore": { "score": number, "maxScore": 100, "rating": "Poor"|"Fair"|"Good"|"Excellent", "strokeColor": string },
  "subScores": [{ "name": string, "score": number, "maxScore": number, "rating": string, "strokeColor": string }],
  "revenueLoss": { "amount": number, "problems": [string] },
  "keywordCards": [{
    "keyword": string, "city": string, "fullKeyword": string,
    "mapPackRank": number|null, "organicRank": number|null,
    "winner": string|null,
    "competitors": [{ "name": string, "rating": number, "mapRank": number|null, "organicRank": number|null }]
  }],
  "sections": [{
    "id": string, "number": number, "title": string, "subtitle": string,
    "score": number, "maxScore": number, "scoreColor": string,
    "categories": [{ "name": string, "items": [{ "title": string, "description": string, "status": "pass"|"fail"|"warning", "findings": string, "expected": string }] }]
  }],
  "googleProfile": { "name": string, "rating": number, "reviewCount": number, "description": string, "phone": string, "website": string, "hasHours": boolean, "hasPhone": boolean, "hasPriceRange": boolean, "categories": [string] },
  "caseStudies": [{ "name": string, "initialScore": number, "finalScore": number, "result": string, "desktopImage": string, "tabletImage": string }],
  "ctaText": string
}

Scoring colors: Poor=#D65353, Fair=#F89412, Good=#57AA30, Excellent=#57AA30
Overall strokeColor for Poor=#FF0101

Section IDs: "search-results" (number 1), "website-experience" (number 2), "local-listings" (number 3)

For items where data shows "Working on finding this data..." or similar pending states, set status to "warning".
For items that clearly pass, set "pass". For items that clearly fail, set "fail".

Return ONLY valid JSON, no markdown code fences.`

async function main() {
  const htmlPath = process.argv[2]
  if (!htmlPath) {
    console.error('Usage: npx tsx src/lib/extract-report.ts <path-to-html>')
    process.exit(1)
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is required')
    process.exit(1)
  }

  console.log(`Reading HTML file: ${htmlPath}`)
  const html = readFileSync(htmlPath, 'utf-8')

  // Trim to reduce token usage - strip base64 data URIs and scripts
  const trimmed = html
    .replace(/data:[^"')\s]+/g, 'DATA_URI_REMOVED')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')

  const ai = new GoogleGenAI({ apiKey })

  console.log('Sending to Gemini for extraction...')
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: SCHEMA_PROMPT },
          { text: `Here is the HTML content to extract from:\n\n${trimmed.slice(0, 500000)}` },
        ],
      },
    ],
  })

  const text = response.text ?? ''
  // Clean potential markdown fences
  const jsonStr = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

  let data: Record<string, unknown>
  try {
    data = JSON.parse(jsonStr)
  } catch {
    console.error('Failed to parse Gemini response as JSON')
    console.error('Response:', text.slice(0, 500))
    process.exit(1)
  }

  // Derive output filename from restaurant name
  const name = (data.restaurant as { name?: string })?.name ?? basename(htmlPath, '.html')
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
  const outPath = `src/data/${slug}.json`

  writeFileSync(outPath, JSON.stringify(data, null, 2))
  console.log(`Report extracted to: ${outPath}`)
}

main().catch(console.error)
