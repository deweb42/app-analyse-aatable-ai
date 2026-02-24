import { Sparkles } from 'lucide-react'

/** Skeleton that mimics the StartPage layout (recap) */
export function SkeletonStart() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-suisse animate-[fade-in-up_0.3s_ease-out]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 bg-white/95 backdrop-blur-sm border-b border-gray-100/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <Shimmer className="w-28 h-3.5" />
        </div>
        <Shimmer className="w-16 h-7 rounded-lg" />
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-6 pt-8">
        {/* Hero earning badge */}
        <div className="flex justify-center">
          <Shimmer className="w-48 h-10 rounded-2xl" />
        </div>
        <div className="flex justify-center">
          <Shimmer className="w-72 h-4" />
        </div>

        {/* Website preview card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <Shimmer className="w-36 h-4" />
          </div>
          <div className="p-5">
            <Shimmer className="w-full h-56 rounded-xl" />
          </div>
        </div>

        {/* Score comparison */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-3">
              <Shimmer className="w-36 h-36 rounded-full" />
              <Shimmer className="w-16 h-3.5" />
            </div>
            <Shimmer className="w-6 h-6" />
            <div className="flex flex-col items-center gap-3">
              <Shimmer className="w-36 h-36 rounded-full" />
              <Shimmer className="w-16 h-3.5" />
            </div>
          </div>
        </div>

        {/* Improvement cards */}
        <div>
          <Shimmer className="w-56 h-5 mb-4" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <Shimmer className="w-9 h-9 rounded-xl" />
                <Shimmer className="w-28 h-3.5" />
                <div className="space-y-1.5">
                  <Shimmer className="w-full h-3" />
                  <Shimmer className="w-3/4 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`shrink-0 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${className}`}
      style={{ animation: 'skeleton-loading 1.8s ease-in-out infinite' }}
    />
  )
}
