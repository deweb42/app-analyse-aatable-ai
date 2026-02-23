import type { ReportSection } from '../../types/report'
import { SectionHeader } from '../shared/SectionHeader'
import { ChecklistAccordion } from './ChecklistAccordion'

interface WebsiteExperienceSectionProps {
  section: ReportSection
}

export function WebsiteExperienceSection({ section }: WebsiteExperienceSectionProps) {
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
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <SectionHeader
        number={section.number}
        title={section.title}
        subtitle={section.subtitle}
        score={section.score}
        maxScore={section.maxScore}
        scoreColor={section.scoreColor}
      />
      <div className="px-4 py-3">
        <p className="text-sm text-gray-600 mb-4">
          {totalItems} things reviewed, <span className="text-red-500 font-medium">{needsWork} need work</span>
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
