import type { ReportSection, KeywordCard as KeywordCardType, AuditSummary } from '../../types/report'
import { useI18n } from '../../lib/i18n'
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
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      {/* Audit summary */}
      <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm px-5 py-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          {t('thingsReviewed', { total: auditSummary.totalReviewed })}
          <span className="text-red-500">{t('needWork', { count: auditSummary.needsWork })}</span>
        </h2>
        <p className="text-[13px] text-gray-400 mt-0.5">
          {auditSummary.subtitle}
        </p>
      </div>

      {/* Keyword rankings */}
      <div>
        <div className="mb-3 px-1">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            {t('howYoureDoing')}
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {t('whereShowingUp')}
          </p>
        </div>
        <KeywordGrid cards={keywordCards} />
      </div>

      {/* SEO Checklist */}
      <div className="rounded-2xl border border-gray-200/60 bg-white shadow-sm overflow-hidden">
        <SectionHeader
          number={section.number}
          title={t('sectionSearchResults')}
          subtitle={t('sectionSearchResultsSub')}
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
