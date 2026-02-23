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
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-900">{category.name}</span>
      <span className="text-xs text-gray-500">
        {passCount}/{totalCount} passed
      </span>
    </div>
  )

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <DisclosurePanel trigger={trigger} className="px-4 py-1">
        <div className="space-y-0.5 pb-2">
          {category.items.map((item) => (
            <ChecklistItem key={item.title} item={item} />
          ))}
        </div>
      </DisclosurePanel>
    </div>
  )
}
