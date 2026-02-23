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
      className={`inline-flex items-center gap-2 rounded-md bg-black text-white px-3 py-2 text-sm font-medium hover:bg-gray-800 transition-colors ${className}`}
    >
      <Sparkles className="w-4 h-4" />
      {text}
    </button>
  )
}
