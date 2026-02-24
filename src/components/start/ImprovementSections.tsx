import { motion } from 'motion/react'
import { Search, Users, Building2 } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import type { HealthReport } from '../../types/report'

interface ImprovementSectionsProps {
  report: HealthReport
}

export function ImprovementSections({ report }: ImprovementSectionsProps) {
  const { t } = useI18n()

  // Derive improvements from fail items grouped by section
  const sectionMap: Record<string, string[]> = {
    'search-results': [],
    'website-experience': [],
    'local-listings': [],
  }

  for (const section of report.sections) {
    const key = section.id
    if (key in sectionMap) {
      for (const cat of section.categories) {
        for (const item of cat.items) {
          if (item.status === 'fail' && sectionMap[key].length < 3) {
            sectionMap[key].push(item.title)
          }
        }
      }
    }
  }

  const cards = [
    {
      icon: Search,
      title: t('googleRanking'),
      items: sectionMap['search-results'],
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Users,
      title: t('guestExperience'),
      items: sectionMap['website-experience'],
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Building2,
      title: t('googleBizProfile'),
      items: sectionMap['local-listings'],
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">{t('howAiImproved')}</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${card.bg} mb-3`}>
              <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">{card.title}</h4>
            {card.items.length > 0 ? (
              <ul className="space-y-1.5">
                {card.items.map((item, j) => (
                  <li key={j} className="text-xs text-gray-500 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">All checks passed</p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
