import type { KeywordCard as KeywordCardType } from '../../types/report'
import { KeywordCard } from './KeywordCard'

interface KeywordGridProps {
  cards: KeywordCardType[]
}

export function KeywordGrid({ cards }: KeywordGridProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {cards.map((card) => (
        <KeywordCard key={card.fullKeyword} card={card} />
      ))}
    </div>
  )
}
