import { useEffect, useState, useRef } from 'react'
import { useI18n } from '../../lib/i18n'

interface SkeletonReportProps {
  /** True when the actual data has been fetched */
  dataReady?: boolean
  /** Called after the 100% animation finishes — parent can unmount skeleton */
  onComplete?: () => void
}

/**
 * Skeleton loader with a real progress bar.
 *
 * Phase 1 — "loading":
 *   Incremental with halving steps. Starts at increment=48.5.
 *   Each tick: progress += increment, then increment /= 2.
 *   Sum of geometric series 48.5 + 24.25 + 12.125 + … = 97.
 *   Capped at 97 — mathematically impossible to exceed.
 *
 * Phase 2 — "finishing": dataReady=true → sets progress to 100,
 *   CSS transition handles the visual animation (0.4s ease-out).
 *   Shows checkmark after 400ms, calls onComplete after 1000ms.
 */
export function SkeletonReport({ dataReady = false, onComplete }: SkeletonReportProps) {
  const { t } = useI18n()
  const [progress, setProgress] = useState(0)
  const [showCheck, setShowCheck] = useState(false)
  const incrementRef = useRef(48.5) // first step = 48.5, sum → 97

  // Phase 1: each 250ms, add current increment then halve it
  useEffect(() => {
    if (dataReady) return
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + incrementRef.current
        incrementRef.current /= 2
        return Math.min(next, 97) // hard cap, never above 97
      })
    }, 250)
    return () => clearInterval(interval)
  }, [dataReady])

  // Phase 2: data ready → jump to 100 (CSS transition animates the bar)
  useEffect(() => {
    if (!dataReady) return
    setProgress(100)
    const checkTimer = setTimeout(() => setShowCheck(true), 300)
    const completeTimer = setTimeout(() => onComplete?.(), 600)
    return () => {
      clearTimeout(checkTimer)
      clearTimeout(completeTimer)
    }
  }, [dataReady, onComplete])

  return (
    <div className="font-suisse flex min-h-screen flex-wrap lg:gap-0 bg-[#f5f5f7] animate-[fade-in-up_0.4s_ease-out]">
      {/* Top progress bar + badge */}
      <div className="fixed top-0 left-0 right-0 z-[100]">
        <div className="h-1 bg-gray-200/40">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-400 rounded-r-full"
            style={{
              width: `${Math.floor(progress)}%`,
              transition: dataReady ? 'width 0.4s ease-out' : 'width 0.15s linear',
            }}
          />
        </div>
        <div className="flex justify-center mt-2.5">
          <div
            className={`inline-flex items-center gap-2.5 backdrop-blur-sm border rounded-full px-4 py-1.5 shadow-sm animate-[fade-in-up_0.3s_ease-out] transition-colors duration-300 ${
              showCheck
                ? 'bg-green-50/90 border-green-200/60'
                : 'bg-white/90 border-gray-200/60'
            }`}
          >
            {showCheck ? (
              <svg className="w-3.5 h-3.5 text-green-600" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <div
                className="w-1.5 h-1.5 rounded-full bg-violet-500"
                style={{ animation: 'pulse-ring 1.5s ease-in-out infinite' }}
              />
            )}
            <span className={`text-[11px] font-semibold tabular-nums ${showCheck ? 'text-green-700' : 'text-gray-500'}`}>
              {Math.floor(progress)}%
            </span>
            {!showCheck && (
              <span className="text-[10px] text-gray-400">{t('dataLoading')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar skeleton */}
      <aside className="hidden lg:block h-full w-full lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:min-w-[280px] lg:max-w-[280px] lg:p-2 lg:pr-0">
        <div className="relative h-full rounded-2xl border border-gray-200/60 bg-gradient-to-b from-gray-50 via-gray-100/50 to-gray-100 p-5 flex flex-col overflow-hidden">
          <div className="text-center mb-4 space-y-2">
            <SkeletonBar className="mx-auto w-32 h-4" />
            <SkeletonBar className="mx-auto w-20 h-3" />
          </div>
          <div className="flex justify-center mb-4">
            <SkeletonCircle className="w-36 h-36" />
          </div>
          <div className="text-center mb-5 space-y-2">
            <SkeletonBar className="mx-auto w-24 h-2.5" />
            <SkeletonBar className="mx-auto w-16 h-4" />
          </div>
          <div className="w-full h-px bg-gray-200/60 mb-4" />
          <div className="space-y-3 mb-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <SkeletonCircle className="w-6 h-6" />
                <div className="flex-1 space-y-1">
                  <SkeletonBar className="w-24 h-3" />
                  <SkeletonBar className="w-16 h-2.5" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <SkeletonBar className="w-full h-10 rounded-xl" />
          </div>
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="relative min-h-full w-full grow-[999] basis-0 lg:mx-auto lg:max-w-[960px] lg:min-w-0 lg:py-3 lg:px-4">
        <div className="space-y-4 px-4 pb-24 pt-4 lg:px-0 lg:pb-4 lg:pt-0">
          <div className="grid gap-3 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl bg-white border border-gray-100 p-5 space-y-3">
                <SkeletonBar className="w-3/4 h-4" />
                <SkeletonBar className="w-full h-3" />
                <SkeletonBar className="w-1/2 h-3" />
                <div className="pt-2 space-y-2">
                  <SkeletonBar className="w-full h-8 rounded-lg" />
                  <SkeletonBar className="w-full h-8 rounded-lg" />
                  <SkeletonBar className="w-2/3 h-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
          <SkeletonSection />
          <SkeletonSection />
        </div>
      </main>

      {/* Mobile bottom bar skeleton */}
      <div className="fixed right-0 bottom-0 left-0 z-100 m-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10 border border-gray-200/50 p-3.5 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SkeletonCircle className="w-8 h-8" />
            <div className="space-y-1">
              <SkeletonBar className="w-12 h-4" />
              <SkeletonBar className="w-8 h-2.5" />
            </div>
          </div>
          <SkeletonBar className="w-28 h-9 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function SkeletonBar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${className}`}
      style={{ animation: 'skeleton-loading 1.8s ease-in-out infinite' }}
    />
  )
}

function SkeletonCircle({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${className}`}
      style={{ animation: 'skeleton-loading 1.8s ease-in-out infinite' }}
    />
  )
}

function SkeletonSection() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <SkeletonCircle className="w-7 h-7" />
          <div className="space-y-1">
            <SkeletonBar className="w-40 h-4" />
            <SkeletonBar className="w-56 h-3" />
          </div>
        </div>
        <SkeletonBar className="w-14 h-7 rounded-full" />
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3 py-1">
            <SkeletonCircle className="w-5 h-5" />
            <SkeletonBar className="flex-1 h-3.5" />
          </div>
        ))}
      </div>
    </div>
  )
}
