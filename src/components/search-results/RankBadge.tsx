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
        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${
          isUnranked
            ? 'bg-red-100 text-red-600'
            : 'bg-emerald-100 text-emerald-700'
        }`}
      >
        {isUnranked ? `${label || 'Unranked'}` : `#${rank}`}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
        isUnranked
          ? 'bg-red-100 text-red-600'
          : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      {label && <span className="mr-1 opacity-60">{label}</span>}
      {isUnranked ? 'Unranked' : `#${rank}`}
    </span>
  )
}
