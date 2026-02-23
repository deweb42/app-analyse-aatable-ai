import type { ReactNode } from 'react'

interface MainContentProps {
  children: ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="relative min-h-full w-full grow-[999] basis-0 lg:mx-auto lg:max-w-[960px] lg:min-w-0 lg:py-3 lg:px-4">
      {children}
    </main>
  )
}
