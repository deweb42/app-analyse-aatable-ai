# JSON Data Format

The report is driven by a single JSON file conforming to the `HealthReport` interface.

## Top-Level Structure

```json
{
  "restaurant": {},
  "overallScore": {},
  "subScores": [],
  "revenueLoss": {},
  "keywordCards": [],
  "sections": [],
  "googleProfile": {},
  "caseStudies": [],
  "ctaText": "Fix your website with AI"
}
```

## Field Reference

### `restaurant`
| Field | Type | Example |
|-------|------|---------|
| name | string | "Feast Buffet" |
| website | string | "feastbuffetrenton.com" |
| city | string | "Renton" |
| state | string | "WA" |
| placeId | string | "feast-buffet-renton" |
| imageUrl | string | "" |

### `overallScore`
| Field | Type | Example |
|-------|------|---------|
| score | number | 53 |
| maxScore | number | 100 |
| rating | "Poor" \| "Fair" \| "Good" \| "Excellent" | "Poor" |
| strokeColor | string (hex) | "#FF0101" |

### `subScores` (array of 3)
Same as `overallScore` plus `name` field. Names: "Search Results", "Website Experience", "Local Listings"

### `revenueLoss`
| Field | Type | Example |
|-------|------|---------|
| amount | number | 1615 |
| problems | string[] | ["Website is missing a compelling story"] |

### `keywordCards` (array)
Each card represents one keyword + city combination with competitor rankings.

### `sections` (array of 3)
IDs: `search-results`, `website-experience`, `local-listings`. Each contains `categories` with `items` that have `status: "pass" | "fail" | "warning"`.

### `googleProfile`
Google Business Profile data including rating, review count, description, and category list.

### `caseStudies` (array)
Each has `initialScore`, `finalScore`, `result` text, and image filenames for desktop/tablet screenshots.
