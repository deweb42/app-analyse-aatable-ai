import { createContext, useContext, useState, type ReactNode } from 'react'

export type Locale = 'en' | 'fr'

const translations = {
  en: {
    // RevenueLossCard
    couldBeLosing: 'You could be losing ~{amount}/month due to {count} problem{s}',
    // CompetitorRankCard
    rankingBelow: "You're ranking below {count} competitors",
    // WhyFixCard
    successStory: 'Success story',
    whyFix: 'Why fix these?',
    hadScore: '{name} had a health score of {initial}. They {result} by increasing their score to {final}.',
    // ScoreCard
    healthGrade: 'Online health grade',
    // SearchResultsSection
    thingsReviewed: '{total} things reviewed, ',
    needWork: '{count} need work',
    howYoureDoing: "This is how you're doing online",
    whereShowingUp: 'Where you are showing up when customers search you, next to your competitors',
    // KeywordCard
    googleMapsResults: 'Google Maps results',
    mostClicks: 'These results get the most clicks',
    top3Map: 'Top 3 map results',
    googleSearchResults: 'Google Search results',
    youAreUnranked: 'You are Unranked',
    // RankBadge
    unranked: 'Unranked',
    // ChecklistItem
    found: 'Found: ',
    expected: 'Expected: ',
    // AIWebsiteSection
    savorEveryBite: 'Savor every bite',
    freshAuthentic: 'Fresh & authentic',
    orderNow: 'Order now',
    // WebsiteCarousel
    score: 'Score',
    // App
    loadingReport: 'Loading report...',
    // Rating levels
    Poor: 'Poor',
    Fair: 'Fair',
    Good: 'Good',
    Excellent: 'Excellent',
  },
  fr: {
    couldBeLosing: 'Vous pourriez perdre ~{amount}/mois à cause de {count} problème{s}',
    rankingBelow: 'Vous êtes classé derrière {count} concurrents',
    successStory: 'Cas client',
    whyFix: 'Pourquoi corriger ?',
    hadScore: '{name} avait un score santé de {initial}. Ils ont {result} en augmentant leur score à {final}.',
    healthGrade: 'Note de santé en ligne',
    thingsReviewed: '{total} éléments examinés, ',
    needWork: '{count} à corriger',
    howYoureDoing: 'Voici votre visibilité en ligne',
    whereShowingUp: 'Où vous apparaissez quand vos clients vous cherchent, à côté de vos concurrents',
    googleMapsResults: 'Résultats Google Maps',
    mostClicks: 'Ces résultats obtiennent le plus de clics',
    top3Map: 'Top 3 résultats carte',
    googleSearchResults: 'Résultats Google Search',
    youAreUnranked: 'Vous n\'êtes pas classé',
    unranked: 'Non classé',
    found: 'Trouvé : ',
    expected: 'Attendu : ',
    savorEveryBite: 'Savourez chaque bouchée',
    freshAuthentic: 'Frais & authentique',
    orderNow: 'Commander',
    score: 'Score',
    loadingReport: 'Chargement du rapport...',
    Poor: 'Faible',
    Fair: 'Moyen',
    Good: 'Bon',
    Excellent: 'Excellent',
  },
} as const

export type TranslationKey = keyof typeof translations.en

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue>(null!)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    return saved === 'fr' ? 'fr' : 'en'
  })

  function changeLocale(l: Locale) {
    setLocale(l)
    localStorage.setItem('locale', l)
  }

  function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    let str: string = translations[locale][key] ?? translations.en[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replaceAll(`{${k}}`, String(v))
      }
    }
    return str
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
