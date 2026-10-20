'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import {
  Bell,
  MessageSquare,
  Share2,
  Camera,
  ArrowRight,
  Eye,
  Heart,
  Calendar,
  Sparkles,
  ExternalLink,
  ImageIcon,
} from 'lucide-react'

interface PostSummary {
  id: string
  category: 'announce' | 'share' | 'album'
  title: string
  content: string
  author: string
  countryCode: string
  date: string
  views: number
  likes: number
  commentCount: number
  fileName?: string
  imageUrl?: string
  photoCount?: number
}

const countryBadgeMap: Record<string, string> = {
  KR: '🇰🇷 한국',
  MM: '🇲🇲 미얀마',
  VN: '🇻🇳 베트남',
  TH: '🇹🇭 태국',
  ID: '🇮🇩 인도네시아',
  JP: '🇯🇵 일본',
  IN: '🇮🇳 인도',
  NP: '🇳🇵 네팔',
  KH: '🇰🇭 캄보디아',
  LA: '🇱🇦 라오스',
}

const categoryInfo: Record<
  string,
  { label: string; icon: any; badgeClass: string; tabHref: string }
> = {
  announce: {
    label: '공지사항',
    icon: Bell,
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    tabHref: '/community/announce',
  },
  share: {
    label: '자료 나눔방',
    icon: Share2,
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    tabHref: '/community/resources',
  },
  album: {
    label: '사진첩',
    icon: Camera,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    tabHref: '/community/photos',
  },
}

const isImageFile = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false
  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase().trim()
  if (!cleanUrl) return false
  if (/\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|hwp|txt|csv|mp3|mp4|mov|avi)$/i.test(cleanUrl)) return false
  if (cleanUrl.startsWith('data:image/')) return true
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|avif)$/i.test(cleanUrl)) return true
  if (cleanUrl.includes('/uploads/resources/') || cleanUrl.includes('/uploads/files/')) return false
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) return true
  return false
}

