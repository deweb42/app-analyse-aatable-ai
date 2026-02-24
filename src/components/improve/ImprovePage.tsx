import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import type { HealthReport } from '../../types/report'
import { useI18n } from '../../lib/i18n'
import { LanguageToggle } from '../shared/LanguageToggle'
import { useChatSequence } from './useChatSequence'
import { ChatMessage } from './ChatMessage'
import { ShimmerText } from './ShimmerText'
import { MobileScreenshotCard } from './MobileScreenshotCard'
import { TodoListCard } from './TodoListCard'
import { TypingIndicator } from './TypingIndicator'
import { ProgressOverlay } from './ProgressOverlay'
import { Sparkles } from 'lucide-react'

interface ImprovePageProps {
  report: HealthReport
  slug: string
}

// Total estimated animation time ~28s (all step delays + typing)
const TOTAL_DURATION = 28000

export default function ImprovePage({ report, slug }: ImprovePageProps) {
  const { t } = useI18n()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { visibleSteps, isTyping, done } = useChatSequence(report, slug)

  // Auto-scroll as steps appear
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
      })
    }
  }, [visibleSteps.length, isTyping])

  // Auto-redirect when done (1s after completion animation)
  useEffect(() => {
    if (done) {
      const timer = setTimeout(() => {
        window.location.href = `/start/${slug}`
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [done, slug])

  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] font-suisse">
      {/* Progress overlay */}
      <ProgressOverlay totalDuration={TOTAL_DURATION} done={done} />

      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-5 py-3.5 bg-white/95 backdrop-blur-sm border-b border-gray-100/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-900 block leading-tight">AI Website Builder</span>
            <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" style={{ animation: 'pulse-ring 2s ease-in-out infinite' }} />
              Online
            </span>
          </div>
        </div>
        <LanguageToggle />
      </header>

      {/* Chat body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-4">
          {visibleSteps.map((step, i) => {
            switch (step.type) {
              case 'user-msg':
                return <ChatMessage key={`step-${i}`} side="user" text={step.content} />
              case 'bot-msg':
                return <ChatMessage key={`step-${i}`} side="bot" text={step.content} />
              case 'bot-msg-animated':
                return <ChatMessage key={`step-${i}`} side="bot" text={step.content} animated />
              case 'card-screenshot':
                return <MobileScreenshotCard key={`step-${i}`} websiteName={step.content} />
              case 'shimmer':
                return <ShimmerText key={`step-${i}`} text={step.content} />
              case 'card-todo':
                return <TodoListCard key={`step-${i}`} items={step.items ?? []} />
              case 'typing':
                return <TypingIndicator key={`step-${i}`} />
              case 'footer':
                return null
              default:
                return null
            }
          })}

          {/* Show typing indicator when between typing step and next */}
          <AnimatePresence>
            {isTyping && <TypingIndicator key="typing-active" />}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      {visibleSteps.some(s => s.type === 'footer') && (
        <footer className="shrink-0 bg-white border-t border-gray-100/80">
          <div className="flex items-center justify-center gap-3 px-5 py-3.5">
            <div className="h-4 w-4 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
            <span className="text-[13px] font-medium text-gray-500">{t('improvingWebsite')}</span>
          </div>
        </footer>
      )}
    </div>
  )
}
