'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Download, FileText, Globe, Search, BookOpen, Music, FolderArchive, Sparkles } from 'lucide-react'

// 7대 레슨 플랜 실제 파일 데이터
const lessonPlans = [
  {
    num: '#1',
    theme: 'God (하나님)',
    title: '창조주 하나님과 그분의 사랑',
    desc: '창조 세계와 인류를 향한 하나님의 영원한 사랑과 통치를 배우는 4주간의 공과 자료입니다.',
    pages: '28 pages',
    fileName: 'Lesson_Plan_1_God.docx',
    fileSize: '329 KB',
    color: 'border-emerald-200 bg-emerald-50/30 text-emerald-700',
  },
  {
    num: '#2',
    theme: 'Jesus (예수 그리스도)',
    title: '예수 그리스도와 화해의 길',
    desc: '예수님의 산상수훈과 십자가 대속의 은혜, 제자로서 그분의 평화의 발자취를 따르는 교육과정입니다.',
    pages: '32 pages',
    fileName: 'Lesson_Plan_2_Jesus.docx',
    fileSize: '329 KB',
    color: 'border-teal-200 bg-teal-50/30 text-teal-700',
  },
  {
    num: '#3',
    theme: 'Holy Spirit & Church (성령과 교회)',
    title: '성령의 능력과 언약 공동체',
    desc: '성령의 은사와 열매, 차별 없는 사랑과 섬김으로 세워지는 신자들의 언약 공동체 교회 교육입니다.',
    pages: '30 pages',
    fileName: 'Lesson_Plan_3_Holy_Spirit.docx',
    fileSize: '329 KB',
    color: 'border-sky-200 bg-sky-50/30 text-sky-700',
  },
  {
    num: '#4',
    theme: 'Bible (성경)',
    title: '그리스도 중심으로 읽는 하나님의 말씀',
    desc: '예수 그리스도의 눈으로 구약과 신약 성경을 통전적으로 읽고 일상에 적용하는 성경 연구 가이드입니다.',
    pages: '34 pages',
    fileName: 'Lesson_Plan_4_Bible.docx',
    fileSize: '329 KB',
    color: 'border-indigo-200 bg-indigo-50/30 text-indigo-700',
  },
  {
    num: '#5',
    theme: 'Peacemaker (평화구축자)',
    title: '원수 사랑과 비폭력 평화의 제자도',
    desc: '갈등 해결, 용서와 회복적 정의, 일상과 사회 속에서 평화의 사절로 살아가는 실천 워크북입니다.',
    pages: '36 pages',
    fileName: 'Lesson_Plan_5_Peacemaker.docx',
    fileSize: '329 KB',
    color: 'border-amber-200 bg-amber-50/30 text-amber-700',
  },
  {
    num: '#6',
    theme: 'Worship (예배)',
    title: '삶으로 드리는 온전한 예배',
    desc: '성만찬, 침례, 공동체적 찬양과 기도를 통해 삶의 모든 순간을 하나님께 드리는 예배학 개론입니다.',
    pages: '24 pages',
    fileName: 'Lesson_Plan_6_Worship.docx',
    fileSize: '17 KB',
    color: 'border-purple-200 bg-purple-50/30 text-purple-700',
  },
  {
    num: '#7',
    theme: 'Global Family (세계적 한 가족)',
    title: '장벽을 넘어 하나 된 13개국 네트워크',
    desc: '인종, 민족, 국가를 초월하여 그리스도 안에서 전 세계 성도들과 함께 복음을 증거하는 선교 공과입니다.',
    pages: '35 pages',
    fileName: 'Lesson_Plan_7_Global_Family.docx',
    fileSize: '330 KB',
    color: 'border-rose-200 bg-rose-50/30 text-rose-700',
  },
]

