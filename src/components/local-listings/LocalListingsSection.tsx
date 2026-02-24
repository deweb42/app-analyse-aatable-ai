import type { ReportSection, GoogleBusinessProfile } from '../../types/report'
import { useI18n } from '../../lib/i18n'
import { SectionHeader } from '../shared/SectionHeader'
import { GoogleProfileCard } from './GoogleProfileCard'
import { ChecklistAccordion } from '../website-experience/ChecklistAccordion'

interface LocalListingsSectionProps {
  section: ReportSection
  googleProfile: GoogleBusinessProfile
}

export function LocalListingsSection({ section, googleProfile }: LocalListingsSectionProps) {
  const { t } = useI18n()

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white shadow-sm overflow-hidden">
      <SectionHeader
        number={section.number}
        title={t('sectionLocalListings')}
        subtitle={t('sectionLocalListingsSub')}
        score={section.score}
        maxScore={section.maxScore}
        scoreColor={section.scoreColor}
      />

      <div className="p-5">
        <GoogleProfileCard profile={googleProfile} />
      </div>

      <div className="border-t border-gray-100">
        {section.categories.map((category) => (
          <ChecklistAccordion key={category.name} category={category} />
        ))}
      </div>
    </div>
  )
}
