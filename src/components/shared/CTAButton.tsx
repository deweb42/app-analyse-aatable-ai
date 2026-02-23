import { Sparkles } from 'lucide-react'

interface CTAButtonProps {
  text: string
  onClick?: () => void
  className?: string
}

export function CTAButton({ text, onClick, className = '' }: CTAButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black active:scale-[0.98] transition-all duration-150 shadow-sm ${className}`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      {text}
    </button>
  )
}
