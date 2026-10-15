'use client'

import { useState, useEffect, useMemo } from 'react'
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
  ChevronLeft,
  ChevronRight,
  X,
  Palette,
  CalendarCheck,
  Download,
} from 'lucide-react'
import {
  initialAamenEvents,
  generateGoogleCalendarUrl,
  type AamenEventItem,
} from '@/data/scheduleData'
import { networkTranslations } from '@/data/networkTranslations'
import { getStoredUser, AUTH_ROLE_KEY } from '@/lib/auth'

// 🎨 카테고리별 감각적인 디자인 컬러 테마 (AAMEN 맞춤형 5색 팔레트)
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string; labelKo: string; labelEn: string }> = {
  총회: {
    bg: 'bg-purple-50 hover:bg-purple-100/90 text-purple-900',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    labelKo: '총회',
    labelEn: 'General Assembly',
  },
  컨퍼런스: {
    bg: 'bg-indigo-50 hover:bg-indigo-100/90 text-indigo-900',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
    labelKo: '컨퍼런스',
    labelEn: 'Conference',
  },
  워크숍: {
    bg: 'bg-blue-50 hover:bg-blue-100/90 text-blue-900',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    labelKo: '워크숍 / 세미나',
    labelEn: 'Workshop / Seminar',
  },
  교육: {
    bg: 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    labelKo: '교육 / 교재 번역',
    labelEn: 'Education / Curriculum',
  },
  기도회: {
    bg: 'bg-amber-50 hover:bg-amber-100/90 text-amber-900',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    labelKo: '기도회 / 묵상회',
    labelEn: 'Prayer Fellowship',
  },
}

