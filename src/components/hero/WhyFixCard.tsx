import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { CaseStudy } from '../../types/report'

interface WhyFixCardProps {
  caseStudies: CaseStudy[]
}

export function WhyFixCard({ caseStudies }: WhyFixCardProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = caseStudies[activeIndex]

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % caseStudies.length)
  }, [caseStudies.length])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative rounded-2xl overflow-hidden h-full min-h-[240px] shadow-sm group cursor-pointer">
      {/* Background images with crossfade */}
      <AnimatePresence mode="wait">
        <motion.img
          key={activeIndex}
          src={new URL(`../../assets/images/${active.desktopImage}`, import.meta.url).href}
          alt={active.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        <div>
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1">
            Success story
          </span>
          <h3 className="text-lg font-bold text-white">Why fix these?</h3>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              className="text-[13px] text-white/85 leading-relaxed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <span className="font-semibold text-white">{active.name}</span> had a health score of{' '}
              <span className="font-semibold text-white">{active.initialScore}</span>. They{' '}
              {active.result.toLowerCase()} by increasing their score to{' '}
              <span className="font-semibold text-white">{active.finalScore}</span>.
            </motion.p>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5 mt-3">
            {caseStudies.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i) }}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-5 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
