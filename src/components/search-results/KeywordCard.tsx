import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { KeywordCard as KeywordCardType } from '../../types/report'
import { useI18n } from '../../lib/i18n'
import { RankBadge } from './RankBadge'
import { CompetitorEntry } from './CompetitorEntry'
import googleIcon from '../../assets/icons/google_symbol.svg'
import mapBg from '../../assets/images/map-bg.png'

interface KeywordCardProps {
  card: KeywordCardType
}

export function KeywordCard({ card }: KeywordCardProps) {
  const { t } = useI18n()
  const mapCompetitors = card.competitors
    .filter((c) => c.mapRank !== null)
    .sort((a, b) => (a.mapRank ?? 99) - (b.mapRank ?? 99))

  return (
    <Disclosure defaultOpen={false}>
      {({ open }) => (
        <div>
          {/* Trigger row */}
          <DisclosureButton className="flex w-full items-center gap-3 py-3 px-4 text-left hover:bg-gray-50/80 transition-colors">
            <img src={googleIcon} alt="" className="w-5 h-5 shrink-0" />
            <span className="text-[13px] font-semibold text-gray-900 flex-1 truncate">
              {card.fullKeyword}
            </span>
            {card.winner && (
              <span className="text-[11px] text-gray-400 hidden md:inline-flex items-center gap-1 shrink-0">
                <span className="text-amber-500">&#9733;</span> {card.winner}
              </span>
            )}
            <div className="flex items-center gap-1 shrink-0">
              <RankBadge rank={card.mapPackRank} label="Map" compact />
              <RankBadge rank={card.organicRank} label="Organic" compact />
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-300 shrink-0 transition-transform duration-200 ${
                open ? 'rotate-180' : ''
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 pb-4">
                    {/* Google Maps results */}
                    <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 overflow-hidden">
                      <div className="px-4 pt-4 pb-2">
                        <h4 className="text-sm font-bold text-gray-900">
                          {t('googleMapsResults')}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {t('mostClicks')}
                        </p>
                      </div>
                      <div className="flex">
                        <div className="w-2/5 relative">
                          <img
                            src={mapBg}
                            alt="Map"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-3/5 px-3 pb-3 pt-1">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1.5">{t('top3Map')}</p>
                          {mapCompetitors.map((comp, i) => (
                            <CompetitorEntry key={comp.name} competitor={comp} index={i} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Google Search results */}
                    <div className="rounded-xl border border-gray-200/80 bg-gray-50/50 p-4">
                      <h4 className="text-sm font-bold text-gray-900">
                        {t('googleSearchResults')}
                      </h4>
                      <p className="text-[11px] text-red-400 font-medium mt-0.5 mb-3">
                        {t('youAreUnranked')}
                      </p>
                      <div className="space-y-2.5">
                        {card.organicResults.map((result) => (
                          <div key={result.title} className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded bg-gray-200/80 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[9px] font-bold text-gray-400">
                                {result.site.replace('www.', '').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] text-gray-400 truncate">{result.site}</p>
                              <p className="text-[12px] text-blue-600 truncate leading-snug">{result.title}</p>
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
