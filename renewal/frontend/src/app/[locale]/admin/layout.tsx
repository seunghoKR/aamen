'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import {
  ShieldCheck,
  Image as ImageIcon,
  Users,
  LayoutDashboard,
  MessageSquare,
  Camera,
  ExternalLink,
  Menu,
  X,
  Layers,
  ChevronRight,
  Database,
  Sparkles,
  LogOut,
  Building2,
} from 'lucide-react'
import { useEffect } from 'react'
import { getStoredUser, logoutUser, AUTH_EVENT_NAME, type AuthUser } from '@/lib/auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const localePath = (p: string) => `/${currentLocale}${p.startsWith('/') ? p : `/${p}`}`

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    setCurrentUser(getStoredUser())
    const handleAuth = (e: Event) => {
      const customEvent = e as CustomEvent<{ user: AuthUser | null }>
      if (customEvent.detail) setCurrentUser(customEvent.detail.user)
      else setCurrentUser(getStoredUser())
    }
    window.addEventListener(AUTH_EVENT_NAME, handleAuth)
    return () => window.removeEventListener(AUTH_EVENT_NAME, handleAuth)
  }, [])

  // 상대 경로 추출
  const basePath = pathname.replace(/^\/(ko|en|ja|zh-TW|mn|vi|id|ne|th|lo|my|hi|km)/, '') || '/'

  const navMenuItems = [
    {
      title: '대시보드 홈',
      href: '/admin',
      icon: LayoutDashboard,
      badge: 'Overview',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      title: '배너 관리',
      href: '/admin/banners',
      icon: ImageIcon,
      badge: '5슬롯 슬라이더',
      badgeColor: 'bg-teal-500/20 text-teal-300',
    },
    {
      title: '회원 관리',
      href: '/admin/members',
      icon: Users,
      badge: '등급/승인',
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
    {
      title: '13개국 코디네이터',
      href: '/admin/coordinators',
      icon: Users,
      badge: '대표/초청',
      badgeColor: 'bg-sky-500/20 text-sky-300',
    },
    {
      title: '글로벌 협력단체',
      href: '/admin/partners',
      icon: Building2,
      badge: '기관/한·영',
      badgeColor: 'bg-blue-500/20 text-blue-300',
    },
    {
      title: '팝업 관리',
      href: '/admin/popups',
      icon: Layers,
      badge: '공지 모달',
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    {
      title: 'AI 엔진 설정',
      href: '/admin/ai-settings',
      icon: Sparkles,
      badge: 'Gemini AI',
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
  ]

  const quickLinks = [
    {
      title: '열린 나눔터 게시판',
      href: '/community/board',
      icon: MessageSquare,
    },
    {
      title: '사진첩 바로가기',
      href: '/history/photos',
      icon: Camera,
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
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="font-black text-sm text-white">AAMEN 관리자 콘솔</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              Admin
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
          aria-label="Toggle Admin Menu"
        >
          {mobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. 좌측 사이드바 메뉴 (Left Sidebar) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-white flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* 사이드바 헤더 & 관리자 프로필 */}
          <div className="p-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2 className="font-black text-base tracking-tight text-white leading-snug">
                  AAMEN 통합 관리자
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-semibold text-slate-400">
                    MariaDB & PHP 8.4
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    v1.2.0
                  </span>
                </div>
              </div>
            </div>

            {/* 로그인된 관리자 안내 카드 */}
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>
                    {currentUser?.role === 'developer'
                      ? '개발자 관리자'
                      : currentUser?.name || '배용하 관리자'}
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
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {currentUser?.email || 'gimac1424@gmail.com'}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={localePath('/')}
                  target="_blank"
                  title="새 탭에서 사이트 홈 열기"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logoutUser()
                    alert('로그아웃되었습니다.')
                    window.location.href = localePath('/')
                  }}
                  title="관리자 로그아웃"
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 사이드바 네비게이션 목록 */}
          <nav className="p-4 space-y-6 overflow-y-auto">
            {/* 1) 핵심 관리 메뉴 */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                운영 및 시스템 설정
              </div>
              <div className="space-y-1">
                {navMenuItems.map((item) => {
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

            {/* 2) 콘텐츠 바로가기 */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                콘텐츠 및 바로가기
              </div>
              <div className="space-y-1">
                {quickLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={localePath(item.href)}
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={15} className="text-slate-500" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight size={13} className="text-slate-600" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* 사이드바 하단: 웹사이트 바로가기 및 버전 정보 */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 space-y-2">
          <Link
            href={localePath('/')}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-800"
          >
            <span>🏠</span>
            <span>사용자 웹사이트 바로가기</span>
          </Link>
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
            <span>AAMEN Global 2.0</span>
            <span className="font-mono text-emerald-400 font-bold">Release v1.2.0</span>
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
        {children}
      </main>
    </div>
  )
}
