'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Users,
  Image,
  ShieldAlert,
  Award,
  ArrowUpRight,
  CheckCircle2,
  Building2,
  Sparkles,
  Zap,
  BookOpen,
  Layers,
} from 'lucide-react'
import { Member, BannerConfig, defaultBanner, initialMembers, initialPartnerOrgs } from '@/lib/store'
import { getStoredUser, type AuthUser } from '@/lib/auth'
import { getAdminTexts } from '@/lib/adminI18n'

export default function AdminDashboardPage() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isEn = currentLocale === 'en'
  const t = getAdminTexts(currentLocale).home

  const localePath = (p: string) => `/${currentLocale}${p.startsWith('/') ? p : `/${p}`}`

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [banner, setBanner] = useState<BannerConfig>(defaultBanner)
  const [partnerCount, setPartnerCount] = useState<number>(initialPartnerOrgs.length)

  useEffect(() => {
    setCurrentUser(getStoredUser())
    try {
      const savedMembers = localStorage.getItem('aamen_members')
      if (savedMembers) setMembers(JSON.parse(savedMembers))

      const savedBanner = localStorage.getItem('aamen_banner_config')
      if (savedBanner) setBanner(JSON.parse(savedBanner))

      const savedPartners = localStorage.getItem('aamen_partner_orgs')
      if (savedPartners) {
        const parsed = JSON.parse(savedPartners)
        if (Array.isArray(parsed)) setPartnerCount(parsed.length)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // 등급별 회원 수 집계
  const countSuper = members.filter((m) => m.role === 'super_admin').length
  const countCountry = members.filter((m) => m.role === 'country_admin').length
  const countRegular = members.filter((m) => m.role === 'regular').length
  const countAssociate = members.filter((m) => m.role === 'associate').length

  const isDeveloper = currentUser?.role === 'developer'

  return (
    <div className="space-y-8">
      {/* ========================================================================= */}
      {/* 1. 환영 배너 (Hero Welcome Banner) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white/90">
              {t.welcomeBadge}
            </span>
            <span className="text-[11px] font-bold font-mono bg-emerald-400/30 border border-emerald-300/40 px-2.5 py-0.5 rounded-full text-emerald-100">
              {t.versionBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 mb-2 text-white">
            {t.welcomeTitle}
          </h1>
          <p className="text-white/80 text-sm max-w-xl leading-relaxed">
            {t.welcomeSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href={localePath('/admin/banners')}
            className="px-4 py-2.5 bg-white text-emerald-800 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-all shadow-xs"
          >
            {t.btnBanners}
          </Link>
          <Link
            href={localePath('/admin/members')}
            className="px-4 py-2.5 bg-emerald-950/40 border border-white/30 text-white font-bold rounded-xl text-xs hover:bg-emerald-950/60 transition-all"
          >
            {t.btnMembers}
          </Link>
          <Link
            href={localePath('/admin/coordinators')}
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-xs"
          >
            {t.btnCoordinators}
          </Link>
          <Link
            href={localePath('/admin/partners')}
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-xl text-xs transition-all shadow-xs"
          >
            {t.btnPartners}
          </Link>
          <Link
            href={localePath('/admin/popups')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-xs"
          >
            {t.btnPopups}
          </Link>
          {isDeveloper && (
            <Link
              href={localePath('/admin/convictions')}
              className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
            >
              <BookOpen size={13} />
              <span>{t.btnConvictions}</span>
            </Link>
          )}
          {isDeveloper && (
            <Link
              href={localePath('/admin/ai-settings')}
              className="px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-black rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>{t.btnAiSettings}</span>
            </Link>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 4대 주요 지표 카드 (4 Core Metric Cards) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase">{t.statMembersTitle}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900">{members.length}{t.statMembersUnit}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>{t.statMembersSub}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase">{t.statCoordinatorsTitle}</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Award size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-sky-700">{countCountry}{t.statCoordinatorsUnit}</div>
          <div className="text-xs text-gray-500 font-medium mt-2">{t.statCoordinatorsSub}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase">{t.statRegularAssociateTitle}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900">
            {countRegular} / {countAssociate}
          </div>
          <div className="text-xs text-amber-700 font-medium mt-2">{t.statRegularAssociateSub(countAssociate)}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase">{t.statBannerStatusTitle}</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Image size={18} />
            </div>
          </div>
          <div className="text-lg font-extrabold text-gray-900">
            {banner.type === 'gradient_text' ? t.statBannerTypeGradient : t.statBannerTypeImage}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-2">
            {t.statBannerActiveSub}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 하단 관리 섹션 프리뷰 그리드 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 랜딩 배너 관리 프리뷰 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🖼️</span>
                <h3 className="font-extrabold text-lg text-gray-900">{t.cardBannerTitle}</h3>
              </div>
              <Link
                href={localePath('/admin/banners')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>{t.cardManageBtn}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t.cardBannerDesc}
            </p>
            {/* 현재 배너 미니 미리보기 */}
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${banner.bgGradient} text-white text-left`}>
              <div className="text-[10px] font-bold uppercase opacity-80">{banner.badgeText}</div>
              <div className="font-extrabold text-sm sm:text-base mt-1 line-clamp-1">{banner.title}</div>
              <div className="text-xs opacity-90 line-clamp-1 mt-0.5">{banner.subtitle}</div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-gray-100 flex justify-end">
            <Link
              href={localePath('/admin/banners')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              {t.cardBannerAction}
            </Link>
          </div>
        </div>

        {/* 회원 등급 관리 프리뷰 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">👥</span>
                <h3 className="font-extrabold text-lg text-gray-900">{t.cardMembersTitle}</h3>
              </div>
              <Link
                href={localePath('/admin/members')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>{t.cardManageBtn}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t.cardMembersDesc}
            </p>

            {/* 회원 목록 간략 뷰 */}
            <div className="space-y-2">
              {members.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m.flag}</span>
                    <span className="font-bold text-gray-900">{m.name}</span>
                    <span className="text-gray-400 font-mono text-[11px] truncate max-w-[120px]">{m.email}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      m.role === 'super_admin'
                        ? 'bg-purple-100 text-purple-800'
                        : m.role === 'country_admin'
                        ? 'bg-sky-100 text-sky-800'
                        : m.role === 'regular'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {m.role === 'super_admin'
                      ? t.roleSuper
                      : m.role === 'country_admin'
                      ? t.roleCountry
                      : m.role === 'regular'
                      ? t.roleRegular
                      : t.roleAssociate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-gray-100 flex justify-end">
            <Link
              href={localePath('/admin/members')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              {t.cardMembersAction}
            </Link>
          </div>
        </div>

        {/* 15개국 코디네이터 관리 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌏</span>
                <h3 className="font-extrabold text-lg text-gray-900">{t.cardCoordTitle}</h3>
              </div>
              <Link
                href={localePath('/admin/coordinators')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <span>{t.cardManageBtn}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t.cardCoordDesc}
            </p>
            <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-sky-950">{t.cardCoordStatusTitle}</span>
              <span className="text-xs font-black bg-sky-600 text-white px-2.5 py-0.5 rounded-full">{t.cardCoordStatusBadge}</span>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-gray-100 flex justify-end">
            <Link
              href={localePath('/admin/coordinators')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              {t.cardCoordAction}
            </Link>
          </div>
        </div>

        {/* 글로벌 협력단체 관리 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤝</span>
                <h3 className="font-extrabold text-lg text-gray-900">{t.cardPartnersTitle}</h3>
              </div>
              <Link
                href={localePath('/admin/partners')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>{t.cardManageBtn}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t.cardPartnersDesc}
            </p>
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-blue-950">{t.cardPartnersStatusTitle}</span>
              <span className="text-xs font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-full">{t.cardPartnersStatusBadge(partnerCount)}</span>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-gray-100 flex justify-end">
            <Link
              href={localePath('/admin/partners')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              {t.cardPartnersAction}
            </Link>
          </div>
        </div>

        {/* 팝업 관리 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📢</span>
                <h3 className="font-extrabold text-lg text-gray-900">{t.cardPopupsTitle}</h3>
              </div>
              <Link
                href={localePath('/admin/popups')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <span>{t.cardManageBtn}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t.cardPopupsDesc}
            </p>
            <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950">{t.cardPopupsStatusTitle}</span>
              <span className="text-xs font-black bg-amber-600 text-white px-2.5 py-0.5 rounded-full">{t.cardPopupsStatusBadge}</span>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-gray-100 flex justify-end">
            <Link
              href={localePath('/admin/popups')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              {t.cardPopupsAction}
            </Link>
          </div>
        </div>

        {/* 개발자 전용: 7대 신념 교안 관리 카드 */}
        {isDeveloper && (
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <BookOpen size={18} />
                  </span>
                  <h3 className="font-extrabold text-lg text-gray-900">{t.cardConvictionsTitle}</h3>
                </div>
                <Link
                  href={localePath('/admin/convictions')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>{t.cardManageBtn}</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {t.cardConvictionsDesc}
              </p>
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">{t.cardConvictionsStatusTitle}</span>
                <span className="text-xs font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                  {t.cardConvictionsStatusBadge}
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-gray-100 flex justify-end">
              <Link
                href={localePath('/admin/convictions')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                {t.cardConvictionsAction}
              </Link>
            </div>
          </div>
        )}

        {/* 개발자 전용: 제미나이(Gemini) AI 엔진 관리 카드 */}
        {isDeveloper && (
          <div className="bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-white rounded-3xl p-6 border border-purple-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                    <Sparkles size={18} />
                  </span>
                  <h3 className="font-extrabold text-lg text-gray-900">{t.cardAiTitle}</h3>
                </div>
                <Link
                  href={localePath('/admin/ai-settings')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <span>{t.cardManageBtn}</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {t.cardAiDesc}
              </p>
              <div className="p-3.5 bg-white border border-purple-100 rounded-2xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
                  <Zap size={14} className="text-amber-500" />
                  <span>{t.cardAiRecommend}</span>
                </div>
                <span className="text-xs font-black bg-purple-600 text-white px-2.5 py-0.5 rounded-full">
                  {t.cardAiSupportBadge}
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-purple-100 flex justify-end">
              <Link
                href={localePath('/admin/ai-settings')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                {t.cardAiAction}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
