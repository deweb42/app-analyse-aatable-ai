import reportData from './data/feast-buffet.json'
import type { HealthReport } from './types/report'
import { ReportLayout } from './components/layout/ReportLayout'
import { Sidebar } from './components/layout/Sidebar'
import { MainContent } from './components/layout/MainContent'
import { SearchResultsSection } from './components/search-results/SearchResultsSection'
import { WebsiteExperienceSection } from './components/website-experience/WebsiteExperienceSection'
import { LocalListingsSection } from './components/local-listings/LocalListingsSection'
import { AIWebsiteSection } from './components/ai-website/AIWebsiteSection'
import { formatCurrency } from './lib/score-utils'

export default function App() {
  const report = reportData as unknown as HealthReport

  const searchResults = report.sections.find((s) => s.id === 'search-results')
  const websiteExperience = report.sections.find((s) => s.id === 'website-experience')
  const localListings = report.sections.find((s) => s.id === 'local-listings')

  return (
    <ReportLayout>
      <Sidebar report={report} />
      <MainContent>
        {/* Revenue loss banner */}
        {report.revenueLoss.amount > 0 && (
          <div className="mx-4 mb-4 rounded-lg bg-red-50 border border-red-200 p-4 lg:mx-0">
            <p className="text-sm text-red-800">
              You could be losing up to{' '}
              <span className="font-semibold">
                {formatCurrency(report.revenueLoss.amount)}/month
              </span>{' '}
              due to:
            </p>
            <ul className="mt-1 space-y-0.5">
              {report.revenueLoss.problems.map((problem) => (
                <li key={problem} className="text-sm text-red-700">
                  • {problem}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4 pb-20 lg:pb-4">
          {searchResults && (
            <SearchResultsSection
              section={searchResults}
              keywordCards={report.keywordCards}
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

          <AIWebsiteSection
            caseStudies={report.caseStudies}
            ctaText={report.ctaText}
          />
        </div>
      </MainContent>
    </ReportLayout>
  )
}
