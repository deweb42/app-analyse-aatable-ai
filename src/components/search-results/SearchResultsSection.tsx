import type { ReportSection, KeywordCard as KeywordCardType } from '../../types/report'
import { SectionHeader } from '../shared/SectionHeader'
import { InfoBox } from '../shared/InfoBox'
import { KeywordGrid } from './KeywordGrid'
import { ChecklistAccordion } from '../website-experience/ChecklistAccordion'

interface SearchResultsSectionProps {
  section: ReportSection
  keywordCards: KeywordCardType[]
}

export function SearchResultsSection({ section, keywordCards }: SearchResultsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Keyword rankings */}
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-semibold text-gray-900">
            This is how you're doing online
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Where you are showing up when customers search you, next to your competitors
          </p>
        </div>
        <KeywordGrid cards={keywordCards} />
      </div>

      {/* SEO Checklist */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <SectionHeader
          number={section.number}
          title={section.title}
          subtitle={section.subtitle}
          score={section.score}
          maxScore={section.maxScore}
          scoreColor={section.scoreColor}
        />
        {section.infoBox && <InfoBox infoBox={section.infoBox} />}
        <div>
          {section.categories.map((category) => (
            <ChecklistAccordion key={category.name} category={category} />
          ))}
        </div>
      </div>
    </div>
  )
}
