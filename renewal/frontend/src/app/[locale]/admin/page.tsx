'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Users, Image, ShieldAlert, Award, FileText, ArrowUpRight, CheckCircle2, Building2, Sparkles, Zap } from 'lucide-react'
import { Member, BannerConfig, defaultBanner, initialMembers, initialPartnerOrgs, PartnerOrgItem } from '@/lib/store'

export default function AdminDashboardPage() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const localePath = (p: string) => `/${currentLocale}${p.startsWith('/') ? p : `/${p}`}`

  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [banner, setBanner] = useState<BannerConfig>(defaultBanner)
  const [partnerCount, setPartnerCount] = useState<number>(initialPartnerOrgs.length)

  useEffect(() => {
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

  return (
    <div className="space-y-8">
      {/* 환영 배너 */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white/90">
              AAMEN Administration
            </span>
            <span className="text-[11px] font-bold font-mono bg-emerald-400/30 border border-emerald-300/40 px-2.5 py-0.5 rounded-full text-emerald-100">
              v1.2.0
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 mb-2 text-white">
            관리자님, 환영합니다! 👑
          </h1>
          <p className="text-white/80 text-sm max-w-xl">
            13개국 아시아 아나밥티스트 메노나이트 교육 네트워크의 회원 등급, 상단 배너, 그리고 공지 팝업을 실시간으로 총괄 제어할 수 있는 관리자 화면입니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href={localePath('/admin/banners')}
            className="px-4 py-2.5 bg-white text-emerald-800 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-all shadow-xs"
          >
            배너 관리
          </Link>
          <Link
            href={localePath('/admin/members')}
            className="px-4 py-2.5 bg-emerald-950/40 border border-white/30 text-white font-bold rounded-xl text-xs hover:bg-emerald-950/60 transition-all"
          >
            회원 등급 관리
          </Link>
          <Link
            href={localePath('/admin/coordinators')}
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-xs"
          >
            13개국 코디네이터 관리
          </Link>
          <Link
            href={localePath('/admin/popups')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-xs"
          >
            팝업 관리
          </Link>
          <Link
            href={localePath('/admin/ai-settings')}
            className="px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-black rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            <span>AI 엔진(Gemini) 설정</span>
          </Link>
        </div>
      </div>

      {/* 4대 주요 지표 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase">전체 회원</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900">{members.length}명</div>
          <div className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>13개국 활성 네트워크</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase">국가관리자 (Coordinators)</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Award size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-sky-700">{countCountry}명</div>
          <div className="text-xs text-gray-500 font-medium mt-2">각 국가 자료/기도 승인 권한</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase">정회원 / 준회원</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-gray-900">
            {countRegular} / {countAssociate}
          </div>
          <div className="text-xs text-amber-700 font-medium mt-2">가입 승인 대기: {countAssociate}명</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase">랜딩 상단 배너 상태</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Image size={18} />
            </div>
          </div>
          <div className="text-lg font-extrabold text-gray-900">
            {banner.type === 'gradient_text' ? '텍스트 그라디언트' : '이미지 배너'}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-2">
            ● 현재 실시간 노출 중
          </div>
        </div>
      </div>

      {/* 하단 관리 섹션 바로가기 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 랜딩 배너 관리 프리뷰 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🖼️</span>
                <h3 className="font-extrabold text-lg text-gray-900">랜딩페이지 상단 배너 관리</h3>
              </div>
              <Link
                href="/admin/banners"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>관리하기</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              방문자가 가장 먼저 보게 되는 메인 상단 배너의 타이틀, 소개 문구, 버튼 링크 및 배경 이미지/그라디언트를 즉시 변경할 수 있습니다.
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
              href="/admin/banners"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              배너 내용 및 이미지 변경
            </Link>
          </div>
        </div>

        {/* 회원 등급 관리 프리뷰 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">👥</span>
                <h3 className="font-extrabold text-lg text-gray-900">4단계 회원 등급 관리</h3>
              </div>
              <Link
                href="/admin/members"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>관리하기</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              13개국 회원을 **최고관리자, 국가관리자, 정회원, 준회원**으로 구분하여 글쓰기 권한 및 자료 다운로드 권한을 세밀하게 제어합니다.
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
                    <span className="text-gray-400 font-mono text-[11px]">{m.email}</span>
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
                      ? '최고관리자'
                      : m.role === 'country_admin'
                      ? '국가관리자'
                      : m.role === 'regular'
                      ? '정회원'
                      : '준회원'}
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
              회원 전체 목록 및 등급 변경
            </Link>
          </div>
        </div>

        {/* 13개국 코디네이터 관리 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌏</span>
                <h3 className="font-extrabold text-lg text-gray-900">13개국 대표 코디네이터 관리</h3>
              </div>
              <Link
                href={localePath('/admin/coordinators')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <span>관리하기</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              13개국 각 국가의 대표자를 회원 목록에서 직접 선택하여 임명하고, 전화번호로 WhatsApp 공식 사이트 초청장을 1초 만에 전송합니다.
            </p>
            <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-sky-950">13개국 코디네이터 현황</span>
              <span className="text-xs font-black bg-sky-600 text-white px-2.5 py-0.5 rounded-full">13개국 완비</span>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-gray-100 flex justify-end">
            <Link
              href={localePath('/admin/coordinators')}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              대표 코디네이터 및 WhatsApp 초청
            </Link>
          </div>
        </div>

        {/* 글로벌 협력단체 관리 카드 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤝</span>
                <h3 className="font-extrabold text-lg text-gray-900">글로벌 협력단체 관리</h3>
              </div>
              <Link
                href={localePath('/admin/partners')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>관리하기</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              MWC, MCC 등 글로벌 파트너 기구의 한국어/영어 정보, 웹사이트 링크를 등록하고 수정합니다. 한국어 모드에선 한국어, 12개국 모드에선 영어로 자동 분기됩니다.
            </p>
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-bold text-blue-950">등록된 공식 협력단체</span>
              <span className="text-xs font-black bg-blue-600 text-white px-2.5 py-0.5 rounded-full">{partnerCount}개 기관</span>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-gray-100 flex justify-end">
            <Link
              href={localePath('/admin/partners')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
            >
              협력단체 목록 및 신규 등록
            </Link>
          </div>
        </div>

        {/* 제미나이(Gemini) AI 엔진 관리 카드 */}
        <div className="bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-white rounded-3xl p-6 border border-purple-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Sparkles size={18} />
                </span>
                <h3 className="font-extrabold text-lg text-gray-900">제미나이(Gemini) AI 엔진 관리</h3>
              </div>
              <Link
                href={localePath('/admin/ai-settings')}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <span>관리하기</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Google Gemini 1.5 Flash API 키를 관리하고, 13개국 실시간 알림 번역 및 기도제목 변환 품질을 테스트합니다. 로컬 AI(LM Studio)와의 하이브리드 연동도 지원합니다.
            </p>
            <div className="p-3.5 bg-white border border-purple-100 rounded-2xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-950">
                <Zap size={14} className="text-amber-500" />
                <span>권장 모델: Gemini 1.5 Flash</span>
              </div>
              <span className="text-xs font-black bg-purple-600 text-white px-2.5 py-0.5 rounded-full">
                13개국어 지원
              </span>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-purple-100 flex justify-end">
            <Link
              href={localePath('/admin/ai-settings')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              API 키 및 모델 설정
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
