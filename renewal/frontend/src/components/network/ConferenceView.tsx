'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Calendar,
  MapPin,
  Users,
  Globe2,
  Sparkles,
  Share2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Clock,
  Heart,
  Award,
  ChevronRight,
  X,
  Send,
} from 'lucide-react'
import {
  conferenceArchives,
  conferenceTranslations,
  type ConferenceArchive,
} from '@/data/conferenceData'

export default function ConferenceView() {
  const locale = useLocale()
  const isKo = locale === 'ko'
  const t = conferenceTranslations[locale] || conferenceTranslations.en

  // 사전 등록 모달 상태
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    country: isKo ? '대한민국' : 'South Korea',
    church: '',
    phone: '',
    attendanceType: 'onsite', // 'onsite' | 'online'
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // 등록 제출
  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    if (!regForm.name || !regForm.email) {
      alert('성명과 이메일을 입력해 주세요.')
      return
    }

    try {
      const existing = JSON.parse(localStorage.getItem('aamen_conference_registrations') || '[]')
      const newReg = {
        ...regForm,
        id: `reg_${Date.now()}`,
        submittedAt: new Date().toISOString(),
      }
      localStorage.setItem('aamen_conference_registrations', JSON.stringify([newReg, ...existing]))
    } catch (e) {
      console.error(e)
    }

    setRegisterModalOpen(false)
    showToast(
      isKo
        ? '🎉 2026 AAMEN 연합 컨퍼런스 사전 참가 신청이 접수되었습니다! 사무국에서 확인 메일을 발송해 드립니다.'
        : '🎉 Your pre-registration for the 2026 AAMEN Conference has been received!'
    )
    setRegForm({
      name: '',
      email: '',
      country: isKo ? '대한민국' : 'South Korea',
      church: '',
      phone: '',
      attendanceType: 'onsite',
    })
  }

  // WhatsApp 문의
  const handleWhatsAppInquiry = () => {
    const msg = isKo
      ? `🕊️ *[2026 AAMEN 아시아 연합 컨퍼런스 문의]*\n샬롬! 제4차 아시아 아나밥티스트 메노나이트 연합 컨퍼런스 참가 및 등록에 대해 문의드립니다.`
      : `🕊️ *[2026 AAMEN Asia Conference Inquiry]*\nShalom! I would like to inquire about registration for the 4th Asia Anabaptist Conference.`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // 구글 캘린더 등록 링크
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    '[AAMEN] 제4차 아시아 아나밥티스트 연합 컨퍼런스 (Seoul, Korea)'
  )}&dates=20261015/20261018&details=${encodeURIComponent(
    '13개국 교회 지도자, 사역자, 청년 리더십이 함께 모이는 AAMEN 공식 연례 최대 중심 행사\nhttps://aamen.net/network/conference'
  )}&location=${encodeURIComponent('서울 & 오산 아시아 평화 교육 센터, 대한민국')}&ctz=Asia/Seoul`

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      <Header />

      {/* 토스트 메시지 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* 상단 브레드크럼 */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Link href={`/${locale}`} className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <Link href={`/${locale}/network`} className="hover:text-emerald-600">Network</Link>
            <span>/</span>
            <span className="text-emerald-700 font-bold">Conference</span>
          </div>

          {/* 🌟 메인 히어로 배너 (연례 최대 중심 행사) */}
          <div className="bg-gradient-to-r from-blue-950 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-400/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300 uppercase tracking-widest mb-4 backdrop-blur-sm">
                <Sparkles size={13} className="text-emerald-400" />
                <span>{t.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight leading-tight text-white">
                {t.heroTitle}
              </h1>

              <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-8">
                {t.heroSubtitle}
              </p>

              {/* 액션 버튼 그룹 */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg hover:shadow-emerald-500/25 cursor-pointer active:scale-95"
                >
                  {t.registerBtn}
                </button>

                <a
                  href={gcalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-white/15"
                >
                  <Calendar size={14} />
                  <span>Google 캘린더에 일정 저장</span>
                </a>

                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer"
                >
                  <MessageCircle size={14} className="text-emerald-300" />
                  <span>{t.whatsappInquiryBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 🌟 1. 컨퍼런스 3대 핵심 지향점 (Pillars) */}
          <div className="space-y-4">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                Core Vision & Purpose
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                {t.pillarsTitle}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {t.pillarsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-2 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center text-xs font-bold text-emerald-600">
                    <span>AAMEN Signature Value 0{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🌟 2. 2026 차기 컨퍼런스 상세 안내 (Upcoming Assembly Box) */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
                  Next Gathering 2026
                </span>
                <h3 className="text-2xl font-black text-gray-900 mt-2">
                  {t.currentTitle}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {t.currentSubtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRegisterModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer shrink-0"
              >
                사전 등록 신청하기
              </button>
            </div>

            {/* 일정 & 장소 상세 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase">{t.details.datesLabel}</div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5">{t.details.datesValue}</div>
                  <div className="text-xs text-blue-700 font-semibold mt-1">● 현장 등록 마감: 2026년 8월 31일</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase">{t.details.venueLabel}</div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5">{t.details.venueValue}</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-1">● 인천공항 셔틀 리무진 무료 운행</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase">{t.details.attendeesLabel}</div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5">{t.details.attendeesValue}</div>
                  <div className="text-xs text-purple-700 font-semibold mt-1">● 총 13개국 200여 명 규모</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  <Globe2 size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase">{t.details.languagesLabel}</div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5">{t.details.languagesValue}</div>
                  <div className="text-xs text-amber-700 font-semibold mt-1">● 13개국 언어 교재 및 동시통역</div>
                </div>
              </div>
            </div>

            {/* 주요 프로그램 타임테이블 */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h4 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                <span>📋 3일간의 주요 프로그램 개요</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2">
                  <div className="font-black text-emerald-800 text-sm">DAY 1 (10. 15 목)</div>
                  <div className="font-bold text-gray-800">개회 총회 & 연합 찬양</div>
                  <p className="text-gray-500 leading-relaxed">
                    13개국 대표단 입장식, 기조 강연(MWC 총무), 다국어 연합 저녁 기도회
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2">
                  <div className="font-black text-sky-800 text-sm">DAY 2 (10. 16 금)</div>
                  <div className="font-bold text-gray-800">사역 포럼 & 평화 워크숍</div>
                  <p className="text-gray-500 leading-relaxed">
                    분쟁 지역 화해 사역 보고, 차세대 다문화 교육 세션, 청년 리더십 분과 모임
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2">
                  <div className="font-black text-purple-800 text-sm">DAY 3 (10. 17 토)</div>
                  <div className="font-bold text-gray-800">공동 선언 & 성찬식</div>
                  <p className="text-gray-500 leading-relaxed">
                    2026-2030 아시아 평화 선언문 채택, 13개국 연합 성찬 예배, 파송식
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 3. 역대 컨퍼런스 아카이브 (History & Archives) */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/90 shadow-sm space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                Archives
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-2">
                {t.historyTitle}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {t.historySubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {conferenceArchives.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gray-50/90 border border-gray-200/90 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${item.badgeColor}`}>
                        {item.edition} · {item.year}
                      </span>
                      <span className="text-xs text-gray-500 font-bold">
                        📍 {isKo ? item.locationKo : item.locationEn}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-gray-900 mb-1.5 leading-snug">
                      {isKo ? item.themeKo : item.themeEn}
                    </h4>

                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      {isKo ? item.descKo : item.descEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-200/70 flex items-center justify-between text-[11px] font-bold text-gray-500">
                    <span>참가 규모:</span>
                    <span className="text-gray-900">{item.participants}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 📝 사전 등록 모달 */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  Pre-Registration
                </span>
                <h3 className="font-black text-lg text-gray-900 mt-1">
                  2026 AAMEN 연합 컨퍼런스 사전 참가 신청
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRegisterModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  성명 (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="예: 홍길동 (John Doe)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    이메일 주소 *
                  </label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="example@aamen.net"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    소속 국가
                  </label>
                  <input
                    type="text"
                    value={regForm.country}
                    onChange={(e) => setRegForm({ ...regForm, country: e.target.value })}
                    placeholder="예: 대한민국 / 태국 / 미얀마"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    소속 교회 / 기관
                  </label>
                  <input
                    type="text"
                    value={regForm.church}
                    onChange={(e) => setRegForm({ ...regForm, church: e.target.value })}
                    placeholder="소속 교회 또는 선교 단체명"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    WhatsApp 전화번호
                  </label>
                  <input
                    type="text"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="+82 10 1234 5678"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  참가 형태 선택
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      regForm.attendanceType === 'onsite'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendanceType"
                      checked={regForm.attendanceType === 'onsite'}
                      onChange={() => setRegForm({ ...regForm, attendanceType: 'onsite' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs">현장 참석 (서울/오산)</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      regForm.attendanceType === 'online'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-black'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attendanceType"
                      checked={regForm.attendanceType === 'online'}
                      onChange={() => setRegForm({ ...regForm, attendanceType: 'online' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs">온라인 참가 (Zoom)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={13} />
                  <span>사전 신청 완료</span>
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
