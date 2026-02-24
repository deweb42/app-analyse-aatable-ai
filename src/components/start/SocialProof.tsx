import { motion } from 'motion/react'
import type { CaseStudy } from '../../types/report'
import { useI18n } from '../../lib/i18n'

interface SocialProofProps {
  caseStudies: CaseStudy[]
}

export function SocialProof({ caseStudies }: SocialProofProps) {
  const { t } = useI18n()

  if (caseStudies.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">{t('successStory')}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {caseStudies.map((cs, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">{cs.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{cs.name}</p>
                <p className="text-xs text-gray-400">
                  {cs.initialScore} → {cs.finalScore}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{cs.result}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
