import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { convictionPages } from '@/data/convictionsData'
import { ChevronRight, ArrowLeft, ArrowRight, BookOpen, Layers, Sparkles, Home } from 'lucide-react'

// 7개 주제 목록 순서 및 정돈된 라벨
const convictionOrder = [
  { slug: 'god', num: '01', title: '하나님', fullTitle: '하나님 (God)' },
  { slug: 'jesus', num: '02', title: '예수 그리스도', fullTitle: '예수 그리스도 (Jesus)' },
  { slug: 'spirit', num: '03', title: '성령', fullTitle: '성령 (Holy Spirit)' },
  { slug: 'church', num: '04', title: '성경', fullTitle: '성경 (The Bible)' },
  { slug: 'peace', num: '05', title: '평화와 정의', fullTitle: '평화, 정의, 화해 (Peace)' },
  { slug: 'community', num: '06', title: '예배와 사명', fullTitle: '예배와 삶 (Worship)' },
  { slug: 'unity', num: '07', title: '지구촌 가족', fullTitle: '지구촌 가족 (Global Family)' },
]

export function generateStaticParams() {
  return convictionOrder.map((item) => ({
    slug: item.slug,
  }))
}

import { setRequestLocale } from 'next-intl/server'

export default async function ConvictionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const pageData = convictionPages[slug]

  if (!pageData) {
    notFound()
  }

  // 현재 인덱스 및 이전/다음 탐색
  const currentIndex = convictionOrder.findIndex((item) => item.slug === slug)
  const currentTopic = convictionOrder[currentIndex] || convictionOrder[0]
  const prevTopic = currentIndex > 0 ? convictionOrder[currentIndex - 1] : null
  const nextTopic = currentIndex < convictionOrder.length - 1 ? convictionOrder[currentIndex + 1] : null

  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `/${locale}${cleanPath}`
  }

  return (
    <div className="min-h-screen bg-[#f5f8f7] flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* 상단 브레드크럼 (가독성 100% 확보를 위한 깔끔한 글래스모피즘 배지) */}
          <div className="mb-6 flex items-center">
            <nav className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 rounded-full shadow-sm border border-emerald-100/80 text-xs sm:text-sm font-semibold text-gray-700">
              <Link
                href={getLocalizedPath('/')}
                className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-700 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>홈</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <Link
                href={getLocalizedPath('/convictions')}
                className="text-gray-500 hover:text-emerald-700 transition-colors"
              >
                공유된 신념
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              <span className="text-emerald-800 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {currentTopic.fullTitle}
              </span>
            </nav>
          </div>

          {/* 7대 공유된 신념 빠른 이동 탭 바 (글씨 잘림 방지 및 모바일 스크롤 지원) */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-emerald-100/60 mb-8">
            <div className="flex items-center justify-between gap-2 mb-3 px-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>7대 공유된 신념 목차</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">원클릭 바로가기</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {convictionOrder.map((item) => {
                const isActive = item.slug === slug
                return (
                  <Link
                    key={item.slug}
                    href={getLocalizedPath(`/convictions/${item.slug}`)}
                    className={`text-center py-2.5 px-2 rounded-2xl transition-all border flex flex-col justify-center items-center ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25 scale-[1.02]'
                        : 'bg-gray-50/80 text-gray-700 border-gray-200/60 hover:bg-emerald-50/70 hover:text-emerald-900 hover:border-emerald-200'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-mono font-bold block mb-0.5 ${
                        isActive ? 'text-emerald-100' : 'text-gray-400'
                      }`}
                    >
                      주제 {item.num}
                    </span>
                    <span className="text-xs font-bold leading-tight whitespace-nowrap">
                      {item.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 원본 교안 본문 영역 (화사하고 깨끗한 화이트 카드 디자인) */}
          <article className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl shadow-teal-950/5 border border-emerald-100/60 overflow-hidden">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.rawHtml }}
            />
          </article>

          {/* 하단 이전/다음 페이지 이동 네비게이션 */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {prevTopic ? (
              <Link
                href={getLocalizedPath(`/convictions/${prevTopic.slug}`)}
                className="flex items-center gap-3 px-5 py-3.5 bg-white border border-gray-200/80 rounded-2xl shadow-xs hover:border-emerald-300 hover:bg-emerald-50/40 text-gray-700 hover:text-emerald-900 transition-all text-sm font-bold group"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-600 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <span className="block text-[11px] text-gray-400 font-normal">이전 주제</span>
                  <span>{prevTopic.fullTitle}</span>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            <Link
              href={getLocalizedPath('/convictions')}
              className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>전체 7대 확신 목록으로</span>
            </Link>

            {nextTopic ? (
              <Link
                href={getLocalizedPath(`/convictions/${nextTopic.slug}`)}
                className="flex items-center justify-between sm:justify-end gap-3 px-5 py-3.5 bg-white border border-gray-200/80 rounded-2xl shadow-xs hover:border-emerald-300 hover:bg-emerald-50/40 text-gray-700 hover:text-emerald-900 transition-all text-sm font-bold text-right group"
              >
                <div>
                  <span className="block text-[11px] text-gray-400 font-normal">다음 주제</span>
                  <span>{nextTopic.fullTitle}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
