import { motion } from 'motion/react'
import { Gift, Smile } from 'lucide-react'
import { useI18n } from '../../lib/i18n'

export function SecretGiftSection() {
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl bg-white border border-gray-200/60 shadow-sm overflow-hidden"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 4 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm shrink-0"
          >
            <Gift className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-gray-900 tracking-tight">{t('secretGift')}</h3>
              <span className="text-[10px] font-semibold text-violet-600 bg-violet-50 border border-violet-100 rounded-md px-1.5 py-0.5">
                {t('secretGiftValue')}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-snug mt-0.5">{t('secretGiftDesc')}</p>
          </div>
        </div>

        {/* Dashed divider */}
        <div
          className="w-full h-px mb-4"
          style={{
            background: 'repeating-linear-gradient(90deg, #090a0b 0, #090a0b 6px, transparent 6px, transparent 11px)',
            opacity: 0.08,
          }}
        />

        {/* Mystery row */}
        <div className="flex items-center gap-3 rounded-xl bg-violet-50/60 border border-violet-100/60 px-3.5 py-3">
          <Smile className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-2 w-16 bg-violet-200/60 rounded" />
              <div className="h-2 w-10 bg-violet-200/40 rounded" />
              <div className="h-2 w-20 bg-violet-200/60 rounded" />
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-2 w-24 bg-violet-200/40 rounded" />
              <div className="h-2 w-12 bg-violet-200/60 rounded" />
            </div>
          </div>
          <Gift className="w-4 h-4 text-violet-300 shrink-0" />
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-3 uppercase tracking-wider font-medium">
          {t('secretGiftReveal')}
        </p>
      </div>
    </motion.div>
  )
}
