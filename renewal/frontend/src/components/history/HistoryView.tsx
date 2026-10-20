'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HistoryPhotoBoard from '@/components/history/HistoryPhotoBoard'
import {
  History,
  Church,
  Camera,
} from 'lucide-react'

const historyMilestones = [
  {
    year: '2015',
    title: '아시아 평화 교육 네트워크 태동',
    desc: '아시아 각국의 메노나이트 및 평화교회 사역자들이 모여 차세대 신앙 교육과 평화 훈련의 필요성을 공감하고 첫 연합 포럼을 개최했습니다.',
  },
  {
    year: '2018',
    title: 'AAMEN 공식 출범 및 15개국 협의체 구성',
    desc: '한국, 일본, 베트남, 미얀마, 태국, 인도네시아 등 아시아 15개국 대표들이 참여하여 아시아 아나밥티스트 메노나이트 교육 네트워크(AAMEN)를 정식 발족했습니다.',
  },
  {
    year: '2022',
    title: '7대 표준 레슨 플랜 개발 및 다국어 번역 착수',
    desc: 'MWC의 공유된 확신을 토대로 아시아 현지 상황에 맞춘 7대 테마별 교재를 집필하고 각국 모국어 번역을 시작했습니다.',
  },
  {
    year: '2025~2026',
    title: '온라인 통합 디지털 플랫폼 및 상호 교류 활성화',
    desc: '언어의 장벽을 넘어 15개국 성도와 지도자들이 실시간으로 기도와 자료를 나누는 디지털 플랫폼으로 새롭게 도약합니다.',
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

interface HistoryViewProps {
  initialTab?: 'all' | 'history' | 'churches' | 'photos'
}

export default function HistoryView({ initialTab = 'all' }: HistoryViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'history' | 'churches' | 'photos'>(initialTab)

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
              아시아 땅에 뿌리내린 아나밥티스트 메노나이트 신앙의 발자취와 15개국 교회들의 생생한 역사 및 사역 사진첩입니다.
            </p>

            {/* 네비게이션 탭 칩 */}
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
              {[
                { id: 'all', label: '전체 보기' },
                { id: 'history', label: '📜 AAMEN 걸어온 길' },
                { id: 'churches', label: '⛪ 15개국 교회 소개' },
                { id: 'photos', label: '📷 역사와 교회 사진첩' },
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

          {/* 2. 15개국 교회 소개 섹션 */}
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

          {/* 3. 📸 역사와 교회 사진첩 (독립된 전용 게시판: board_type='history_photos') */}
          {(activeTab === 'all' || activeTab === 'photos') && (
            <HistoryPhotoBoard />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
