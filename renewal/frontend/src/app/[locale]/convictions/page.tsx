import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { BookOpen, Sparkles, Layers, ArrowRight } from 'lucide-react'
import { setRequestLocale } from 'next-intl/server'
import { getConvictionList, getConvictionsPageUi } from '@/data/convictionsOverviewData'

export default async function ConvictionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const list = getConvictionList(locale)
  const ui = getConvictionsPageUi(locale)

  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `/${locale}${cleanPath}`
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="lp-container max-w-5xl mx-auto">
          {/* 상단 헤더 배너 */}
          <div className="lp-header text-center py-12 px-6 sm:px-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white rounded-3xl shadow-xl shadow-teal-950/10 mb-10 word-break-keep-all">
            <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest mb-3.5 border border-white/30">
              {ui.bannerBadge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
              {ui.bannerTitle}
            </h1>
            <div className="lp-header-desc text-white/90 text-sm sm:text-base italic max-w-2xl mx-auto leading-relaxed border-l-4 border-white/60 pl-4 text-left">
              {ui.bannerDesc}
            </div>
          </div>

          {/* 인트로 안내 박스 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-emerald-100 shadow-xs mb-10">
            <div className="flex items-center gap-2 mb-2 font-bold text-emerald-800 text-base sm:text-lg">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{ui.introTitle}</span>
            </div>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {ui.introDesc}
            </p>
          </div>

          {/* 7대 신념 카드 리스트 */}
          <div className="space-y-8">
            {list.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100/70 shadow-xs hover:shadow-lg transition-all scroll-mt-24"
              >
                {/* 카드 상단 헤더 */}
                <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-mono font-extrabold text-emerald-600 block mb-1">
                      {ui.convictionPrefix} {item.num}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                      {item.title}
                    </h2>
                  </div>
                  <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 shrink-0">
                    {item.badge}
                  </span>
                </div>

                {/* 핵심 리드 문장 */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 mb-5 text-emerald-950 font-medium text-sm sm:text-base leading-relaxed">
                  👉 {item.lead}
                </div>

                {/* 본문 요약 내용 */}
                {item.content && item.content.length > 0 && (
                  <div className="space-y-2.5 mb-6">
                    {item.content.map((p, idx) => (
                      <p key={idx} className="text-gray-700 text-sm sm:text-base leading-relaxed flex items-start gap-2.5">
                        <span className="text-emerald-500 font-bold mt-0.5">•</span>
                        <span>{p}</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* 참고 성경 말씀 */}
                <div className="p-3.5 bg-gray-50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-600 mb-5">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{ui.scriptureLabel}</span>
                  </div>
                  <span className="font-mono text-emerald-700 font-semibold">{item.scripture}</span>
                </div>

                {/* 개별 상세 교안 페이지 바로가기 버튼 */}
                <div className="pt-2 text-right">
                  <Link
                    href={getLocalizedPath(`/convictions/${item.slug}`)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm shadow-emerald-700/20"
                  >
                    <span>{ui.viewBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 교육 자료 연결 CTA */}
          <div className="mt-14 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-600 to-sky-600 text-white text-center shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              {ui.ctaTitle}
            </h3>
            <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto mb-7 leading-relaxed">
              {ui.ctaDesc}
            </p>
            <Link
              href={getLocalizedPath('/convictions/god')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-800 font-extrabold rounded-full hover:bg-emerald-50 transition-all shadow-md text-sm"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>{ui.ctaBtn}</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
