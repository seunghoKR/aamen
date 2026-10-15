'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Globe2,
  Users,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Share2,
  MessageCircle,
  Building,
  Mail,
  ArrowRight,
  Phone,
  Send,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import {
  initialCoordinators,
  initialPartnerOrgs,
  type CountryCoordinator,
  type PartnerOrgItem,
} from '@/lib/store'
import { networkTranslations } from '@/data/networkTranslations'

export default function NetworkView() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const t = networkTranslations[locale] || networkTranslations.en

  const [activeTab, setActiveTab] = useState<'all' | 'partners' | 'coordinators'>('all')
  const [partners, setPartners] = useState<PartnerOrgItem[]>(initialPartnerOrgs)
  const [coordinators, setCoordinators] = useState<CountryCoordinator[]>(initialCoordinators)

  // 관리자 대시보드에서 등록/수정한 협력단체 및 코디네이터 데이터 불러오기
  useEffect(() => {
    try {
      // 1. 협력단체 데이터 로드 (서버 API 우선, 로컬 캐시 폴백)
      fetch('/api/partners')
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json && json.success && Array.isArray(json.data)) {
            setPartners(json.data)
            localStorage.setItem('aamen_partner_orgs', JSON.stringify(json.data))
          }
        })
        .catch(() => {
          const savedPartners = localStorage.getItem('aamen_partner_orgs')
          if (savedPartners !== null) {
            try {
              const parsed = JSON.parse(savedPartners)
              if (Array.isArray(parsed)) {
                setPartners(parsed)
              }
            } catch (e) {}
          }
        })

      // 2. 13개국 코디네이터 데이터 로드 및 최신 영문/현지어 데이터 병합
      const savedCoords = localStorage.getItem('aamen_coordinators_data')
      if (savedCoords) {
        const parsed = JSON.parse(savedCoords)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = initialCoordinators.map((init) => {
            const saved = parsed.find((p: any) => p.countryCode === init.countryCode || p.id === init.id)
            if (!saved) return init
            return {
              ...init,
              ...saved,
              nameNative: init.nameNative,
              nameEn: init.nameEn,
              name: init.name,
              email: saved.email || init.email,
            }
          })
          setCoordinators(merged)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // 💬 WhatsApp 초청 메시지 발송 핸들러 (전화번호가 있으면 바로 전송, 없으면 입력받아 전송)
  const sendWhatsAppInvitation = (targetPhone?: string, recipientName: string = '동역자', country: string = '아시아') => {
    let phoneToSend = targetPhone ? targetPhone.replace(/[^0-9]/g, '') : ''

    if (!phoneToSend) {
      const inputPhone = prompt(
        isKo
          ? `[${recipientName} (${country})] 님께 WhatsApp 사이트 초청장을 보냅니다.\n국가번호를 포함한 전화번호를 입력하세요: (예: 821012345678, 95912345678)`
          : `Send WhatsApp invitation to [${recipientName} (${country})].\nPlease enter phone number with country code: (e.g., 821012345678)`
      )
      if (!inputPhone) return
      phoneToSend = inputPhone.replace(/[^0-9]/g, '')
    }

    const invitationMsg = isKo
      ? `🕊️ *[AAMEN 아시아 13개국 네트워크 초청]*\n\n샬롬! ${recipientName}님(${country}),\n그리스도의 비폭력 평화와 제자도의 복음을 나누는 *AAMEN (아시아 아나밥티스트 메노나이트 교육 네트워크)*에 초대합니다.\n\n📖 MWC 7대 신념 13개 언어 무료 교안 자료실\n🙏 13개국 실시간 중보기도의 벽 & 다국어 커뮤니티\n👥 아시아 13개국 지도자 연대 플랫폼\n\n👉 *AAMEN 공식 사이트 방문하기:* https://aamen.net/ko/network\n\n함께 평화의 사역에 동참해 주시기를 소망합니다!`
      : `🕊️ *[AAMEN Asia 13 Nations Network Invitation]*\n\nShalom! ${recipientName} (${country}),\nYou are warmly invited to *AAMEN (Asia Anabaptist Mennonite Education Network)*.\n\n📖 13 Languages MWC 7 Core Convictions Curriculum\n🙏 13 Nations Real-time Wall of Intercessory Prayer\n👥 Asian Leaders Fellowship & Peace Education Hub\n\n👉 *Visit AAMEN:* https://aamen.net/en/network\n\nJoin hands with us in Christ's peace!`

    window.open(`https://wa.me/${phoneToSend}?text=${encodeURIComponent(invitationMsg)}`, '_blank')
  }

  // 협력단체 공유 WhatsApp 핸들러
  const shareViaWhatsApp = (orgName: string, desc: string) => {
    const message = isKo
      ? `🕊️ *[AAMEN 글로벌 협력단체 안내]*\n🤝 *${orgName}*\n${desc}\n🔗 확인하기: https://aamen.net/ko/network`
      : `🕊️ *[AAMEN Global Partner Organization]*\n🤝 *${orgName}*\n${desc}\n🔗 Learn more: https://aamen.net/en/network`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 배너 (각 국가 고유 언어로 타이틀 및 소개 문구 표기!) */}
          <div className="bg-gradient-to-r from-blue-950 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-8 shadow-md">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
              {t.bannerBadge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
              {t.bannerTitle}
            </h1>
            <p className="text-white/85 text-sm sm:text-base max-w-2xl leading-relaxed">
              {t.bannerDesc}
            </p>

            {/* 네비게이션 탭 칩 */}
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/15">
              {[
                { id: 'all', label: t.tabs.all },
                { id: 'partners', label: t.tabs.partners },
                { id: 'coordinators', label: t.tabs.coordinators },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-sky-400 text-slate-950 shadow-md font-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {/* 📅 주요일정 별도 페이지 바로가기 버튼 */}
              <Link
                href={`/${locale}/network/schedule`}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-all flex items-center gap-1.5"
              >
                <span>{t.tabs.schedule}</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* 1. 🤝 협력단체 (제목/소개는 각 국가 언어, 박스 내용은 영어(12개국) or 한국어(ko)) */}
          {(activeTab === 'all' || activeTab === 'partners') && (
            <div id="partners" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm mb-10">
              {/* 섹션 타이틀 헤더 바 (각 국가 언어로 표기) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                    🌐
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl text-blue-950 flex items-center gap-2">
                      <span>{t.partners.title}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black">
                        {isKo ? '한국어 모드' : 'English Mode (12 Nations)'}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t.partners.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200/70 px-3 py-1.5 rounded-xl">
                    {t.partners.countBadge.replace('{count}', partners.length.toString())}
                  </span>
                </div>
              </div>

              {/* 🌟 직사각형 박스 1열에 2개씩 (grid-cols-1 lg:grid-cols-2) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {partners.map((p) => {
                  const mainName = isKo ? p.nameKo : (p.nameEn || p.nameKo)
                  const subName = isKo ? p.nameEn : p.nameKo
                  const mainDesc = isKo ? p.descKo : (p.descEn || p.descKo)
                  const subDesc = isKo ? p.descEn : p.descKo

                  return (
                    <div
                      key={p.id}
                      className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200/90 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* 메타 뱃지 라인 */}
                        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-black text-[10px]">
                            {p.category}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {isKo ? '설립' : 'Est.'}: {p.established}
                          </span>
                        </div>

                        {/* 단체명 (한국어 모드: 한국어명 / 해외 12개국 모드: 영어명) */}
                        <h4 className="font-black text-lg text-gray-900 mb-1 leading-snug">
                          {mainName}
                        </h4>
                        {subName && (
                          <p className="text-xs font-semibold text-gray-500 mb-3 font-mono">
                            {subName}
                          </p>
                        )}

                        {/* 소개 내용 */}
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2">
                          {mainDesc}
                        </p>
                        {subDesc && subDesc !== mainDesc && (
                          <p className="text-xs text-gray-500 italic mb-4">
                            {subDesc}
                          </p>
                        )}

                        <div className="text-[11px] text-gray-500 mb-4 pb-3 border-b border-gray-200/70">
                          📍 <strong>{isKo ? '본부:' : 'HQ:'}</strong> {p.headquarters}
                        </div>
                      </div>

                      {/* 하단 사이트 연결 및 WhatsApp 버튼 */}
                      <div className="flex items-center gap-2.5 pt-1">
                        <a
                          href={p.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <span>{isKo ? '공식 웹사이트 바로가기' : 'Official Website'}</span>
                          <ExternalLink size={13} />
                        </a>

                        <button
                          type="button"
                          onClick={() => shareViaWhatsApp(mainName, mainDesc)}
                          className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          <Share2 size={13} />
                          <span>{isKo ? 'WhatsApp 문의' : 'WhatsApp Contact'}</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 2. 13개국 대표 코디네이터 (제목/소개는 각 국가 언어) */}
          {(activeTab === 'all' || activeTab === 'coordinators') && (
            <div id="coordinators" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm mb-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <Users size={22} className="text-emerald-600" />
                  <div>
                    <h3 className="font-black text-xl text-gray-900">{t.coordinators.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t.coordinators.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
                    {t.coordinators.badge}
                  </span>
                </div>
              </div>

              {/* 🌟 PC 모드 1열에 4명 (국가 이니셜 알파벳 순서 정렬) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {[...coordinators]
                  .sort((a, b) => a.countryCode.localeCompare(b.countryCode))
                  .map((lead) => {
                    const flagSvg = `/images/flags/${lead.countryCode.toLowerCase()}.svg`
                    return (
                      <div
                        key={lead.id}
                        className="p-5 rounded-2xl bg-white border border-gray-200/90 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between text-center relative group"
                      >
                        <div>
                          {/* 1. 국가명 위에 선명한 국기 이미지 표시 */}
                          <div className="flex justify-center mb-2.5">
                            <div className="w-12 h-8 rounded-sm overflow-hidden shadow-2xs border border-gray-200/80 bg-gray-50 flex items-center justify-center">
                              <Image
                                src={flagSvg}
                                alt={lead.countryName}
                                width={48}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          {/* 2. 국가 이니셜 & 국가명 */}
                          <div className="text-[11px] font-bold text-gray-500 font-mono tracking-wide mb-3">
                            {lead.countryName}
                          </div>

                          {/* 3. 이름: 해당국가 언어 + 영문 표기 */}
                          <div className="mb-2">
                            <h4 className="font-black text-lg text-gray-900 tracking-tight leading-snug">
                              {lead.nameNative || lead.name}
                            </h4>
                            {lead.nameEn && (
                              <p className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider mt-0.5">
                                {lead.nameEn}
                              </p>
                            )}
                          </div>

                          {/* 4. 사역 직책 */}
                          <p className="text-xs font-semibold text-emerald-700 leading-tight mb-4">
                            {lead.role}
                          </p>
                        </div>

                        {/* 5. 이메일 (구분선과 함께 깔끔하게 표기 / 전화번호 & 초청장 전송 제거) */}
                        <div className="pt-3 border-t border-gray-100">
                          <a
                            href={`mailto:${lead.email}`}
                            className="inline-flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:text-emerald-700 font-mono transition-colors truncate max-w-full"
                            title={lead.email}
                          >
                            <Mail size={13} className="text-emerald-600 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </a>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* 3. 📅 주요일정 안내 배너 & 별도 페이지 바로가기 카드 */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-sm mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shrink-0 backdrop-blur-sm">
                📅
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  {t.schedulePage.badge}
                </span>
                <h3 className="font-black text-xl text-white mt-0.5">
                  {t.schedulePage.title}
                </h3>
                <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
                  {t.schedulePage.desc}
                </p>
              </div>
            </div>

            <Link
              href={`/${locale}/network/schedule`}
              className="px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-center"
            >
              <span>{t.tabs.schedule} 바로가기</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
