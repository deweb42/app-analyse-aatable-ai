import { motion } from 'motion/react'
import { MapPin, Globe, Star, ArrowRight } from 'lucide-react'
import { RadialProgress } from '../shared/RadialProgress'
import { useI18n } from '../../lib/i18n'

interface ProfileCardProps {
  name: string
  city: string
  website: string
  imageUrl: string
  currentScore: number
  projectedScore: number
  maxScore: number
  scoreColor: string
  rating?: number
  reviewCount?: number
}

export function ProfileCard({
  name,
  city,
  website,
  imageUrl,
  currentScore,
  projectedScore,
  maxScore,
  scoreColor,
  rating,
  reviewCount,
}: ProfileCardProps) {
  const { t } = useI18n()
  const domain = website.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <div className="relative h-full rounded-2xl border border-[#EDBEAF] bg-gradient-to-b from-[#FDF4F1] via-[#F9E5E1] to-[#F2C4BA] p-5 flex flex-col overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative flex flex-col items-center flex-1">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden bg-white ring-2 ring-white/80 shadow-sm mb-3">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-400">{name.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Restaurant info */}
        <div className="text-center mb-1">
          <h3 className="text-base font-semibold text-gray-900 tracking-tight">{name}</h3>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{city}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <Globe className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{domain}</span>
          </div>
          {rating != null && reviewCount != null && (
            <div className="flex items-center justify-center gap-1 mt-1.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-semibold text-gray-700">{rating}</span>
              <span className="text-[11px] text-gray-400">({reviewCount})</span>
            </div>
          )}
        </div>

        {/* Dashed divider */}
        <div
          className="w-full h-px my-4"
          style={{
            background: 'repeating-linear-gradient(90deg, #090a0b 0, #090a0b 6px, transparent 6px, transparent 11px)',
            opacity: 0.12,
          }}
        />

        {/* Current score */}
        <div className="mb-2">
          <RadialProgress
            size="lg"
            score={currentScore}
            maxScore={maxScore}
            strokeColor={scoreColor}
            showLabel
            animate
          />
        </div>
        <p className="text-[11px] text-gray-400 tracking-widest uppercase font-medium mb-4">{t('currentScore')}</p>

        {/* Arrow + 30j */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex items-center gap-1.5 mb-4"
        >
          <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">30 {t('goalIn30Days')}</span>
        </motion.div>

        {/* Projected score */}
        <div className="mb-2">
          <RadialProgress
            size="lg"
            score={projectedScore}
            maxScore={maxScore}
            strokeColor="#57AA30"
            showLabel
            animate
          />
        </div>
        <p className="text-[11px] text-green-600 tracking-widest uppercase font-medium mb-4">{t('goalIn30Days')}</p>

        {/* Footer */}
        <p className="text-[11px] text-gray-400 text-center mt-auto pt-2">
          {t('basedOnAudit', { count: '100' })}
        </p>
      </div>
    </div>
  )
}
