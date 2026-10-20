'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import {
  ShieldCheck,
  Image as ImageIcon,
  Users,
  LayoutDashboard,
  ExternalLink,
  Menu,
  X,
  Layers,
  Sparkles,
  LogOut,
  Building2,
  BookOpen,
  Globe,
} from 'lucide-react'
import { getStoredUser, logoutUser, AUTH_EVENT_NAME, type AuthUser } from '@/lib/auth'
import { getAdminTexts } from '@/lib/adminI18n'
import { getStoredTierLevel, TIER_EVENT_NAME, TIER_STORAGE_KEY } from '@/components/common/GlobalTierSimulator'
import { MemberLevel } from '@/lib/store'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isEn = currentLocale === 'en'
  const t = getAdminTexts(currentLocale).layout

  const localePath = (p: string) => `/${currentLocale}${p.startsWith('/') ? p : `/${p}`}`

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [currentLevel, setCurrentLevel] = useState<MemberLevel>(5)

  useEffect(() => {
    setCurrentUser(getStoredUser())
    setCurrentLevel(getStoredTierLevel())

    const handleAuth = (e: Event) => {
      const customEvent = e as CustomEvent<{ user: AuthUser | null }>
      if (customEvent.detail) setCurrentUser(customEvent.detail.user)
      else setCurrentUser(getStoredUser())
      setCurrentLevel(getStoredTierLevel())
    }

    const handleTier = (e: Event) => {
      const customEvent = e as CustomEvent<{ level: MemberLevel }>
      if (customEvent.detail && typeof customEvent.detail.level === 'number') {
        setCurrentLevel(customEvent.detail.level)
      } else {
        setCurrentLevel(getStoredTierLevel())
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === TIER_STORAGE_KEY || e.key === 'aamen_current_user') {
        setCurrentLevel(getStoredTierLevel())
        setCurrentUser(getStoredUser())
      }
    }

    window.addEventListener(AUTH_EVENT_NAME, handleAuth)
    window.addEventListener(TIER_EVENT_NAME, handleTier)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuth)
      window.removeEventListener(TIER_EVENT_NAME, handleTier)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  // 상대 경로 추출
  const basePath = pathname.replace(/^\/(ko|en|ja|zh-TW|mn|vi|id|ne|th|lo|my|hi|km)/, '') || '/'
  const targetPathKo = `/ko${basePath.startsWith('/') ? basePath : `/${basePath}`}`
  const targetPathEn = `/en${basePath.startsWith('/') ? basePath : `/${basePath}`}`

  // 6단계(개발자)일 때만 개발자 전용 메뉴(7대 신념 교안 관리, 제미나이 AI 엔진 관리) 표시!
  // 5단계(사이트 관리자)는 사이트 운영 메뉴만 관리하며 개발자 메뉴는 숨겨집니다.
  const isDeveloper = currentLevel >= 6

  // 최상단 공통 메뉴 (대시보드 홈)
  const topMenuItem = {
    title: t.homeTitle,
    href: '/admin',
    icon: LayoutDashboard,
    badge: t.overviewBadge,
    badgeColor: 'bg-emerald-500/20 text-emerald-300',
  }

  // 1) 운영 관리자 메뉴 (v 표시 항목)
  const adminMenuItems = [
    {
      title: t.menuBanners,
      href: '/admin/banners',
      icon: ImageIcon,
      badge: t.menuBannersBadge,
      badgeColor: 'bg-teal-500/20 text-teal-300',
    },
    {
      title: t.menuMembers,
      href: '/admin/members',
      icon: Users,
      badge: t.menuMembersBadge,
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
    {
      title: t.menuCoordinators,
      href: '/admin/coordinators',
      icon: Users,
      badge: t.menuCoordinatorsBadge,
      badgeColor: 'bg-sky-500/20 text-sky-300',
    },
    {
      title: t.menuPartners,
      href: '/admin/partners',
      icon: Building2,
      badge: t.menuPartnersBadge,
      badgeColor: 'bg-blue-500/20 text-blue-300',
    },
    {
      title: t.menuPopups,
      href: '/admin/popups',
      icon: Layers,
      badge: t.menuPopupsBadge,
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    {
      title: isEn ? 'Site Manual' : '사이트 운영 설명서',
      href: '/admin/manual',
      icon: BookOpen,
      badge: isEn ? 'Guide' : '필독',
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
  ]

  // 2) 개발자 전용 메뉴 (o 표시 항목: 오직 개발자에게만 노출)
  const developerMenuItems = [
    {
      title: t.menuConvictions,
      href: '/admin/convictions',
      icon: BookOpen,
      badge: t.menuConvictionsBadge,
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      title: t.menuAiSettings,
      href: '/admin/ai-settings',
      icon: Sparkles,
      badge: t.menuAiSettingsBadge,
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
  ]

  const isExactActive = (href: string) => {
    if (href === '/admin') {
      return basePath === '/admin' || basePath === '/admin/'
    }
    return basePath.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col lg:flex-row">
      {/* ========================================================================= */}
      {/* 1. 모바일 상단 바 (작은 화면용) */}
      {/* ========================================================================= */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="font-black text-sm text-white">{t.adminConsole}</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 모바일 언어 전환 스위처 */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-bold">
            <Link
              href={targetPathKo}
              className={`px-2 py-1 rounded-md transition-colors ${
                !isEn ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              KO
            </Link>
            <Link
              href={targetPathEn}
              className={`px-2 py-1 rounded-md transition-colors ${
                isEn ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </Link>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white"
            aria-label="Toggle Admin Menu"
          >
            {mobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 좌측 사이드바 메뉴 (Left Sidebar) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-white flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto">
          {/* 사이드바 헤더 & 언어 전환기 & 관리자 프로필 */}
          <div className="p-5 border-b border-slate-800/80 space-y-4">
            {/* 브랜드 헤더 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20 shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="font-black text-base tracking-tight text-white leading-snug">
                  {t.brandTitle}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-semibold text-slate-400">
                    {t.serverBadge}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    {t.versionBadge}
                  </span>
                </div>
              </div>
            </div>

            {/* 언어 전환 세그먼트 버튼 (KO | EN Switcher) */}
            <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800/90 flex items-center shadow-inner">
              <Link
                href={targetPathKo}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-black transition-all ${
                  !isEn
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title="한국어 모드로 전환"
              >
                <span>🇰🇷</span>
                <span>한국어</span>
              </Link>
              <Link
                href={targetPathEn}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-black transition-all ${
                  isEn
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title="Switch to English mode"
              >
                <span>🌐</span>
                <span>English</span>
              </Link>
            </div>

            {/* 로그인된 관리자 안내 카드 */}
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>
                    {currentUser?.role === 'developer'
                      ? t.adminRoleDev
                      : currentUser?.name || t.adminRoleSuper}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                      currentUser?.role === 'developer'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {currentUser?.role === 'developer' ? 'DEV' : 'Super'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]">
                  {currentUser?.email || 'gimac1424@gmail.com'}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={localePath('/')}
                  target="_blank"
                  title={t.openSiteTooltip}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logoutUser()
                    alert(t.logoutConfirm)
                    window.location.href = localePath('/')
                  }}
                  title={t.logoutTooltip}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 사이드바 네비게이션 목록 */}
          <nav className="p-4 space-y-6">
            {/* 1) 최상단: 대시보드 홈 (모든 관리자 공통) */}
            <div>
              <Link
                href={localePath(topMenuItem.href)}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all group ${
                  isExactActive(topMenuItem.href)
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800/80 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard
                    size={17}
                    className={
                      isExactActive(topMenuItem.href)
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-emerald-400'
                    }
                  />
                  <span>{topMenuItem.title}</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isExactActive(topMenuItem.href)
                      ? 'bg-white/20 text-white'
                      : topMenuItem.badgeColor
                  }`}
                >
                  {topMenuItem.badge}
                </span>
              </Link>
            </div>

            {/* 2) 운영 관리자 메뉴 (v 표시 항목) */}
            <div>
              <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <span>{t.sectionAdmin}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                  {t.sectionAdminBadge}
                </span>
              </div>
              <div className="space-y-1">
                {adminMenuItems.map((item) => {
                  const active = isExactActive(item.href)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={localePath(item.href)}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all group ${
                        active
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-black'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          size={17}
                          className={active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}
                        />
                        <span>{item.title}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          active ? 'bg-white/20 text-white' : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* 3) 개발자 전용 메뉴 (o 표시 항목: 오직 role === 'developer' 일 때만 표시!) */}
            {isDeveloper && (
              <div>
                <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-indigo-400">
                  <span>{t.sectionDev}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                    {t.sectionDevBadge}
                  </span>
                </div>
                <div className="space-y-1">
                  {developerMenuItems.map((item) => {
                    const active = isExactActive(item.href)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={localePath(item.href)}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all group ${
                          active
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black'
                            : 'text-slate-300 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            size={17}
                            className={active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}
                          />
                          <span>{item.title}</span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            active ? 'bg-white/20 text-white' : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* 사이드바 하단: 웹사이트 바로가기 및 버전 정보 */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 space-y-2 shrink-0">
          <Link
            href={localePath('/')}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-800"
          >
            <span>🏠</span>
            <span>{t.backToSite}</span>
          </Link>
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
            <span>{t.footerSub}</span>
            <span className="font-mono text-emerald-400 font-bold">{t.versionBadge}</span>
          </div>
        </div>
      </aside>

      {/* 모바일 사이드바 열림 시 오버레이 배경 */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-xs"
        />
      )}

      {/* ========================================================================= */}
      {/* 3. 우측 메인 콘텐츠 영역 (Right Content Area) */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-[1400px]">
        {(basePath.startsWith('/admin/convictions') || basePath.startsWith('/admin/ai-settings')) && !isDeveloper ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-5 text-3xl">
              🛠️
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
              {isEn ? 'Developer Only Access' : '개발자(6단계) 전용 관리 페이지'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {isEn
                ? 'This section (7 Convictions Curriculum / Gemini AI Engine) is reserved exclusively for Level 6 Developers. Site Administrators (Level 5) manage operational items.'
                : '이 메뉴(7대 신념 교안 관리 및 제미나이 AI 엔진 관리)는 시스템 최고 권한인 [6단계: 개발자] 전용 영역입니다. 5단계 사이트 관리자는 배너, 회원, 코디네이터, 협력단체, 팝업 등 운영 항목을 관리합니다.'}
            </p>
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl mb-6 text-xs text-indigo-950 font-bold">
              💡 {isEn ? 'To test this page, switch to "Level 6: Developer" in the floating Permission Simulator.' : '해당 메뉴를 테스트하시려면 화면의 권한 테스트 시뮬레이터에서 [6단계: 개발자]를 선택해 주세요.'}
            </div>
            <Link
              href={localePath('/admin')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <span>←</span>
              <span>{isEn ? 'Return to Dashboard' : '대시보드로 돌아가기'}</span>
            </Link>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