// 13개국 국가별 자료실 카드
const countryResources = [
  { code: 'KR', name: '대한민국 (Korea)', flag: '🇰🇷', count: 18, coordinator: '이승호 대표' },
  { code: 'MM', name: '미얀마 (Myanmar)', flag: '🇲🇲', count: 14, coordinator: 'Zaw Min 목사' },
  { code: 'VN', name: '베트남 (Vietnam)', flag: '🇻🇳', count: 12, coordinator: 'Sarah Nguyen' },
  { code: 'TH', name: '태국 (Thailand)', flag: '🇹🇭', count: 15, coordinator: 'Somchai Prasert' },
  { code: 'ID', name: '인도네시아 (Indonesia)', flag: '🇮🇩', count: 11, coordinator: 'Budi Santoso' },
  { code: 'JP', name: '일본 (Japan)', flag: '🇯🇵', count: 9, coordinator: 'Kenji Sato' },
  { code: 'NP', name: '네팔 (Nepal)', flag: '🇳🇵', count: 13, coordinator: 'Ramesh Adhikari' },
  { code: 'IN', name: '인도 (India)', flag: '🇮🇳', count: 16, coordinator: 'Priya Sharma' },
  { code: 'KH', name: '캄보디아 (Cambodia)', flag: '🇰🇭', count: 8, coordinator: 'Sophea Meas' },
  { code: 'LA', name: '라오스 (Laos)', flag: '🇱🇦', count: 7, coordinator: 'Khamla Phom' },
  { code: 'PH', name: '필리핀 (Philippines)', flag: '🇵🇭', count: 10, coordinator: 'Maria Santos' },
  { code: 'TW', name: '대만 (Taiwan)', flag: '🇹🇼', count: 8, coordinator: 'David Lin' },
  { code: 'MN', name: '몽골 (Mongolia)', flag: '🇲🇳', count: 6, coordinator: 'Batbayar' },
]

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'country' | 'worship' | 'praise' | 'books'>('lessons')
  const [searchTerm, setSearchTerm] = useState('')

  const handleDownload = (fileName: string) => {
    alert(`📥 [${fileName}] 다운로드를 시작합니다.\n(로그인 정회원은 모든 원본 docx/PDF를 자유롭게 받으실 수 있습니다.)`)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 상단 헤더 배너 */}
          <div className="lp-header mb-10">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              AAMEN Resource Hub
            </span>
            <h2>교육 및 예배 자료실</h2>
            <div className="lp-header-desc">
              13개국 교회와 주일학교, 지도자 훈련을 위해 엄선된 레슨 플랜과 예배 자료를 자유롭게 열람하고 다운로드하세요.
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-4 border-b border-gray-200">
            {[
              { id: 'lessons', label: '📖 7대 레슨 플랜', icon: BookOpen },
              { id: 'country', label: '🌍 13개국 국가별 자료실', icon: Globe },
              { id: 'worship', label: '⛪ 예배 자료 & 커리큘럼', icon: FileText },
              { id: 'praise', label: '🎵 찬양 및 악보', icon: Music },
              { id: 'books', label: '📚 도서 및 팜플렛', icon: FolderArchive },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md -translate-y-0.5'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 탭 1: 7대 레슨 플랜 */}
          {activeTab === 'lessons' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-xs mb-6">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-emerald-600" />
                    <span>AAMEN 표준 7대 레슨 플랜 시리즈</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    신앙의 기초부터 평화 제자도까지 체계적으로 구성된 7개 테마별 공과 교재입니다.
                  </p>
                </div>
                <button
                  onClick={() => handleDownload('AAMEN_Lesson_Plans_Full_Pack.zip')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm self-start sm:self-auto shrink-0"
                >
                  <Download size={14} />
                  <span>전체 7개 합본팩 받기 (ZIP)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessonPlans.map((lesson) => (
                  <div
                    key={lesson.num}
                    className={`p-6 rounded-3xl border bg-white shadow-xs hover:shadow-lg transition-all flex flex-col justify-between ${lesson.color}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-sm px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-800">
                          {lesson.num}
                        </span>
                        <span className="text-xs font-semibold text-gray-400 font-mono">
                          {lesson.pages} · {lesson.fileSize}
                        </span>
                      </div>
                      <h4 className="font-black text-lg text-gray-900 mb-1 leading-snug">
                        {lesson.theme}
                      </h4>
                      <div className="text-xs font-bold text-emerald-700 mb-3">{lesson.title}</div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-6">
                        {lesson.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-gray-400 truncate max-w-[150px]">
                        {lesson.fileName}
                      </span>
                      <button
                        onClick={() => handleDownload(lesson.fileName)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Download size={13} />
                        <span>다운로드</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 탭 2: 13개국 국가별 자료실 */}
          {activeTab === 'country' && (
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs mb-6">
                <h3 className="font-extrabold text-lg text-gray-900">13개국 맞춤형 현지 자료실</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  각 나라의 언어로 번역된 공과, 찬양집, 행사 사진 및 선교 보고서를 확인하세요. 각 국가관리자(Coordinator)가 직접 업데이트합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {countryResources.map((c) => (
                  <div
                    key={c.code}
                    className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{c.flag}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          자료 {c.count}건
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-gray-900 mb-1">{c.name}</h4>
                      <p className="text-xs text-gray-400">담당자: {c.coordinator}</p>
                    </div>
                    <button
                      onClick={() => alert(`${c.name} 자료실로 이동합니다.`)}
                      className="mt-4 w-full py-2 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 font-bold text-xs rounded-xl border border-gray-200 transition-colors"
                    >
                      국가 자료 보기 →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 탭 3: 예배 자료 & 커리큘럼 */}
          {activeTab === 'worship' && (
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-900">예배 순서지 및 절기 커리큘럼</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                부활절, 성탄절, 세계 평화 주일 등 메노나이트 교회력에 맞춘 다국어 예배 기도문과 설교 가이드가 제공됩니다.
              </p>
              <div className="space-y-3 pt-4">
                {[
                  '2026 부활절 다국어 연합 예배문 (한국어/영어/태국어)',
                  '메노나이트 평화주일 기념 예배 순서 및 중보기도문',
                  '주일학교 52주 연간 성경 커리큘럼 계획표',
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{item}</span>
                    <button onClick={() => handleDownload('Worship_Resource.pdf')} className="text-xs font-bold text-emerald-600 hover:underline">
                      다운로드
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 탭 4: 찬양 및 악보 */}
          {activeTab === 'praise' && (
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-900">13개국 아나밥티스트 찬양 악보 및 음원</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                각 나라의 언어로 번역된 평화의 노래, 성만찬 찬송 악보와 음원을 나누어 예배를 풍성하게 만듭니다.
              </p>
              <div className="space-y-3 pt-4">
                {[
                  '샬롬 평화의 노래 (13개국 번역 합본 악보집)',
                  '그리스도 우리의 평화 (단선율 악보 + 피아노 반주보)',
                  'AAMEN 테마 찬양 음원 (MP3 & 가사집)',
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{item}</span>
                    <button onClick={() => handleDownload('Praise_Score.pdf')} className="text-xs font-bold text-emerald-600 hover:underline">
                      악보 받기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 탭 5: 도서 및 팜플렛 */}
          {activeTab === 'books' && (
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-gray-900">도서 요약본 및 사역 팜플렛</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                아나밥티스트 역사와 신학에 관한 추천 도서 및 교회 비치용 소개 팜플렛(소책자) 자료입니다.
              </p>
              <div className="space-y-3 pt-4">
                {[
                  'AAMEN 네트워크 공식 소개 팜플렛 (3단 접이식 리플렛)',
                  '평화제자도 핵심 가이드북 소책자 (PDF 인쇄용)',
                  '메노나이트 신앙의 뿌리 (추천 도서 요약집)',
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">{item}</span>
                    <button onClick={() => handleDownload('Pamphlet_Print.pdf')} className="text-xs font-bold text-emerald-600 hover:underline">
                      PDF 열기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
