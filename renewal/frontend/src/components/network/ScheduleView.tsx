'use client'

import { useState, useEffect, useMemo } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Calendar as CalendarIcon,
  ExternalLink,
  ArrowLeft,
  RefreshCw,
  Plus,
  Clock,
  MapPin,
  Users,
  Globe,
  Layers,
  CalendarCheck,
  ShieldCheck,
  Lock,
  LogIn,
  UserPlus,
  UserCheck,
} from 'lucide-react'
import { networkTranslations } from '@/data/networkTranslations'
import {
  initialAamenEvents,
  generateGoogleCalendarUrl,
  AamenEventItem,
} from '@/data/scheduleData'
import { getStoredTierLevel, TIER_EVENT_NAME } from '@/components/common/GlobalTierSimulator'
import { getStoredUser, AUTH_EVENT_NAME, AuthUser } from '@/lib/auth'

const OFFICIAL_CALENDAR_ID = 'asiaamen2025@gmail.com'

export default function ScheduleView() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const t = networkTranslations[locale] || networkTranslations.en

  const [mounted, setMounted] = useState<boolean>(false)
  const [currentLevel, setCurrentLevel] = useState<number>(0)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

  const [activeTab, setActiveTab] = useState<'google_embed' | 'aamen_list'>('google_embed')
  const [selectedMonth, setSelectedMonth] = useState<number>(0) // 0: 전체
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [iframeKey, setIframeKey] = useState<number>(1)
  const [remoteEvents, setRemoteEvents] = useState<AamenEventItem[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false)

  // 1. 회원 등급 및 로그인 상태 실시간 감지 (시뮬레이터 & 실사용자 반응형)
  useEffect(() => {
    setMounted(true)
    const lvl = getStoredTierLevel()
    const user = getStoredUser()
    setCurrentLevel(lvl)
    setCurrentUser(user)

    const handleTierChange = (e: any) => {
      const newLvl = e?.detail?.level !== undefined ? e.detail.level : getStoredTierLevel()
      setCurrentLevel(newLvl)
    }

    const handleAuthChange = () => {
      const u = getStoredUser()
      setCurrentUser(u)
      setCurrentLevel(getStoredTierLevel())
    }

    window.addEventListener(TIER_EVENT_NAME, handleTierChange)
    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange)
    return () => {
      window.removeEventListener(TIER_EVENT_NAME, handleTierChange)
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange)
    }
  }, [])

  // 2. 권한 판별: 2단계: 정회원(Regular) 이상인 경우에만 일정 열람 가능
  const hasAccess = mounted && currentLevel >= 2
  const isAssociate = mounted && currentLevel === 1 // 준회원
  const isGuest = mounted && currentLevel === 0 // 비회원 / 로그아웃

  // 3. AAMEN 공식 구글 캘린더 iCal 피드(/api/calendar.php)로부터 공식 일정만 안전하게 로드 (정회원 이상일 때만 로드)
  useEffect(() => {
    if (!hasAccess) return

    async function fetchCalendarEvents() {
      setIsLoadingEvents(true)
      try {
        const res = await fetch(`/api/calendar.php?cal_id=${encodeURIComponent(OFFICIAL_CALENDAR_ID)}`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.status === 'success' && Array.isArray(data.events)) {
            const mapped: AamenEventItem[] = data.events
              .filter((e: any) => e.titleKo && e.titleKo !== 'Busy')
              .map((e: any, idx: number) => ({
                id: e.id || `remote_${idx}`,
                month: e.month || (e.startDate ? parseInt(e.startDate.split('-')[1], 10) : 1),
                startDate: e.startDate || '2026-01-01',
                endDate: e.endDate,
                timeStr: e.timeStr || '하루 종일',
                titleKo: e.titleKo,
                titleEn: e.titleEn || e.titleKo,
                descKo: e.descKo || '',
                descEn: e.descEn || '',
                locationKo: e.locationKo || '온라인 / 현장',
                locationEn: e.locationEn || 'Online / On-site',
                isOnline: Boolean(e.isOnline),
                organizer: 'AAMEN',
                category: '기도회',
                badgeColor: 'bg-emerald-100 text-emerald-800',
              }))
            setRemoteEvents(mapped)
          }
        }
      } catch (err) {
        console.warn('Failed to load remote calendar events:', err)
      } finally {
        setIsLoadingEvents(false)
      }
    }
    fetchCalendarEvents()
  }, [hasAccess])

  // 4. Google Calendar Iframe Embed URL (오직 AAMEN 공식 캘린더만, showCalendars=0)
  const calendarEmbedUrl = useMemo(() => {
    const encodedCal = encodeURIComponent(OFFICIAL_CALENDAR_ID)
    return `https://calendar.google.com/calendar/embed?src=${encodedCal}&ctz=Asia%2FSeoul&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&hl=${isKo ? 'ko' : 'en'}`
  }, [isKo])

  // 5. AAMEN 공식 이벤트 목록 병합 및 필터링
  const combinedEvents = useMemo(() => {
    const map = new Map<string, AamenEventItem>()
    initialAamenEvents.forEach((ev) => map.set(ev.id, ev))
    remoteEvents.forEach((ev) => {
      if (ev.titleKo && ev.titleKo !== 'Busy') {
        map.set(ev.id, ev)
      }
    })
    return Array.from(map.values()).sort((a, b) => a.startDate.localeCompare(b.startDate))
  }, [remoteEvents])

  const filteredEvents = useMemo(() => {
    return combinedEvents.filter((ev) => {
      const matchMonth = selectedMonth === 0 || ev.month === selectedMonth
      const matchCat = selectedCategory === 'all' || ev.category === selectedCategory
      return matchMonth && matchCat
    })
  }, [combinedEvents, selectedMonth, selectedCategory])

  const monthsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* 상단 네비게이션 */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Link
              href={`/${locale}/network`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>{t.schedulePage.backToNetwork}</span>
            </Link>

            {hasAccess && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 transition-all cursor-pointer"
                  title="캘린더 새로고침"
                >
                  <RefreshCw size={13} />
                  <span>{isKo ? '새로고침' : 'Refresh'}</span>
                </button>

                <a
                  href={calendarEmbedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs transition-all"
                >
                  <ExternalLink size={14} />
                  <span>{isKo ? '새 창에서 전체 화면' : 'Open Full Screen'}</span>
                </a>
              </div>
            )}
          </div>

          {/* 헤더 배너 */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                  {t.schedulePage.badge || 'Official Calendar & Ministry Schedule'}
                </span>
                {hasAccess ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[11px] font-semibold border border-emerald-400/30">
                    <ShieldCheck size={12} />
                    <span>{isKo ? '정회원 사역 일정 열람 활성화' : 'Regular Member Access'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[11px] font-semibold border border-amber-400/30">
                    <Lock size={12} />
                    <span>{isKo ? '2단계: 정회원 이상 열람 권한 전용' : 'Level 2+ Members Only'}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 tracking-tight">
                {t.schedulePage.title}
              </h1>
              <p className="text-white/85 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {isKo
                  ? '15개국 메노나이트 평화 연합 총회, 온라인 다국어 기도회 및 주요 사역 일정을 실시간 공식 구글 캘린더와 월간 사역 일정표로 확인하세요.'
                  : t.schedulePage.desc}
              </p>
            </div>

            {/* 배경 데코레이션 */}
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* 🔒 1. 비회원(로그아웃) 또는 준회원(1단계) 접근 제한 잠금 카드 */}
          {!hasAccess && mounted && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-dashed border-gray-300 text-center shadow-sm space-y-6 max-w-3xl mx-auto my-8">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-inner">
                <Lock size={32} />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  {isAssociate ? (
                    <>
                      <UserCheck size={13} className="text-amber-600" />
                      <span>{isKo ? '현재 회원 등급: 1단계 (준회원)' : 'Current Level: 1 (Associate)'}</span>
                    </>
                  ) : (
                    <>
                      <Lock size={13} className="text-amber-600" />
                      <span>{isKo ? '로그아웃 (비회원 상태)' : 'Logged Out (Guest)'}</span>
                    </>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {isAssociate
                    ? (isKo ? '정회원(2단계) 승인 후 공식 사역 일정이 표시됩니다.' : 'Available after Regular Member (Level 2) Approval.')
                    : (isKo ? '공식 사역 캘린더는 [정회원] 이상 로그인 시 열람하실 수 있습니다.' : 'Official Calendar requires Regular Member (Level 2) login.')}
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                  {isAssociate
                    ? (isKo
                        ? '회원님은 현재 1단계(준회원)로 등록되어 있습니다. AAMEN 관리자의 정회원 등급 조정이 완료되면 15개국 연합 기도회와 공식 총회 일정을 확인하실 수 있습니다.'
                        : 'Your account is currently at Level 1 (Associate). Once upgraded to Regular Member, you will have full access to all official ministry schedules.')
                    : (isKo
                        ? '15개국 메노나이트 평화 연합 총회, 실시간 다국어 기도회 등 AAMEN 공식 사역 일정은 회원 프라이버시 및 보안을 위해 2단계: 정회원 이상에게만 공개됩니다.'
                        : 'To protect ministry network privacy and security, the official calendar is accessible only to approved members (Level 2 and above).')}
                </p>
              </div>

              {/* 행동 유도 버튼 */}
              <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                {isGuest ? (
                  <>
                    <Link
                      href={`/${locale}/member/login?redirect=/network/schedule`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      <LogIn size={16} />
                      <span>{isKo ? '정회원 계정으로 로그인' : 'Log In to View'}</span>
                    </Link>
                    <Link
                      href={`/${locale}/member/signup`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm transition-all"
                    >
                      <UserPlus size={16} />
                      <span>{isKo ? '신규 회원가입' : 'Sign Up'}</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/${locale}/member/mypage`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <UserCheck size={16} />
                    <span>{isKo ? '내 회원 등급 및 프로필 확인' : 'View My Profile & Tier'}</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* 🌟 2. 정회원(2단계) 이상 승인 회원 전용 캘린더 영역 (인증 통과 시에만 렌더링) */}
          {hasAccess && (
            <div className="space-y-6">
              {/* 🧭 보기 방식 전환 탭 바 */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('google_embed')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      activeTab === 'google_embed'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                        : 'text-gray-600 bg-white hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Globe size={15} />
                    <span>{isKo ? '🌐 Google 캘린더 실시간 뷰' : 'Google Calendar Live'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('aamen_list')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      activeTab === 'aamen_list'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                        : 'text-gray-600 bg-white hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <CalendarCheck size={15} />
                    <span>{isKo ? '📅 AAMEN 월간 사역 일정표' : 'AAMEN Monthly Schedule'}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold ml-1">
                      {combinedEvents.length}
                    </span>
                  </button>
                </div>

                <div className="text-[11px] text-gray-500 font-medium">
                  {isKo ? '※ AAMEN 공식 사역 캘린더 일정만 안전하게 표시됩니다.' : 'Official AAMEN ministry events only.'}
                </div>
              </div>

              {/* 🌟 탭 1: Google Calendar 실시간 iframe 임베드 */}
              {activeTab === 'google_embed' && (
                <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <CalendarIcon size={18} />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-black text-gray-900">
                          {t.schedulePage.googleCalendarTitle || 'AAMEN Official Calendar'}
                        </h2>
                        <p className="text-xs text-gray-500 font-mono">
                          {OFFICIAL_CALENDAR_ID}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Live Syncing</span>
                      </span>
                    </div>
                  </div>

                  {/* 구글 캘린더 iframe 임베드 (개인 캘린더 목록 비활성화 showCalendars=0) */}
                  <div className="w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] min-h-[620px] sm:min-h-[720px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
                    <iframe
                      key={iframeKey}
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
              )}

              {/* 🌟 탭 2: AAMEN 월간 사역 일정표 */}
              {activeTab === 'aamen_list' && (
                <div className="space-y-6">
                  {/* 월별 & 카테고리 필터 컨트롤 */}
                  <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Layers size={16} className="text-emerald-600" />
                        <span className="text-xs sm:text-sm font-black text-gray-900">
                          {isKo ? '2026 연간 주요 사역 월별 필터' : '2026 Monthly Filter'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-bold">
                        {filteredEvents.length}개의 일정
                      </span>
                    </div>

                    {/* 월별 칩 */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                      <button
                        type="button"
                        onClick={() => setSelectedMonth(0)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                          selectedMonth === 0
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isKo ? '전체 일정' : 'All Months'}
                      </button>
                      {monthsList.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSelectedMonth(m)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                            selectedMonth === m
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {m}{isKo ? '월' : 'M'}
                        </button>
                      ))}
                    </div>

                    {/* 카테고리 칩 */}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100 flex-wrap">
                      {['all', '기도회', '컨퍼런스', '워크숍', '총회', '교육'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {cat === 'all' ? (isKo ? '모든 유형' : 'All Types') : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 일정 카드 그리드 */}
                  {filteredEvents.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-2">
                      <p className="text-3xl">📅</p>
                      <p className="text-sm font-bold text-gray-800">
                        {isKo ? '해당 월/유형에 등록된 일정이 없습니다.' : 'No events found for this filter.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => { setSelectedMonth(0); setSelectedCategory('all') }}
                        className="mt-2 px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        {isKo ? '전체 일정 보기' : 'Show All'}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filteredEvents.map((ev) => {
                        const googleAddUrl = generateGoogleCalendarUrl(ev, isKo)
                        return (
                          <div
                            key={ev.id}
                            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
                          >
                            <div className="space-y-3">
                              {/* 뱃지 및 날짜 헤더 */}
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${ev.badgeColor || 'bg-emerald-100 text-emerald-800'}`}>
                                  {ev.category}
                                </span>
                                <span className="text-xs font-bold text-gray-500 font-mono bg-gray-100 px-2.5 py-0.5 rounded-md">
                                  {ev.startDate}{ev.endDate ? ` ~ ${ev.endDate}` : ''}
                                </span>
                              </div>

                              {/* 제목 */}
                              <h3 className="text-base sm:text-lg font-black text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
                                {isKo ? ev.titleKo : ev.titleEn}
                              </h3>

                              {/* 설명 */}
                              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                                {isKo ? ev.descKo : ev.descEn}
                              </p>

                              {/* 메타 정보 */}
                              <div className="space-y-1.5 pt-2 text-xs text-gray-500 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                  <Clock size={13} className="text-emerald-600 shrink-0" />
                                  <span className="font-medium">{ev.timeStr}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin size={13} className="text-rose-500 shrink-0" />
                                  <span className="font-medium">{isKo ? ev.locationKo : ev.locationEn}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users size={13} className="text-blue-500 shrink-0" />
                                  <span className="font-medium text-gray-400">주관: {ev.organizer}</span>
                                </div>
                              </div>
                            </div>

                            {/* 하단 원클릭 구글 캘린더 추가 버튼 */}
                            <div className="pt-2">
                              <a
                                href={googleAddUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-emerald-600 text-gray-700 hover:text-white border border-gray-200 hover:border-emerald-600 text-xs font-bold transition-all shadow-2xs group-hover:bg-emerald-600 group-hover:text-white"
                              >
                                <Plus size={13} />
                                <span>{isKo ? '내 구글 캘린더에 일정 추가' : 'Add to My Google Calendar'}</span>
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
