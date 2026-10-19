'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  History,
  Church,
  Camera,
  Calendar,
  MapPin,
  Users,
  Share2,
  X,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

const historyMilestones = [
  {
    year: '2015',
    title: '아시아 평화 교육 네트워크 태동',
    desc: '아시아 각국의 메노나이트 및 평화교회 사역자들이 모여 차세대 신앙 교육과 평화 훈련의 필요성을 공감하고 첫 연합 포럼을 개최했습니다.',
  },
  {
    year: '2018',
    title: 'AAMEN 공식 출범 및 13개국 협의체 구성',
    desc: '한국, 일본, 베트남, 미얀마, 태국, 인도네시아 등 아시아 13개국 대표들이 참여하여 아시아 아나밥티스트 메노나이트 교육 네트워크(AAMEN)를 정식 발족했습니다.',
  },
  {
    year: '2022',
    title: '7대 표준 레슨 플랜 개발 및 다국어 번역 착수',
    desc: 'MWC의 공유된 확신을 토대로 아시아 현지 상황에 맞춘 7대 테마별 교재를 집필하고 각국 모국어 번역을 시작했습니다.',
  },
  {
    year: '2025~2026',
    title: '온라인 통합 디지털 플랫폼 및 상호 교류 활성화',
    desc: '언어의 장벽을 넘어 13개국 성도와 지도자들이 실시간으로 기도와 자료를 나누는 디지털 플랫폼으로 새롭게 도약합니다.',
  },
]

const churchProfiles = [
  { name: '한국 메노나이트 교회 연합', country: '대한민국', flag: '🇰🇷', desc: '화해와 평화제자도를 삶의 현장에서 실천하는 공동체' },
  { name: '미얀마 메노나이트 교회 협의회', country: '미얀마', flag: '🇲🇲', desc: '고난 속에서도 복음과 사랑의 섬김을 이어가는 믿음의 증인' },
  { name: '베트남 복음주의 메노나이트 교회', country: '베트남', flag: '🇻🇳', desc: '청년 세대를 중심으로 부흥하는 활력 넘치는 복음 공동체' },
  { name: '태국 평화 아나밥티스트 펠로우십', country: '태국', flag: '🇹🇭', desc: '지역 사회 섬김과 아동 교육에 헌신하는 따뜻한 교회' },
  { name: '인도네시아 게키(GKMI) & 기타스(GITJ)', country: '인도네시아', flag: '🇮🇩', desc: '100년 이상의 역사를 지닌 아시아 최대 규모의 메노나이트 교단' },
  { name: '인도 비하르 & 차티스가르 메노나이트 연합', country: '인도', flag: '🇮🇳', desc: '가난한 이웃과 소외 계층을 섬기며 그리스도의 평화를 전파하는 교회' },
]

// 📸 사진첩 게시판형 데이터 (이미지 + 사역 내용이 함께 표시되는 매거진 리스트 스타일)
interface HistoryPhotoItem {
  id: string
  title: string
  location: string
  flag: string
  date: string
  attendees: string
  imageUrl: string
  story: string
  tags: string[]
}

const historyPhotos: HistoryPhotoItem[] = [
  {
    id: 'hp_1',
    title: '제1회 아시아 아나밥티스트 평화 교육 컨퍼런스',
    location: '방콕 (Bangkok, Thailand)',
    flag: '🇹🇭',
    date: '2018-11-15',
    attendees: '13개국 대표단 120명',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    story: '아시아 13개국 교회 지도자들과 평화 사역자들이 한자리에 모여 AAMEN의 공식 출범을 선포하고 평화 교육 헌장을 채택했습니다. 분쟁과 갈등이 깊은 아시아 땅에서 화해의 제자도를 살아내기로 결단한 역사적인 순간이었습니다.',
    tags: ['AAMEN출범', '평화컨퍼런스', '13개국연합'],
  },
  {
    id: 'hp_2',
    title: '13개국 대표단 7대 레슨 플랜 집필 및 감수 워크숍',
    location: '서울 (Seoul, Korea)',
    flag: '🇰🇷',
    date: '2022-06-20',
    attendees: '각국 교육분과 위원 35명',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    story: 'MWC 7대 확신을 아시아 청소년과 성도들이 이해하기 쉬운 12주 교안으로 집필하기 위해 각국 신학자와 교사들이 5일간 합숙하며 교재의 초안을 완성하고 다국어 번역 기준을 세웠습니다.',
    tags: ['교재집필', '레슨플랜', '신학교육'],
  },
  {
    id: 'hp_3',
    title: '아시아 청년 메노나이트 평화 캠프 & 제자도 훈련',
    location: '자바 (Java, Indonesia)',
    flag: '🇮🇩',
    date: '2023-08-10',
    attendees: '청년 리더 150명',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    story: '인도네시아, 미얀마, 베트남, 필리핀 등 아시아 청년들이 모여 문화와 언어를 뛰어넘는 그리스도의 한 가족 됨을 체험했습니다. 밤마다 각국의 평화와 교회를 위해 눈물로 중보기도하는 뜨거운 은혜가 있었습니다.',
    tags: ['청년평화캠프', '제자도훈련', '인도네시아'],
  },
  {
    id: 'hp_4',
    title: '미얀마 평화 센터 개소 및 긴급 구호 연대 기도회',
    location: '양곤 (Yangon, Myanmar)',
    flag: '🇲🇲',
    date: '2024-03-05',
    attendees: '현지 사역자 및 성도 70명',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    story: '정치적 격변과 불안 속에서도 복음의 평화를 증거하기 위한 현지 청년 센터가 문을 열었습니다. AAMEN 13개국은 구호 물품과 기도 지원을 통해 미얀마 형제자매들과 굳건히 연대하고 있습니다.',
    tags: ['미얀마사역', '긴급구호', '화해와평화'],
  },
]

