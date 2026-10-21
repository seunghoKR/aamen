'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  Camera,
  Search,
  PlusCircle,
  Eye,
  Heart,
  Flame,
  MessageCircle,
  X,
  Upload,
  Calendar,
  MapPin,
  Share2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import { getStoredUser } from '@/lib/auth'
import { getStoredTierLevel, TIER_EVENT_NAME, TIER_STORAGE_KEY } from '@/components/common/GlobalTierSimulator'
import { MemberLevel } from '@/lib/store'
import { optimizeMultipleImages } from '@/lib/imageOptimizer'
import { NATIONS_15 } from '@/components/community/communityI18n'
import { translateTitleTo15Languages, translateSingleGoogle } from '@/lib/gemini'

interface Comment {
  id: string
  author_name: string
  author_country: string
  author_role: string
  content: string
  created_at: string
}

interface HistoryPost {
  id: string
  board_type: string
  title: string
  content: string
  category?: string
  author_id?: string
  author_name: string
  author_country: string
  author_role: string
  views: number
  likes: number
  is_pinned: boolean
  amen_count: number
  image_url?: string
  extra_json?: string
  created_at: string
  updated_at?: string
  comments?: Comment[]
}

const countryBadgeMap: Record<string, string> = {
  KR: '🇰🇷 한국',
  US: '🇺🇸 미국',
  HK: '🇭🇰 홍콩',
  ID: '🇮🇩 인도네시아',
  IN: '🇮🇳 인도',
  JP: '🇯🇵 일본',
  KH: '🇰🇭 캄보디아',
  LA: '🇱🇦 라오스',
  MM: '🇲🇲 미얀마',
  MN: '🇲🇳 몽골',
  NP: '🇳🇵 네팔',
  PH: '🇵🇭 필리핀',
  TH: '🇹🇭 태국',
  TW: '🇹🇼 대만',
  VN: '🇻🇳 베트남',
}

