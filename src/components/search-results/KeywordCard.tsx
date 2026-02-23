import type { KeywordCard as KeywordCardType } from '../../types/report'
import { DisclosurePanel } from '../shared/DisclosurePanel'
import { RankBadge } from './RankBadge'
import { CompetitorEntry } from './CompetitorEntry'
import googleIcon from '../../assets/icons/google_symbol.svg'

interface KeywordCardProps {
  card: KeywordCardType
}

export function KeywordCard({ card }: KeywordCardProps) {
  const trigger = (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-gray-900">{card.fullKeyword}</p>
          {card.winner && (
            <p className="text-xs text-gray-500 mt-0.5">
              Winner: <span className="text-gray-700">{card.winner}</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <RankBadge rank={card.mapPackRank} label="Map" />
        <RankBadge rank={card.organicRank} label="Organic" />
      </div>
    </div>
  )

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <DisclosurePanel trigger={trigger}>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Google Maps results */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <img src={googleIcon} alt="" className="w-4 h-4" />
                <span className="text-xs font-medium text-gray-600">Google Maps</span>
              </div>
              {card.competitors
                .filter((c) => c.mapRank !== null)
                .sort((a, b) => (a.mapRank ?? 99) - (b.mapRank ?? 99))
                .map((comp, i) => (
                  <CompetitorEntry key={comp.name} competitor={comp} index={i} />
                ))}
            </div>

            {/* Google Search results */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <img src={googleIcon} alt="" className="w-4 h-4" />
                <span className="text-xs font-medium text-gray-600">Google Search</span>
              </div>
              {card.competitors
                .filter((c) => c.organicRank !== null)
                .sort((a, b) => (a.organicRank ?? 99) - (b.organicRank ?? 99))
                .map((comp, i) => (
                  <CompetitorEntry key={comp.name} competitor={comp} index={i} />
                ))}
              {card.competitors.filter((c) => c.organicRank !== null).length === 0 && (
                <p className="text-xs text-gray-400 italic">No organic rankings data</p>
              )}
            </div>
          </div>
        </div>
      </DisclosurePanel>
    </div>
  )
}
