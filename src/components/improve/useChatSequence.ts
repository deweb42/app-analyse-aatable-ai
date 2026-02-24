import { useEffect, useState, useMemo, useCallback } from 'react'
import type { HealthReport } from '../../types/report'
import { useI18n } from '../../lib/i18n'

export type StepType =
  | 'user-msg'
  | 'bot-msg'
  | 'bot-msg-animated'
  | 'card-screenshot'
  | 'shimmer'
  | 'card-todo'
  | 'typing'
  | 'footer'

export interface ChatStep {
  type: StepType
  content: string
  delay: number
  items?: string[]
}

export function useChatSequence(report: HealthReport, slug: string) {
  const { t } = useI18n()
  const [visibleCount, setVisibleCount] = useState(0)
  const [done, setDone] = useState(false)

  const failItems = useMemo(() => {
    const items: string[] = []
    for (const section of report.sections) {
      for (const cat of section.categories) {
        for (const item of cat.items) {
          if (item.status === 'fail' && items.length < 8) {
            items.push(item.title)
          }
        }
      }
    }
    return items
  }, [report])

  const reviewSummary = useMemo(() => {
    const gp = report.googleProfile
    return `${gp.description} (${gp.rating}/5, ${gp.reviewCount} reviews)`
  }, [report])

  const praiseWords = useMemo(() => {
    const words: string[] = [
      ...(report.businessInfo?.cuisineTypes ?? []),
      ...report.googleProfile.categories,
    ]
    return words.join(', ')
  }, [report])

  // Sequence: user msg → typing → bot reply → shimmer → card → etc.
  // Typing indicators appear before every bot message/card for realism
  const steps: ChatStep[] = useMemo(() => [
    { type: 'user-msg', content: t('improveToSales', { website: report.restaurant.website }), delay: 600 },
    { type: 'typing', content: '', delay: 1200 },
    { type: 'bot-msg', content: t('scanMobileMessage'), delay: 800 },
    { type: 'card-screenshot', content: report.restaurant.website, delay: 2000 },
    { type: 'shimmer', content: t('craftingPalette'), delay: 1800 },
    { type: 'shimmer', content: t('buildingTodo'), delay: 2000 },
    { type: 'typing', content: '', delay: 900 },
    { type: 'card-todo', content: '', delay: 800, items: failItems },
    { type: 'shimmer', content: t('upscalingPhotos'), delay: 1800 },
    { type: 'shimmer', content: t('summarizingReviews'), delay: 1500 },
    { type: 'typing', content: '', delay: 1000 },
    { type: 'bot-msg-animated', content: reviewSummary, delay: 800 },
    { type: 'shimmer', content: t('findingPraise'), delay: 1500 },
    { type: 'typing', content: '', delay: 800 },
    { type: 'bot-msg-animated', content: praiseWords, delay: 800 },
    { type: 'shimmer', content: t('writingContent'), delay: 2500 },
    { type: 'footer', content: t('improvingWebsite'), delay: 3000 },
  ], [t, report, failItems, reviewSummary, praiseWords])

  const advance = useCallback(() => {
    setVisibleCount(c => c + 1)
  }, [])

  useEffect(() => {
    if (visibleCount >= steps.length) {
      const timer = setTimeout(() => setDone(true), steps[steps.length - 1].delay)
      return () => clearTimeout(timer)
    }

    const delay = visibleCount === 0 ? steps[0].delay : steps[visibleCount].delay
    const timer = setTimeout(advance, delay)
    return () => clearTimeout(timer)
  }, [visibleCount, steps, advance])

  // When a typing indicator is followed by the actual message, remove the typing
  // indicator from visible steps (so it disappears when the real message shows)
  const displaySteps = useMemo(() => {
    const visible = steps.slice(0, visibleCount)
    // Remove typing indicators that have been "resolved" (next step is visible)
    return visible.filter((step, i) => {
      if (step.type === 'typing' && i < visible.length - 1) return false
      return true
    })
  }, [steps, visibleCount])

  return {
    visibleSteps: displaySteps,
    isTyping: visibleCount > 0 && visibleCount < steps.length && steps[visibleCount - 1]?.type === 'typing',
    done,
    slug,
  }
}
