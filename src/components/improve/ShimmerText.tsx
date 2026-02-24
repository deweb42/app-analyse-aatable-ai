import { motion } from 'motion/react'

interface ShimmerTextProps {
  text: string
}

export function ShimmerText({ text }: ShimmerTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-2.5 ml-9.5"
    >
      {/* Pulsing dot */}
      <div className="relative shrink-0">
        <div
          className="w-2 h-2 rounded-full bg-violet-500"
          style={{ animation: 'pulse-ring 1.5s ease-in-out infinite' }}
        />
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-violet-400 opacity-40"
          style={{ animation: 'pulse-ring 1.5s ease-in-out infinite 0.3s' }}
        />
      </div>
      <span
        className="text-[13px] font-medium bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 bg-clip-text text-transparent bg-[length:200%_100%]"
        style={{ animation: 'shimmer 2s linear infinite' }}
      >
        {text}
      </span>
    </motion.div>
  )
}
