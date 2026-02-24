import { motion } from 'motion/react'

interface AnimatedTextProps {
  text: string
  className?: string
}

export function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.03, duration: 0.05 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}
