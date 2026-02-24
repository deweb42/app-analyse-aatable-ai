import type { HealthReport } from '../types/report'

/**
 * Params accepted via URL query string:
 *
 *   /builder?name=Feast+Buffet&city=Renton&state=WA&zip=98057
 *            &website=feastbuffet.com&phone=(425)+235-1888
 *            &cuisine=Asian,Chinese,Japanese&owner=John+Doe
 *            &rating=4.1&reviews=500&address=801+Rainier+Ave+S
 *
 * All params are optional except `name`. Missing values get smart defaults.
 */
export interface BuilderParams {
  name: string
  city?: string
  state?: string
  zip?: string
  website?: string
  phone?: string
  cuisine?: string       // comma-separated
  owner?: string
  rating?: string        // e.g. "4.1"
  reviews?: string       // e.g. "500"
  address?: string
  description?: string
}

export function parseBuilderParams(search: string): BuilderParams | null {
  const p = new URLSearchParams(search)
  const name = p.get('name')
  if (!name) return null

  return {
    name,
    city: p.get('city') ?? undefined,
    state: p.get('state') ?? undefined,
    zip: p.get('zip') ?? undefined,
    website: p.get('website') ?? undefined,
    phone: p.get('phone') ?? undefined,
    cuisine: p.get('cuisine') ?? undefined,
    owner: p.get('owner') ?? undefined,
    rating: p.get('rating') ?? undefined,
    reviews: p.get('reviews') ?? undefined,
    address: p.get('address') ?? undefined,
    description: p.get('description') ?? undefined,
  }
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function getRating(score: number): { rating: 'Poor' | 'Fair' | 'Good' | 'Excellent'; color: string } {
  if (score <= 30) return { rating: 'Poor', color: '#D65353' }
  if (score <= 55) return { rating: 'Poor', color: '#FF0101' }
  if (score <= 70) return { rating: 'Fair', color: '#F89412' }
  if (score <= 85) return { rating: 'Good', color: '#57AA30' }
  return { rating: 'Excellent', color: '#22C55E' }
}

export function buildReport(params: BuilderParams): HealthReport {
  const city = params.city ?? 'your city'
  const state = params.state ?? ''
  const website = params.website ?? `${slugify(params.name)}.com`
  const phone = params.phone ?? ''
  const cuisineTypes = params.cuisine?.split(',').map(s => s.trim()).filter(Boolean) ?? ['Restaurant']
  const rating = params.rating ? parseFloat(params.rating) : 3.8
  const reviewCount = params.reviews ? parseInt(params.reviews, 10) : 120
  const description = params.description ?? `${params.name} is a popular restaurant in ${city}.`
  const placeId = slugify(params.name + '-' + city)

  // Generate a semi-random but deterministic score based on name length
  const seed = params.name.length + (params.city?.length ?? 0)
  const overallScore = 25 + (seed % 40) // 25-64 range
  const { rating: scoreRating, color: strokeColor } = getRating(overallScore)

  // Sub-scores that sum roughly to overallScore
  const searchScore = Math.round(overallScore * 0.4)
  const experienceScore = Math.round(overallScore * 0.35)
  const listingsScore = Math.round(overallScore * 0.25)

  // Keywords based on cuisine types
  const mainKeyword = cuisineTypes[0]?.toLowerCase() ?? 'restaurant'
  const secondKeyword = cuisineTypes[1]?.toLowerCase() ?? 'food'

  // Generate fail items for sections
  const searchFailItems = [
    { title: 'Missing meta description', status: 'fail' as const },
    { title: 'No H1 tag found on homepage', status: 'fail' as const },
    { title: 'Missing Open Graph tags', status: 'fail' as const },
    { title: 'No structured data (schema.org)', status: 'warning' as const },
    { title: 'Page title too generic', status: 'warning' as const },
    { title: 'SSL certificate valid', status: 'pass' as const },
    { title: 'Domain is indexed by Google', status: 'pass' as const },
    { title: 'Robots.txt is present', status: 'pass' as const },
    { title: 'Sitemap.xml found', status: 'pass' as const },
  ]

  const experienceFailItems = [
    { title: 'No online ordering system', status: 'fail' as const },
    { title: 'No menu available on website', status: 'fail' as const },
    { title: 'Website not mobile-optimized', status: 'fail' as const },
    { title: 'No reservation system', status: 'fail' as const },
    { title: 'Missing call-to-action buttons', status: 'warning' as const },
    { title: 'No customer testimonials', status: 'warning' as const },
    { title: 'Website loads in under 3 seconds', status: 'pass' as const },
    { title: 'Images are optimized', status: 'pass' as const },
    { title: 'Contact information visible', status: 'pass' as const },
  ]

  const listingsFailItems = [
    { title: 'Google Business Profile not optimized', status: 'fail' as const },
    { title: 'Missing business description', status: 'fail' as const },
    { title: 'Photos are outdated', status: 'warning' as const },
    { title: 'Business hours are set', status: 'pass' as const },
    { title: 'Phone number listed', status: 'pass' as const },
    { title: 'Address is correct', status: 'pass' as const },
    { title: 'Categories are set', status: 'pass' as const },
  ]

  const failCount = [...searchFailItems, ...experienceFailItems, ...listingsFailItems]
    .filter(i => i.status === 'fail').length

  const report: HealthReport = {
    restaurant: {
      name: params.name,
      website,
      city,
      state,
      placeId,
      imageUrl: '',
    },
    overallScore: {
      score: overallScore,
      maxScore: 100,
      rating: scoreRating,
      strokeColor,
    },
    subScores: [
      { name: 'Search Results', score: searchScore, maxScore: 40, ...getRating(searchScore * 2.5), strokeColor: getRating(searchScore * 2.5).color },
      { name: 'Website Experience', score: experienceScore, maxScore: 40, ...getRating(experienceScore * 2.5), strokeColor: getRating(experienceScore * 2.5).color },
      { name: 'Local Listings', score: listingsScore, maxScore: 20, ...getRating(listingsScore * 5), strokeColor: getRating(listingsScore * 5).color },
    ],
    revenueLoss: {
      amount: failCount * 230 + 500,
      problems: [
        'Website is missing a compelling story',
        `Not ranking for "${mainKeyword} in ${city}"`,
        'No online ordering system found',
      ],
    },
    competitorRankings: [
      { name: `Top ${mainKeyword} spot`, rating: 4.7, rank: 1 },
      { name: `Popular ${secondKeyword} place`, rating: 4.5, rank: 2 },
      { name: `Local ${mainKeyword} favorite`, rating: 4.4, rank: 3 },
    ],
    keywordCards: [
      {
        keyword: mainKeyword,
        city,
        fullKeyword: `Best ${mainKeyword} in ${city}`,
        mapPackRank: null,
        organicRank: null,
        winner: `Top ${mainKeyword} spot`,
        competitors: [
          { name: `Top ${mainKeyword} spot`, rating: 4.7, mapRank: 1, organicRank: null },
          { name: `Popular ${secondKeyword} place`, rating: 4.5, mapRank: 2, organicRank: null },
          { name: `Local ${mainKeyword} favorite`, rating: 4.4, mapRank: 3, organicRank: null },
        ],
        organicResults: [
          { site: 'www.yelp.com', title: `TOP 10 BEST ${cuisineTypes[0]} in ${city}` },
          { site: 'www.tripadvisor.com', title: `THE BEST ${cuisineTypes[0]} Restaurants in ${city}` },
          { site: 'www.google.com', title: `${cuisineTypes[0]} near ${city}` },
        ],
      },
      {
        keyword: secondKeyword,
        city,
        fullKeyword: `Best ${secondKeyword} in ${city}`,
        mapPackRank: null,
        organicRank: null,
        winner: null,
        competitors: [
          { name: `${secondKeyword} corner`, rating: 4.3, mapRank: 1, organicRank: null },
          { name: `The ${secondKeyword} house`, rating: 4.1, mapRank: 2, organicRank: null },
        ],
        organicResults: [
          { site: 'www.yelp.com', title: `Best ${secondKeyword} near ${city}` },
          { site: 'www.tripadvisor.com', title: `${secondKeyword} restaurants in ${city}` },
        ],
      },
    ],
    sections: [
      {
        id: 'search-results',
        number: 1,
        title: 'Search Results',
        subtitle: `How ${params.name} shows up on Google`,
        score: searchScore,
        maxScore: 40,
        scoreColor: getRating(searchScore * 2.5).color,
        categories: [
          { name: 'SEO & Metadata', items: searchFailItems.map(i => ({ ...i, title: i.title })) },
        ],
      },
      {
        id: 'website-experience',
        number: 2,
        title: 'Website Experience',
        subtitle: `How visitors experience ${website}`,
        score: experienceScore,
        maxScore: 40,
        scoreColor: getRating(experienceScore * 2.5).color,
        infoBox: {
          title: 'Why this matters',
          text: '75% of customers judge a business credibility by its website design. A modern, mobile-friendly site with clear calls-to-action can increase revenue by up to 40%.',
        },
        categories: [
          { name: 'Content & Features', items: experienceFailItems.map(i => ({ ...i, title: i.title })) },
        ],
      },
      {
        id: 'local-listings',
        number: 3,
        title: 'Local Listings',
        subtitle: `${params.name}'s online presence`,
        score: listingsScore,
        maxScore: 20,
        scoreColor: getRating(listingsScore * 5).color,
        categories: [
          { name: 'Google Business Profile', items: listingsFailItems.map(i => ({ ...i, title: i.title })) },
        ],
      },
    ],
    auditSummary: {
      totalReviewed: searchFailItems.length + experienceFailItems.length + listingsFailItems.length,
      needsWork: failCount,
      subtitle: `${failCount} items need attention`,
    },
    googleProfile: {
      name: params.name,
      rating,
      reviewCount,
      description,
      phone,
      website,
      hasHours: true,
      hasPhone: !!phone,
      hasPriceRange: true,
      categories: cuisineTypes,
    },
    caseStudies: [
      { name: 'Cyclo Noodles', initialScore: 37, finalScore: 92, result: 'Grew direct online sales by 7X', desktopImage: 'cyclonoodles-desktop.png', tabletImage: 'cyclonoodles-tablet.png' },
      { name: "Talkin' Tacos", initialScore: 46, finalScore: 95, result: '$120,000/month in sales', desktopImage: 'talkintacos-desktop.png', tabletImage: 'talkintacos-tablet.png' },
      { name: 'Saffron', initialScore: 43, finalScore: 96, result: '$171,400/month online sales', desktopImage: 'saffron-desktop.png', tabletImage: 'saffron-tablet.png' },
    ],
    ctaText: 'Fix in 35 seconds',
    ctaBanner: {
      label: 'Owner AI Website',
      title: `Improve ${params.name}'s website with AI in 35 seconds.`,
      buttonText: 'Improve your website',
    },
    businessInfo: {
      legalName: params.name,
      ownerName: params.owner,
      address: params.address ?? '',
      city,
      state,
      postalCode: params.zip ?? '',
      country: 'US',
      phone,
      website,
      description,
      cuisineTypes,
      scrapedAt: new Date().toISOString(),
      sources: ['builder'],
    },
  }

  return report
}