export default function ScheduleView() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const t = networkTranslations[locale] || networkTranslations.en

  // 뷰 모드: 'custom' (AAMEN 커스텀 디자인 캘린더) | 'list' (월별 리스트) | 'google' (구글 원본 임베드)
  const [viewMode, setViewMode] = useState<'custom' | 'list' | 'google'>('custom')

  // 커스텀 캘린더 년/월 상태 (기본 2026년 10월)
  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(10) // 1 ~ 12

  // 이벤트 목록 상태 (로컬 스토리지와 동기화)
  const [events, setEvents] = useState<AamenEventItem[]>(initialAamenEvents)
  const [selectedEvent, setSelectedEvent] = useState<AamenEventItem | null>(null)

  // 공식 구글 캘린더 ID (신규: asiaaamen2025@gmail.com)
  const officialCalendarId = 'asiaaamen2025@gmail.com'
  const [googleCalendarId, setGoogleCalendarId] = useState<string>(officialCalendarId)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [customCalInput, setCustomCalInput] = useState(officialCalendarId)
  const [isDeveloper, setIsDeveloper] = useState(false)

  // 새 일정 추가 모달 상태
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    titleKo: '',
    titleEn: '',
    startDate: '2026-10-15',
    endDate: '',
    timeStr: '19:00 - 21:00 (KST)',
    locationKo: '',
    locationEn: '',
    isOnline: false,
    organizer: 'AAMEN',
    category: '컨퍼런스' as AamenEventItem['category'],
    descKo: '',
    descEn: '',
  })

  useEffect(() => {
    try {
      const u = getStoredUser()
      const role = u?.role || (typeof window !== 'undefined' ? localStorage.getItem(AUTH_ROLE_KEY) : null)
      setIsDeveloper(role === 'developer' || role === 'super_admin' || role === 'country_admin')

      // 저장된 사용자 정의 일정 불러오기
      const savedEvents = localStorage.getItem('aamen_custom_calendar_events')
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed)
        }
      }

      // 캘린더 ID 로드
      const savedCalId = localStorage.getItem('aamen_google_calendar_id')
      if (savedCalId && !savedCalId.includes('holiday@group.v.calendar.google.com') && !savedCalId.includes('47b9a808f2d0ae426575c')) {
        setGoogleCalendarId(savedCalId)
        setCustomCalInput(savedCalId)
      } else {
        setGoogleCalendarId(officialCalendarId)
        setCustomCalInput(officialCalendarId)
        localStorage.setItem('aamen_google_calendar_id', officialCalendarId)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // 캘린더 ID 저장
  const handleSaveCalendarId = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customCalInput.trim() || officialCalendarId
    setGoogleCalendarId(trimmed)
    localStorage.setItem('aamen_google_calendar_id', trimmed)
    setIsConfigOpen(false)
    alert(isKo ? '공식 캘린더 ID가 저장되었습니다!' : 'Official Calendar ID has been updated!')
  }

  // 이전 달 / 다음 달 / 오늘 이동
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1)
      setCurrentMonth(12)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1)
      setCurrentMonth(1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleGoToday = () => {
    const today = new Date()
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth() + 1)
  }

  // 월간 달력 날짜 그리드 계산
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay() // 0: 일요일 ~ 6: 토요일
    const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate()
    const daysInPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate()

    const days: Array<{
      day: number
      month: number
      year: number
      isCurrentMonth: boolean
      dateString: string
    }> = []

    // 1) 이전 달 날짜 채우기
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const pDay = daysInPrevMonth - i
      const pMonth = currentMonth === 1 ? 12 : currentMonth - 1
      const pYear = currentMonth === 1 ? currentYear - 1 : currentYear
      const mStr = String(pMonth).padStart(2, '0')
      const dStr = String(pDay).padStart(2, '0')
      days.push({
        day: pDay,
        month: pMonth,
        year: pYear,
        isCurrentMonth: false,
        dateString: `${pYear}-${mStr}-${dStr}`,
      })
    }

    // 2) 이번 달 날짜 채우기
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const mStr = String(currentMonth).padStart(2, '0')
      const dStr = String(d).padStart(2, '0')
      days.push({
        day: d,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        dateString: `${currentYear}-${mStr}-${dStr}`,
      })
    }

    // 3) 다음 달 날짜 채우기 (총 35일 또는 42일로 7의 배수 맞춤)
    const remainingDays = 42 - days.length >= 7 && days.length <= 35 ? 35 - days.length : 42 - days.length
    for (let n = 1; n <= remainingDays; n++) {
      const nMonth = currentMonth === 12 ? 1 : currentMonth + 1
      const nYear = currentMonth === 12 ? currentYear + 1 : currentYear
      const mStr = String(nMonth).padStart(2, '0')
      const dStr = String(n).padStart(2, '0')
      days.push({
        day: n,
        month: nMonth,
        year: nYear,
        isCurrentMonth: false,
        dateString: `${nYear}-${mStr}-${dStr}`,
      })
    }

    return days
  }, [currentYear, currentMonth])

  // 특정 날짜에 속한 일정 필터링
  const getEventsForDate = (dateString: string) => {
    return events.filter((evt) => {
      const start = evt.startDate
      const end = evt.endDate || evt.startDate
      return dateString >= start && dateString <= end
    })
  }

  // WhatsApp 일정 공유
  const handleShareEvent = (evt: AamenEventItem) => {
    const title = isKo ? evt.titleKo : evt.titleEn
    const loc = isKo ? evt.locationKo : evt.locationEn
    const date = evt.endDate ? `${evt.startDate} ~ ${evt.endDate}` : evt.startDate
    const msg = `📅 *[AAMEN 아시아 사역 일정 안내]*\n✨ *${title}*\n🗓️ 일시: ${date} (${evt.timeStr})\n📍 장소: ${loc}\n👥 주관: ${evt.organizer}\n\n👉 캘린더 확인: https://aamen.net/${locale}/network/schedule`

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // 신규 사역 일정 저장
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.titleKo && !newEvent.titleEn) {
      alert(isKo ? '일정 제목을 입력해 주세요.' : 'Please enter event title.')
      return
    }

    const monthNum = parseInt(newEvent.startDate.substring(5, 7), 10) || currentMonth
    const createdItem: AamenEventItem = {
      id: `evt_custom_${Date.now()}`,
      month: monthNum,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate || undefined,
      timeStr: newEvent.timeStr || '하루 종일',
      titleKo: newEvent.titleKo || newEvent.titleEn,
      titleEn: newEvent.titleEn || newEvent.titleKo,
      descKo: newEvent.descKo || '',
      descEn: newEvent.descEn || '',
      locationKo: newEvent.locationKo || (newEvent.isOnline ? '온라인 Zoom' : '현장 모임'),
      locationEn: newEvent.locationEn || (newEvent.isOnline ? 'Online Zoom' : 'On-site Fellowship'),
      isOnline: newEvent.isOnline,
      organizer: newEvent.organizer || 'AAMEN',
      category: newEvent.category,
      badgeColor: CATEGORY_COLORS[newEvent.category]?.bg || 'bg-emerald-100 text-emerald-800',
    }

    const updated = [createdItem, ...events]
    setEvents(updated)
    try {
      localStorage.setItem('aamen_custom_calendar_events', JSON.stringify(updated))
    } catch (err) {}

    setIsAddEventOpen(false)
    alert(isKo ? '새 사역 일정이 캘린더에 등록되었습니다!' : 'New ministry event added successfully!')
  }

  // 공식 구글 캘린더 임베드 URL
  const embedUrl = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
    googleCalendarId
  )}&ctz=Asia%2FSeoul&mode=MONTH&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=0`

  // 오늘 날짜 문자열
  const todayDateStr = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }, [])

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

            <div className="flex items-center gap-2">
              {/* 관리자 및 리더 전용 일정 추가 버튼 */}
              {isDeveloper && (
                <button
                  onClick={() => setIsAddEventOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{isKo ? '새 사역 일정 추가' : 'Add Ministry Event'}</span>
                </button>
              )}

              {/* 개발자 전용 캘린더 ID 설정 버튼 */}
              {isDeveloper && (
                <button
                  onClick={() => setIsConfigOpen(!isConfigOpen)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-blue-700 bg-white px-3.5 py-2 rounded-xl border border-gray-200 transition-all shadow-2xs cursor-pointer"
                >
                  <Settings2 size={14} />
                  <span>{isKo ? '구글 ID 설정 (DEV)' : 'Google ID Settings'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 캘린더 ID 설정 모달/박스 (개발자 전용) */}
          {isDeveloper && isConfigOpen && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-xs animate-in fade-in">
              <h4 className="text-xs font-extrabold text-blue-950 mb-1 flex items-center gap-1.5">
                <Settings2 size={14} />
                <span>{isKo ? '연동할 Google 캘린더 ID 설정 (공식 ID: asiaaamen2025@gmail.com)' : 'Google Calendar ID (Official: asiaaamen2025@gmail.com)'}</span>
              </h4>
              <p className="text-[11px] text-blue-700 mb-3">
                {isKo
                  ? 'AAMEN 공식 구글 캘린더 ID를 입력하면 구글 연동 뷰 및 원클릭 동기화에 실시간으로 반영됩니다.'
                  : 'Enter Google Calendar ID to sync with official calendar views.'}
              </p>
              <form onSubmit={handleSaveCalendarId} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customCalInput}
                  onChange={(e) => setCustomCalInput(e.target.value)}
                  placeholder="asiaaamen2025@gmail.com"
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

          {/* 헤더 배너 (디자인 커스텀 캘린더 소개) */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
                  {t.schedulePage.badge} · Official Calendar
                </span>
                <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
                  {t.schedulePage.title}
                </h1>
                <p className="text-white/85 text-sm sm:text-base max-w-2xl leading-relaxed">
                  {isKo
                    ? '13개국 메노나이트 평화 연합 총회, 온라인 다국어 기도회, 청년 리더십 워크숍 및 신학교 세미나 일정을 감각적인 컬러 캘린더로 확인하세요.'
                    : 'Discover Asian Anabaptist fellowship general assemblies, online multilingual prayers, and youth leadership peace workshops.'}
                </p>
              </div>

              {/* 구글 캘린더 구독 및 iCal 링크 */}
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <a
                  href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(officialCalendarId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-2xl bg-white text-emerald-950 text-xs font-black shadow-md hover:bg-emerald-50 transition-all flex items-center gap-2"
                >
                  <CalendarCheck size={15} className="text-emerald-600" />
                  <span>Google 캘린더에 구독 추가</span>
                </a>
                <a
                  href={`https://calendar.google.com/calendar/ical/${encodeURIComponent(officialCalendarId)}/public/basic.ics`}
                  className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Download size={12} />
                  <span>iCal (.ics) 형식 다운로드</span>
                </a>
              </div>
            </div>

            {/* 3대 뷰 스위처 (1. 커스텀 캘린더 | 2. 월별 사역 목록 | 3. 구글 캘린더 원본) */}
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/15">
              <button
                onClick={() => setViewMode('custom')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'custom'
                    ? 'bg-emerald-400 text-slate-950 shadow-md font-black ring-2 ring-emerald-300'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Palette size={14} />
                <span>{isKo ? '✨ 커스텀 컬러 캘린더 (추천)' : '✨ Custom Color Calendar'}</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-emerald-400 text-slate-950 shadow-md font-black ring-2 ring-emerald-300'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Filter size={14} />
                <span>{isKo ? '📋 월별 사역 일정 목록' : '📋 Monthly Event List'}</span>
              </button>

              <button
                onClick={() => setViewMode('google')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'google'
                    ? 'bg-emerald-400 text-slate-950 shadow-md font-black ring-2 ring-emerald-300'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Globe size={14} />
                <span>{isKo ? '🌐 구글 캘린더 원본 연동' : '🌐 Official Google Calendar'}</span>
              </button>
            </div>
          </div>

          {/* =========================================================================
              1. ✨ 감각적인 AAMEN 커스텀 컬러 캘린더 (월간 인터랙티브 뷰)
             ========================================================================= */}
          {viewMode === 'custom' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
              {/* 캘린더 상단 컨트롤: 년/월 네비게이션 + 오늘 버튼 + 카테고리 범례 */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                {/* 년/월 선택기 */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-2xl border border-gray-200/80">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 hover:bg-white text-gray-700 rounded-xl transition-all shadow-2xs cursor-pointer"
                      title="이전 달"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 hover:bg-white text-gray-700 rounded-xl transition-all shadow-2xs cursor-pointer"
                      title="다음 달"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <span>{currentYear}년 {currentMonth}월</span>
                    <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {new Date(currentYear, currentMonth - 1).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                    </span>
                  </h2>

                  <button
                    onClick={handleGoToday}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    {isKo ? '오늘' : 'Today'}
                  </button>
                </div>

                {/* 카테고리 컬러 범례 (Legend) */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-gray-400 font-bold text-[11px] mr-1">분류:</span>
                  {Object.entries(CATEGORY_COLORS).map(([catKey, catMeta]) => (
                    <div
                      key={catKey}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200/80 text-[11px] font-semibold text-gray-700"
                    >
                      <span className={`w-2 h-2 rounded-full ${catMeta.dot}`}></span>
                      <span>{isKo ? catMeta.labelKo : catMeta.labelEn}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 월간 캘린더 그리드 */}
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                {/* 요일 헤더 (일 ~ 토) */}
                <div className="grid grid-cols-7 bg-gray-50/90 border-b border-gray-200 text-center font-bold text-xs py-2.5 text-gray-600">
                  <span className="text-rose-600">{isKo ? '일' : 'Sun'}</span>
                  <span>{isKo ? '월' : 'Mon'}</span>
                  <span>{isKo ? '화' : 'Tue'}</span>
                  <span>{isKo ? '수' : 'Wed'}</span>
                  <span>{isKo ? '목' : 'Thu'}</span>
                  <span>{isKo ? '금' : 'Fri'}</span>
                  <span className="text-sky-600">{isKo ? '토' : 'Sat'}</span>
                </div>

                {/* 일자 셀 그리드 */}
                <div className="grid grid-cols-7 divide-x divide-y divide-gray-200/70 bg-gray-200/20">
                  {calendarDays.map((dItem, index) => {
                    const dayEvents = getEventsForDate(dItem.dateString)
                    const isToday = dItem.dateString === todayDateStr
                    const dayOfWeek = index % 7

                    return (
                      <div
                        key={dItem.dateString + index}
                        className={`min-h-[105px] sm:min-h-[120px] p-2 flex flex-col justify-between transition-colors ${
                          dItem.isCurrentMonth ? 'bg-white' : 'bg-gray-50/50 text-gray-300'
                        } ${isToday ? 'bg-emerald-50/30' : ''}`}
                      >
                        {/* 상단 날짜 번호 및 오늘 마커 */}
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-mono font-bold ${
                              !dItem.isCurrentMonth
                                ? 'text-gray-300'
                                : dayOfWeek === 0
                                ? 'text-rose-600'
                                : dayOfWeek === 6
                                ? 'text-sky-600'
                                : 'text-gray-700'
                            } ${
                              isToday
                                ? 'w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs'
                                : ''
                            }`}
                          >
                            {dItem.day}
                          </span>

                          {dayEvents.length > 0 && dItem.isCurrentMonth && (
                            <span className="text-[10px] font-mono font-bold text-gray-400">
                              {dayEvents.length}개
                            </span>
                          )}
                        </div>

                        {/* 일정 뱃지 목록 (사역 성격에 따른 감각적인 컬러 테마) */}
                        <div className="space-y-1 flex-1 overflow-hidden">
                          {dayEvents.slice(0, 3).map((evt) => {
                            const colorTheme = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['컨퍼런스']
                            const evtTitle = isKo ? evt.titleKo : evt.titleEn

                            return (
                              <button
                                key={evt.id}
                                onClick={() => setSelectedEvent(evt)}
                                className={`w-full text-left px-2 py-1 rounded-md text-[11px] font-bold border transition-all truncate block shadow-2xs cursor-pointer ${colorTheme.bg} ${colorTheme.border}`}
                                title={`${evtTitle} (${evt.timeStr})`}
                              >
                                <div className="flex items-center gap-1 truncate">
                                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colorTheme.dot}`}></span>
                                  <span className="truncate">{evtTitle}</span>
                                </div>
                              </button>
                            )
                          })}

                          {dayEvents.length > 3 && (
                            <div className="text-[10px] text-gray-500 font-bold pl-1">
                              +{dayEvents.length - 3}개 더보기
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 하단 사역 일정 빠른 요약 바 */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span>
                    {isKo
                      ? '달력의 사역 일정 카드를 클릭하시면 상세 프로그램, 장소, Google 캘린더 추가 및 WhatsApp 공유를 이용하실 수 있습니다.'
                      : 'Click any event on the calendar to view full descriptions, add to Google Calendar, and share via WhatsApp.'}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-extrabold text-emerald-800">
                    {currentYear}년 {currentMonth}월 사역 총 {events.filter((e) => e.month === currentMonth).length}건
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              2. 📋 월별 주요 사역 일정 리스트 (Monthly List View)
             ========================================================================= */}
          {viewMode === 'list' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
              {/* 월 필터 칩 */}
              <div className="flex flex-wrap gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-200/80">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      if (m > 0) {
                        setCurrentMonth(m)
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentMonth === m
                        ? 'bg-emerald-600 text-white shadow-xs font-black'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                    }`}
                  >
                    {m === 0 ? t.schedulePage.allMonths : `${m}월`}
                  </button>
                ))}
              </div>

              {/* 일정 카드 목록 */}
              <div className="space-y-4">
                {events.map((evt) => {
                  const title = isKo ? evt.titleKo : evt.titleEn
                  const desc = isKo ? evt.descKo : evt.descEn
                  const loc = isKo ? evt.locationKo : evt.locationEn
                  const colorTheme = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS['컨퍼런스']

                  return (
                    <div
                      key={evt.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${colorTheme.bg} ${colorTheme.border}`}>
                            {isKo ? colorTheme.labelKo : colorTheme.labelEn}
                          </span>
                          <span className="text-xs font-mono font-bold text-gray-500 flex items-center gap-1">
                            <Clock size={13} />
                            <span>
                              {evt.startDate} {evt.endDate ? `~ ${evt.endDate}` : ''} ({evt.timeStr})
                            </span>
                          </span>
                          {evt.isOnline && (
                            <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold">
                              Online Live
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{desc}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-emerald-600" />
                            <span>{loc}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Building size={13} className="text-gray-400" />
                            <span>{evt.organizer}</span>
                          </span>
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleShareEvent(evt)}
                          className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Share2 size={13} />
                          <span>WhatsApp</span>
                        </button>
                        <a
                          href={generateGoogleCalendarUrl(evt, isKo)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <ExternalLink size={13} />
                          <span>Google 캘린더</span>
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              3. 🌐 공식 구글 캘린더 (iframe 원본 뷰 - ID: asiaaamen2025@gmail.com)
             ========================================================================= */}
          {viewMode === 'google' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-xs">
                    📅
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-gray-900 flex items-center gap-2">
                      <span>Google Calendar Original (asiaaamen2025@gmail.com)</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                        Official Sync
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      구글 캘린더 서버와 100% 실시간으로 연동되는 원본 임베드 화면입니다.
                    </p>
                  </div>
                </div>

                <a
                  href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(googleCalendarId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>내 캘린더에 바로 추가</span>
                </a>
              </div>

              {/* 반응형 캘린더 iframe 임베드 */}
              <div className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] min-h-[520px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
                <iframe
                  src={embedUrl}
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
          )}
        </div>
      </main>

      {/* =========================================================================
          🌟 일정 상세 보기 모달 (Event Detail Modal)
         ========================================================================= */}
      {selectedEvent && (
        <div
          onClick={() => setSelectedEvent(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 border border-gray-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${CATEGORY_COLORS[selectedEvent.category]?.bg} ${CATEGORY_COLORS[selectedEvent.category]?.border}`}>
                {isKo ? CATEGORY_COLORS[selectedEvent.category]?.labelKo : CATEGORY_COLORS[selectedEvent.category]?.labelEn}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900 leading-tight">
                {isKo ? selectedEvent.titleKo : selectedEvent.titleEn}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {isKo ? selectedEvent.titleEn : selectedEvent.titleKo}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock size={14} className="text-emerald-600 shrink-0" />
                <span className="font-bold">
                  {selectedEvent.startDate} {selectedEvent.endDate ? `~ ${selectedEvent.endDate}` : ''} ({selectedEvent.timeStr})
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={14} className="text-emerald-600 shrink-0" />
                <span>{isKo ? selectedEvent.locationKo : selectedEvent.locationEn}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Building size={14} className="text-emerald-600 shrink-0" />
                <span>주관: {selectedEvent.organizer}</span>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-white">
              {isKo ? selectedEvent.descKo : selectedEvent.descEn}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleShareEvent(selectedEvent)}
                className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Share2 size={14} />
                <span>WhatsApp 공유</span>
              </button>

              <a
                href={generateGoogleCalendarUrl(selectedEvent, isKo)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <ExternalLink size={14} />
                <span>Google 캘린더에 추가</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ➕ 새 사역 일정 추가 모달 (Add Event Modal - 관리자/리더 전용)
         ========================================================================= */}
      {isAddEventOpen && (
        <div
          onClick={() => setIsAddEventOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 animate-in zoom-in-95 border border-gray-100 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Plus size={18} className="text-emerald-600" />
                <span>새 사역 일정 등록</span>
              </h3>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">일정 제목 (한국어)</label>
                <input
                  type="text"
                  value={newEvent.titleKo}
                  onChange={(e) => setNewEvent({ ...newEvent, titleKo: e.target.value })}
                  placeholder="예: 2026 아시아 청년 평화 컨퍼런스"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">일정 제목 (영어)</label>
                <input
                  type="text"
                  value={newEvent.titleEn}
                  onChange={(e) => setNewEvent({ ...newEvent, titleEn: e.target.value })}
                  placeholder="e.g. 2026 Asian Youth Peace Conference"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">시작일</label>
                  <input
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">종료일 (선택)</label>
                  <input
                    type="date"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">시간 안내</label>
                  <input
                    type="text"
                    value={newEvent.timeStr}
                    onChange={(e) => setNewEvent({ ...newEvent, timeStr: e.target.value })}
                    placeholder="19:00 - 21:00 (KST)"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">사역 카테고리 (색상 연동)</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-emerald-600 font-bold"
                  >
                    <option value="총회">🟣 총회 (보라색)</option>
                    <option value="컨퍼런스">🔵 컨퍼런스 (인디고)</option>
                    <option value="워크숍">🔷 워크숍 / 세미나 (블루)</option>
                    <option value="교육">🟢 교육 / 교재 번역 (에메랄드)</option>
                    <option value="기도회">🟠 기도회 / 묵상회 (오렌지)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">장소</label>
                <input
                  type="text"
                  value={newEvent.locationKo}
                  onChange={(e) => setNewEvent({ ...newEvent, locationKo: e.target.value })}
                  placeholder="예: 서울 종로 연합회관 / 온라인 Zoom"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">상세 사역 설명</label>
                <textarea
                  value={newEvent.descKo}
                  onChange={(e) => setNewEvent({ ...newEvent, descKo: e.target.value })}
                  placeholder="일정 세부 내용 및 참가 안내..."
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-xs"
                >
                  캘린더에 일정 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