export default function RecentPostsSection() {
  const locale = useLocale()
  const tHome = useTranslations('home')
  const tComm = useTranslations('community')
  const [activeFilter, setActiveFilter] = useState<'all' | 'announce' | 'share' | 'album'>('all')
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getLocalizedPath = (path: string) => {
    return locale === 'ko' ? path : `/${locale}${path}`
  }

  // 서버 API로부터 실시간 최신 DB 게시물 연동 (가상 더미 데이터 완전 제거)
  useEffect(() => {
    async function fetchLive() {
      try {
        setLoading(true)
        let res = await fetch('/api/posts.php?limit=12&role=regular')
        if (!res.ok) {
          res = await fetch('/api/posts?limit=12&role=regular')
        }
        if (!res.ok) return
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) return
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          const apiPosts: PostSummary[] = data.data
            .filter((p: any) => ['announce', 'photos', 'album', 'resources', 'share'].includes(p.board_type))
            .map((p: any) => {
              let images: string[] = []
              if (p.images) {
                if (typeof p.images === 'string') {
                  try { images = JSON.parse(p.images) } catch (e) {}
                } else if (Array.isArray(p.images)) {
                  images = p.images
                }
              }
              if (p.extra_json) {
                try {
                  const extra = typeof p.extra_json === 'string' ? JSON.parse(p.extra_json) : p.extra_json
                  if (extra.images && Array.isArray(extra.images)) images = extra.images
                  if (!p.image_url && extra.image_url) p.image_url = extra.image_url
                } catch (e) {}
              }
              const validImages = images.filter(isImageFile)
              const candidate = isImageFile(p.image_url) ? p.image_url : (validImages.length > 0 ? validImages[0] : undefined)

              let cat: 'announce' | 'share' | 'album' = 'announce'
              if (p.board_type === 'photos' || p.board_type === 'album') cat = 'album'
              else if (p.board_type === 'resources' || p.board_type === 'share') cat = 'share'
              else cat = 'announce'

              return {
                id: String(p.id),
                category: cat,
                title: p.title || '제목 없음',
                content: (p.content || '').replace(/<[^>]*>?/gm, ''),
                author: p.author_name || 'AAMEN',
                countryCode: p.author_country || 'KR',
                date: (p.created_at || '').substring(0, 10),
                views: Number(p.views) || 0,
                likes: Number(p.likes) || 0,
                commentCount: p.comments ? p.comments.length : 0,
                imageUrl: candidate,
                photoCount: validImages.length > 0 ? validImages.length : (candidate ? 1 : 0),
              }
            })
          setPosts(apiPosts)
        }
      } catch (e) {
        console.error('Failed to load recent posts:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchLive()
  }, [])

  const filteredPosts =
    activeFilter === 'all' ? posts : posts.filter((p) => p.category === activeFilter)

  return (
    <section className="py-12 sm:py-18 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* 섹션 상단 헤더 & 카테고리 필터 탭 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
            <Sparkles size={12} className="text-emerald-600" />
            <span>Community & Fellowship</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {tHome('recent_news_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            {tHome('recent_news_desc')}
          </p>
        </div>

        {/* 4개 탭 필터: 전체, 공지사항, 자료방, 사진첩 */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tHome('tab_all')}
          </button>
          <button
            onClick={() => setActiveFilter('announce')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'announce'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Bell size={13} />
            <span>{tComm('announcements')}</span>
          </button>
          <button
            onClick={() => setActiveFilter('share')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'share'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-sky-700'
            }`}
          >
            <Share2 size={13} />
            <span>{tComm('share')}</span>
          </button>
          <button
            onClick={() => setActiveFilter('album')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'album'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            <Camera size={13} />
            <span>{tHome('tab_album')}</span>
          </button>
        </div>
      </div>

      {/* 카드 그리드 목록 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 animate-pulse flex flex-col justify-between h-72"
            >
              <div>
                <div className="h-4 bg-slate-200 rounded w-24 mb-4" />
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
              <div className="h-4 bg-slate-100 rounded w-1/3 pt-4 border-t border-slate-100" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center bg-slate-50/80 rounded-3xl border border-dashed border-slate-200">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-700 font-bold text-sm">등록된 최신 게시물이 없습니다.</p>
          <p className="text-slate-400 text-xs mt-1">소통광장에서 첫 번째 소식을 전해보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const cat = categoryInfo[post.category] || categoryInfo.announce
            const Icon = cat.icon
            const isAlbum = post.category === 'album'

            return (
              <div
                key={post.id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* 포스트 썸네일 (실제 이미지 또는 흐릿한 대표 로고 워터마크 대표이미지) */}
                  <Link
                    href={getLocalizedPath(isAlbum ? '/community/photos' : post.category === 'share' ? '/community/resources' : '/community/announce')}
                    className="block relative h-48 w-full overflow-hidden group/thumb cursor-pointer select-none"
                  >
                    {post.imageUrl ? (
                      <div className="relative h-full w-full overflow-hidden bg-slate-900">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url(${post.imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                        {isAlbum && (post.photoCount || 0) > 1 && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1">
                              <Camera size={11} className="text-amber-400" />
                              <span>사진 {post.photoCount}장</span>
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                            {countryBadgeMap[post.countryCode] || post.countryCode}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-emerald-50/80 via-slate-50 to-teal-50/50 border-b border-slate-100 flex items-center justify-center">
                        {/* 흐릿한 로고 대표 이미지 (검은 상태 방지) */}
                        <div className="relative flex items-center justify-center pointer-events-none p-4">
                          <img
                            src="/logo.png"
                            alt="AAMEN"
                            className="max-h-16 w-auto object-contain opacity-25 filter blur-[0.4px] group-hover:scale-110 group-hover:opacity-40 transition-all duration-700"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-bold shadow-2xs border border-slate-200/80">
                            {countryBadgeMap[post.countryCode] || post.countryCode}
                          </span>
                        </div>
                      </div>
                    )}
                  </Link>

                  <div className="p-6">
                    {/* 카테고리 배지 */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cat.badgeClass}`}
                      >
                        <Icon size={12} />
                        <span>
                          {post.category === 'announce'
                            ? tComm('announcements')
                            : post.category === 'share'
                            ? tComm('share')
                            : tHome('tab_album')}
                        </span>
                      </span>
                    </div>

                    {/* 제목 */}
                    <Link
                      href={getLocalizedPath(isAlbum ? '/community/photos' : post.category === 'share' ? '/community/resources' : '/community/announce')}
                      className="block group-hover:text-emerald-700 transition-colors"
                    >
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug mb-2">
                        {post.title}
                      </h3>
                    </Link>

                    {/* 내용 요약 */}
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {post.content}
                    </p>
                  </div>
                </div>

                {/* 카드 하단 메타 정보 */}
                <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye size={13} className="text-slate-400" />
                      <span>{post.views}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={13} className="text-rose-400" />
                      <span>{post.likes}</span>
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 하단 전체 바로가기 버튼 */}
      <div className="mt-12 text-center">
        <Link
          href={getLocalizedPath('/community/announce')}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
        >
          <span>{tHome('recent_news_view_all')}</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  )
}
