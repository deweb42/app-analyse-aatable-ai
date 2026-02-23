import type { CheckItem } from '../../types/report'
import { StatusIcon } from '../shared/StatusIcon'
import { DisclosurePanel } from '../shared/DisclosurePanel'

interface ChecklistItemProps {
  item: CheckItem
}

export function ChecklistItem({ item }: ChecklistItemProps) {
  const hasDetails = item.findings || item.expected || item.description

  const trigger = (
    <div className="flex items-center gap-2.5">
      <StatusIcon status={item.status} />
      <span className={`text-[13px] ${item.status === 'fail' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
        {item.title}
      </span>
    </div>
  )

  if (!hasDetails) {
    return (
      <div className="flex items-center gap-2.5 py-2 px-1">
        <StatusIcon status={item.status} />
        <span className={`text-[13px] ${item.status === 'fail' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
          {item.title}
        </span>
      </div>
    )
  }

  return (
    <div className="px-1">
      <DisclosurePanel trigger={trigger}>
        <div className="ml-[30px] pb-2 space-y-1.5">
          {item.description && (
            <p className="text-[12px] text-gray-400 leading-relaxed">{item.description}</p>
          )}
          {item.findings && (
            <div className="text-[12px] bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-400">Found: </span>
              <span className="text-gray-600">{item.findings}</span>
            </div>
          )}
          {item.expected && (
            <div className="text-[12px] bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-400">Expected: </span>
              <span className="text-gray-600">{item.expected}</span>
            </div>
          )}
        </div>
      </DisclosurePanel>
    </div>
  )
}
