import { useI18n } from '../../lib/i18n'

export function LanguageToggle() {
  const { locale, setLocale } = useI18n()

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
      className="fixed top-3 right-3 z-50 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-sm px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
      title={locale === 'en' ? 'Passer en français' : 'Switch to English'}
    >
      <span className={locale === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
      <span className="text-gray-300">|</span>
      <span className={locale === 'fr' ? 'opacity-100' : 'opacity-40'}>FR</span>
    </button>
  )
}
