import { motion } from 'motion/react'
import { Smartphone } from 'lucide-react'
import { useI18n } from '../../lib/i18n'

interface MobileScreenshotCardProps {
  websiteName: string
}

export function MobileScreenshotCard({ websiteName }: MobileScreenshotCardProps) {
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="ml-9.5"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 max-w-[280px]">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{t('mobileScan')}</span>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200/80 p-5 flex flex-col items-center justify-center gap-2.5">
          {/* Phone frame */}
          <div className="w-14 h-24 rounded-lg border-2 border-gray-300 bg-white flex flex-col items-center justify-center gap-1.5 shadow-inner">
            <div className="w-6 h-1 bg-gray-200 rounded-full" />
            <div className="w-8 h-1 bg-gray-100 rounded-full" />
            <div className="w-5 h-1 bg-gray-100 rounded-full" />
          </div>
          <span className="text-[11px] text-gray-400 font-medium">{websiteName}</span>
        </div>
      </div>
    </motion.div>
  )
}
