import type { RatingLevel } from '../types/report'

export function getCircumference(radius: number): number {
  return 2 * Math.PI * radius
}

export function getDashArray(
  score: number,
  max: number,
  circumference: number
): [number, number] {
  return [circumference * (score / max), circumference]
}

export function getRatingColor(rating: RatingLevel): string {
  switch (rating) {
    case 'Poor':
      return '#D65353'
    case 'Fair':
      return '#F89412'
    case 'Good':
      return '#57AA30'
    case 'Excellent':
      return '#57AA30'
  }
}

export function getRatingLevel(score: number, max: number): RatingLevel {
  const pct = score / max
  if (pct >= 0.8) return 'Excellent'
  if (pct >= 0.6) return 'Good'
  if (pct >= 0.4) return 'Fair'
  return 'Poor'
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
