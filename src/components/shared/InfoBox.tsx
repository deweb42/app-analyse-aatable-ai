import type { InfoBox as InfoBoxType } from '../../types/report'
import { Info } from 'lucide-react'
import { useI18n, type TranslationKey } from '../../lib/i18n'

interface InfoBoxProps {
  infoBox: InfoBoxType
}

// Map known infoBox titles to i18n keys
const titleMap: Record<string, { title: TranslationKey; text: TranslationKey }> = {
  "What's SEO?": { title: 'whatsSeo', text: 'whatsSeoText' },
  "C'est quoi le SEO ?": { title: 'whatsSeo', text: 'whatsSeoText' },
  'Your site': { title: 'yourSite', text: 'yourSiteText' },
  'Votre site': { title: 'yourSite', text: 'yourSiteText' },
}

export function InfoBox({ infoBox }: InfoBoxProps) {
  const { t } = useI18n()
  const mapped = titleMap[infoBox.title]

  const title = mapped ? t(mapped.title) : infoBox.title
  const text = mapped ? t(mapped.text) : infoBox.text

  return (
    <div className="mx-5 my-3 rounded-xl bg-blue-50/60 border border-blue-100/60 p-4">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[13px] font-semibold text-gray-900">{title}</h4>
          <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  )
}
