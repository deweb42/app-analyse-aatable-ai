import type { InfoBox as InfoBoxType } from '../../types/report'
import { Info } from 'lucide-react'

interface InfoBoxProps {
  infoBox: InfoBoxType
}

export function InfoBox({ infoBox }: InfoBoxProps) {
  return (
    <div className="mx-5 my-3 rounded-xl bg-blue-50/60 border border-blue-100/60 p-4">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-[13px] font-semibold text-gray-900">{infoBox.title}</h4>
          <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{infoBox.text}</p>
        </div>
      </div>
    </div>
  )
}
