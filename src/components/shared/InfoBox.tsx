import type { InfoBox as InfoBoxType } from '../../types/report'

interface InfoBoxProps {
  infoBox: InfoBoxType
}

export function InfoBox({ infoBox }: InfoBoxProps) {
  return (
    <div className="mx-4 my-3 rounded-lg bg-gray-50 p-4">
      <h4 className="text-sm font-semibold text-gray-900">{infoBox.title}</h4>
      <p className="text-sm text-gray-600 mt-1">{infoBox.text}</p>
    </div>
  )
}
