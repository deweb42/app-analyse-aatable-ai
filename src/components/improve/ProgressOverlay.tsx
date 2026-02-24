import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'
import { useI18n } from '../../lib/i18n'

interface ProgressOverlayProps {
  /** Total duration in ms before redirect */
  totalDuration: number
  /** Whether the sequence is done */
  done: boolean
}

/**
 * Progress bar with %. Goes fast at start (0→70 in 60% of time),
 * then slows (70→95 in 35% of time), then jumps to 100% and shows
 * a checkmark animation 1s before redirect.
 */
export function ProgressOverlay({ totalDuration, done }: ProgressOverlayProps) {
  const { t } = useI18n()
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    const start = Date.now()
    const fastEnd = totalDuration * 0.55 // 0→70% in first 55% of time
    const slowEnd = totalDuration * 0.90 // 70→95% in next 35%

    const tick = () => {
      const elapsed = Date.now() - start
      let pct: number

      if (elapsed < fastEnd) {
        // Fast phase: 0→70
        pct = (elapsed / fastEnd) * 70
      } else if (elapsed < slowEnd) {
        // Slow phase: 70→95
        const slowElapsed = elapsed - fastEnd
        const slowDuration = slowEnd - fastEnd
        pct = 70 + (slowElapsed / slowDuration) * 25
      } else {
        // Hold at 95 until done
        pct = 95
      }

      setProgress(Math.min(Math.round(pct), 95))
    }

    const interval = setInterval(tick, 60)
    return () => clearInterval(interval)
  }, [totalDuration])

  // When done, animate to 100
  useEffect(() => {
    if (done) {
      setProgress(100)
      const timer = setTimeout(() => setComplete(true), 400)
      return () => clearTimeout(timer)
    }
  }, [done])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      {/* Progress bar */}
      <div className="h-1 bg-gray-100/50">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 rounded-r-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Percentage badge */}
      <div className="flex justify-center mt-2">
        <AnimatePresence mode="wait">
          {complete ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-flex items-center gap-1.5 bg-green-500 text-white rounded-full px-3 py-1 shadow-lg shadow-green-500/20"
            >
              <Check className="w-3 h-3" />
              <span className="text-[11px] font-semibold">100%</span>
            </motion.div>
          ) : (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-full px-3 py-1 shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" style={{ animation: 'pulse-ring 1.5s ease-in-out infinite' }} />
              <span className="text-[11px] font-semibold text-gray-600 tabular-nums">{progress}%</span>
              <span className="text-[10px] text-gray-400">{t('improvingWebsite')}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
