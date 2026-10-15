'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Calendar as CalendarIcon,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react'
import { networkTranslations } from '@/data/networkTranslations'

export default function ScheduleView() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const t = networkTranslations[locale] || networkTranslations.en

  const calendarId = 'asiaamen2025@gmail.com'
  const calendarEmbedUrl = 'https://calendar.google.com/calendar/embed?src=asiaamen2025%40gmail.com&ctz=Asia%2FSeoul'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* 상단 네비게이션 */}
          <div className="flex items-center justify-between">
            <Link
              href={`/${locale}/network`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>{t.schedulePage.backToNetwork}</span>
            </Link>

            <a
              href={calendarEmbedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-emerald-700 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs hover:border-emerald-300 transition-all"
            >
              <ExternalLink size={14} />
              <span>{isKo ? '새 창에서 캘린더 보기' : 'Open in New Window'}</span>
            </a>
          </div>

          {/* 헤더 배너 */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-md">
            <div>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
                {t.schedulePage.badge || 'Official Calendar'}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 tracking-tight">
                {t.schedulePage.title}
              </h1>
              <p className="text-white/85 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {isKo
                  ? '13개국 메노나이트 평화 연합 총회, 온라인 다국어 기도회 및 주요 사역 일정을 공식 구글 캘린더로 확인하세요.'
                  : t.schedulePage.desc}
              </p>
            </div>
          </div>

          {/* 캘린더 카드 컨테이너 */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CalendarIcon size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-gray-900">
                    {t.schedulePage.googleCalendarTitle || 'AAMEN Official Calendar'}
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">
                    {calendarId}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Sync</span>
              </span>
            </div>

            {/* 구글 캘린더 iframe 임베드 */}
            <div className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] min-h-[600px] sm:min-h-[700px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
              <iframe
                src={calendarEmbedUrl}
                style={{ border: 0 }}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                title="AAMEN Official Monthly Calendar"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
