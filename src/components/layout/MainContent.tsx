import type { ReactNode } from 'react'

interface MainContentProps {
  children: ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="relative min-h-full w-full grow-[999] basis-0 lg:mx-auto lg:max-w-[1080px] lg:min-w-0 lg:py-2 lg:pr-2">
      {children}
    </main>
  )
}
