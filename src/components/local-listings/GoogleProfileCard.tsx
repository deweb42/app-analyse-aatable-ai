import type { GoogleBusinessProfile } from '../../types/report'
import gbpIcon from '../../assets/icons/gbp.svg'
import starIcon from '../../assets/icons/star.svg'

interface GoogleProfileCardProps {
  profile: GoogleBusinessProfile
}

export function GoogleProfileCard({ profile }: GoogleProfileCardProps) {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
          <img src={gbpIcon} alt="Google Business Profile" className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{profile.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm font-semibold text-gray-800">{profile.rating}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src={starIcon}
                  alt=""
                  className="w-3.5 h-3.5"
                  style={{ opacity: i < Math.round(profile.rating) ? 1 : 0.2 }}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400 font-medium">
              ({profile.reviewCount.toLocaleString()})
            </span>
          </div>
          <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">{profile.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {profile.categories.map((cat) => (
              <span
                key={cat}
                className="text-[11px] bg-white border border-gray-200 rounded-full px-2.5 py-1 text-gray-500 font-medium"
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
