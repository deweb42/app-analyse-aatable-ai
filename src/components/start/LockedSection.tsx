import { motion } from 'motion/react'
import { Lock, type LucideIcon } from 'lucide-react'
import { useI18n, type TranslationKey } from '../../lib/i18n'

interface LockedSectionProps {
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  icon: LucideIcon
  delay?: number
  children: React.ReactNode
}

export function LockedSection({ titleKey, descriptionKey, icon: Icon, delay = 0, children }: LockedSectionProps) {
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex flex-col rounded-2xl bg-white border border-gray-200/60 shadow-sm overflow-hidden h-full"
    >
      {/* Blurred content */}
      <div className="pointer-events-none select-none min-h-[260px]" style={{ filter: 'blur(7px)', opacity: 0.6 }}>
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[1px]">
        <div className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center mb-3 shadow-sm">
          <Lock className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <Icon className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[13px] font-semibold text-gray-900 tracking-tight">{t(titleKey)}</span>
        </div>
        <p className="text-[11px] text-gray-400 text-center max-w-[220px] leading-snug">{t(descriptionKey)}</p>
      </div>
    </motion.div>
  )
}

/** Mock content for the AI Report locked section */
export function MockReportContent() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-3.5 w-28 bg-gray-200/80 rounded" />
        <div className="h-3.5 w-14 bg-gray-200/80 rounded" />
      </div>
      {/* Score circle */}
      <div className="flex justify-center py-2">
        <div className="w-20 h-20 rounded-full border-[3px] border-violet-200/80">
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-gray-200">78</span>
          </div>
        </div>
      </div>
      {/* Lines */}
      <div className="space-y-2.5">
        <div className="h-2.5 w-full bg-gray-100 rounded" />
        <div className="h-2.5 w-4/5 bg-gray-100 rounded" />
        <div className="h-2.5 w-3/5 bg-gray-100 rounded" />
      </div>
      {/* Bar chart */}
      <div className="flex items-end gap-1.5 h-16">
        {[35, 55, 25, 65, 45, 30, 50].map((h, i) => (
          <div key={i} className="flex-1 bg-gray-100 rounded-sm" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

/** Mock content for the Marketing Report locked section */
export function MockMarketingContent() {
  return (
    <div className="p-5 space-y-4">
      <div className="h-3.5 w-36 bg-gray-200/80 rounded" />
      {/* Table rows */}
      <div className="space-y-2.5">
        {[80, 58, 42, 28, 65].map((w, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-gray-100 shrink-0" />
            <div className="h-2.5 w-16 bg-gray-100 rounded" />
            <div className="flex-1 h-2.5 bg-gray-50 rounded overflow-hidden">
              <div className="h-full bg-gray-100 rounded" style={{ width: `${w}%` }} />
            </div>
          </div>
        ))}
      </div>
      {/* Pie chart */}
      <div className="flex justify-center py-1">
        <div className="w-20 h-20 rounded-full bg-gray-50 border-[6px] border-gray-100" />
      </div>
      {/* Lines */}
      <div className="space-y-2">
        <div className="h-2.5 w-full bg-gray-100 rounded" />
        <div className="h-2.5 w-3/4 bg-gray-100 rounded" />
      </div>
    </div>
  )
}
