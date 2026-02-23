import type { CTABanner } from '../../types/report'
import { ArrowRight } from 'lucide-react'
import feastBuffetImg from '../../assets/images/feast-buffet.jpg'

interface AIWebsiteSectionProps {
  ctaBanner: CTABanner
}

export function AIWebsiteSection({ ctaBanner }: AIWebsiteSectionProps) {
  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={feastBuffetImg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <p className="text-sm text-white/70">{ctaBanner.label}</p>
        <h2 className="text-xl md:text-2xl font-semibold text-white mt-1">
          {ctaBanner.title}
        </h2>

        <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors">
          {ctaBanner.buttonText}
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Preview card */}
        <div className="mt-6 flex justify-center">
          <div className="bg-white rounded-lg shadow-xl p-4 w-40">
            <div className="w-full h-20 bg-gray-100 rounded mb-2" />
            <p className="text-xs font-medium text-gray-900">Savor every bite</p>
            <div className="mt-2 bg-black text-white text-[10px] rounded px-2 py-1 text-center">
              Order now
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
