import type { GoogleBusinessProfile } from '../../types/report'
import gbpIcon from '../../assets/icons/gbp.svg'
import starIcon from '../../assets/icons/star.svg'

interface GoogleProfileCardProps {
  profile: GoogleBusinessProfile
}

export function GoogleProfileCard({ profile }: GoogleProfileCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <img src={gbpIcon} alt="Google Business Profile" className="w-10 h-10 shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{profile.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm text-gray-700">{profile.rating}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src={starIcon}
                  alt=""
                  className="w-3 h-3"
                  style={{ opacity: i < Math.round(profile.rating) ? 1 : 0.3 }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({profile.reviewCount.toLocaleString()} reviews)
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2">{profile.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {profile.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5 text-gray-600"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
