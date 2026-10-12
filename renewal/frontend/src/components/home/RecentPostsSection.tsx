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
  category: 'announce' | 'board' | 'share' | 'album'
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

// 8개의 공지사항, 나눔터, 자료방 및 사진 앨범 최신 게시물 데이터
const communityLatestPosts: PostSummary[] = [
  {
    id: 'p_album_01',
    category: 'album',
    title: '베트남 하노이 가정교회 연합 예배 & 찬양 모임 사진 앨범',
    content:
      '하노이 지역 4개 메노나이트 가정교회 성도와 청년들이 함께 모여 찬양하고 친교를 나눈 은혜로운 현장 사진들을 공유합니다.',
    author: 'Nguyen Van Thanh',
    countryCode: 'VN',
    date: '2026-09-28',
    views: 342,
    likes: 78,
    commentCount: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    photoCount: 8,
  },
  {
    id: 'p_ann_01',
    category: 'announce',
    title: '2026 아시아 아나밥티스트 메노나이트 연합 수련회 개최 안내',
    content:
      '2026년 가을, 아시아 13개국 멘토와 청년들이 한자리에 모여 평화와 복음을 나누는 글로벌 연합 수련회가 열립니다. 각국 코디네이터를 통해 참가 신청을 받고 있으니 많은 기도와 참여를 바랍니다.',
    author: 'AAMEN 총괄본부',
    countryCode: 'KR',
    date: '2026-09-20',
    views: 312,
    likes: 54,
    commentCount: 4,
  },
  {
    id: 'p_album_02',
    category: 'album',
    title: '2026 네팔 카트만두 청년 평화 구축 워크숍 현장 스케치',
    content:
      '서로 다른 민족과 배경을 가진 네팔 청년 30여 명이 모여 그리스도의 비폭력 평화와 화해를 배우고 실천한 워크숍 현장 사진 모음입니다.',
    author: 'Sunita Shrestha',
    countryCode: 'NP',
    date: '2026-09-26',
    views: 289,
    likes: 65,
    commentCount: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    photoCount: 12,
  },
  {
    id: 'p_board_01',
    category: 'board',
    title: '미얀마 양곤 평화신학교 가을학기 개강 소식 나눕니다',
    content:
      '어려운 시국 속에서도 하나님 나라의 평화와 비폭력 복음을 배우고자 하는 30명의 신학생들이 이번 학기를 시작했습니다. 안전과 배움을 위해 13개국 성도님들의 기도를 부탁드립니다.',
    author: 'Zaw Min (미얀마 연합)',
    countryCode: 'MM',
    date: '2026-09-24',
    views: 189,
    likes: 38,
    commentCount: 3,
  },
  {
    id: 'p_share_01',
    category: 'share',
    title: '청소년을 위한 비폭력 평화 교육 워크시트 공유',
    content:
      '교회 주일학교 및 청소년부에서 바로 인쇄하여 활용할 수 있는 갈등 해결 실습 워크시트(PDF)를 공유합니다. 한국어와 영어 버전이 함께 포함되어 있습니다.',
    author: '이은혜 사역자',
    countryCode: 'KR',
    date: '2026-09-23',
    views: 280,
    likes: 62,
    commentCount: 5,
    fileName: 'Peace_Education_Worksheet.pdf',
  },
  {
    id: 'p_ann_02',
    category: 'announce',
    title: 'AAMEN 13개 언어 레슨 플랜 개정판 배포 소식',
    content:
      '아나밥티스트 7대 확신을 바탕으로 한 청소년/성인용 교육 교재 개정판이 13개국 언어로 완역되어 자료실에 업로드되었습니다. 각 지역 교회에서 무료로 내려받아 사용하실 수 있습니다.',
    author: '교육위원회',
    countryCode: 'KR',
    date: '2026-09-22',
    views: 245,
    likes: 41,
    commentCount: 2,
  },
  {
    id: 'p_album_03',
    category: 'album',
    title: '인도 차티스가르 메노나이트 교회 어린이 평화학교 사진',
    content:
      '소외된 농촌 지역 어린이들과 함께 성경 말씀을 배우고 평화 그림을 그리며 나눈 따뜻한 시간들의 기록입니다.',
    author: 'Rajesh Kumar',
    countryCode: 'IN',
    date: '2026-09-25',
    views: 254,
    likes: 52,
    commentCount: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80',
    photoCount: 6,
  },
  {
    id: 'p_share_02',
    category: 'share',
    title: '아나밥티스트 찬송가 모음집 오디오 음원 링크',
    content:
      '13개국 언어로 번역되어 불리는 대표적인 평화 찬양 음원과 악보 자료집 링크입니다. 주일 예배 찬양 시간 및 소그룹 기도 모임에서 유용하게 사용하실 수 있습니다.',
    author: '찬양사역팀',
    countryCode: 'KR',
    date: '2026-09-25',
    views: 215,
    likes: 49,
    commentCount: 2,
    fileName: 'AAMEN_Hymns_Audio_Pack.zip',
  },
]

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
    tabHref: '/community/announcements',
  },
  board: {
    label: '열린 나눔터',
    icon: MessageSquare,
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    tabHref: '/community/board',
  },
  share: {
    label: '자료 나눔방',
    icon: Share2,
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    tabHref: '/community/share',
  },
  album: {
    label: '사진첩',
    icon: Camera,
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    tabHref: '/history/photos',
  },
}

