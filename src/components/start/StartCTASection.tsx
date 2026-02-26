import { motion } from 'motion/react'
import { ArrowRight, Phone, Shield, Calendar, Gift, Smile } from 'lucide-react'
import { useI18n } from '../../lib/i18n'

export function StartCTASection() {
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl overflow-hidden"
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-gray-900" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative p-5 md:p-8">
        {/* Mock calendar preview */}
        <div className="bg-white/[0.07] backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6 max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-white/60" />
            <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Cal.com</span>
          </div>
          {/* Fake calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <span key={i} className="text-[9px] text-white/30 text-center font-medium">{d}</span>
            ))}
            {Array.from({ length: 28 }, (_, i) => {
              const isHighlighted = [3, 5, 10, 12, 17, 19, 24, 26].includes(i)
              return (
                <div
                  key={i}
                  className={`aspect-square rounded flex items-center justify-center text-[9px] font-medium ${
                    isHighlighted
                      ? 'bg-white/15 text-white/80'
                      : 'text-white/20'
                  }`}
                >
                  {i + 1}
                </div>
              )
            })}
          </div>
          {/* Time slots */}
          <div className="flex gap-1.5">
            {['09:00', '10:30', '14:00', '16:30'].map((time) => (
              <div key={time} className="flex-1 text-center py-1 rounded bg-white/[0.07] text-[9px] text-white/40 font-medium">
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* CTA button */}
        <div className="text-center mb-5">
          <button
            onClick={() => window.open('https://cal.com/PLACEHOLDER', '_blank')}
            className="inline-flex items-center gap-2 rounded-xl bg-white text-gray-900 px-6 py-3 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 shadow-lg"
          >
            {t('getItNow')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 mb-6">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3 h-3" />
            {t('freeCall')}
          </span>
          <span className="w-px h-3 bg-gray-700" />
          <span className="flex items-center gap-1.5">
            <Shield className="w-3 h-3" />
            {t('noCommitment')}
          </span>
        </div>

        {/* Dashed divider */}
        <div
          className="w-full h-px mb-5"
          style={{
            background: 'repeating-linear-gradient(90deg, #ffffff 0, #ffffff 6px, transparent 6px, transparent 11px)',
            opacity: 0.08,
          }}
        />

        {/* Secret gift bonus */}
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3.5">
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 4 }}
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-sm shrink-0"
          >
            <Gift className="w-4 h-4 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[12px] font-semibold text-white/90">{t('secretGift')}</span>
              <span className="text-[9px] font-semibold text-violet-300 bg-violet-500/20 border border-violet-400/20 rounded px-1.5 py-0.5">
                {t('secretGiftValue')}
              </span>
            </div>
            <p className="text-[11px] text-white/40 leading-snug">{t('secretGiftDesc')}</p>
          </div>
          <Smile className="w-5 h-5 text-amber-400/60 shrink-0" />
        </div>

        <p className="text-[10px] text-white/25 text-center mt-3 uppercase tracking-wider font-medium">
          {t('secretGiftReveal')}
        </p>
      </div>
    </motion.div>
  )
}
