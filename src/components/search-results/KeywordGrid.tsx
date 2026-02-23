import type { KeywordCard as KeywordCardType } from '../../types/report'
import { KeywordCard } from './KeywordCard'

interface KeywordGridProps {
  cards: KeywordCardType[]
}

export function KeywordGrid({ cards }: KeywordGridProps) {
  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white shadow-sm overflow-hidden divide-y divide-gray-100">
      {cards.map((card) => (
        <KeywordCard key={card.fullKeyword} card={card} />
      ))}
    </div>
  )
}
