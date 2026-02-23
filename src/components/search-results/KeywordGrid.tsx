import type { KeywordCard as KeywordCardType } from '../../types/report'
import { KeywordCard } from './KeywordCard'

interface KeywordGridProps {
  cards: KeywordCardType[]
}

export function KeywordGrid({ cards }: KeywordGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 px-4">
      {cards.map((card) => (
        <KeywordCard key={card.fullKeyword} card={card} />
      ))}
    </div>
  )
}
