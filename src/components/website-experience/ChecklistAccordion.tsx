import type { CheckCategory } from '../../types/report'
import { DisclosurePanel } from '../shared/DisclosurePanel'
import { ChecklistItem } from './ChecklistItem'

interface ChecklistAccordionProps {
  category: CheckCategory
}

export function ChecklistAccordion({ category }: ChecklistAccordionProps) {
  const passCount = category.items.filter((i) => i.status === 'pass').length
  const totalCount = category.items.length

  const trigger = (
    <div className="flex items-center justify-between pr-1">
      <span className="text-[13px] font-semibold text-gray-900">{category.name}</span>
      <span className="text-[11px] font-medium text-gray-400 tabular-nums bg-gray-100 rounded-md px-1.5 py-0.5">
        {passCount}/{totalCount}
      </span>
    </div>
  )

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <DisclosurePanel trigger={trigger} className="px-5 py-1">
        <div className="space-y-0 pb-2">
          {category.items.map((item) => (
            <ChecklistItem key={item.title} item={item} />
          ))}
        </div>
      </DisclosurePanel>
    </div>
  )
}
