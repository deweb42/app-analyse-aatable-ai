# Report Extraction Guide

## Automated Extraction (Gemini AI)

### Prerequisites
- Node.js 18+
- `GEMINI_API_KEY` environment variable set

### Steps

1. **Capture the HTML report** from grader.owner.com using your browser's "Save As" or a SingleFile extension.

2. **Run the extraction script:**
   ```bash
   GEMINI_API_KEY=your-key npx tsx src/lib/extract-report.ts path/to/report.html
   ```

3. **Output:** A JSON file is created at `src/data/<restaurant-name>.json`

4. **Update App.tsx** to import the new JSON:
   ```tsx
   import reportData from './data/new-restaurant.json'
   ```

## Manual Extraction

If AI extraction fails or you need to create data manually:

1. Copy `src/data/feast-buffet.json` as a template
2. Update all fields with the new restaurant's data
3. Ensure all required fields are present (see `src/types/report.ts`)

## Key Data Points to Extract

- Overall score (out of 100) and rating level
- 3 sub-scores with their maximums
- Revenue loss amount and problem descriptions
- Keyword rankings (typically 9: 3 keywords × 3 cities)
- Competitor names and ratings for each keyword
- Checklist items with pass/fail/warning status
- Google Business Profile details
- Case study scores and results

## Validation

After generating the JSON, run:
```bash
npm run lint
```
This will catch any TypeScript type mismatches if the JSON doesn't conform to the `HealthReport` interface.