export default function HistoryView() {
  const [activeTab, setActiveTab] = useState<'all' | 'history' | 'churches' | 'photos'>('all')
  const [lightboxItem, setLightboxItem] = useState<HistoryPhotoItem | null>(null)

  const shareViaWhatsApp = (title: string, desc: string) => {
    const message = `🕊️ *[AAMEN 역사와 교회 - 사진첩]*\n📸 *${title}*\n${desc}\n🔗 바로가기: https://aamen.net/history`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 배너 */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-8 shadow-md">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
              Heritage & Fellowship
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">역사와 교회</h1>
            <p className="text-white/85 text-sm sm:text-base max-w-2xl leading-relaxed">
              아시아 땅에 뿌리내린 아나밥티스트 메노나이트 신앙의 발자취와 13개국 교회들의 생생한 역사 및 사역 사진첩입니다.
            </p>

            {/* 네비게이션 탭 칩 */}
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
              {[
                { id: 'all', label: '전체 보기' },
                { id: 'history', label: '📜 AAMEN 걸어온 길' },
                { id: 'churches', label: '⛪ 13개국 교회 소개' },
                { id: 'photos', label: '📸 사진첩 (게시판)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 1. 역사 타임라인 섹션 */}
          {(activeTab === 'all' || activeTab === 'history') && (
            <div id="history" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm mb-10">
              <div className="flex items-center gap-2 mb-6 font-black text-xl text-gray-900">
                <History size={22} className="text-emerald-600" />
                <span>AAMEN 걸어온 길 (History Timeline)</span>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-200">
                {historyMilestones.map((m, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white shadow-xs" />
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-extrabold mb-1">
                        {m.year}
                      </span>
                      <h4 className="font-bold text-base text-gray-900 mb-1">{m.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. 13개국 교회 소개 섹션 */}
          {(activeTab === 'all' || activeTab === 'churches') && (
            <div id="churches" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm mb-10">
              <div className="flex items-center gap-2 mb-6 font-black text-xl text-gray-900">
                <Church size={22} className="text-emerald-600" />
                <span>함께하는 13개국 교회 소개 (Churches)</span>
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

          {/* 3. 📸 사진첩 (게시판 형태: 이미지 + 내용이 함께 표시되는 매거진 리스트 스타일) */}
          {(activeTab === 'all' || activeTab === 'photos') && (
            <div id="photos" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 font-black text-xl text-gray-900">
                  <Camera size={22} className="text-emerald-600" />
                  <span>역사 사진첩 (Field Photos Board)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    매거진 뷰
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-400 mr-2">
                    사역 현장 사진과 상세 스토리가 함께 정리된 게시판형 목록입니다.
                  </span>
                  <a
                    href="/community/photos"
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
                  >
                    <Camera size={13} />
                    <span>사역 사진 등록 & 전체보기 →</span>
                  </a>
                </div>
              </div>

              {/* 사진첩 게시판 목록: 이미지 + 내용이 함께 정갈하게 표시되는 카드 리스트 */}
              <div className="space-y-6">
                {historyPhotos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLightboxItem(item)}
                    className="group bg-gray-50/60 hover:bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer flex flex-col md:flex-row gap-6 items-stretch"
                  >
                    {/* 이미지 영역 */}
                    <div className="md:w-72 lg:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden shrink-0 relative bg-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[11px] font-bold flex items-center gap-1">
                        <span>{item.flag}</span>
                        <span>{item.location}</span>
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-emerald-600/90 text-white text-[10px] font-black rounded-lg backdrop-blur-sm">
                        {item.attendees}
                      </div>
                    </div>

                    {/* 내용 및 사역 스토리 영역 */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mb-2">
                          <span className="flex items-center gap-1 text-emerald-700 font-bold">
                            <Calendar size={13} />
                            {item.date}
                          </span>
                          <span>•</span>
                          <span>{item.location}</span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-gray-900 group-hover:text-emerald-700 transition-colors mb-2 leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                          {item.story}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {item.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-semibold"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 하단 액션 바 */}
                      <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                          <span>자세히 보기 & 고화질 확대</span>
                          <ArrowRight size={13} />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            shareViaWhatsApp(item.title, `${item.location} (${item.date}) - ${item.story}`)
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Share2 size={13} />
                          <span>WhatsApp 공유</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 📸 라이트박스 모달 팝업 */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col md:flex-row max-h-[90vh]"
          >
            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="w-full h-full object-contain max-h-[60vh] md:max-h-none"
              />
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 md:hidden w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                    {lightboxItem.flag} {lightboxItem.location}
                  </span>
                  <button onClick={() => setLightboxItem(null)} className="hidden md:block text-gray-400 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>

                <div className="text-xs font-mono text-gray-400 mb-1">
                  {lightboxItem.date} · {lightboxItem.attendees}
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-3 leading-snug">
                  {lightboxItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                  {lightboxItem.story}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {lightboxItem.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => shareViaWhatsApp(lightboxItem.title, lightboxItem.story)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>WhatsApp으로 사진 & 소식 공유하기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
