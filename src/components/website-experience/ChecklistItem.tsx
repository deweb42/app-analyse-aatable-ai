import type { CheckItem } from '../../types/report'
import { StatusIcon } from '../shared/StatusIcon'
import { DisclosurePanel } from '../shared/DisclosurePanel'

interface ChecklistItemProps {
  item: CheckItem
}

export function ChecklistItem({ item }: ChecklistItemProps) {
  const hasDetails = item.findings || item.expected || item.description

  const trigger = (
    <div className="flex items-center gap-2">
      <StatusIcon status={item.status} />
      <span className="text-sm text-gray-800">{item.title}</span>
    </div>
  )

  if (!hasDetails) {
    return (
      <div className="flex items-center gap-2 py-2 px-1">
        <StatusIcon status={item.status} />
        <span className="text-sm text-gray-800">{item.title}</span>
      </div>
    )
  }

  return (
    <div className="px-1">
      <DisclosurePanel trigger={trigger}>
        <div className="ml-7 pb-2 space-y-1">
          {item.description && (
            <p className="text-xs text-gray-500">{item.description}</p>
          )}
          {item.findings && (
            <div className="text-xs">
              <span className="text-gray-500">What we found: </span>
              <span className="text-gray-700">{item.findings}</span>
            </div>
          )}
          {item.expected && (
            <div className="text-xs">
              <span className="text-gray-500">What we were looking for: </span>
              <span className="text-gray-700">{item.expected}</span>
            </div>
          )}
        </div>
      </DisclosurePanel>
    </div>
  )
}
