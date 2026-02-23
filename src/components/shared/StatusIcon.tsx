import { Check, X, Clock } from 'lucide-react'

interface StatusIconProps {
  status: 'pass' | 'fail' | 'warning'
  className?: string
}

export function StatusIcon({ status, className = '' }: StatusIconProps) {
  switch (status) {
    case 'pass':
      return (
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 ${className}`}>
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )
    case 'fail':
      return (
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 ${className}`}>
          <X className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )
    case 'warning':
      return (
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-400 ${className}`}>
          <Clock className="w-3 h-3 text-gray-900" strokeWidth={3} />
        </span>
      )
  }
}
