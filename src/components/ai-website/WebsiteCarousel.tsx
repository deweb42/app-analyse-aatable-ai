import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { CaseStudy } from '../../types/report'
import { useI18n } from '../../lib/i18n'

interface WebsiteCarouselProps {
  caseStudies: CaseStudy[]
}

export function WebsiteCarousel({ caseStudies }: WebsiteCarouselProps) {
  const { t } = useI18n()
  const [activeIndex, setActiveIndex] = useState(0)
  const active = caseStudies[activeIndex]

  return (
    <div className="space-y-4">
      {/* Case study info */}
      <div className="text-center">
        <p className="text-sm font-medium text-white">{active.name}</p>
        <p className="text-xs text-white/70 mt-0.5">
          {t('score')}: {active.initialScore} → {active.finalScore}
        </p>
        <p className="text-xs text-white/70">{active.result}</p>
      </div>

      {/* Images */}
      <div className="relative overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex gap-4 justify-center items-end"
          >
            <img
              src={new URL(`../../assets/images/${active.desktopImage}`, import.meta.url).href}
              alt={`${active.name} desktop`}
              className="w-3/5 rounded-lg shadow-lg"
            />
            <img
              src={new URL(`../../assets/images/${active.tabletImage}`, import.meta.url).href}
              alt={`${active.name} tablet`}
              className="w-1/4 rounded-lg shadow-lg"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2">
        {caseStudies.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`rounded-full transition-all ${
              i === activeIndex
                ? 'w-3.5 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
