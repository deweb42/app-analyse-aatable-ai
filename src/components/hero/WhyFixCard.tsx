import type { CaseStudy } from '../../types/report'

interface WhyFixCardProps {
  caseStudy: CaseStudy
}

export function WhyFixCard({ caseStudy }: WhyFixCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden h-full min-h-[200px]">
      <img
        src={new URL(`../../assets/images/${caseStudy.desktopImage}`, import.meta.url).href}
        alt={caseStudy.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-white">Why fix these?</h3>
        <p className="text-sm text-white/90 leading-relaxed mt-auto">
          {caseStudy.name} had a health score of {caseStudy.initialScore}. They{' '}
          {caseStudy.result.toLowerCase()} by increasing their score to {caseStudy.finalScore}.
        </p>
      </div>
    </div>
  )
}
