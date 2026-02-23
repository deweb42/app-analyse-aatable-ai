import { useEffect, useState } from 'react'
import type { HealthReport } from './types/report'

const staticReports: Record<string, () => Promise<{ default: unknown }>> = {
  'feast-buffet': () => import('./data/feast-buffet.json'),
  'istanbul-kasap-market': () => import('./data/istanbul-kasap-market.json'),
  'oqg-burger-tacos': () => import('./data/oqg-burger-tacos.json'),
}
import { ReportLayout } from './components/layout/ReportLayout'
import { Sidebar } from './components/layout/Sidebar'
import { MainContent } from './components/layout/MainContent'
import { HeroCards } from './components/hero/HeroCards'
import { SearchResultsSection } from './components/search-results/SearchResultsSection'
import { WebsiteExperienceSection } from './components/website-experience/WebsiteExperienceSection'
import { LocalListingsSection } from './components/local-listings/LocalListingsSection'
import { AIWebsiteSection } from './components/ai-website/AIWebsiteSection'
import { LanguageToggle } from './components/shared/LanguageToggle'
import { useI18n } from './lib/i18n'

export default function App() {
  const { t } = useI18n()
  const [report, setReport] = useState<HealthReport | null>(null)
  const [loading, setLoading] = useState(true)

  const slug = window.location.pathname.split('/report/')[1] || 'feast-buffet'

  useEffect(() => {
    fetch(`/api/reports/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('API unavailable')
        return r.json()
      })
      .then(setReport)
      .catch(async () => {
        // API not running — fallback to static JSON
        const loader = staticReports[slug]
        if (loader) {
          const mod = await loader()
          setReport(mod.default as unknown as HealthReport)
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-4 text-gray-600">{t('loadingReport')}</p>
        </div>
      </div>
    )
  }

  if (!report) return null

  const searchResults = report.sections.find((s) => s.id === 'search-results')
  const websiteExperience = report.sections.find((s) => s.id === 'website-experience')
  const localListings = report.sections.find((s) => s.id === 'local-listings')

  return (
    <ReportLayout>
      <LanguageToggle />
      <Sidebar report={report} />
      <MainContent>
        <div className="space-y-4 px-4 pb-24 pt-4 lg:px-0 lg:pb-4 lg:pt-0">
          <HeroCards report={report} />

          {searchResults && (
            <SearchResultsSection
              section={searchResults}
              keywordCards={report.keywordCards}
              auditSummary={report.auditSummary}
            />
          )}

          {websiteExperience && (
            <WebsiteExperienceSection section={websiteExperience} />
          )}

          {localListings && (
            <LocalListingsSection
              section={localListings}
              googleProfile={report.googleProfile}
            />
          )}

          <AIWebsiteSection ctaBanner={report.ctaBanner} />
        </div>
      </MainContent>
    </ReportLayout>
  )
}