export default function HistoryPhotosView() {
  const locale = useLocale()
  const isEn = locale === 'en'

  const [posts, setPosts] = useState<HistoryPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('ALL')
  const [currentLevel, setCurrentLevel] = useState<MemberLevel>(2)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // 모달 상태
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<HistoryPost | null>(null)
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  // 새 글 작성 폼
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 15개국 실시간 번역 캐시 상태
  const [runtimeTitles, setRuntimeTitles] = useState<Record<string, string>>({})

  // 언어별 게시물 제목 추출 헬퍼 (extra_json.titles[locale] 우선, 실시간 번역 캐시 차선)
  const getPostTitle = (p?: HistoryPost | null, langCode: string = locale): string => {
    if (!p) return ''
    let extra: any = {}
    try {
      extra = typeof p.extra_json === 'string' ? JSON.parse(p.extra_json) : p.extra_json || {}
    } catch (e) {}

    if (extra?.titles && typeof extra.titles === 'object' && extra.titles[langCode]) {
      return extra.titles[langCode]
    }
    const cacheKey = `${p.id}_${langCode}`
    if (runtimeTitles[cacheKey]) {
      return runtimeTitles[cacheKey]
    }
    return p.title || ''
  }

  // 댓글 입력
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  // 사용자 및 레벨 동기화
  useEffect(() => {
    const user = getStoredUser()
    setCurrentUser(user)
    if (user && user.role) {
      if (user.role === 'super_admin' || user.role === 'developer') setCurrentLevel(5)
      else if (user.role === 'country_admin') setCurrentLevel(4)
      else if (user.role === 'level3_worker') setCurrentLevel(3)
      else if (user.role === 'associate') setCurrentLevel(1)
      else setCurrentLevel(2)
    } else {
      setCurrentLevel(getStoredTierLevel())
    }

    const handleTier = (e: any) => {
      const lvl = e.detail?.level ?? getStoredTierLevel()
      setCurrentLevel(lvl)
    }
    window.addEventListener(TIER_EVENT_NAME, handleTier)
    return () => window.removeEventListener(TIER_EVENT_NAME, handleTier)
  }, [])

  // 게시물 목록 불러오기
  const fetchPosts = async () => {
    setLoading(true)
    try {
      const roleParam = currentLevel === 0 ? 'guest' : currentLevel === 1 ? 'associate' : currentLevel >= 4 ? 'country_admin' : 'regular'
      let res = await fetch(`/api/posts.php?type=history_photos&search=${encodeURIComponent(searchTerm)}&country=${selectedCountry}&role=${roleParam}`)
      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        res = await fetch(`/api/posts?type=history_photos&search=${encodeURIComponent(searchTerm)}&country=${selectedCountry}&role=${roleParam}`)
      }
      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [searchTerm, selectedCountry, currentLevel])

  // 언어 변경 시 번역 데이터가 없는 게시물에 대해 비동기 자동 번역
  useEffect(() => {
    let isMounted = true
    const needTranslation = posts.filter((p) => {
      let extra: any = {}
      try {
        extra = typeof p.extra_json === 'string' ? JSON.parse(p.extra_json) : p.extra_json || {}
      } catch (e) {}
      const hasPrecomputed = extra?.titles && extra.titles[locale]
      const hasRuntime = runtimeTitles[`${p.id}_${locale}`]
      return !hasPrecomputed && !hasRuntime && Boolean(p.title)
    })

    if (needTranslation.length === 0) return

    const runTranslations = async () => {
      for (const p of needTranslation.slice(0, 8)) {
        try {
          const translated = await translateSingleGoogle(p.title, locale)
          if (isMounted && translated && translated !== p.title) {
            setRuntimeTitles((prev) => ({
              ...prev,
              [`${p.id}_${locale}`]: translated,
            }))
          }
        } catch (e) {}
      }
    }
    runTranslations()
    return () => {
      isMounted = false
    }
  }, [posts, locale, runtimeTitles])

  // 단일 게시물 상세 조회
  const loadPostDetail = async (id: string) => {
    try {
      const roleParam = currentLevel === 0 ? 'guest' : currentLevel === 1 ? 'associate' : currentLevel >= 4 ? 'country_admin' : 'regular'
      let res = await fetch(`/api/posts.php?id=${id}&role=${roleParam}`)
      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        res = await fetch(`/api/posts?id=${id}&role=${roleParam}`)
      }
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          setSelectedPost(data.data)
          setActiveImageIdx(0)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  // 좋아요 액션
  const handleLike = async (id: string) => {
    try {
      let res = await fetch(`/api/posts.php?id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      })
      if (!res.ok) {
        res = await fetch(`/api/posts?id=${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'like' }),
        })
      }
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
        )
        if (selectedPost && selectedPost.id === id) {
          setSelectedPost((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null))
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  // 댓글 등록
  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return
    if (currentLevel < 2) {
      showToast(isEn ? 'Regular members (Tier 2+) can write comments.' : '정회원(2단계) 이상만 댓글을 작성할 수 있습니다.')
      return
    }

    setIsSubmittingComment(true)
    try {
      const authorName = currentUser?.name || '성도'
      const authorCountry = currentUser?.countryCode || 'KR'
      const authorRole = currentUser?.role || 'regular'

      let res = await fetch('/api/comments.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          content: newComment,
          author_name: authorName,
          author_country: authorCountry,
          author_role: authorRole,
        }),
      })
      if (!res.ok) {
        res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            post_id: postId,
            content: newComment,
            author_name: authorName,
            author_country: authorCountry,
            author_role: authorRole,
          }),
        })
      }
      if (res.ok) {
        setNewComment('')
        loadPostDetail(postId)
        showToast(isEn ? 'Comment posted successfully.' : '댓글이 등록되었습니다.')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // 게시물 삭제
  const handleDeletePost = async (id: string) => {
    const confirmMsg = isEn ? 'Are you sure you want to delete this photo album?' : '정말 이 사진첩 게시물을 삭제하시겠습니까?'
    if (!confirm(confirmMsg)) return

    try {
      let res = await fetch(`/api/posts.php?id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete' }),
      })
      if (!res.ok) {
        res = await fetch(`/api/posts?id=${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete' }),
        })
      }
      if (res.ok) {
        setSelectedPost(null)
        setPosts((prev) => prev.filter((p) => p.id !== id))
        showToast(isEn ? 'Post deleted.' : '게시물이 삭제되었습니다.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  // 다중 이미지 파일 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingImages(true)
    try {
      const optimized = await optimizeMultipleImages(Array.from(files), {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.85,
      })

      const formData = new FormData()
      formData.append('type', 'posts')
      optimized.forEach((item) => {
        formData.append('images[]', item.file)
      })

      let res = await fetch('/api/posts.php', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        res = await fetch('/api/upload.php', {
          method: 'POST',
          body: formData,
        })
      }

      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.image_urls)) {
          setUploadedImageUrls((prev) => [...prev, ...data.image_urls])
        } else if (data.success && data.image_url) {
          setUploadedImageUrls((prev) => [...prev, data.image_url])
        }
      } else {
        alert(isEn ? 'Failed to upload images.' : '사진 업로드에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      alert(isEn ? 'Error uploading images.' : '사진 처리 중 오류가 발생했습니다.')
    } finally {
      setIsUploadingImages(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // 새 글 등록 제출
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) {
      alert(isEn ? 'Please fill in both title and content.' : '제목과 내용을 모두 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const authorId = currentUser?.id || 'admin'
      const authorName = currentUser?.name || 'AAMEN 사역자'
      const authorRole = currentUser?.role || 'level3_worker'
      const userCountry = currentUser?.country_code || currentUser?.countryCode || 'KR'

      // 15개국 공식 언어로 제목 자동 번역
      let titles: Record<string, string> = {}
      try {
        titles = await translateTitleTo15Languages(newTitle.trim())
      } catch (err) {
        console.warn('History photo title translation warning:', err)
      }

      const extraJson = JSON.stringify({
        image_urls: uploadedImageUrls,
        flag: countryBadgeMap[userCountry]?.split(' ')[0] || '🌐',
        countryName: countryBadgeMap[userCountry] || userCountry,
        titles,
      })

      const payload = {
        board_type: 'history_photos',
        title: newTitle.trim(),
        content: newContent.trim(),
        category: null,
        author_id: authorId,
        author_name: authorName,
        author_country: userCountry,
        author_role: authorRole,
        image_url: uploadedImageUrls[0] || '',
        extra_json: extraJson,
        is_pinned: currentLevel >= 4 ? 1 : 0,
      }

      let res = await fetch('/api/posts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        setIsNewModalOpen(false)
        setNewTitle('')
        setNewContent('')
        setUploadedImageUrls([])
        fetchPosts()
        showToast(isEn ? 'History photo album created!' : '역사와교회 사진첩에 새 앨범이 등록되었습니다!')
      } else {
        alert(isEn ? 'Failed to save post.' : '게시물 등록에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      alert(isEn ? 'Network error saving post.' : '네트워크 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 이미지 목록 파싱 헬퍼
  const getPostImages = (post: HistoryPost): string[] => {
    const urls: string[] = []
    if (post.image_url) urls.push(post.image_url)
    if (post.extra_json) {
      try {
        const parsed = JSON.parse(post.extra_json)
        if (Array.isArray(parsed.image_urls)) {
          parsed.image_urls.forEach((u: string) => {
            if (u && !urls.includes(u)) urls.push(u)
          })
        }
      } catch (e) {}
    }
    return urls
  }

  // 사역자/관리자 등록 권한
  const canWritePhoto = currentLevel >= 3

  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* 상단 네비게이션 & 헤더 배너 */}
          <div className="mb-6">
            <Link
              href="/history"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl transition-colors mb-4 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{isEn ? 'Back to History & Churches' : '← 역사와 교회 걸어온 길로 돌아가기'}</span>
            </Link>
          </div>

          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
                  Heritage & Photo Board
                </span>
                <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight flex items-center gap-3">
                  <Camera className="w-8 h-8 text-emerald-400" />
                  <span>{isEn ? 'History & Church Photos' : '역사와교회 사진첩'}</span>
                </h1>
                <p className="text-white/85 text-sm sm:text-base max-w-2xl leading-relaxed">
                  {isEn
                    ? 'A dedicated photo gallery capturing historical milestones, conferences, and field ministries of Anabaptist Mennonite churches across 15 Asian nations.'
                    : '아시아 땅에 뿌리내린 아나밥티스트 메노나이트 신앙의 발자취와 15개국 교회들의 역사적인 순간, 연합 사역의 생생한 사진을 나누는 게시판입니다.'}
                </p>
              </div>

              {/* 사진 등록 버튼 */}
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (currentLevel === 0) {
                      showToast(isEn ? 'Please log in to register photos.' : '비회원은 사진을 등록할 수 없습니다. 로그인 후 이용해 주세요.')
                      return
                    }
                    if (!canWritePhoto) {
                      showToast(isEn ? 'Level 3 Worker/Leader approval required.' : '🔒 역사 사진첩 등록은 3단계 사역자/선교사 이상 권한이 필요합니다.')
                      return
                    }
                    setIsNewModalOpen(true)
                  }}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-105"
                >
                  <PlusCircle size={17} />
                  <span>{isEn ? 'Register History Photo' : '역사 사진 등록'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 검색 및 15개국 국가 필터 */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={isEn ? 'Search photo title, story, or author...' : '사진 제목, 역사적 내용, 작성자로 검색...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="w-full sm:w-60 shrink-0">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ALL">🌐 {isEn ? 'All 15 Nations' : '15개국 전체'}</option>
                {NATIONS_15.map((n) => (
                  <option key={n.code} value={n.code}>
                    {n.flag} {n.name[locale as 'ko' | 'en'] || n.name.en} ({n.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 사진 목록 매거진 카드 그리드 */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-500">{isEn ? 'Loading photos...' : '역사와교회 사진첩을 불러오는 중입니다...'}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-gray-200">
              <Camera size={44} className="text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-700 mb-1">
                {isEn ? 'No photo albums found.' : '등록된 역사와교회 사진첩이 없습니다.'}
              </h3>
              <p className="text-xs text-gray-400 mb-5">
                {isEn ? 'Be the first to share a historic church photo!' : '첫 번째 역사적인 사역 사진을 등록해 보세요!'}
              </p>
              {canWritePhoto && (
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  {isEn ? 'Register Photo' : '사진 등록하기'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const images = getPostImages(post)
                const thumb = images[0] || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
                const flagDisplay = countryBadgeMap[post.author_country] || post.author_country

                return (
                  <div
                    key={post.id}
                    onClick={() => loadPostDetail(post.id)}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-200/90 hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* 썸네일 영역 */}
                      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        
                        {/* 국가 및 장수 배지 */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                            {flagDisplay}
                          </span>
                        </div>
                        {images.length > 1 && (
                          <div className="absolute bottom-3 right-3">
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-600/90 text-white text-[10px] font-black backdrop-blur-sm flex items-center gap-1">
                              <Camera size={11} />
                              <span>{images.length}장</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 본문 정보 */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          {post.category && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                              {post.category}
                            </span>
                          )}
                          <span className="text-[11px] text-gray-400 font-mono">
                            {(post.created_at || '').substring(0, 10)}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
                          {getPostTitle(post)}
                        </h3>

                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    {/* 카드 하단 메타 */}
                    <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span className="font-bold text-gray-700 truncate max-w-[130px]">
                        {post.author_name}
                      </span>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Eye size={12} className="text-gray-400" />
                          <span>{post.views}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-rose-500 font-bold">
                          <Heart size={12} />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                          <MessageCircle size={12} />
                          <span>{post.comments ? post.comments.length : 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          상세 모달 (Detail Modal with Image Slideshow & Comments)
         ========================================================================= */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95">
            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* 이미지 슬라이드쇼 영역 */}
            {(() => {
              const images = getPostImages(selectedPost)
              const curImg = images[activeImageIdx] || images[0]

              return (
                <div className="relative bg-slate-950 w-full h-72 sm:h-96 shrink-0 flex items-center justify-center overflow-hidden">
                  {curImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={curImg}
                      alt={selectedPost.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-500 text-xs flex flex-col items-center gap-1">
                      <ImageIcon size={32} />
                      <span>{isEn ? 'No photo available' : '사진이 없습니다.'}</span>
                    </div>
                  )}

                  {/* 좌우 이동 컨트롤 */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-bold">
                        {activeImageIdx + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              )
            })()}

            {/* 본문 정보 영역 */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {selectedPost.category && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-black">
                        {selectedPost.category}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-bold">
                      {countryBadgeMap[selectedPost.author_country] || selectedPost.author_country}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400 font-mono">
                    {(selectedPost.created_at || '').substring(0, 16)}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 leading-snug">
                  {getPostTitle(selectedPost)}
                </h2>

                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-6 bg-gray-50/60 p-4 rounded-2xl border border-gray-100">
                  {selectedPost.content}
                </div>

                {/* 작성자 & 액션 버튼 */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-bold text-gray-900">{selectedPost.author_name}</span>
                    <span>•</span>
                    <span>{countryBadgeMap[selectedPost.author_country] || selectedPost.author_country}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 좋아요 버튼 */}
                    <button
                      type="button"
                      onClick={() => handleLike(selectedPost.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Heart size={14} className="fill-rose-500" />
                      <span>{selectedPost.likes}</span>
                    </button>

                    {/* WhatsApp 공유 */}
                    <button
                      type="button"
                      onClick={() => {
                        const url = `https://aamen.net/history/photos`
                        const text = `📸 [AAMEN 역사와교회 사진첩]\n${getPostTitle(selectedPost)}\n\n${selectedPost.content.substring(0, 100)}...\n\n바로보기: ${url}`
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Share2 size={13} />
                      <span>{isEn ? 'Share' : '공유'}</span>
                    </button>

                    {/* 작성자 또는 관리자 삭제 버튼 */}
                    {(currentLevel >= 4 || currentUser?.id === selectedPost.author_id) && (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(selectedPost.id)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title={isEn ? 'Delete post' : '게시물 삭제'}
                      >
                        <Trash2 size={13} />
                        <span>{isEn ? 'Delete' : '삭제'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 댓글 목록 */}
                <div className="mt-6">
                  <h4 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                    <MessageCircle size={16} className="text-emerald-600" />
                    <span>{isEn ? 'Comments' : '은혜의 댓글'}</span>
                    <span className="text-xs text-gray-400">
                      ({selectedPost.comments ? selectedPost.comments.length : 0})
                    </span>
                  </h4>

                  <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                    {(!selectedPost.comments || selectedPost.comments.length === 0) ? (
                      <p className="text-xs text-gray-400 py-3 text-center">
                        {isEn ? 'No comments yet. Leave the first encouragement!' : '아직 작성된 댓글이 없습니다. 첫 번째 격려의 글을 남겨주세요!'}
                      </p>
                    ) : (
                      selectedPost.comments.map((c) => (
                        <div key={c.id} className="p-3 bg-gray-50 rounded-xl text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-800">{c.author_name}</span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {(c.created_at || '').substring(0, 16)}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* 댓글 작성 폼 */}
                  {currentLevel >= 2 ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={isEn ? 'Write an encouraging comment...' : '성도들과 나눌 따뜻한 격려의 댓글을 입력하세요...'}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(selectedPost.id)
                        }}
                        className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(selectedPost.id)}
                        disabled={isSubmittingComment}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                      >
                        {isSubmittingComment ? (isEn ? 'Posting...' : '등록중') : (isEn ? 'Post' : '등록')}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 bg-gray-50 p-2.5 rounded-xl text-center">
                      🔒 {isEn ? 'Log in with Regular member tier to leave a comment.' : '정회원(2단계) 이상 로그인 시 댓글을 작성하실 수 있습니다.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          새 사진 등록 모달 (New Photo Modal)
         ========================================================================= */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsNewModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Camera size={22} className="text-emerald-600" />
              <h2 className="text-xl font-black text-gray-900">
                {isEn ? 'Register History & Church Photo' : '역사와교회 사진첩 등록'}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              {isEn
                ? 'Upload historic milestone photos, conference memories, and church fellowship stories.'
                : '아시아 아나밥티스트 교회의 역사적인 순간과 연합 사역의 사진을 등록해 주세요.'}
            </p>

            <form onSubmit={handleCreatePost} className="space-y-5">
              {/* 제목 */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                  {isEn ? 'Album Title' : '사진첩 제목'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? 'e.g. 1st Asian Anabaptist Peace Conference' : '예: 제1회 아시아 아나밥티스트 평화 교육 컨퍼런스'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* 제목 15개국 자동 번역 안내 배지 */}
              <div className="-mt-3 flex items-center gap-1.5 px-3 py-2 bg-emerald-50/80 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-medium">
                <Sparkles size={14} className="text-emerald-600 shrink-0" />
                <span>
                  {isEn
                    ? '✨ The title is automatically translated into all 15 official nation languages upon registration.'
                    : '✨ 제목은 등록 시 15개 회원국 공식 언어로 실시간 자동 번역되어 전 세계 성도들에게 표시됩니다.'}
                </span>
              </div>

              {/* 사진 첨부 영역 */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1.5 flex items-center justify-between">
                  <span>{isEn ? 'Upload Photos (Multiple)' : '사진 첨부 (여러 장 선택 가능)'}</span>
                  <span className="text-[11px] text-gray-400 font-normal">
                    {uploadedImageUrls.length}장 첨부됨
                  </span>
                </label>

                <div className="flex flex-wrap gap-2.5 mb-2">
                  {uploadedImageUrls.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setUploadedImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImages}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/50 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-emerald-700 transition-all cursor-pointer"
                  >
                    <Upload size={18} />
                    <span className="text-[10px] font-bold">
                      {isUploadingImages ? (isEn ? 'Optimizing' : '최적화중') : (isEn ? 'Add Photo' : '사진 추가')}
                    </span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-[11px] text-gray-400">
                  {isEn
                    ? 'Photos are automatically resized and optimized for high quality viewing.'
                    : '사진은 고화질로 자동 최적화 및 압축되어 빠르게 등록됩니다.'}
                </p>
              </div>

              {/* 내용 / 스토리 */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                  {isEn ? 'Historical Story & Details' : '역사 스토리 및 상세 설명'} *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder={isEn ? 'Describe the historical significance, attendees, and memories...' : '해당 역사적 순간의 배경, 참여 인원, 신앙의 고백 등을 자유롭게 작성해 주세요.'}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {isEn ? 'Cancel' : '취소'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImages}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (isEn ? 'Submitting...' : '등록 중...') : (isEn ? 'Publish Album' : '사진첩 게시하기')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 토스트 알림 */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <Sparkles size={14} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <Footer />
    </div>
  )
}
