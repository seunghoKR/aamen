'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, Settings, ShieldCheck, Shield, User, LogOut, Code, UserCheck } from 'lucide-react'
import { locales, localeFlags, type Locale } from '@/config/locales'
import { MemberLevel, defaultTierSettings } from '@/lib/store'
import { getStoredTierLevel, TIER_EVENT_NAME, TIER_STORAGE_KEY } from '@/components/common/GlobalTierSimulator'
import { getStoredUser, logoutUser, AUTH_EVENT_NAME, type AuthUser } from '@/lib/auth'

// 13개 참여국 정의 (각 국가의 언어로 국가명 | 영어 표기 | 이니셜)
interface CountryItemInfo {
  code: string
  nativeName: string
  englishName: string
}

const countryInfos: Record<Locale, CountryItemInfo> = {
  ko: { code: 'KR', nativeName: '대한민국', englishName: 'South Korea' },
  en: { code: 'US', nativeName: 'United States', englishName: 'United States' },
  ja: { code: 'JP', nativeName: '日本', englishName: 'Japan' },
  'zh-TW': { code: 'TW', nativeName: '台灣', englishName: 'Taiwan' },
  vi: { code: 'VN', nativeName: 'Việt Nam', englishName: 'Vietnam' },
  id: { code: 'ID', nativeName: 'Indonesia', englishName: 'Indonesia' },
  th: { code: 'TH', nativeName: 'ไทย', englishName: 'Thailand' },
  lo: { code: 'LA', nativeName: 'ລາວ', englishName: 'Laos' },
  my: { code: 'MM', nativeName: 'မြန်မာ', englishName: 'Myanmar' },
  ne: { code: 'NP', nativeName: 'नेपाल', englishName: 'Nepal' },
  hi: { code: 'IN', nativeName: 'भारत', englishName: 'India' },
  km: { code: 'KH', nativeName: 'កម្ពុជា', englishName: 'Cambodia' },
  mn: { code: 'MN', nativeName: 'Монгол', englishName: 'Mongolia' },
}

// 1차 및 2차 서브메뉴 구조
interface NavItem {
  key: string
  href: string
  subItems?: { key: string; href: string }[]
}

