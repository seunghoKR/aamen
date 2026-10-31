'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HistoryPhotoBoard from '@/components/history/HistoryPhotoBoard'
import {
  History,
  Church,
  Calendar,
  MapPin,
  Sparkles,
  BookOpen,
  Users,
  Compass,
  FileText,
  ExternalLink,
  Layers,
  ArrowRight,
  Globe,
  CheckCircle2,
} from 'lucide-react'
import {
  nationOrderedLocales,
  localeNames,
  localeFlags,
  localeCountryNames,
  Locale,
} from '@/config/locales'
import { getHistoryData, HistoryLocaleData } from '@/data/historyData'

const churchProfiles = [
  { name: '한국 메노나이트 교회 연합', country: '대한민국', flag: '🇰🇷', desc: '화해와 평화제자도를 삶의 현장에서 실천하는 공동체' },
  { name: '미얀마 메노나이트 교회 협의회', country: '미얀마', flag: '🇲🇲', desc: '고난 속에서도 복음과 사랑의 섬김을 이어가는 믿음의 증인' },
  { name: '베트남 복음주의 메노나이트 교회', country: '베트남', flag: '🇻🇳', desc: '청년 세대를 중심으로 부흥하는 활력 넘치는 복음 공동체' },
  { name: '태국 평화 아나밥티스트 펠로우십', country: '태국', flag: '🇹🇭', desc: '지역 사회 섬김과 아동 교육에 헌신하는 따뜻한 교회' },
  { name: '인도네시아 게키(GKMI) & 기타스(GITJ)', country: '인도네시아', flag: '🇮🇩', desc: '100년 이상의 역사를 지닌 아시아 최대 규모의 메노나이트 교단' },
  { name: '인도 비하르 & 차티스가르 메노나이트 연합', country: '인도', flag: '🇮🇳', desc: '가난한 이웃과 소외 계층을 섬기며 그리스도의 평화를 전파하는 교회' },
]

interface HistoryViewProps {
  initialTab?: 'all' | 'history' | 'churches' | 'photos'
  initialLocale?: string
}

