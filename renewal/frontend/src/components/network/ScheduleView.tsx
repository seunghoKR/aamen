'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Calendar as CalendarIcon,
  ExternalLink,
  Plus,
  Share2,
  Clock,
  MapPin,
  Building,
  ArrowLeft,
  Settings2,
  CheckCircle2,
  Globe,
  Sparkles,
  Filter,
} from 'lucide-react'
import {
  initialAamenEvents,
  generateGoogleCalendarUrl,
  type AamenEventItem,
} from '@/data/scheduleData'
import { networkTranslations } from '@/data/networkTranslations'

export default function ScheduleView() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const t = networkTranslations[locale] || networkTranslations.en

  // 뷰 모드: 'calendar' (구글 캘린더 임베드) vs 'list' (월별 리스트)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [selectedMonth, setSelectedMonth] = useState<number>(0) // 0: 전체, 1~12: 월별

  // 구글 캘린더 ID (로컬스토리지 연동 가능)
  const defaultCalId = 'ko.south_korea#holiday@group.v.calendar.google.com' // 기본 공용 캘린더 및 AAMEN 캘린더
  const [googleCalendarId, setGoogleCalendarId] = useState<string>(defaultCalId)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [customCalInput, setCustomCalInput] = useState('')

  useEffect(() => {
    try {
      const savedCalId = localStorage.getItem('aamen_google_calendar_id')
      if (savedCalId) {
        setGoogleCalendarId(savedCalId)
        setCustomCalInput(savedCalId)
      } else {
        setCustomCalInput(defaultCalId)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleSaveCalendarId = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customCalInput.trim() || defaultCalId
    setGoogleCalendarId(trimmed)
    localStorage.setItem('aamen_google_calendar_id', trimmed)
    setIsConfigOpen(false)
    alert(isKo ? '구글 캘린더 ID가 저장되었습니다!' : 'Google Calendar ID has been updated!')
  }

  // 월별 필터링
  const filteredEvents = selectedMonth === 0
    ? initialAamenEvents
    : initialAamenEvents.filter((evt) => evt.month === selectedMonth)

  // WhatsApp 일정 공유
  const handleShareEvent = (evt: AamenEventItem) => {
    const title = isKo ? evt.titleKo : evt.titleEn
    const loc = isKo ? evt.locationKo : evt.locationEn
    const date = evt.endDate ? `${evt.startDate} ~ ${evt.endDate}` : evt.startDate
    const msg = `📅 *[AAMEN 주요 일정 안내]*\n✨ *${title}*\n🗓️ 일시: ${date} (${evt.timeStr})\n📍 장소: ${loc}\n👥 주관: ${evt.organizer}\n\n👉 캘린더 확인: https://aamen.net/${locale}/network/schedule`

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // 구글 캘린더 임베드 URL (월간 기준 mode=MONTH)
  const embedUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
    googleCalendarId
  )}&ctz=Asia%2FSeoul&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0`

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 상단 네비게이션 & 브레드크럼 */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Link
              href={`/${locale}/network`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-700 bg-white px-3.5 py-2 rounded-xl border border-gray-200 transition-all shadow-2xs"
            >
              <ArrowLeft size={14} />
              <span>{t.schedulePage.backToNetwork}</span>
            </Link>

            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-blue-700 bg-white px-3.5 py-2 rounded-xl border border-gray-200 transition-all shadow-2xs cursor-pointer"
            >
              <Settings2 size={14} />
              <span>{isKo ? '구글 캘린더 ID 설정' : 'Google Calendar Settings'}</span>
            </button>
          </div>

          {/* 구글 캘린더 ID 설정 모달/박스 (관리자용) */}
          {isConfigOpen && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-xs animate-in fade-in">
              <h4 className="text-xs font-extrabold text-blue-950 mb-1 flex items-center gap-1.5">
                <Settings2 size={14} />
                <span>{isKo ? '연동할 Google 캘린더 ID 설정 (공개 캘린더)' : 'Set Public Google Calendar ID'}</span>
              </h4>
              <p className="text-[11px] text-blue-700 mb-3">
                {isKo
                  ? 'AAMEN 본부 공식 구글 캘린더의 계정 ID 또는 공개 캘린더 ID를 입력하면 아래 월간 뷰에 실시간으로 표시됩니다.'
                  : 'Enter public Google Calendar ID to sync and display monthly events in real-time.'}
              </p>
              <form onSubmit={handleSaveCalendarId} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customCalInput}
                  onChange={(e) => setCustomCalInput(e.target.value)}
                  placeholder="example@group.calendar.google.com"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  {isKo ? '설정 저장' : 'Save'}
                </button>
              </form>
            </div>
          )}

          {/* 헤더 배너 (13개국 각 국가 고유 언어 표기) */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-md">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
              {t.schedulePage.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
              {t.schedulePage.title}
            </h1>
            <p className="text-white/85 text-sm sm:text-base max-w-2xl leading-relaxed">
              {t.schedulePage.desc}
            </p>

            {/* 뷰 스위처 (구글 캘린더 월간 뷰 vs 월별 일정 리스트) */}
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/15">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'calendar'
                    ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <CalendarIcon size={14} />
                <span>{isKo ? '📅 구글 캘린더 (월간 보기)' : '📅 Google Calendar (Monthly)'}</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Filter size={14} />
                <span>{isKo ? '📋 월별 사역 일정 목록' : '📋 Monthly Event List'}</span>
              </button>

              <a
                href={`https://calendar.google.com/calendar/u/0/r`}
                target="_blank"
                rel="noreferrer"
                className="ml-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 backdrop-blur-xs"
              >
                <span>{t.schedulePage.openGoogleCalendarBtn}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* 1. 구글 캘린더 (월간 일정 기준 임베드 뷰) */}
          {viewMode === 'calendar' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-xs">
                    📅
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-gray-900 flex items-center gap-2">
                      <span>{t.schedulePage.googleCalendarTitle}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                        Monthly View
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t.schedulePage.googleCalendarSubtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://calendar.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Google Calendar</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* 반응형 Google 캘린더 iframe 임베드 */}
              <div className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] min-h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
                <iframe
                  src={embedUrl}
                  style={{ border: 0 }}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  title="AAMEN Google Calendar Monthly View"
                  className="w-full h-full"
                />
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span>
                    {isKo
                      ? '일정을 클릭하면 구글 캘린더 세부 정보가 열리며, 본인의 구글 계정으로 즉시 복사 및 알림 등록이 가능합니다.'
                      : 'Click any event to view details and copy it directly to your personal Google Calendar.'}
                  </span>
                </div>
                <button
                  onClick={() => setViewMode('list')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 shrink-0 cursor-pointer"
                >
                  {isKo ? '월별 일정 리스트 보기 👉' : 'View Monthly Event List 👉'}
                </button>
              </div>
            </div>
          )}

          {/* 2. 월별 주요 사역 일정 리스트 (Monthly List View) */}
          {viewMode === 'list' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
              {/* 월별 필터 칩 (전체, 1월 ~ 12월) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Filter size={13} />
                    <span>{isKo ? '월 선택 필터' : 'Filter by Month'}</span>
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    {filteredEvents.length} {isKo ? '개 일정' : 'events'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-200/80">
                  <button
                    onClick={() => setSelectedMonth(0)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedMonth === 0
                        ? 'bg-emerald-600 text-white shadow-xs font-black'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                    }`}
                  >
                    {t.schedulePage.allMonths}
                  </button>

                  {months.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMonth(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedMonth === m
                          ? 'bg-emerald-600 text-white shadow-xs font-black'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                      }`}
                    >
                      {m}
                      {t.schedulePage.monthSuffix}
                    </button>
                  ))}
                </div>
              </div>

              {/* 이벤트 카드 목록 */}
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 text-xs">
                    {t.schedulePage.emptyMonth}
                  </div>
                ) : (
                  filteredEvents.map((evt) => {
                    const title = isKo ? evt.titleKo : evt.titleEn
                    const desc = isKo ? evt.descKo : evt.descEn
                    const loc = isKo ? evt.locationKo : evt.locationEn
                    const gcalUrl = generateGoogleCalendarUrl(evt, isKo)
                    const dateDisplay = evt.endDate
                      ? `${evt.startDate} ~ ${evt.endDate}`
                      : evt.startDate

                    return (
                      <div
                        key={evt.id}
                        className="p-6 rounded-2xl bg-gray-50/90 border border-gray-200/90 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                      >
                        <div className="space-y-2 flex-1">
                          {/* 메타 라인 */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${evt.badgeColor}`}>
                              {evt.category}
                            </span>
                            <span className="px-2.5 py-0.5 bg-gray-200/80 text-gray-700 rounded-full font-mono font-bold text-[11px]">
                              🗓️ {dateDisplay}
                            </span>
                            {evt.isOnline && (
                              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full font-bold text-[10px]">
                                🌐 Zoom Online
                              </span>
                            )}
                          </div>

                          {/* 제목 */}
                          <h4 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                            {title}
                          </h4>

                          {/* 설명 */}
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            {desc}
                          </p>

                          {/* 시간, 장소, 주관 */}
                          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-gray-500 pt-1">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock size={12} className="text-gray-400" />
                              <span>{evt.timeStr}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-gray-400" />
                              <span>{loc}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Building size={12} className="text-gray-400" />
                              <span>{evt.organizer}</span>
                            </span>
                          </div>
                        </div>

                        {/* 액션 버튼: 구글 캘린더 등록 & WhatsApp 공유 */}
                        <div className="flex sm:flex-col gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                          <a
                            href={gcalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                          >
                            <CalendarIcon size={13} />
                            <span>{t.schedulePage.addToGoogleCalendarBtn}</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleShareEvent(evt)}
                            className="flex-1 sm:flex-initial py-2.5 px-3.5 rounded-xl bg-white border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Share2 size={13} />
                            <span>{t.schedulePage.shareWhatsappBtn}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
