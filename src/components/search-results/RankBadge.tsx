interface RankBadgeProps {
  rank: number | null
  label?: string
  compact?: boolean
}

export function RankBadge({ rank, label, compact = false }: RankBadgeProps) {
  const isUnranked = rank === null

  if (compact) {
    return (
      <span
        className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium ${
          isUnranked
            ? 'bg-[#FFB4B4] text-gray-800'
            : 'bg-green-100 text-green-800'
        }`}
      >
        {isUnranked ? (label || 'Unranked') : `#${rank}`}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium ${
        isUnranked
          ? 'bg-[#FFB4B4] text-gray-800'
          : 'bg-green-100 text-green-800'
      }`}
    >
      {label && <span className="mr-1 text-gray-500">{label}</span>}
      {isUnranked ? 'Unranked' : `#${rank}`}
    </span>
  )
}
