import type { CaseStudy } from '../../types/report'
import { CTAButton } from '../shared/CTAButton'
import { WebsiteCarousel } from './WebsiteCarousel'
import feastBuffetImg from '../../assets/images/feast-buffet.jpg'

interface AIWebsiteSectionProps {
  caseStudies: CaseStudy[]
  ctaText: string
}

export function AIWebsiteSection({ caseStudies, ctaText }: AIWebsiteSectionProps) {
  return (
    <div className="relative rounded-lg overflow-hidden">
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
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Improve your website with AI in 35 seconds
          </h2>
          <p className="text-sm text-white/70 mt-2">
            See how other restaurants improved their online health score
          </p>
        </div>

        <WebsiteCarousel caseStudies={caseStudies} />

        <div className="flex justify-center mt-6">
          <CTAButton text={ctaText} className="bg-white !text-black hover:bg-gray-100" />
        </div>
      </div>
    </div>
  )
}
