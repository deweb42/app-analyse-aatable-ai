import { motion } from 'motion/react'
import { CheckCircle2 } from 'lucide-react'
import { useI18n } from '../../lib/i18n'

interface TodoListCardProps {
  items: string[]
}

export function TodoListCard({ items }: TodoListCardProps) {
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="ml-9.5"
    >
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 max-w-[320px]">
        <h4 className="text-[13px] font-semibold text-gray-900 mb-3">{t('todoHeading')}</h4>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.25 }}
              className="flex items-start gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-[12px] text-gray-600 leading-snug">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
