import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { RadialProgress } from '../shared/RadialProgress'
import { useI18n } from '../../lib/i18n'

interface ScoreComparisonProps {
  currentScore: number
  projectedScore: number
  maxScore: number
  currentColor: string
}

export function ScoreComparison({ currentScore, projectedScore, maxScore, currentColor }: ScoreComparisonProps) {
  const { t } = useI18n()
  const projectedColor = '#57AA30' // green for projected

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-center gap-6 md:gap-10">
        {/* Current */}
        <div className="text-center">
          <RadialProgress
            size="lg"
            score={currentScore}
            maxScore={maxScore}
            strokeColor={currentColor}
            showLabel
          />
          <p className="mt-3 text-sm font-medium text-gray-500">{t('currentLabel')}</p>
        </div>

        <ArrowRight className="w-6 h-6 text-gray-300 shrink-0" />

        {/* Projected */}
        <div className="text-center">
          <RadialProgress
            size="lg"
            score={projectedScore}
            maxScore={maxScore}
            strokeColor={projectedColor}
            showLabel
          />
          <p className="mt-3 text-sm font-medium text-green-600">{t('projectedLabel')}</p>
        </div>
      </div>
    </motion.div>
  )
}
