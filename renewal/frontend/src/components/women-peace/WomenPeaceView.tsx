'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Heart,
  Feather,
  Calendar,
  MapPin,
  Users,
  Clock,
  Sparkles,
  Share2,
  X,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'

// 1. 여성 평화 스토리 (Herstory & Peacetory)
const womenStories = [
  {
    title: '전쟁의 상흔을 치유하는 어머니들의 화해 식탁',
    category: 'Herstory',
    author: 'Sarah Nguyen (베트남 메노나이트 교회)',
    date: '2026-09-05',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    desc: '베트남 전쟁과 역사적 상처 속에서 침묵으로 눈물 흘리던 어머니들이 화해의 성찬 식탁을 열고 서로를 용서하며 평화의 씨앗을 뿌린 기록입니다.',
  },
  {
    title: '미얀마 국경 난민촌 아이들을 위한 이동 평화 학교',
    category: 'Peacetory',
    author: 'Khin Aye (미얀마 양곤 평화사역)',
    date: '2026-08-18',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    desc: '폭력과 절망 대신 연필과 그림책, 찬양을 쥐어주며 세대를 이어 비폭력 제자도를 가르치는 최전선 여성 사역자들의 가슴 뭉클한 이야기입니다.',
  },
  {
    title: '작은 나눔으로 시작된 메노나이트 여성 자립 협동조합',
    category: 'Community',
    author: 'Priya Sharma (인도 비하르 사역팀)',
    date: '2026-07-22',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    desc: '경제적 자립과 복음 전파를 함께 이루어가며 지역 사회 소외 여성들의 인권과 존엄성을 회복시킨 따뜻한 메노나이트 여성 공동체입니다.',
  },
]

// 2. 📅 행사 및 소식 (게시판 형태: 이미지 + 내용이 함께 표시되는 카드 리스트)
interface WomenEventItem {
  id: string
  title: string
  status: '접수중' | '진행예정' | '정기모임'
  statusColor: string
  date: string
  time: string
  location: string
  target: string
  imageUrl: string
  overview: string
  schedule: { time: string; session: string }[]
  contact: string
}

const womenEvents: WomenEventItem[] = [
  {
    id: 'we_1',
    title: '2026 아시아 메노나이트 여성 평화 리더십 포럼 (온라인 & 방콕)',
    status: '접수중',
    statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    date: '2026-11-20 ~ 11-22',
    time: '오전 10:00 ~ 오후 5:00 (ICT)',
    location: '방콕 현지 센터 및 Zoom 하이브리드',
    target: '아시아 13개국 메노나이트 여성 리더 및 차세대 사역자',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80',
    overview: '‘상처 입은 치유자: 가정과 교회, 사회의 평화 메이커’를 주제로 13개국 여성 사역자들이 모여 갈등 전환 워크숍과 영성 세미나를 진행합니다.',
    schedule: [
      { time: '10:00 - 11:30', session: '개회 예배 및 기조 강연 (화해의 식탁 신학)' },
      { time: '13:00 - 15:00', session: '소그룹 갈등 해결 및 회복적 서클 실습' },
      { time: '15:30 - 17:00', session: '13개국 현장 사역 나눔 및 연합 중보기도' },
    ],
    contact: 'AAMEN 여성사역분과 (WhatsApp 문의 가능)',
  },
  {
    id: 'we_2',
    title: '매월 첫째 주 화요일: 아시아 여성 평화 중보기도의 날',
    status: '정기모임',
    statusColor: 'bg-purple-100 text-purple-800 border-purple-300',
    date: '매월 첫째 주 화요일',
    time: '한국시간 20:00 (각국 시차 연동)',
    location: '온라인 Zoom 화상 기도실',
    target: '아시아 평화를 사모하는 모든 성도와 여성 사역자',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
    overview: '미얀마, 네팔, 인도, 인도네시아 등 분쟁과 경제적 곤경에 처한 현지 자매들과 가정들을 위해 매월 정기적으로 한 시간 동안 손잡고 기도합니다.',
    schedule: [
      { time: '20:00 - 20:15', session: '평화 찬양 및 말씀 묵상' },
      { time: '20:15 - 20:45', session: '국가별 긴급 기도제목 릴레이 중보' },
      { time: '20:45 - 21:00', session: '축복과 평화의 인사' },
    ],
    contact: 'prayer@aamen.net',
  },
  {
    id: 'we_3',
    title: '지역 사회 여성 청소년을 위한 비폭력 평화 교육 워크숍',
    status: '진행예정',
    statusColor: 'bg-sky-100 text-sky-800 border-sky-300',
    date: '2026-12-15',
    time: '오후 2:00 ~ 오후 6:00',
    location: '베트남 호치민 평화 센터',
    target: '현지 다문화 청소년 및 주일학교 교사',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
    overview: 'AAMEN 7대 신념 교안을 토대로 일상 속에서 학교 폭력을 예방하고 감정을 건강하게 표현하는 비폭력 대화법(NVC) 실무 훈련을 진행합니다.',
    schedule: [
      { time: '14:00 - 15:30', session: '갈등의 이해와 비폭력 대화 기초' },
      { time: '16:00 - 18:00', session: '역할극(롤플레잉) 및 평화 중재 실습' },
    ],
    contact: '호치민 메노나이트 교회 교육관',
  },
]

