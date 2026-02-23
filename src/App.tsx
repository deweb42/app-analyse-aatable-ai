import reportData from './data/feast-buffet.json'
import type { HealthReport } from './types/report'
import { ReportLayout } from './components/layout/ReportLayout'
import { Sidebar } from './components/layout/Sidebar'
import { MainContent } from './components/layout/MainContent'
import { HeroCards } from './components/hero/HeroCards'
import { SearchResultsSection } from './components/search-results/SearchResultsSection'
import { WebsiteExperienceSection } from './components/website-experience/WebsiteExperienceSection'
import { LocalListingsSection } from './components/local-listings/LocalListingsSection'
import { AIWebsiteSection } from './components/ai-website/AIWebsiteSection'

export default function App() {
  const report = reportData as unknown as HealthReport

  const searchResults = report.sections.find((s) => s.id === 'search-results')
  const websiteExperience = report.sections.find((s) => s.id === 'website-experience')
  const localListings = report.sections.find((s) => s.id === 'local-listings')

  return (
    <ReportLayout>
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
