'use client'

import { useTranslations } from 'next-intl'
import { Smartphone, Download } from 'lucide-react'

export default function PwaBanner() {
  const t = useTranslations('home')

  const handleInstallClick = () => {
    alert('📱 스마트폰 브라우저(Safari / Chrome) 하단의 [공유] 또는 메뉴에서 [홈 화면에 추가]를 누르시면 앱으로 즉시 설치됩니다!')
  }

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4 text-left">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-white">
          <Smartphone size={30} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-extrabold text-lg sm:text-xl">
              {t('pwa_install')}
            </h3>
            <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              PWA
            </span>
          </div>
          <p className="text-white/85 text-xs sm:text-sm max-w-md leading-relaxed">
            {t('pwa_install_desc')}
          </p>
        </div>
      </div>
      <button
        onClick={handleInstallClick}
        className="px-6 py-3 bg-white text-emerald-800 font-extrabold text-sm rounded-full hover:bg-emerald-50 hover:shadow-lg transition-all shrink-0 flex items-center gap-2"
      >
        <Download size={16} />
        <span>앱 설치 안내</span>
      </button>
    </div>
  )
}
