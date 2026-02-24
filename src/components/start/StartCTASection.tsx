import { motion } from 'motion/react'
import { Sparkles, Shield, Clock } from 'lucide-react'
import { useI18n } from '../../lib/i18n'

interface StartCTASectionProps {
  domain: string
}

export function StartCTASection({ domain }: StartCTASectionProps) {
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl p-8 text-center overflow-hidden"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative">
        <button className="inline-flex items-center gap-2.5 rounded-xl bg-white text-gray-900 px-7 py-3.5 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-white/10 mb-5">
          <Sparkles className="w-4 h-4" />
          {t('launchForFree')}
        </button>

        <div className="flex items-center justify-center gap-4 text-[12px] text-gray-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            {t('keepDomain', { domain })}
          </span>
          <span className="w-px h-3 bg-gray-700" />
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {t('noContracts')}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
