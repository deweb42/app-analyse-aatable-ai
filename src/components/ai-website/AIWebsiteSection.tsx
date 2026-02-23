import type { CTABanner } from '../../types/report'
import { ArrowRight, Sparkles } from 'lucide-react'
import feastBuffetImg from '../../assets/images/feast-buffet.jpg'

interface AIWebsiteSectionProps {
  ctaBanner: CTABanner
}

export function AIWebsiteSection({ ctaBanner }: AIWebsiteSectionProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-sm">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={feastBuffetImg}
          alt=""
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">{ctaBanner.label}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-snug tracking-tight">
            {ctaBanner.title}
          </h2>

          <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white text-gray-900 px-5 py-3 text-sm font-semibold hover:bg-gray-100 active:scale-[0.98] transition-all duration-150 shadow-lg">
            {ctaBanner.buttonText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Preview card */}
        <div className="hidden md:block">
          <div className="bg-white rounded-xl shadow-2xl p-4 w-44 transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-2xl">🍜</span>
            </div>
            <p className="text-xs font-bold text-gray-900">Savor every bite</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Fresh & authentic</p>
            <div className="mt-3 bg-gray-900 text-white text-[10px] font-semibold rounded-lg px-3 py-1.5 text-center">
              Order now
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
