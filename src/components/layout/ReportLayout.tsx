import type { ReactNode } from 'react'

interface ReportLayoutProps {
  children: ReactNode
}

export function ReportLayout({ children }: ReportLayoutProps) {
  return (
    <div className="font-suisse flex min-h-screen flex-wrap lg:gap-2 bg-white">
      {children}
    </div>
  )
}
