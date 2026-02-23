import type { ReportSection, KeywordCard as KeywordCardType, AuditSummary } from '../../types/report'
import { SectionHeader } from '../shared/SectionHeader'
import { InfoBox } from '../shared/InfoBox'
import { KeywordGrid } from './KeywordGrid'
import { ChecklistAccordion } from '../website-experience/ChecklistAccordion'

interface SearchResultsSectionProps {
  section: ReportSection
  keywordCards: KeywordCardType[]
  auditSummary: AuditSummary
}

export function SearchResultsSection({ section, keywordCards, auditSummary }: SearchResultsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Audit summary */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm px-5 py-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          {auditSummary.totalReviewed} things reviewed,{' '}
          <span className="text-red-500">{auditSummary.needsWork} need work</span>
        </h2>
        <p className="text-[13px] text-gray-400 mt-0.5">
          {auditSummary.subtitle}
        </p>
      </div>

      {/* Keyword rankings */}
      <div>
        <div className="mb-3 px-1">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            This is how you're doing online
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Where you are showing up when customers search you, next to your competitors
          </p>
        </div>
        <KeywordGrid cards={keywordCards} />
      </div>

      {/* SEO Checklist */}
      <div className="rounded-2xl border border-gray-200/60 bg-white shadow-sm overflow-hidden">
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
