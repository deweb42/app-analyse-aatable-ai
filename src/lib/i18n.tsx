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
    // Section titles
    sectionSearchResults: 'Search Results',
    sectionSearchResultsSub: 'Where you are showing up when customers search you',
    sectionWebsiteExperience: 'Website Experience',
    sectionWebsiteExperienceSub: 'How visitors experience your website',
    sectionLocalListings: 'Local Listings',
    sectionLocalListingsSub: 'Your online presence on local platforms',
    // CTA
    fixIn35: 'Fix in 35 seconds',
    ownerAiWebsite: 'Owner AI Website',
    improveWebsiteAi: 'Improve your website with AI in 35 seconds.',
    improveWebsiteBtn: 'Improve your website',
    // Audit
    auditSubtitle: 'This is how you\'re doing online',
    // InfoBox
    whatsSeo: "What's SEO?",
    whatsSeoText: 'It means improving your website so search engines like Google can find it, rank it higher, and help more people see it.',
    yourSite: 'Your site',
    yourSiteText: 'Your site content and experience drive conversion and sales',
    // Loader
    dataLoading: 'Loading data, please wait...',
    // ImprovePage
    improvingWebsite: 'Improving your website...',
    improveToSales: 'Improve {website} to drive more sales',
    scanMobileMessage: "Great! I'll start by scanning your site on mobile. 85% of people browse on their phone, so this is key.",
    craftingPalette: 'Crafting a color palette',
    buildingTodo: 'Building a todo list, to improve traffic and conversion',
    todoHeading: 'To-do list to improve your score',
    upscalingPhotos: 'Upscaling photos to improve conversion',
    summarizingReviews: 'Summarizing reviews',
    findingPraise: 'Finding most-used praise words',
    writingContent: 'Writing content to boost Google ranking',
    mobileScan: 'Mobile scan',
    // StartPage
    earnPerMonth: 'Earn ~${amount}/month',
    newWebsiteRank: 'A new website could rank you at the top of Google and drive more customers',
    howAiImproved: 'How AI improved your online presence',
    currentLabel: 'Current',
    projectedLabel: 'Projected',
    launchForFree: 'Launch for free',
    keepDomain: 'Keep {domain}',
    noContracts: 'No contracts, cancel anytime',
    googleRanking: 'Google Ranking',
    guestExperience: 'Guest Experience',
    googleBizProfile: 'Google Business Profile',
    yourNewWebsite: 'Your new website',
    menuItems: 'Menu items',
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
    // Section titles
    sectionSearchResults: 'Résultats de recherche',
    sectionSearchResultsSub: 'Où vous apparaissez quand vos clients vous cherchent',
    sectionWebsiteExperience: 'Expérience du site web',
    sectionWebsiteExperienceSub: 'Comment les visiteurs perçoivent votre site',
    sectionLocalListings: 'Fiches locales',
    sectionLocalListingsSub: 'Votre présence en ligne sur les plateformes locales',
    // CTA
    fixIn35: 'Corriger en 35 secondes',
    ownerAiWebsite: 'Site web IA Owner',
    improveWebsiteAi: 'Améliorez votre site avec l\'IA en 35 secondes.',
    improveWebsiteBtn: 'Améliorer votre site',
    // Audit
    auditSubtitle: 'Voici votre visibilité en ligne',
    // InfoBox
    whatsSeo: "C'est quoi le SEO ?",
    whatsSeoText: "Ça consiste à améliorer votre site pour que les moteurs de recherche comme Google le trouvent, le classent plus haut, et aident plus de gens à le voir.",
    yourSite: 'Votre site',
    yourSiteText: 'Le contenu et l\'expérience de votre site stimulent la conversion et les ventes',
    // Loader
    dataLoading: 'Chargement des données, veuillez patienter...',
    // ImprovePage
    improvingWebsite: 'Amélioration de votre site...',
    improveToSales: 'Améliorer {website} pour générer plus de ventes',
    scanMobileMessage: "Super ! Je commence par scanner votre site sur mobile. 85 % des gens naviguent sur leur téléphone, c'est donc essentiel.",
    craftingPalette: 'Création d\'une palette de couleurs',
    buildingTodo: 'Construction d\'une liste de tâches pour améliorer le trafic et la conversion',
    todoHeading: 'Liste de tâches pour améliorer votre score',
    upscalingPhotos: 'Amélioration des photos pour booster la conversion',
    summarizingReviews: 'Résumé des avis',
    findingPraise: 'Recherche des mots les plus utilisés',
    writingContent: 'Rédaction de contenu pour améliorer le classement Google',
    mobileScan: 'Scan mobile',
    // StartPage
    earnPerMonth: 'Gagnez ~{amount} $/mois',
    newWebsiteRank: 'Un nouveau site pourrait vous placer en tête de Google et attirer plus de clients',
    howAiImproved: 'Comment l\'IA a amélioré votre présence en ligne',
    currentLabel: 'Actuel',
    projectedLabel: 'Projeté',
    launchForFree: 'Lancer gratuitement',
    keepDomain: 'Garder {domain}',
    noContracts: 'Sans engagement, annulez à tout moment',
    googleRanking: 'Classement Google',
    guestExperience: 'Expérience client',
    googleBizProfile: 'Profil Google Business',
    yourNewWebsite: 'Votre nouveau site',
    menuItems: 'Éléments du menu',
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
    return saved === 'en' ? 'en' : 'fr'
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
