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
        <div className="space-y-6 px-4 pb-20 lg:px-0 lg:pb-4">
          {/* Hero cards: Revenue Loss + Competitors + Why Fix */}
          <HeroCards report={report} />

          {/* Search Results section with keywords + audit summary */}
          {searchResults && (
            <SearchResultsSection
              section={searchResults}
              keywordCards={report.keywordCards}
              auditSummary={report.auditSummary}
            />
          )}

          {/* Section 2: Guest Experience */}
          {websiteExperience && (
            <WebsiteExperienceSection section={websiteExperience} />
          )}

          {/* Section 3: Local Listings */}
          {localListings && (
            <LocalListingsSection
              section={localListings}
              googleProfile={report.googleProfile}
            />
          )}

          {/* CTA Banner */}
          <AIWebsiteSection ctaBanner={report.ctaBanner} />
        </div>
      </MainContent>
    </ReportLayout>
  )
}
