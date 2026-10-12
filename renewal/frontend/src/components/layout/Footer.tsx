import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const locale = useLocale()

  const getLocalizedPath = (path: string) => {
    const loc = locale || 'ko'
    return `/${loc}${path.startsWith('/') ? path : `/${path}`}`
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* 로고 + 설명 */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-xs">
              <Image
                src="/logo.png"
                alt="AAMEN"
                width={120}
                height={39}
                className="h-7 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Asia Anabaptist Mennonite Education Network<br />
              아시아 아나밥티스트 메노나이트 교육 네트워크
            </p>
          </div>

          {/* 메뉴 링크 */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <Link href={getLocalizedPath('/convictions')} className="text-gray-400 hover:text-emerald-400 transition-colors">
              {nav('convictions')}
            </Link>
            <Link href={getLocalizedPath('/network')} className="text-gray-400 hover:text-emerald-400 transition-colors">
              {nav('network')}
            </Link>
            <Link href={getLocalizedPath('/resources')} className="text-gray-400 hover:text-emerald-400 transition-colors">
              {nav('resources')}
            </Link>
            <Link href={getLocalizedPath('/community')} className="text-gray-400 hover:text-emerald-400 transition-colors">
              {nav('community')}
            </Link>
            <Link href={getLocalizedPath('/history')} className="text-gray-400 hover:text-emerald-400 transition-colors">
              {nav('history')}
            </Link>
            <Link href={getLocalizedPath('/women-peace')} className="text-gray-400 hover:text-emerald-400 transition-colors">
              {nav('women_peace')}
            </Link>
          </div>
        </div>

        {/* 하단 바 */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <span>{t('rights')}</span>
          <div className="flex gap-4">
            <Link href={getLocalizedPath('/terms')} className="hover:text-gray-300 transition-colors">
              {t('terms')}
            </Link>
            <Link href={getLocalizedPath('/privacy')} className="hover:text-gray-300 transition-colors">
              {t('privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
