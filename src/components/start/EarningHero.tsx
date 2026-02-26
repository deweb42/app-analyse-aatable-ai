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
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="text-center py-5"
    >
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-green-700 rounded-full px-4 py-2 shadow-sm">
        <TrendingUp className="w-4 h-4" />
        <span className="text-base font-bold tracking-tight">{t('earnPerMonth', { amount: amount.toLocaleString() })}</span>
      </div>
      <p className="text-[13px] text-gray-400 max-w-sm mx-auto mt-3 leading-relaxed">
        {t('newWebsiteRank')}
      </p>
    </motion.div>
  )
}
