import type { ReportSection } from '../../types/report'
import { useI18n } from '../../lib/i18n'
import { SectionHeader } from '../shared/SectionHeader'
import { InfoBox } from '../shared/InfoBox'
import { ChecklistAccordion } from './ChecklistAccordion'

interface WebsiteExperienceSectionProps {
  section: ReportSection
}

export function WebsiteExperienceSection({ section }: WebsiteExperienceSectionProps) {
  const { t } = useI18n()
  const totalItems = section.categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const failCount = section.categories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.status === 'fail').length,
    0
  )
  const warningCount = section.categories.reduce(
    (sum, cat) => sum + cat.items.filter((i) => i.status === 'warning').length,
    0
  )
  const needsWork = failCount + warningCount

  return (
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
      <div className="px-5 py-3 border-b border-gray-100">
        <p className="text-[13px] text-gray-500">
          <span className="font-semibold text-gray-700">{t('thingsReviewed', { total: totalItems })}</span>
          <span className="text-red-500 font-semibold">{t('needWork', { count: needsWork })}</span>
        </p>
      </div>
      <div>
        {section.categories.map((category) => (
          <ChecklistAccordion key={category.name} category={category} />
        ))}
      </div>
    </div>
  )
}
