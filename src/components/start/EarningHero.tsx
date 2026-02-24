import { motion } from 'motion/react'
import { TrendingUp } from 'lucide-react'
import { useI18n } from '../../lib/i18n'

interface EarningHeroProps {
  amount: number
}

export function EarningHero({ amount }: EarningHeroProps) {
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="text-center py-6"
    >
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-green-700 rounded-2xl px-5 py-2.5 mb-3 shadow-sm">
        <TrendingUp className="w-5 h-5" />
        <span className="text-lg font-bold">{t('earnPerMonth', { amount: amount.toLocaleString() })}</span>
      </div>
      <p className="text-gray-400 text-sm max-w-sm mx-auto mt-3 leading-relaxed">
        {t('newWebsiteRank')}
      </p>
    </motion.div>
  )
}
