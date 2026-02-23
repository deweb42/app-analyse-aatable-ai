import { GoogleGenAI } from '@google/genai'
import type { HealthReport } from '../src/types/report.js'

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
    "competitors": [{ "name": string, "rating": number, "mapRank": number|null, "organicRank": number|null }],
    "organicResults": [{ "site": string, "title": string }]
  }],
  "competitorRankings": [{ "name": string, "rating": number, "rank": number }],
  "sections": [{
    "id": string, "number": number, "title": string, "subtitle": string,
    "score": number, "maxScore": number, "scoreColor": string,
    "infoBox": { "title": string, "text": string } | null,
    "categories": [{ "name": string, "items": [{ "title": string, "description": string, "status": "pass"|"fail"|"warning", "findings": string, "expected": string }] }]
  }],
  "googleProfile": { "name": string, "rating": number, "reviewCount": number, "description": string, "phone": string, "website": string, "hasHours": boolean, "hasPhone": boolean, "hasPriceRange": boolean, "categories": [string] },
  "caseStudies": [{ "name": string, "initialScore": number, "finalScore": number, "result": string, "desktopImage": string, "tabletImage": string }],
  "ctaText": string,
  "ctaBanner": { "label": string, "title": string, "buttonText": string }
}

Scoring colors: Poor=#D65353, Fair=#F89412, Good=#57AA30, Excellent=#57AA30
Overall strokeColor for Poor=#FF0101

Section IDs: "search-results" (number 1), "website-experience" (number 2), "local-listings" (number 3)

For items where data shows "Working on finding this data..." or similar pending states, set status to "warning".
For items that clearly pass, set "pass". For items that clearly fail, set "fail".

Return ONLY valid JSON, no markdown code fences.`

export async function extractReport(htmlContent: string): Promise<HealthReport> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is required')

  const trimmed = htmlContent
    .replace(/data:[^"')\s]+/g, 'DATA_URI_REMOVED')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')

  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{
      role: 'user',
      parts: [
        { text: SCHEMA_PROMPT },
        { text: `Here is the HTML content to extract from:\n\n${trimmed.slice(0, 500000)}` },
      ],
    }],
  })

  const text = response.text ?? ''
  const jsonStr = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
  return JSON.parse(jsonStr) as HealthReport
}
