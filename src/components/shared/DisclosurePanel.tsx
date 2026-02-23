import { Disclosure, DisclosureButton, DisclosurePanel as HeadlessPanel } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode } from 'react'

interface DisclosurePanelProps {
  trigger: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function DisclosurePanel({
  trigger,
  children,
  defaultOpen = false,
  className = '',
}: DisclosurePanelProps) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className={className}>
          <DisclosureButton className="flex w-full items-center justify-between gap-2 py-2 text-left">
            <div className="flex-1 min-w-0">{trigger}</div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </DisclosureButton>
          <AnimatePresence initial={false}>
            {open && (
              <HeadlessPanel static>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  {children}
                </motion.div>
              </HeadlessPanel>
            )}
          </AnimatePresence>
        </div>
      )}
    </Disclosure>
  )
}
