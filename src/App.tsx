import { useEffect, useState, lazy, Suspense, useCallback } from 'react'
import type { HealthReport } from './types/report'
import { parseBuilderParams, buildReport, slugify } from './lib/report-builder'

const staticReports: Record<string, () => Promise<{ default: unknown }>> = {
  'feast-buffet': () => import('./data/feast-buffet.json'),
  'istanbul-kasap-market': () => import('./data/istanbul-kasap-market.json'),
  'oqg-burger-tacos': () => import('./data/oqg-burger-tacos.json'),
  'okapi-neuchatel': () => import('./data/00001-okapi-neuchatel.json'),
}
import { ReportLayout } from './components/layout/ReportLayout'
import { Sidebar } from './components/layout/Sidebar'
import { MainContent } from './components/layout/MainContent'
import { HeroCards } from './components/hero/HeroCards'
import { SearchResultsSection } from './components/search-results/SearchResultsSection'
import { WebsiteExperienceSection } from './components/website-experience/WebsiteExperienceSection'
import { LocalListingsSection } from './components/local-listings/LocalListingsSection'
import { AIWebsiteSection } from './components/ai-website/AIWebsiteSection'
import { LanguageToggle } from './components/shared/LanguageToggle'
import { SkeletonReport } from './components/shared/SkeletonReport'
import { SkeletonImprove } from './components/shared/SkeletonImprove'
import { SkeletonStart } from './components/shared/SkeletonStart'

const ImprovePageLazy = lazy(() => import('./components/improve/ImprovePage'))
const StartPageLazy = lazy(() => import('./components/start/StartPage'))
const preloadImprove = () => import('./components/improve/ImprovePage')
const preloadStart = () => import('./components/start/StartPage')

function parseRoute() {
  const { pathname, search } = window.location

  if (pathname === '/builder' || pathname === '/builder/') {
    const params = parseBuilderParams(search)
    if (params) {
      const generated = buildReport(params)
      const slug = slugify(params.name + '-' + (params.city ?? ''))
      sessionStorage.setItem(`report:${slug}`, JSON.stringify(generated))
      return { route: 'report' as const, slug, generatedReport: generated }
    }
  }

  const match = pathname.match(/^\/(report|improve|start)\/(.+)$/)
  const route = (match?.[1] ?? 'report') as 'report' | 'improve' | 'start'
  const slug = match?.[2] ?? 'feast-buffet'

  const cached = sessionStorage.getItem(`report:${slug}`)
  const generatedReport = cached ? (JSON.parse(cached) as HealthReport) : null

  return { route, slug, generatedReport }
}

export default function App() {
  const { route, slug, generatedReport } = parseRoute()

  // If data is already available (generated or cached), skip loading entirely
  const hasInstantData = !!generatedReport
  const [report, setReport] = useState<HealthReport | null>(
    hasInstantData ? generatedReport : null
  )
  const [phase, setPhase] = useState<'loading' | 'finishing' | 'done'>(
    hasInstantData ? 'done' : 'loading'
  )

  const onSkeletonComplete = useCallback(() => {
    setPhase('done')
  }, [])

  useEffect(() => {
    // Data already loaded synchronously — nothing to fetch
    if (hasInstantData) return

    const loadData = async () => {
      let data: HealthReport | null = null

      try {
        const r = await fetch(`/api/reports/${slug}`)
        if (!r.ok) throw new Error('API unavailable')
        data = await r.json()
      } catch {
        const loader = staticReports[slug]
        if (loader) {
          const mod = await loader()
          data = mod.default as unknown as HealthReport
        }
      }

      if (data) setReport(data)
      setPhase(route === 'report' ? 'finishing' : 'done')
    }

    loadData()
  }, [slug, hasInstantData])

  useEffect(() => {
    if (phase === 'done' && route === 'report' && report) {
      const timer = setTimeout(() => {
        preloadImprove()
        preloadStart()
      }, 2000)
      return () => clearTimeout(timer)
    }
    if (phase === 'done' && route === 'improve' && report) {
      preloadStart()
    }
  }, [phase, route, report])

  if (phase !== 'done') {
    // Show the right skeleton depending on the route
    if (route === 'improve') return <SkeletonImprove />
    if (route === 'start') return <SkeletonStart />
    return (
      <SkeletonReport
        dataReady={phase === 'finishing'}
        onComplete={onSkeletonComplete}
      />
    )
  }

  if (!report) return null

  if (route === 'improve') {
    return (
      <Suspense fallback={<SkeletonImprove />}>
        <ImprovePageLazy report={report} slug={slug} />
      </Suspense>
    )
  }

  if (route === 'start') {
    return (
      <Suspense fallback={<SkeletonStart />}>
        <StartPageLazy report={report} slug={slug} />
      </Suspense>
    )
  }

  const searchResults = report.sections.find((s) => s.id === 'search-results')
  const websiteExperience = report.sections.find((s) => s.id === 'website-experience')
  const localListings = report.sections.find((s) => s.id === 'local-listings')

  return (
    <ReportLayout>
      <LanguageToggle />
      <Sidebar report={report} slug={slug} />
      <MainContent>
        <div className="space-y-4 px-4 pb-24 pt-4 lg:px-0 lg:pb-4 lg:pt-0">
          <HeroCards report={report} />

          {searchResults && (
            <SearchResultsSection
              section={searchResults}
              keywordCards={report.keywordCards}
              auditSummary={report.auditSummary}
            />
          )}

          {websiteExperience && (
            <WebsiteExperienceSection section={websiteExperience} />
          )}

          {localListings && (
            <LocalListingsSection
              section={localListings}
              googleProfile={report.googleProfile}
            />
          )}

          <AIWebsiteSection ctaBanner={report.ctaBanner} slug={slug} />
        </div>
      </MainContent>
    </ReportLayout>
  )
}
