import type { ReportSection, KeywordCard as KeywordCardType } from '../../types/report'
import { SectionHeader } from '../shared/SectionHeader'
import { KeywordGrid } from './KeywordGrid'
import { ChecklistAccordion } from '../website-experience/ChecklistAccordion'

interface SearchResultsSectionProps {
  section: ReportSection
  keywordCards: KeywordCardType[]
}

export function SearchResultsSection({ section, keywordCards }: SearchResultsSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <SectionHeader
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
        score={section.score}
        maxScore={section.maxScore}
        scoreColor={section.scoreColor}
      />

      {/* Keyword Rankings */}
      <div className="py-4">
        <h3 className="text-sm font-medium text-gray-700 px-4 mb-3">
          Keyword Rankings
        </h3>
        <KeywordGrid cards={keywordCards} />
      </div>

      {/* Checklist */}
      <div className="border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 px-4 py-3">
          SEO Checklist
        </h3>
        {section.categories.map((category) => (
          <ChecklistAccordion key={category.name} category={category} />
        ))}
      </div>
    </div>
  )
}
