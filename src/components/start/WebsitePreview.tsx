import { motion } from 'motion/react'
import { useI18n } from '../../lib/i18n'

interface WebsitePreviewProps {
  restaurantName: string
  cuisineTypes: string[]
}

export function WebsitePreview({ restaurantName, cuisineTypes }: WebsitePreviewProps) {
  const { t } = useI18n()

  const menuItems = cuisineTypes.length > 0 ? cuisineTypes.slice(0, 4) : ['Specialty 1', 'Specialty 2', 'Specialty 3']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{t('yourNewWebsite')}</h3>
      </div>
      <div className="p-5">
        {/* Mock website preview */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          {/* Header bar */}
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-bold">{restaurantName}</span>
            <div className="flex gap-3">
              <div className="w-8 h-1 bg-white/30 rounded" />
              <div className="w-8 h-1 bg-white/30 rounded" />
              <div className="w-8 h-1 bg-white/30 rounded" />
            </div>
          </div>
          {/* Hero */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-6 text-center">
            <p className="text-lg font-bold text-gray-900">{restaurantName}</p>
            <p className="text-xs text-gray-500 mt-1">{t('savorEveryBite')}</p>
            <div className="mt-3 inline-flex bg-gray-900 text-white text-xs font-semibold rounded-lg px-4 py-2">
              {t('orderNow')}
            </div>
          </div>
          {/* Menu cards */}
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 mb-3">{t('menuItems')}</p>
            <div className="grid grid-cols-2 gap-2">
              {menuItems.map((item, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="w-full h-10 bg-gradient-to-br from-gray-100 to-gray-50 rounded mb-2" />
                  <p className="text-xs font-medium text-gray-700 truncate">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