export default function HistoryView({
  initialTab = 'all',
  initialLocale = 'ko',
}: HistoryViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'history' | 'churches' | 'photos'>(initialTab)
  const [currentLocale, setCurrentLocale] = useState<string>(initialLocale || 'ko')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      if (hash === '#photos' || tabParam === 'photos') {
        setActiveTab('photos')
      } else if (hash === '#history' || tabParam === 'history') {
        setActiveTab('history')
      } else if (hash === '#churches' || tabParam === 'churches') {
        setActiveTab('churches')
      }
    }
  }, [])

  // Sync if initialLocale changes
  useEffect(() => {
    if (initialLocale) {
      setCurrentLocale(initialLocale)
    }
  }, [initialLocale])

  const historyData: HistoryLocaleData = getHistoryData(currentLocale)

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* 상단 메인 헤더 배너 */}
          <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-8 shadow-xl shadow-teal-950/15 relative overflow-hidden">
            {/* 은은한 배경 데코 */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-60 h-60 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <span className="inline-block px-3.5 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm border border-white/20">
                  {historyData.badge || 'Heritage & Fellowship'}
                </span>

                {/* 원문 PDF 바로보기 버튼 */}
                <a
                  href="/history.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-white border border-emerald-400/40 text-xs font-bold transition-all shadow-sm group"
                >
                  <FileText size={14} className="group-hover:scale-110 transition-transform" />
                  <span>{historyData.readPdfLabel || '원문 PDF 보기'}</span>
                  <ExternalLink size={12} className="opacity-70" />
                </a>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 tracking-tight text-white">
                {historyData.mainTitle}
              </h1>
              <p className="text-white/85 text-sm sm:text-base max-w-2xl leading-relaxed">
                {historyData.subtitle}
              </p>

              {/* 네비게이션 탭 칩 */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/15">
                {[
                  { id: 'all', label: '전체 보기 (All)' },
                  { id: 'history', label: '📜 AAMEN 역사 & 타임라인' },
                  { id: 'churches', label: '⛪ 15개국 교회 소개' },
                  { id: 'photos', label: '📷 역사와 교회 사진첩' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-emerald-400 text-slate-950 shadow-md font-black ring-2 ring-emerald-300'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 1. 📜 AAMEN 역사 및 타임라인 섹션 */}
          {(activeTab === 'all' || activeTab === 'history') && (
            <div id="history" className="space-y-8 mb-12 scroll-mt-24">
              {/* 🌍 15개국 모국어 번역 퀵 셀렉터 툴바 */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                      15개국 모국어 번역 선택 (Select 15-Nation Language)
                    </span>
                  </div>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200/60 self-start sm:self-auto">
                    현재 언어: {localeNames[currentLocale as Locale] || currentLocale}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {nationOrderedLocales.map((loc) => {
                    const isSelected = currentLocale === loc
                    return (
                      <button
                        key={loc}
                        onClick={() => setCurrentLocale(loc)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500 scale-105'
                            : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200'
                        }`}
                      >
                        <span className="text-base">{localeFlags[loc]}</span>
                        <span>{localeCountryNames[loc]}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 📖 서사 스토리 카드 1: 필요를 인식하다 (Recognizing the Need) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                    {historyData.sections.need.badge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-5 flex items-center gap-2.5">
                  <Compass className="w-7 h-7 text-emerald-600 shrink-0" />
                  <span>{historyData.sections.need.title}</span>
                </h3>

                <div className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
                  {historyData.sections.need.paragraphs.map((p, idx) => (
                    <p key={idx} className="bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* 📖 서사 스토리 카드 2: 초기의 논의 (Early Conversations) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-full text-xs font-bold">
                    {historyData.sections.early.badge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 flex items-center gap-2.5">
                  <BookOpen className="w-7 h-7 text-sky-600 shrink-0" />
                  <span>{historyData.sections.early.title}</span>
                </h3>

                <p className="text-gray-600 text-sm sm:text-base italic mb-6 border-l-4 border-sky-400 pl-4 py-1">
                  "{historyData.sections.early.lead}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {historyData.sections.early.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-sky-50/40 border border-sky-100/80 flex flex-col justify-between hover:border-sky-300 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 font-mono font-bold text-xs">
                            {item.date}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                            <MapPin size={12} className="text-sky-600" />
                            {item.place}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-2 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 📖 서사 스토리 카드 3: 비전을 새롭게 하다 & 3대 태스크포스 (Renewing the Vision) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                    {historyData.sections.renewing.badge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
                  <Sparkles className="w-7 h-7 text-emerald-600 shrink-0" />
                  <span>{historyData.sections.renewing.title}</span>
                </h3>

                <div className="space-y-3 text-gray-700 leading-relaxed text-sm sm:text-base mb-6">
                  {historyData.sections.renewing.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* 3대 태스크포스 소개 그리드 */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-base text-gray-900 mb-4 flex items-center gap-2">
                    <Layers size={18} className="text-emerald-600" />
                    <span>{historyData.sections.renewing.taskForcesIntro}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {historyData.sections.renewing.taskForces.map((tf) => (
                      <div
                        key={tf.num}
                        className="p-5 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-200/80 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
                              0{tf.num}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                              {tf.nameEn}
                            </span>
                          </div>
                          <h5 className="font-bold text-base text-gray-900 mb-2">{tf.name}</h5>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{tf.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 📖 서사 스토리 카드 4: 첫 AAMEN 게더링 (The First AAMEN Gathering) */}
              <div className="bg-gradient-to-br from-teal-50/80 via-emerald-50/50 to-white rounded-3xl p-6 sm:p-8 border border-teal-200/80 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 border border-teal-300 rounded-full text-xs font-bold">
                    {historyData.sections.gathering.badge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
                  <Users className="w-7 h-7 text-teal-700 shrink-0" />
                  <span>{historyData.sections.gathering.title}</span>
                </h3>

                <div className="space-y-3 text-gray-800 leading-relaxed text-sm sm:text-base">
                  {historyData.sections.gathering.paragraphs.map((p, idx) => (
                    <p key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* 🗓️ 5. AAMEN 공식 연표 (Historical Timeline) */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 font-black text-xl sm:text-2xl text-gray-900">
                    <History size={26} className="text-emerald-600" />
                    <span>{historyData.timeline.title}</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold self-start sm:self-auto">
                    {historyData.timeline.badge}
                  </span>
                </div>

                {/* 반응형 타임라인 리스트 */}
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-200">
                  {historyData.timeline.items.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-8 group">
                      <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white shadow-xs group-hover:scale-125 group-hover:bg-emerald-500 transition-all" />
                      <div className="flex-1 bg-gray-50/70 hover:bg-emerald-50/40 p-4 sm:p-5 rounded-2xl border border-gray-200/70 hover:border-emerald-300 transition-all">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <span className="inline-block px-3 py-0.5 rounded-lg bg-emerald-600 text-white font-mono text-xs font-extrabold shadow-xs">
                            {item.date}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-white px-2.5 py-0.5 rounded-md border border-gray-200">
                            <MapPin size={12} className="text-emerald-600" />
                            {item.place}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-medium">
                          {item.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ⛪ 15개국 교회 소개 섹션 */}
          {(activeTab === 'all' || activeTab === 'churches') && (
            <div id="churches" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm mb-10">
              <div className="flex items-center gap-2 mb-6 font-black text-xl text-gray-900">
                <Church size={22} className="text-emerald-600" />
                <span>함께하는 15개국 교회 소개 (Churches)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {churchProfiles.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <h5 className="font-bold text-sm text-gray-900">{c.name}</h5>
                          <span className="text-[11px] text-gray-400">{c.country}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mt-2">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 📷 역사와 교회 사진첩 (독립된 전용 게시판: board_type='history_photos') */}
          {(activeTab === 'all' || activeTab === 'photos') && (
            <HistoryPhotoBoard />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