export default function WomenPeaceView() {
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'stories'>('all')
  const [selectedEventModal, setSelectedEventModal] = useState<WomenEventItem | null>(null)

  const shareViaWhatsApp = (title: string, desc: string) => {
    const message = `🕊️ *[AAMEN 여성과 평화 - 행사 및 소식]*\n📌 *${title}*\n${desc}\n🔗 확인하기: https://aamen.net/women-peace`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 배너 */}
          <div className="bg-gradient-to-r from-rose-950 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-8 shadow-md">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
              Women & Peacebuilding
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">여성과 평화</h1>
            <p className="text-white/85 text-sm sm:text-base max-w-2xl leading-relaxed">
              갈등과 상처를 치유하고 가정과 교회, 사회 속에서 평화의 화해자로 살아가는 아시아 여성들의 신앙 증언과 주요 행사 소식입니다.
            </p>

            {/* 네비게이션 탭 칩 */}
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/15">
              {[
                { id: 'all', label: '전체 보기' },
                { id: 'events', label: '📅 행사 및 소식 (게시판)' },
                { id: 'stories', label: '🕊️ Herstory & Peacetory' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-rose-500 text-white shadow-md font-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 1. 📅 행사 및 소식 (게시판 형태: 이미지 + 내용이 함께 표시되는 정갈한 스타일) */}
          {(activeTab === 'all' || activeTab === 'events') && (
            <div id="events" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 font-black text-xl text-gray-900">
                  <Calendar size={22} className="text-rose-600" />
                  <span>행사 및 소식 (Events & News Board)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                    게시판형 카드 뷰
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  포스터 이미지와 세부 행사 요강이 함께 표시되는 정돈된 목록입니다.
                </p>
              </div>

              {/* 행사 목록 */}
              <div className="space-y-6">
                {womenEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventModal(evt)}
                    className="group bg-gray-50/60 hover:bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 hover:border-rose-300 hover:shadow-lg transition-all cursor-pointer flex flex-col md:flex-row gap-6 items-stretch"
                  >
                    {/* 행사 포스터/썸네일 이미지 */}
                    <div className="md:w-72 lg:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden shrink-0 relative bg-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={evt.imageUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border shadow-xs ${evt.statusColor}`}>
                          {evt.status}
                        </span>
                      </div>
                    </div>

                    {/* 행사 내용 및 세부 정보 */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2 font-medium">
                          <span className="flex items-center gap-1 font-bold text-rose-700">
                            <Calendar size={13} />
                            {evt.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} />
                            {evt.time}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-gray-900 group-hover:text-rose-700 transition-colors mb-2 leading-snug">
                          {evt.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                          {evt.overview}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500 bg-white p-3 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin size={13} className="text-rose-500 shrink-0" />
                            <span className="truncate"><strong>장소:</strong> {evt.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Users size={13} className="text-rose-500 shrink-0" />
                            <span className="truncate"><strong>대상:</strong> {evt.target}</span>
                          </div>
                        </div>
                      </div>

                      {/* 하단 액션 바 */}
                      <div className="pt-4 mt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                        <span className="font-bold text-rose-700 group-hover:underline flex items-center gap-1">
                          <span>세부 일정 및 참가 안내 모달 열기</span>
                          <ArrowRight size={13} />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            shareViaWhatsApp(evt.title, `${evt.date} | ${evt.location} - ${evt.overview}`)
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

          {/* 2. 🕊️ Herstory & Peacetory 섹션 */}
          {(activeTab === 'all' || activeTab === 'stories') && (
            <div id="stories" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm mb-10">
              <div className="flex items-center gap-2 mb-6 font-black text-xl text-gray-900">
                <Feather size={22} className="text-rose-600" />
                <span>여성 평화 스토리 (Herstory & Peacetory)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {womenStories.map((story, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-40 rounded-xl overflow-hidden mb-3 bg-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold mb-2">
                        {story.category}
                      </span>
                      <h4 className="font-extrabold text-base text-gray-900 mb-2 leading-snug">
                        {story.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4">
                        {story.desc}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-400">
                      <span>{story.author}</span>
                      <button
                        onClick={() => shareViaWhatsApp(story.title, story.desc)}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <Share2 size={12} />
                        <span>공유</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 📅 행사 세부 안내 모달 */}
      {selectedEventModal && (
        <div
          onClick={() => setSelectedEventModal(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${selectedEventModal.statusColor}`}>
                  {selectedEventModal.status}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-2 mb-2 leading-snug">
                  {selectedEventModal.title}
                </h3>
                <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                  <span>{selectedEventModal.date}</span>
                  <span>·</span>
                  <span>{selectedEventModal.time}</span>
                </div>
              </div>
              <button onClick={() => setSelectedEventModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 text-xs sm:text-sm text-gray-700 leading-relaxed mb-6">
              {selectedEventModal.overview}
            </div>

            <div className="mb-6">
              <h4 className="font-extrabold text-sm text-gray-900 mb-3 flex items-center gap-1.5">
                <Clock size={15} className="text-rose-600" />
                <span>세부 진행 타임테이블</span>
              </h4>
              <div className="space-y-2">
                {selectedEventModal.schedule.map((sch, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl text-xs">
                    <span className="font-mono font-bold text-rose-700 shrink-0 w-28">{sch.time}</span>
                    <span className="text-gray-700 font-medium">{sch.session}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl mb-6 text-xs text-gray-600">
              <p><strong>참가 문의:</strong> {selectedEventModal.contact}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => shareViaWhatsApp(selectedEventModal.title, `${selectedEventModal.date} | ${selectedEventModal.location} - ${selectedEventModal.overview}`)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 size={14} />
                <span>WhatsApp으로 참가 안내 공유하기</span>
              </button>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
