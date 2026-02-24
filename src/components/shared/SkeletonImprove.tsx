import { Sparkles } from 'lucide-react'

/** Skeleton that mimics the ImprovePage layout (chatbot) */
export function SkeletonImprove() {
  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA] font-suisse animate-[fade-in-up_0.3s_ease-out]">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-5 py-3.5 bg-white/95 backdrop-blur-sm border-b border-gray-100/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="space-y-1">
            <Shimmer className="w-28 h-3.5" />
            <Shimmer className="w-12 h-2.5" />
          </div>
        </div>
        <Shimmer className="w-16 h-7 rounded-lg" />
      </header>

      {/* Chat body */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-5">
          {/* User message bubble (right) */}
          <div className="flex justify-end">
            <div className="flex items-end gap-2.5 flex-row-reverse">
              <Shimmer className="w-7 h-7 rounded-full" />
              <Shimmer className="w-52 h-10 rounded-2xl rounded-br-md" />
            </div>
          </div>
          {/* Bot message bubble (left) */}
          <div className="flex items-end gap-2.5">
            <Shimmer className="w-7 h-7 rounded-full" />
            <div className="space-y-1.5">
              <Shimmer className="w-64 h-4 rounded-xl" />
              <Shimmer className="w-48 h-4 rounded-xl" />
            </div>
          </div>
          {/* Card placeholder */}
          <div className="ml-9.5">
            <Shimmer className="w-[260px] h-40 rounded-2xl" />
          </div>
          {/* Shimmer line */}
          <div className="ml-9.5 flex items-center gap-2.5">
            <Shimmer className="w-2 h-2 rounded-full" />
            <Shimmer className="w-40 h-3.5" />
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