export default function RecentPostsSection() {
  const locale = useLocale()
  const tHome = useTranslations('home')
  const tComm = useTranslations('community')
  const [activeFilter, setActiveFilter] = useState<'all' | 'announce' | 'board' | 'share' | 'album'>('all')
  const [posts, setPosts] = useState<PostSummary[]>(communityLatestPosts)

  const getLocalizedPath = (path: string) => {
    return locale === 'ko' ? path : `/${locale}${path}`
  }

  // 서버 API로부터 실시간 최신글 동기화
  useEffect(() => {
    async function fetchLive() {
      try {
        const res = await fetch('/api/posts?limit=12&role=regular')
        const data = await res.json()
        if (data.success && data.data && data.data.length > 0) {
          const apiPosts = data.data
            .filter((p: any) => p.board_type !== 'prayer')
            .map((p: any) => ({
              id: p.id,
              category: (p.board_type === 'photos' || p.board_type === 'album' ? 'album' : p.board_type) as 'announce' | 'board' | 'share' | 'album',
              title: p.title,
              content: p.content,
              author: p.author_name,
              countryCode: p.author_country,
              date: p.created_at.substring(0, 10),
              views: p.views,
              likes: p.likes,
              commentCount: p.comments ? p.comments.length : 0,
            }))
          if (apiPosts.length > 0) {
            // 기존 앨범 데이터와 합쳐서 최신순 유지
            setPosts([...communityLatestPosts.filter(p => p.category === 'album'), ...apiPosts])
          }
        }
      } catch (e) {
        console.error('Failed to load live community posts:', e)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const cat = categoryInfo[post.category] || categoryInfo.board
          const Icon = cat.icon
          const isAlbum = post.category === 'album'

          return (
            <div
              key={post.id}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* 사진 앨범 전용 고화질 썸네일 */}
                {isAlbum && post.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${post.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1">
                        <Camera size={11} className="text-amber-400" />
                        <span>앨범 {post.photoCount || 4}장</span>
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                        {countryBadgeMap[post.countryCode] || post.countryCode}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* 카테고리 배지 & 국가 */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cat.badgeClass}`}
                    >
                      <Icon size={12} />
                      <span>
                        {post.category === 'announce'
                          ? tComm('announcements')
                          : post.category === 'board'
                          ? tComm('board')
                          : post.category === 'share'
                          ? tComm('share')
                          : tHome('tab_album')}
                      </span>
                    </span>

                    {!isAlbum && (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {countryBadgeMap[post.countryCode] || post.countryCode}
                      </span>
                    )}
                  </div>

                  {/* 제목 */}
                  <Link
                    href={getLocalizedPath(isAlbum ? '/community/photos' : `/community/${post.category === 'announce' ? 'announce' : 'resources'}`)}
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
