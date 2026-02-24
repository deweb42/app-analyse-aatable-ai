import { motion } from 'motion/react'
import { AnimatedText } from './AnimatedText'
import { User } from 'lucide-react'

interface ChatMessageProps {
  side: 'user' | 'bot'
  text: string
  animated?: boolean
}

export function ChatMessage({ side, text, animated = false }: ChatMessageProps) {
  const isUser = side === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0 shadow-sm">
          <User className="w-3.5 h-3.5 text-white" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white text-[10px] font-bold">AI</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
          isUser
            ? 'bg-gray-900 text-white rounded-br-md'
            : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-md'
        }`}
      >
        {animated ? <AnimatedText text={text} /> : text}
      </div>
    </motion.div>
  )
}
