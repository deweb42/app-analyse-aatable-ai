import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronUp } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { KeywordCard as KeywordCardType } from '../../types/report'
import { RankBadge } from './RankBadge'
import { CompetitorEntry } from './CompetitorEntry'
import googleIcon from '../../assets/icons/google_symbol.svg'
import mapBg from '../../assets/images/map-bg.png'

interface KeywordCardProps {
  card: KeywordCardType
}

export function KeywordCard({ card }: KeywordCardProps) {
  const mapCompetitors = card.competitors
    .filter((c) => c.mapRank !== null)
    .sort((a, b) => (a.mapRank ?? 99) - (b.mapRank ?? 99))

  return (
    <Disclosure defaultOpen={false}>
      {({ open }) => (
        <div className="border-b border-gray-100 last:border-b-0">
          {/* Trigger row */}
          <DisclosureButton className="flex w-full items-center gap-3 py-3 px-4 text-left hover:bg-gray-50 transition-colors">
            <img src={googleIcon} alt="" className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium text-gray-900 flex-1">
              {card.fullKeyword}
            </span>
            {card.winner && (
              <span className="text-xs text-gray-500 hidden sm:inline-flex items-center gap-1">
                <span>🏆</span> #1: {card.winner}
              </span>
            )}
            <div className="flex items-center gap-1.5 shrink-0">
              <RankBadge rank={card.mapPackRank} label="Unranked map pack" compact />
              <RankBadge rank={card.organicRank} label="Unranked organic" compact />
            </div>
            <ChevronUp
              className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                open ? '' : 'rotate-180'
              }`}
            />
          </DisclosureButton>

          {/* Expanded panel */}
          <AnimatePresence initial={false}>
            {open && (
              <DisclosurePanel static>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
                    {/* Google Maps results */}
                    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                      <div className="p-4">
                        <h4 className="text-base font-semibold text-gray-900">
                          Google Maps results
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          These results get the most clicks
                        </p>
                      </div>
                      <div className="flex">
                        {/* Map image */}
                        <div className="w-2/5 relative">
                          <img
                            src={mapBg}
                            alt="Map"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Results list */}
                        <div className="w-3/5 p-3">
                          <p className="text-xs text-gray-500 mb-2">Top 3 map results</p>
                          {mapCompetitors.map((comp, i) => (
                            <CompetitorEntry key={comp.name} competitor={comp} index={i} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Google Search results */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <h4 className="text-base font-semibold text-gray-900">
                        Google Search results
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 mb-3">
                        You are Unranked
                      </p>
                      <div className="space-y-3">
                        {card.organicResults.map((result) => (
                          <div key={result.title} className="flex items-start gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] text-gray-500">
                                {result.site.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] text-gray-400 truncate">{result.site}</p>
                              <p className="text-sm text-blue-700 truncate">{result.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </DisclosurePanel>
            )}
          </AnimatePresence>
        </div>
      )}
    </Disclosure>
  )
}