const navMenuStructure: NavItem[] = [
  {
    key: 'convictions',
    href: '/convictions',
    subItems: [
      { key: 'god', href: '/convictions/god' },
      { key: 'jesus', href: '/convictions/jesus' },
      { key: 'spirit', href: '/convictions/spirit' },
      { key: 'church', href: '/convictions/church' },
      { key: 'peace', href: '/convictions/peace' },
      { key: 'community', href: '/convictions/community' },
      { key: 'unity', href: '/convictions/unity' },
    ],
  },
  {
    key: 'history',
    href: '/history',
    subItems: [
      { key: 'history', href: '/history' },
      { key: 'church_intro', href: '/history#churches' },
      { key: 'photo', href: '/history#photos' },
    ],
  },
  {
    key: 'women_peace',
    href: '/women-peace',
    subItems: [
      { key: 'events', href: '/women-peace#events' },
      { key: 'herstory', href: '/women-peace#stories' },
    ],
  },
  {
    key: 'network',
    href: '/network',
    subItems: [
      { key: 'calendar', href: '/network/schedule' },
      { key: 'leaders', href: '/network#coordinators' },
      { key: 'associations', href: '/network#partners' },
      { key: 'conference', href: '/network/conference' },
    ],
  },
  {
    key: 'community',
    href: '/community',
    subItems: [
      { key: 'announce', href: '/community/announce' },
      { key: 'resources', href: '/community/resources' },
      { key: 'prayer_wall', href: '/community/prayer' },
      { key: 'photo', href: '/community/photos' },
    ],
  },
]

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({})

  // 전역 회원 등급 및 로그인 유저 정보
  const [currentLevel, setCurrentLevel] = useState<MemberLevel>(0)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [mounted, setMounted] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  // 🌐 로그인 전 위치 정보(브라우저 언어 및 타임존)를 이용한 국가/언어 자동 기본값 설정
  useEffect(() => {
    if (typeof window === 'undefined') return
    const user = getStoredUser()
    const userSelected = localStorage.getItem('aamen_locale_user_selected')
    if (user || userSelected) return

    try {
      // 1. 브라우저 지원 언어 탐지
      const browserLangs = navigator.languages || [navigator.language]
      let detected: Locale | null = null

      for (const lang of browserLangs) {
        const l = lang.toLowerCase()
        if (l.startsWith('ko')) { detected = 'ko'; break }
        if (l.startsWith('ja')) { detected = 'ja'; break }
        if (l.startsWith('zh-tw') || l.startsWith('zh-hk')) { detected = 'zh-TW'; break }
        if (l.startsWith('vi')) { detected = 'vi'; break }
        if (l.startsWith('id')) { detected = 'id'; break }
        if (l.startsWith('th')) { detected = 'th'; break }
        if (l.startsWith('my')) { detected = 'my'; break }
        if (l.startsWith('ne')) { detected = 'ne'; break }
        if (l.startsWith('hi')) { detected = 'hi'; break }
        if (l.startsWith('km')) { detected = 'km'; break }
        if (l.startsWith('lo')) { detected = 'lo'; break }
        if (l.startsWith('mn')) { detected = 'mn'; break }
        if (l.startsWith('en')) { detected = 'en'; break }
      }

      // 2. 타임존 기반 위치 추론
      if (!detected) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        if (tz === 'Asia/Seoul') detected = 'ko'
        else if (tz === 'Asia/Tokyo') detected = 'ja'
        else if (tz === 'Asia/Taipei') detected = 'zh-TW'
        else if (tz === 'Asia/Bangkok') detected = 'th'
        else if (tz.includes('Ho_Chi_Minh') || tz.includes('Saigon')) detected = 'vi'
        else if (tz.includes('Jakarta') || tz.includes('Makassar') || tz.includes('Jayapura')) detected = 'id'
        else if (tz.includes('Yangon') || tz.includes('Rangoon')) detected = 'my'
        else if (tz === 'Asia/Kathmandu') detected = 'ne'
        else if (tz.includes('Kolkata') || tz.includes('Calcutta')) detected = 'hi'
        else if (tz === 'Asia/Phnom_Penh') detected = 'km'
        else if (tz === 'Asia/Vientiane') detected = 'lo'
        else if (tz.includes('Ulaanbaatar') || tz.includes('Hovd')) detected = 'mn'
        else if (tz.startsWith('America/')) detected = 'en'
      }

      if (detected && detected !== locale) {
        document.cookie = `NEXT_LOCALE=${detected}; path=/; max-age=31536000; SameSite=Lax`
        const cleanTarget = pathname.replace(/^\/(ko|en|ja|zh-TW|mn|vi|id|ne|th|lo|my|hi|km)/, '') || '/'
        router.push(`/${detected}${cleanTarget.startsWith('/') ? cleanTarget : `/${cleanTarget}`}`)
      }
    } catch (e) {
      // ignore
    }
  }, [locale, pathname, router])

  useEffect(() => {
    setMounted(true)
    setCurrentLevel(getStoredTierLevel())
    setCurrentUser(getStoredUser())

    const handleTierChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ level: MemberLevel }>
      if (customEvent.detail && customEvent.detail.level !== undefined) {
        setCurrentLevel(customEvent.detail.level)
      } else {
        setCurrentLevel(getStoredTierLevel())
      }
      setCurrentUser(getStoredUser())
    }

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ user: AuthUser | null }>
      if (customEvent.detail) {
        setCurrentUser(customEvent.detail.user)
      } else {
        setCurrentUser(getStoredUser())
      }
      setCurrentLevel(getStoredTierLevel())
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === TIER_STORAGE_KEY || e.key === 'aamen_auth_role' || e.key === 'aamen_current_user') {
        setCurrentLevel(getStoredTierLevel())
        setCurrentUser(getStoredUser())
      }
    }

    window.addEventListener(TIER_EVENT_NAME, handleTierChange)
    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(TIER_EVENT_NAME, handleTierChange)
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 상대 경로 추출
  const basePath = pathname.replace(/^\/(ko|en|ja|zh-TW|mn|vi|id|ne|th|lo|my|hi|km)/, '') || '/'

  const localePath = (loc: string, pathOverride?: string) => {
    const target = pathOverride || basePath
    const cleanTarget = target.startsWith('/') ? target : `/${target}`
    return `/${loc}${cleanTarget}`
  }

  const toggleMobileSubmenu = (key: string) => {
    setMobileExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href={localePath(locale, '/')} className="flex items-center gap-2.5 shrink-0 group py-1" aria-label="AAMEN Home">
          <Image
            src="/logo.png"
            alt="AAMEN"
            width={150}
            height={45}
            className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </Link>

        {/* 데스크톱 네비게이션 (2차 서브메뉴 지원) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navMenuStructure.map((item) => {
            const hasSub = item.subItems && item.subItems.length > 0
            const isHovered = activeSubmenu === item.key

            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => setActiveSubmenu(item.key)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  href={localePath(locale, item.href)}
                  className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isHovered
                      ? 'text-emerald-600 bg-emerald-50/80'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50'
                  }`}
                >
                  <span>{t(item.key as any)}</span>
                  {hasSub && (
                    <ChevronDown
                      size={13}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isHovered ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  )}
                </Link>

                {/* 2차 서브메뉴 드롭다운 (호버 시 표시) */}
                {hasSub && isHovered && (
                  <div className="absolute top-full left-0 w-52 pt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl py-1.5 overflow-hidden">
                      {item.subItems!.map((sub) => (
                        <Link
                          key={sub.key}
                          href={localePath(locale, sub.href)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/80 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2.5 opacity-60" />
                          <span>{t(`sub.${sub.key}` as any)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* 오른쪽: 언어 선택 + 로그인 */}
        <div className="flex items-center gap-2">
          {/* 국가/언어 선택 (13개 참여국: 각 국가의 언어로 국가명 | 영어 표기 | 이니셜) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-800 hover:text-emerald-700 border border-gray-200 rounded-full hover:border-emerald-300 transition-all bg-gray-50/70 cursor-pointer shadow-2xs"
              aria-label="Select Country"
            >
              <span>{countryInfos[locale]?.nativeName || '대한민국'}</span>
              <span className="text-[11px] font-mono font-bold text-emerald-700">
                ({countryInfos[locale]?.code || 'KR'})
              </span>
              <ChevronDown size={13} className={`transition-transform duration-200 text-gray-500 ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (() => {
              const sortedLocales = [...locales].sort((a, b) =>
                countryInfos[a].code.localeCompare(countryInfos[b].code)
              )

              return (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-2xl border border-gray-100 shadow-2xl p-1.5 z-50 max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 space-y-0.5">
                  {sortedLocales.map((loc) => {
                    const item = countryInfos[loc]
                    const isCurrent = loc === locale

                    return (
                      <Link
                        key={loc}
                        href={localePath(loc)}
                        onClick={() => {
                          localStorage.setItem('aamen_locale_user_selected', 'true')
                          document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=31536000; SameSite=Lax`
                          setLangOpen(false)
                        }}
                        className={`flex items-center justify-between px-3.5 py-2 text-xs rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-emerald-600 text-white font-bold shadow-xs'
                            : 'text-gray-800 hover:bg-emerald-50/80'
                        }`}
                      >
                        {/* 왼쪽: 각 국가의 언어로 국가명 | 영어 표기 */}
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-extrabold text-xs shrink-0">
                            {item.nativeName}
                          </span>
                          <span
                            className={`text-[11px] truncate ${
                              isCurrent ? 'text-emerald-100' : 'text-gray-400'
                            }`}
                          >
                            {item.englishName}
                          </span>
                        </div>

                        {/* 오른쪽: 국가 이니셜 */}
                        <span
                          className={`text-[11px] font-mono font-bold shrink-0 ml-3 px-1.5 py-0.5 rounded ${
                            isCurrent
                              ? 'bg-emerald-700/80 text-white'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {item.code}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )
            })()}
          </div>

          {/* 관리자/개발자 콘솔 바로가기 (4~5단계 또는 developer/super_admin에게 강조) */}
          {currentLevel >= 4 || currentUser?.role === 'developer' ? (
            <Link
              href={localePath(locale, '/admin')}
              title={currentUser?.role === 'developer' ? '개발자 관리 콘솔' : '총괄 관리자 대시보드'}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-full transition-all shadow-2xs animate-in fade-in border bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
            >
              {currentUser?.role === 'developer' ? (
                <>
                  <Code size={13} className="text-purple-600" />
                  <span>{t('dev_console')}</span>
                </>
              ) : (
                <>
                  <Settings size={13} className="text-purple-600" />
                  <span>{t('admin')}</span>
                </>
              )}
            </Link>
          ) : null}

          {/* 현재 로그인 상태 및 사용자 액션 (로그인 / 마이페이지 / 로그아웃) */}
          {currentLevel === 0 && !currentUser ? (
            <Link
              href={localePath(locale, '/member/login')}
              className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-all shadow-xs hover:shadow-md"
            >
              <User size={13} />
              <span>{t('login')}</span>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <Link
                href={localePath(locale, '/member/mypage')}
                title={t('mypage')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all border shadow-2xs ${
                  currentUser?.role === 'developer'
                    ? 'text-indigo-900 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                    : currentLevel >= 4
                    ? 'text-purple-900 bg-purple-50 border-purple-200 hover:bg-purple-100'
                    : currentLevel === 1
                    ? 'text-amber-900 bg-amber-50 border-amber-200 hover:bg-amber-100'
                    : 'text-emerald-900 bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <User size={13} />
                <span>{t('mypage')}</span>
              </Link>

              {/* 로그아웃 버튼 */}
              <button
                type="button"
                onClick={() => {
                  logoutUser()
                  alert(locale === 'en' ? 'Logged out successfully.' : '로그아웃되었습니다.')
                  if (typeof window !== 'undefined' && (window.location.pathname.includes('/member/mypage') || window.location.pathname.includes('/admin'))) {
                    window.location.href = localePath(locale, '/')
                  }
                }}
                title={t('logout')}
                className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors border border-transparent hover:border-rose-100"
                aria-label="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 (아코디언 2차 메뉴 지원) */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1 shadow-lg max-h-[80vh] overflow-y-auto">
          {navMenuStructure.map((item) => {
            const hasSub = item.subItems && item.subItems.length > 0
            const isExpanded = mobileExpanded[item.key]

            return (
              <div key={item.key} className="border-b border-gray-50 last:border-b-0 pb-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={localePath(locale, item.href)}
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 py-2.5 text-sm font-semibold text-gray-800 hover:text-emerald-600"
                  >
                    {t(item.key as any)}
                  </Link>
                  {hasSub && (
                    <button
                      onClick={() => toggleMobileSubmenu(item.key)}
                      className="p-2 text-gray-400 hover:text-emerald-600"
                      aria-label="Toggle Submenu"
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-emerald-600' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {/* 모바일 2차 서브메뉴 */}
                {hasSub && isExpanded && (
                  <div className="pl-4 pb-2 pt-1 flex flex-col gap-1 bg-gray-50/60 rounded-xl mb-1">
                    {item.subItems!.map((sub) => (
                      <Link
                        key={sub.key}
                        href={localePath(locale, sub.href)}
                        onClick={() => setMobileOpen(false)}
                        className="py-1.5 text-xs font-medium text-gray-600 hover:text-emerald-600 flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span>{t(`sub.${sub.key}` as any)}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          
          <div className="pt-3 border-t border-gray-100 mt-2 flex flex-col gap-2">
            {(currentLevel >= 4 || currentUser?.role === 'developer') && (
              <Link
                href={localePath(locale, '/admin')}
                onClick={() => setMobileOpen(false)}
                className="text-center px-3 py-2 text-sm font-bold text-purple-700 bg-purple-50 rounded-xl flex items-center justify-center gap-2 border border-purple-200"
              >
                {currentUser?.role === 'developer' ? <Code size={15} /> : <Settings size={15} />}
                <span>{currentUser?.role === 'developer' ? t('dev_console') : t('admin')}</span>
              </Link>
            )}

            {(currentLevel >= 1 || currentUser) && (
              <div className="flex gap-2">
                <Link
                  href={localePath(locale, '/member/mypage')}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-3 py-2 text-sm font-bold text-emerald-800 bg-emerald-50 rounded-xl flex items-center justify-center gap-2 border border-emerald-200"
                >
                  <User size={15} />
                  <span>{t('mypage')}</span>
                </Link>

                <button
                  onClick={() => {
                    logoutUser()
                    setMobileOpen(false)
                    alert(locale === 'en' ? 'Logged out successfully.' : '로그아웃되었습니다.')
                    if (typeof window !== 'undefined' && (window.location.pathname.includes('/member/mypage') || window.location.pathname.includes('/admin'))) {
                      window.location.href = localePath(locale, '/')
                    }
                  }}
                  className="px-3 py-2 text-sm font-bold text-rose-700 bg-rose-50 rounded-xl flex items-center justify-center gap-1.5 border border-rose-200"
                >
                  <LogOut size={15} />
                  <span>{t('logout')}</span>
                </button>
              </div>
            )}

            {currentLevel === 0 && !currentUser && (
              <div className="flex gap-2">
                <Link
                  href={localePath(locale, '/member/login')}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-3 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl"
                >
                  {t('login')}
                </Link>
                <Link
                  href={localePath(locale, '/member/signup')}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-3 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
