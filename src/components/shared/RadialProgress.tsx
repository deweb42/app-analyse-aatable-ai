import { motion } from 'motion/react'
import { getDashArray } from '../../lib/score-utils'

interface RadialProgressProps {
  size: 'lg' | 'sm' | 'inline'
  score: number
  maxScore: number
  strokeColor: string
  showLabel?: boolean
  animate?: boolean
}

const sizeConfig = {
  lg: { viewBox: '0 0 160 160', radius: 72, strokeWidth: 12, circumference: 452.389 },
  sm: { viewBox: '0 0 32 32', radius: 14.0528, strokeWidth: 3.8944, circumference: 88.296 },
  inline: { viewBox: '0 0 24 24', radius: 10.5396, strokeWidth: 2.9208, circumference: 66.222 },
}

const containerSize = {
  lg: 'w-36 h-36',
  sm: 'w-8 h-8',
  inline: 'w-6 h-6',
}

export function RadialProgress({
  size,
  score,
  maxScore,
  strokeColor,
  showLabel = false,
  animate = true,
}: RadialProgressProps) {
  const config = sizeConfig[size]
  const [filled] = getDashArray(score, maxScore, config.circumference)
  const center = size === 'lg' ? 80 : size === 'sm' ? 16 : 12

  return (
    <div className={`relative ${containerSize[size]} shrink-0`}>
      <svg
        viewBox={config.viewBox}
        className="w-full h-full -rotate-90"
        fill="none"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          stroke={strokeColor}
          strokeWidth={config.strokeWidth}
          opacity={0.12}
          fill="none"
        />
        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={config.radius}
          stroke={strokeColor}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          fill="none"
          initial={animate ? { strokeDasharray: `0 ${config.circumference}` } : undefined}
          animate={{ strokeDasharray: `${filled} ${config.circumference}` }}
          transition={animate ? { duration: 0.8, ease: 'easeOut' } : { duration: 0 }}
        />
      </svg>
      {showLabel && size === 'lg' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold text-gray-900 tabular-nums tracking-tight"
            initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-gray-400 font-medium">/ {maxScore}</span>
        </div>
      )}
    </div>
  )
}
