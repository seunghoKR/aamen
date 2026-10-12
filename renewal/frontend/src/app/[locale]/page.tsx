import { setRequestLocale, getTranslations } from 'next-intl/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import ConvictionsPreview from '@/components/home/ConvictionsPreview'
import RecentPostsSection from '@/components/home/RecentPostsSection'
import LivePrayerWall from '@/components/community/LivePrayerWall'
import CommunityPreview from '@/components/home/CommunityPreview'
import { Sparkles, Users } from 'lucide-react'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-800">
      {/* 1. 글로벌 헤더 (메뉴) */}
      <Header />

      {/* 2. 슬라이딩 배너 (13개국 깃발 & 실시간 다국어 배너) */}
      <HeroSection />

      {/* 3. 🌿 MWC 공유된 확신 (Shared Convictions of Faith) */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-[#faf8f5] via-[#fdfcf9] to-white border-b border-amber-200/50 mb-12 sm:mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-900 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-200/80">
              <Sparkles size={12} className="text-amber-600" />
              <span>Foundation of Faith</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-3 mb-3 text-gray-900 tracking-tight">
              {t('section_convictions')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
              {t('section_convictions_desc')}
            </p>
          </div>

          <ConvictionsPreview />
        </div>
      </section>

      {/* 4. 📢 최근 소식 & 은혜 나눔 (Recent News & Grace Sharing) */}
      <div className="bg-white border-y border-slate-200/80 shadow-xs mb-14 sm:mb-20">
        <RecentPostsSection />
      </div>

      {/* 5. 🌟 함께 기도해요 (Live Prayer Wall - 실시간 중보기도 허브) */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-14 sm:mb-20">
        <LivePrayerWall />
      </section>

      {/* 6. 🤝 함께하는 커뮤니티 (13 Nations Fellowship) */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto mb-16 sm:mb-24">
        <div className="rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-12 shadow-2xl border border-teal-700/30">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-300 uppercase tracking-widest bg-teal-500/20 px-3.5 py-1.5 rounded-full border border-teal-400/30 mb-3 backdrop-blur-md">
              <Users size={12} />
              <span>13 Nations in Fellowship</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mb-3 text-white tracking-tight">
              {t('section_community')}
            </h2>
            <p className="text-teal-100/80 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
              {t('section_community_desc')}
            </p>
          </div>

          <CommunityPreview />
        </div>
      </section>

      {/* 7. 글로벌 푸터 */}
      <Footer />
    </main>
  )
}
