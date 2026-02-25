import { motion } from 'motion/react'
import type { HealthReport } from '../../types/report'
import { LanguageToggle } from '../shared/LanguageToggle'
import { EarningHero } from './EarningHero'
import { ProfileCard } from './ProfileCard'
import { WebsitePreview } from './WebsitePreview'
import { LockedSection, MockReportContent, MockMarketingContent } from './LockedSection'
import { StartCTASection } from './StartCTASection'
import { useI18n } from '../../lib/i18n'
import { Sparkles, CheckCircle2, Globe, FileText, BarChart3, Gift, ArrowRight } from 'lucide-react'
import { RadialProgress } from '../shared/RadialProgress'

interface StartPageProps {
  report: HealthReport
  slug: string
}

export default function StartPage({ report }: StartPageProps) {
  const { t } = useI18n()
  const currentScore = report.overallScore.score
  const projectedScore = Math.min(100, currentScore + 35)
  const estimatedEarnings = report.revenueLoss.amount * 2

  return (
    <div className="font-suisse flex min-h-screen flex-wrap lg:gap-0 bg-[#f5f5f7]">

      {/* ─── Desktop sidebar (sticky ProfileCard) ─── */}
      <aside className="hidden lg:block h-full w-full lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:min-w-[280px] lg:max-w-[280px] lg:p-2 lg:pr-0">
        <ProfileCard
          name={report.restaurant.name}
          city={`${report.restaurant.city}, ${report.restaurant.state}`}
          website={report.restaurant.website}
          imageUrl={report.restaurant.imageUrl}
          currentScore={currentScore}
          projectedScore={projectedScore}
          maxScore={report.overallScore.maxScore}
          scoreColor={report.overallScore.strokeColor}
          rating={report.googleProfile?.rating}
          reviewCount={report.googleProfile?.reviewCount}
        />
      </aside>

      {/* ─── Main content ─── */}
      <main className="flex-1 min-w-0 lg:max-w-[960px]">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 bg-white/90 backdrop-blur-xl border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 tracking-tight">aatable.ai</span>
          </div>
          <LanguageToggle />
        </header>

        {/* Success badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex justify-center pt-5 px-4"
        >
          <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200/50 rounded-full px-3 py-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            <span className="text-[11px] font-semibold text-green-700 uppercase tracking-widest">
              {report.restaurant.name}
            </span>
          </div>
        </motion.div>

        <div className="px-4 pb-20 space-y-4">
          {/* Earning hero */}
          <EarningHero amount={estimatedEarnings} />

          {/* ─── Mobile-only: inline profile summary ─── */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden rounded-2xl border border-[#EDBEAF] bg-gradient-to-b from-[#FDF4F1] via-[#F9E5E1] to-[#F2C4BA] p-5 overflow-hidden"
          >
            <div className="relative">
              {/* Dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              {/* Restaurant row */}
              <div className="relative flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-white ring-2 ring-white/80 shadow-sm shrink-0">
                  {report.restaurant.imageUrl ? (
                    <img src={report.restaurant.imageUrl} alt={report.restaurant.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-400">{report.restaurant.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-semibold text-gray-900 tracking-tight truncate">{report.restaurant.name}</h3>
                  <p className="text-[11px] text-gray-500 truncate">{report.restaurant.city}, {report.restaurant.state}</p>
                </div>
              </div>
              {/* Score row */}
              <div className="relative flex items-center justify-center gap-5">
                <div className="flex flex-col items-center">
                  <RadialProgress size="sm" score={currentScore} maxScore={report.overallScore.maxScore} strokeColor={report.overallScore.strokeColor} />
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-lg font-bold text-gray-900 tabular-nums">{currentScore}</span>
                    <span className="text-[10px] text-gray-400">/ {report.overallScore.maxScore}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{t('currentScore')}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                <div className="flex flex-col items-center">
                  <RadialProgress size="sm" score={projectedScore} maxScore={report.overallScore.maxScore} strokeColor="#57AA30" />
                  <div className="flex items-baseline gap-1 mt-1.5">
                    <span className="text-lg font-bold text-green-700 tabular-nums">{projectedScore}</span>
                    <span className="text-[10px] text-gray-400">/ {report.overallScore.maxScore}</span>
                  </div>
                  <span className="text-[10px] text-green-600 uppercase tracking-wider font-medium">{t('goalIn30Days')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Value banner */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="rounded-2xl bg-white border border-gray-200/60 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3.5 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/50 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 tracking-tight">{t('valueOffered')}</p>
                  <p className="text-[11px] text-gray-400 leading-snug">{t('valueOfferedSub')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3 locked sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <LockedSection titleKey="lockedWebsite" descriptionKey="lockedWebsiteDesc" icon={Globe} delay={0.12}>
              <WebsitePreview
                restaurantName={report.restaurant.name}
                cuisineTypes={report.businessInfo?.cuisineTypes ?? []}
              />
            </LockedSection>

            <LockedSection titleKey="lockedReport" descriptionKey="lockedReportDesc" icon={FileText} delay={0.18}>
              <MockReportContent />
            </LockedSection>

            <LockedSection titleKey="lockedMarketing" descriptionKey="lockedMarketingDesc" icon={BarChart3} delay={0.24}>
              <MockMarketingContent />
            </LockedSection>
          </div>

          {/* CTA + Secret gift */}
          <StartCTASection />
        </div>
      </main>

      {/* ─── Mobile bottom bar (fixed) ─── */}
      <div className="fixed right-0 bottom-0 left-0 z-100 m-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10 border border-gray-200/50 p-3.5 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RadialProgress
              size="sm"
              score={projectedScore}
              maxScore={report.overallScore.maxScore}
              strokeColor="#57AA30"
            />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900 tabular-nums">{projectedScore}</span>
                <span className="text-xs text-gray-400">/ {report.overallScore.maxScore}</span>
              </div>
              <span className="text-xs font-semibold text-green-600">{t('goalIn30Days')}</span>
            </div>
          </div>
          <button
            onClick={() => window.open('https://cal.com/PLACEHOLDER', '_blank')}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black active:scale-[0.98] transition-all duration-150 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t('getItNow')}
          </button>
        </div>
      </div>
    </div>
  )
}
