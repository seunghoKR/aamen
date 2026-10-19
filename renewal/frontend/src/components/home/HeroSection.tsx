'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles, Image as ImageIcon, FileText, Globe, Heart, BookOpen } from 'lucide-react'
import { BannerConfig, defaultBanners } from '@/lib/store'

export default function HeroSection() {
  const t = useTranslations('home')
  const tBanners = useTranslations('banners')
  const locale = useLocale()

  const [banners, setBanners] = useState<BannerConfig[]>(defaultBanners)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  // 15개국 다국어 번역 헬퍼
  const getBannerField = (id: string, field: 'title' | 'subtitle' | 'buttonText' | 'secondaryButtonText' | 'badgeText', fallback?: string) => {
    try {
      if (tBanners.has(`${id}.${field}`)) {
        return tBanners(`${id}.${field}`)
      }
    } catch (e) {}
    return fallback || ''
  }

  // 터치 스와이프 지원
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // 배너 데이터 로드 (DB API 우선, localStorage 및 기본값 fallback)
  useEffect(() => {
    setMounted(true)

    // 1. localStorage 로드
    try {
      const cached = localStorage.getItem('aamen_banners_list')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBanners(parsed)
        }
      }
    } catch (e) {
      console.error(e)
    }

    // 2. 서버 API 동기화 (오프라인/로컬 환경 대응)
    fetch('/api/banners')
      .then((res) => {
        if (!res.ok) return null
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          return res.json()
        }
        return null
      })
      .then((res) => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: BannerConfig[] = res.data.map((b: any) => ({
            id: b.id,
            type: b.banner_type === 'image' ? 'image' : 'gradient_text',
            title: b.title,
            subtitle: b.subtitle || '',
            badgeText: b.badge_text || '',
            imageUrl: b.image_url || '',
            buttonText: b.button_text || '시작하기',
            buttonLink: b.link_url || '/community/prayer',
            secondaryButtonText: b.secondary_button_text || '자세히 보기',
            secondaryButtonLink: b.secondary_button_link || '/convictions',
            bgGradient: b.bg_gradient || 'from-emerald-800 via-teal-900 to-slate-950',
            active: Boolean(b.is_active),
            displayOrder: Number(b.display_order) || 1,
          }))
          setBanners(mapped)
          localStorage.setItem('aamen_banners_list', JSON.stringify(mapped))
        }
      })
      .catch(() => {
        // Fallback to local default banners cleanly
      })

    // 스토리지 변경 이벤트 리스너 (관리자 페이지 수정 실시간 반영)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'aamen_banners_list' && e.newValue) {
        try {
          setBanners(JSON.parse(e.newValue))
        } catch (err) {
          console.error(err)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // 활성화된 배너 필터링 (최소 1개 이상 항상 보장)
  const rawActive = banners.filter((b) => b.active).slice(0, 5)
  const activeBanners = rawActive.length > 0 ? rawActive : defaultBanners.slice(0, 5)
  const totalSlides = activeBanners.length
  const currentBanner = activeBanners[currentIndex] || activeBanners[0]

  // 다음 슬라이드
  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
    setProgress(0)
  }, [totalSlides])

  // 이전 슬라이드
  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
    setProgress(0)
  }, [totalSlides])

  // 자동 슬라이딩 & 타이머 프로그레스
  useEffect(() => {
    if (!isPlaying || isHovered || totalSlides <= 1) return

    const intervalTime = 5000 // 5초
    const tickTime = 50
    const step = (tickTime / intervalTime) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + step
      })
    }, tickTime)

    return () => clearInterval(timer)
  }, [isPlaying, isHovered, nextSlide, totalSlides])

  // 모바일 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 50) nextSlide()
    if (diff < -50) prevSlide()
    touchStartX.current = null
    touchEndX.current = null
  }

  const getLocalizedPath = (path: string) => {
    if (!path) return `/${locale}`
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `/${locale}${cleanPath}`
  }

  // =========================================================================
  // 🌟 상단 히어로 배너 슬라이더 (항상 활성화 & 완벽한 고정 높이)
  // =========================================================================
  const isImageBanner = currentBanner && currentBanner.type === 'image' && Boolean(currentBanner.imageUrl)

  return (
    <section
      className="relative overflow-hidden h-[540px] sm:h-[600px] lg:h-[620px] flex items-center justify-center select-none bg-slate-950 text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. 배경 레이어 (이미지 배너 vs 텍스트 그라디언트 배너) */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
        {/* 기본 그라디언트 배경 */}
        <div
          className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ${
            currentBanner?.bgGradient || 'from-emerald-900 via-teal-950 to-slate-950'
          }`}
        />

        {/* 이미지 배너 모드일 때 배경 사진 노출 */}
        {isImageBanner && (
          <>
            <div
              key={currentBanner.imageUrl}
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 animate-in fade-in"
              style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
            />
            {/* 어두운 가독성 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/50" />
            <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply" />
          </>
        )}

        {/* 텍스트 배너일 때 몽환적인 앰비언트 글로우 오브 */}
        {!isImageBanner && (
          <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-emerald-400 blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-sky-400 blur-3xl animate-pulse" />
          </div>
        )}
      </div>

      {/* 2. 상단 프로그레스 바 (자동 슬라이드 진행률) */}
      {isPlaying && totalSlides > 1 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* 3. 메인 콘텐츠 - 고정 높이 핏으로 슬라이드 변경 시 1px도 덜컹거리지 않음 */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 py-8 text-center w-full flex flex-col justify-center items-center h-full">
        {/* 배너 유형 배지 & 슬라이드 넘버 */}
        <div className="h-[32px] flex items-center justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-300 shadow-inner">
            {isImageBanner ? (
              <ImageIcon size={13} className="text-emerald-300" />
            ) : (
              <FileText size={13} className="text-teal-300" />
            )}
            <span>
              {getBannerField(
                currentBanner?.id,
                'badgeText',
                currentBanner?.badgeText || (isImageBanner ? 'PHOTO STORY' : 'SPECIAL FOCUS')
              )}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/40 mx-0.5" />
            <span className="text-white/75 font-mono text-[11px]">
              {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* 메인 타이틀 (고정 컨테이너 높이 h-[84px] sm:h-[100px] -> 덜컹거림 원천 차단) */}
        <div className="h-[84px] sm:h-[100px] flex items-center justify-center w-full mb-3">
          <h1
            key={`title-${currentBanner?.id}`}
            className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-md max-w-4xl line-clamp-2 animate-in fade-in duration-300"
          >
            {getBannerField(currentBanner?.id, 'title', currentBanner?.title)}
          </h1>
        </div>

        {/* 서브 타이틀 / 설명문 (고정 컨테이너 높이 h-[52px] sm:h-[60px] -> 덜컹거림 원천 차단) */}
        <div className="h-[52px] sm:h-[60px] flex items-center justify-center w-full mb-6">
          <p
            key={`sub-${currentBanner?.id}`}
            className="text-xs sm:text-base text-white/90 max-w-2xl leading-relaxed font-normal line-clamp-2 animate-in fade-in duration-300"
          >
            {getBannerField(currentBanner?.id, 'subtitle', currentBanner?.subtitle)}
          </p>
        </div>

        {/* CTA 액션 버튼 (고정 영역) */}
        <div className="h-[48px] flex items-center justify-center gap-3 sm:gap-4 mb-6">
          {currentBanner?.buttonText && (
            <Link
              href={getLocalizedPath(currentBanner.buttonLink || '/community/prayer')}
              className="px-7 sm:px-9 py-3 sm:py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-full hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all text-xs sm:text-sm flex items-center gap-2"
            >
              <span>{getBannerField(currentBanner?.id, 'buttonText', currentBanner.buttonText)}</span>
              <span className="text-base">→</span>
            </Link>
          )}

          {currentBanner?.secondaryButtonText && (
            <Link
              href={getLocalizedPath(currentBanner.secondaryButtonLink || '/convictions')}
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/25 hover:border-white/40 backdrop-blur-md transition-all text-xs sm:text-sm"
            >
              <span>{getBannerField(currentBanner?.id, 'secondaryButtonText', currentBanner.secondaryButtonText)}</span>
            </Link>
          )}
        </div>

        {/* 15개국 글로벌 통계 배지 (고정 하단 바) */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-6 sm:gap-14 text-white/85 max-w-3xl w-full">
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-black text-white">13</div>
            <div className="text-[10px] sm:text-xs text-white/70">{t('stat_nations')}</div>
          </div>
          <div className="w-px h-6 bg-white/15" />
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-black text-white">7</div>
            <div className="text-[10px] sm:text-xs text-white/70">{t('stat_lessons')}</div>
          </div>
          <div className="w-px h-6 bg-white/15" />
          <div className="text-center">
            <div className="text-lg sm:text-2xl font-black text-white">∞</div>
            <div className="text-[10px] sm:text-xs text-white/70">{t('stat_connections')}</div>
          </div>
        </div>
      </div>

      {/* 4. 좌/우 수동 슬라이드 네비게이션 버튼 */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* 5. 하단 인디케이터 컨트롤 (자동/수동 혼용 및 배너 타입 표시) */}
      {totalSlides > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 shadow-xl">
          {/* 재생 / 일시정지 토글 버튼 */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? '자동 슬라이드 일시정지' : '자동 슬라이드 재생'}
            className="p-1 rounded-full text-white/70 hover:text-white transition-colors"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <div className="w-px h-3 bg-white/20" />

          {/* 슬라이드 탭 & 인디케이터 */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {activeBanners.map((b, idx) => {
              const isActive = idx === currentIndex
              const isImg = b.type === 'image' && Boolean(b.imageUrl)

              return (
                <button
                  key={b.id || idx}
                  onClick={() => {
                    setCurrentIndex(idx)
                    setProgress(0)
                  }}
                  className={`group relative flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title={`${idx + 1}: ${getBannerField(b.id, 'title', b.title)}`}
                >
                  {isImg ? (
                    <ImageIcon size={11} className={isActive ? 'text-slate-950' : 'text-emerald-400'} />
                  ) : (
                    <FileText size={11} className={isActive ? 'text-slate-950' : 'text-teal-400'} />
                  )}
                  <span className="hidden sm:inline font-mono">{idx + 1}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
