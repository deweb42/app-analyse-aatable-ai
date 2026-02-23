import { Check, X, Clock } from 'lucide-react'

interface StatusIconProps {
  status: 'pass' | 'fail' | 'warning'
  className?: string
}

export function StatusIcon({ status, className = '' }: StatusIconProps) {
  switch (status) {
    case 'pass':
      return (
        <span className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-gray-800 shrink-0 ${className}`}>
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </span>
      )
    case 'fail':
      return (
        <span className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-red-500 shrink-0 ${className}`}>
          <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </span>
      )
    case 'warning':
      return (
        <span className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-amber-400 shrink-0 ${className}`}>
          <Clock className="w-2.5 h-2.5 text-amber-900" strokeWidth={2.5} />
        </span>
      )
  }
}
