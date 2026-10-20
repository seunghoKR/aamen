'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import {
  Camera,
  Search,
  RefreshCw,
  X,
  Upload,
  Sparkles,
  Plus,
  Heart,
  MessageSquare,
  Send,
  Calendar,
  Share2,
  ArrowRight,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { getStoredUser, type AuthUser } from '@/lib/auth'
import { getStoredTierLevel, TIER_EVENT_NAME } from '@/components/common/GlobalTierSimulator'
import { optimizeMultipleImages, formatBytes, type OptimizedResult } from '@/lib/imageOptimizer'
import { translateTitleTo15Languages } from '@/lib/gemini'

interface HistoryPhotoPost {
  id: string
  board_type: string
  title: string
  content: string
  author_id: string
  author_name: string
  author_country: string
  author_role: string
  views: number
  likes: number
  is_pinned: boolean
  image_url?: string
  extra_json?: string
  created_at: string
  comments?: any[]
}

const countryFlags: Record<string, string> = {
  HK: '🇭🇰 홍콩 (Hong Kong)',
  ID: '🇮🇩 인도네시아 (Indonesia)',
  IN: '🇮🇳 인도 (India)',
  JP: '🇯🇵 일본 (Japan)',
  KH: '🇰🇭 캄보디아 (Cambodia)',
  KR: '🇰🇷 대한민국 (Korea)',
  LA: '🇱🇦 라오스 (Laos)',
  MM: '🇲🇲 미얀마 (Myanmar)',
  MN: '🇲🇳 몽골 (Mongolia)',
  NP: '🇳🇵 네팔 (Nepal)',
  PH: '🇵🇭 필리핀 (Philippines)',
  TH: '🇹🇭 태국 (Thailand)',
  TW: '🇹🇼 대만 (Taiwan)',
  US: '🇺🇸 미국 (USA / Global)',
  VN: '🇻🇳 베트남 (Vietnam)',
}

const NATIONS_15 = [
  { code: 'KR', flag: '🇰🇷', name: '대한민국 (Korea)' },
  { code: 'US', flag: '🇺🇸', name: '미국 (USA)' },
  { code: 'ID', flag: '🇮🇩', name: '인도네시아 (Indonesia)' },
  { code: 'TH', flag: '🇹🇭', name: '태국 (Thailand)' },
  { code: 'VN', flag: '🇻🇳', name: '베트남 (Vietnam)' },
  { code: 'MM', flag: '🇲🇲', name: '미얀마 (Myanmar)' },
  { code: 'IN', flag: '🇮🇳', name: '인도 (India)' },
  { code: 'NP', flag: '🇳🇵', name: '네팔 (Nepal)' },
  { code: 'JP', flag: '🇯🇵', name: '일본 (Japan)' },
  { code: 'KH', flag: '🇰🇭', name: '캄보디아 (Cambodia)' },
  { code: 'LA', flag: '🇱🇦', name: '라오스 (Laos)' },
  { code: 'MN', flag: '🇲🇳', name: '몽골 (Mongolia)' },
  { code: 'PH', flag: '🇵🇭', name: '필리핀 (Philippines)' },
  { code: 'HK', flag: '🇭🇰', name: '홍콩 (Hong Kong)' },
  { code: 'TW', flag: '🇹🇼', name: '대만 (Taiwan)' },
]

// 기본 역사 사진 데이터 (DB에 데이터가 없을 때 표시되는 공식 역사 마일스톤)
const defaultHistoryPosts: HistoryPhotoPost[] = [
  {
    id: 'hp_def_01',
    board_type: 'history_photos',
    title: '제1회 아시아 아나뱁티스트 평화 교육 컨퍼런스',
    content: '아시아 15개국 교회 지도자들과 평화 사역자들이 한자리에 모여 AAMEN의 공식 출범을 선포하고 평화 교육 헌장을 채택했습니다. 분쟁과 갈등이 깊은 아시아 땅에서 화해의 제자도를 살아내기로 결단한 역사적인 순간이었습니다.',
    author_id: 'admin',
    author_name: 'AAMEN 총괄위원회',
    author_country: 'TH',
    author_role: 'super_admin',
    views: 245,
    likes: 48,
    is_pinned: true,
    image_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    extra_json: JSON.stringify({
      location: '방콕 (Bangkok, Thailand)',
      flag: '🇹🇭',
      date: '2018-11-15',
      attendees: '15개국 대표단 120명',
      tags: ['AAMEN출범', '평화컨퍼런스', '15개국연합'],
      images: [
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
      ],
    }),
    created_at: '2018-11-15 10:00:00',
  },
  {
    id: 'hp_def_02',
    board_type: 'history_photos',
    title: '15개국 대표단 7대 레슨 플랜 집필 및 감수 워크숍',
    content: 'MWC 7대 확신을 아시아 청소년과 성도들이 이해하기 쉬운 12주 교안으로 집필하기 위해 각국 신학자와 교사들이 5일간 합숙하며 교재의 초안을 완성하고 다국어 번역 기준을 세웠습니다.',
    author_id: 'yongha',
    author_name: 'Bae Yongha',
    author_country: 'KR',
    author_role: 'country_admin',
    views: 198,
    likes: 36,
    is_pinned: false,
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    extra_json: JSON.stringify({
      location: '서울 (Seoul, Korea)',
      flag: '🇰🇷',
      date: '2022-06-20',
      attendees: '각국 교육분과 위원 35명',
      tags: ['교재집필', '레슨플랜', '신학교육'],
      images: [
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      ],
    }),
    created_at: '2022-06-20 14:00:00',
  },
  {
    id: 'hp_def_03',
    board_type: 'history_photos',
    title: '아시아 청년 메노나이트 평화 캠프 & 제자도 훈련',
    content: '인도네시아, 미얀마, 베트남, 필리핀 등 아시아 청년들이 모여 문화와 언어를 뛰어넘는 그리스도의 한 가족 됨을 체험했습니다. 평화 워크숍과 성만찬을 통해 다음 세대 지도자로서의 부르심을 확인했습니다.',
    author_id: 'paulus',
    author_name: 'Paulus S. Widjaja',
    author_country: 'ID',
    author_role: 'country_admin',
    views: 312,
    likes: 59,
    is_pinned: false,
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    extra_json: JSON.stringify({
      location: '욕야카르타 (Yogyakarta, Indonesia)',
      flag: '🇮🇩',
      date: '2023-08-10',
      attendees: '아시아 청년 85명',
      tags: ['청년평화캠프', '제자도', '문화교류'],
      images: [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      ],
    }),
    created_at: '2023-08-10 16:30:00',
  },
  {
    id: 'hp_def_04',
    board_type: 'history_photos',
    title: '아나뱁티스트 500주년 기념 아시아 연합 포럼 & 찬양 집회',
    content: '종교개혁과 아나뱁티스트 태동 500주년을 맞아 아시아 성도들이 순교자들의 신앙 유산을 기리며 비폭력 평화와 화해의 복음을 오늘의 아시아 상황 속에서 어떻게 실천할 것인지 선언했습니다.',
    author_id: 'hiro',
    author_name: 'Hiro Katano',
    author_country: 'JP',
    author_role: 'country_admin',
    views: 280,
    likes: 52,
    is_pinned: false,
    image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    extra_json: JSON.stringify({
      location: '도쿄 (Tokyo, Japan)',
      flag: '🇯🇵',
      date: '2025-05-12',
      attendees: '아시아 교회 150명',
      tags: ['500주년', '신앙유산', '평화선언'],
      images: [
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
      ],
    }),
    created_at: '2025-05-12 11:00:00',
  },
]

export default function HistoryPhotoBoard() {
  const locale = useLocale()
  const isKo = locale === 'ko'

  const [posts, setPosts] = useState<HistoryPhotoPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  // 권한 상태
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [currentLevel, setCurrentLevel] = useState<number>(0)

  // 사진 등록 모달 상태
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [photoTitle, setPhotoTitle] = useState('')
  const [photoTags, setPhotoTags] = useState('')
  const [photoDesc, setPhotoDesc] = useState('')
  const [photoImageUrls, setPhotoImageUrls] = useState<string[]>([])
  const [photoImageUrl, setPhotoImageUrl] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [optimizationSummary, setOptimizationSummary] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 라이트박스 (상세보기) 상태
  const [activeLightbox, setActiveLightbox] = useState<HistoryPhotoPost | null>(null)
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0)

  // 댓글 상태
  const [comments, setComments] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // 토스트 메시지
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 데이터 로드
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/posts.php?type=history_photos&limit=100')
      if (res.ok) {
        const json = await res.json()
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPosts(json.data)
        } else {
          // 서버에 등록된 history_photos 글이 아직 없으면 공식 마일스톤 사진 표시
          setPosts(defaultHistoryPosts)
        }
      } else {
        setPosts(defaultHistoryPosts)
      }
    } catch (e) {
      console.error('Failed to load history photos:', e)
      setPosts(defaultHistoryPosts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentUser(getStoredUser())
    setCurrentLevel(getStoredTierLevel())
    fetchPosts()

    const handleTier = (e: Event) => {
      const customEvent = e as CustomEvent<{ level: number }>
      if (customEvent.detail && typeof customEvent.detail.level === 'number') {
        setCurrentLevel(customEvent.detail.level)
      } else {
        setCurrentLevel(getStoredTierLevel())
      }
      setCurrentUser(getStoredUser())
    }

    window.addEventListener(TIER_EVENT_NAME, handleTier)
    return () => window.removeEventListener(TIER_EVENT_NAME, handleTier)
  }, [])

  // 다중 이미지 파일 업로드 핸들러
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingImage(true)
    setOptimizationSummary('사진 해상도 및 용량 자동 최적화 중...')

    try {
      const optimized = await optimizeMultipleImages(files, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
      })

      const totalOrig = optimized.reduce((s, it) => s + it.originalSize, 0)
      const totalComp = optimized.reduce((s, it) => s + it.compressedSize, 0)
      const ratio = totalOrig > 0 ? Math.round((1 - totalComp / totalOrig) * 100) : 0
      setOptimizationSummary(
        `✨ ${optimized.length}장 최적화 완료: ${formatBytes(totalOrig)} ➡️ ${formatBytes(totalComp)} (${ratio}% 경량화)`
      )

      const formData = new FormData()
      formData.append('type', 'posts')
      optimized.forEach((opt) => {
        formData.append('images[]', opt.file)
      })

      let res = await fetch('/api/upload.php', { method: 'POST', body: formData })
      if (!res.ok) {
        res = await fetch('/api/posts.php', { method: 'POST', body: formData })
      }

      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          const uploadedUrls: string[] = json.image_urls || (json.image_url ? [json.image_url] : [])
          if (uploadedUrls.length > 0) {
            setPhotoImageUrls((prev) => [...prev, ...uploadedUrls])
            if (!photoImageUrl) {
              setPhotoImageUrl(uploadedUrls[0])
            }
            showToast(`📸 ${uploadedUrls.length}장의 사진이 안전하게 등록되었습니다.`)
          }
        } else {
          alert(json.error || '사진 업로드 실패')
        }
      } else {
        alert('서버 업로드에 실패했습니다. (HTTP ' + res.status + ')')
      }
    } catch (err: any) {
      console.error(err)
      alert('사진 최적화 중 오류가 발생했습니다: ' + (err?.message || err))
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // 간소화된 사진 등록 완료 핸들러 (불필요한 4개 필드 제외)
  const handleCreatePhoto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photoTitle.trim() || !photoDesc.trim()) {
      alert('사진 제목과 사역 스토리를 모두 입력해 주세요.')
      return
    }

    if (photoImageUrls.length === 0 && !photoImageUrl) {
      alert('최소 1장 이상의 사진을 첨부해 주세요.')
      return
    }

    setIsSubmitting(true)
    showToast('사진 등록 및 다국어 번역 처리 중...')
    const user = getStoredUser()
    const userCountry = user?.country_code || 'KR'

    // 15개국 제목 자동 번역
    let titles: Record<string, string> = {}
    try {
      titles = await translateTitleTo15Languages(photoTitle.trim())
    } catch (err) {
      console.warn('Title translation warning:', err)
    }

    const parsedTags = photoTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)

    const allImages = photoImageUrls.length > 0 ? photoImageUrls : [photoImageUrl]
    const primaryImg = photoImageUrl || allImages[0] || ''

    const extraData = {
      location: countryFlags[userCountry]?.split(' ')[1] || 'Asia',
      date: new Date().toISOString().substring(0, 10),
      attendees: '',
      tags: parsedTags,
      flag: countryFlags[userCountry]?.split(' ')[0] || '🌐',
      images: allImages,
      titles,
    }

    try {
      const res = await fetch('/api/posts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_type: 'history_photos', // 🌟 역사와 교회 사진첩 전용 구분값!
          title: photoTitle.trim(),
          content: photoDesc.trim(),
          author_id: user?.id || 'worker',
          author_name: user?.name || 'AAMEN 역사사역자',
          author_country: userCountry,
          author_role: user?.role || 'level3_worker',
          image_url: primaryImg,
          extra_json: JSON.stringify(extraData),
        }),
      })

      if (res.ok) {
        showToast('🎉 역사와 교회 사진첩에 성공적으로 등록되었습니다!')
        setPhotoTitle('')
        setPhotoTags('')
        setPhotoDesc('')
        setPhotoImageUrls([])
        setPhotoImageUrl('')
        setOptimizationSummary(null)
        setIsPhotoModalOpen(false)
        await fetchPosts()
      } else {
        const data = await res.json()
        alert(data.error || '등록 중 오류가 발생했습니다.')
      }
    } catch (err) {
      console.error(err)
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 대표 사진 변경
  const handleSetPrimaryPhoto = (url: string) => {
    setPhotoImageUrl(url)
    showToast('★ 대표 썸네일로 설정되었습니다.')
  }

  // 사진 삭제
  const handleRemovePhotoItem = (index: number) => {
    const target = photoImageUrls[index]
    const nextList = photoImageUrls.filter((_, i) => i !== index)
    setPhotoImageUrls(nextList)
    if (photoImageUrl === target) {
      setPhotoImageUrl(nextList[0] || '')
    }
  }

  // 라이트박스 댓글 로드
  const fetchComments = async (postId: string) => {
    try {
      setLoadingComments(true)
      const res = await fetch(`/api/comments.php?post_id=${postId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setComments(data.data)
        }
      }
    } catch (e) {
      console.error('Failed to load comments:', e)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleOpenLightbox = (post: HistoryPhotoPost) => {
    setActiveLightbox(post)
    setLightboxImageIndex(0)
    fetchComments(post.id)
  }

  // 좋아요
  const handleLike = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try {
      const res = await fetch('/api/posts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', id: postId }),
      })
      if (res.ok) {
        const json = await res.json()
        const newLikes = json.data?.likes
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: newLikes ?? p.likes + 1 } : p))
        )
        if (activeLightbox && activeLightbox.id === postId) {
          setActiveLightbox((prev) => (prev ? { ...prev, likes: newLikes ?? prev.likes + 1 } : null))
        }
        showToast('💖 은혜를 나누어주셔서 감사합니다!')
      }
    } catch (err) {}
  }

  // 게시글 삭제
  const handleDeletePost = async (postId: string) => {
    if (!confirm('정말로 이 역사 사진 게시글을 삭제하시겠습니까?')) return
    try {
      const res = await fetch('/api/posts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: postId }),
      })
      if (res.ok) {
        showToast('게시글이 삭제되었습니다.')
        setActiveLightbox(null)
        setPosts((prev) => prev.filter((p) => p.id !== postId))
      }
    } catch (e) {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  // 댓글 작성
  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeLightbox || !newComment.trim()) return

    const user = getStoredUser()
    setIsSubmittingComment(true)
    try {
      const res = await fetch('/api/comments.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: activeLightbox.id,
          author_id: user?.id || 'guest',
          author_name: user?.name || 'AAMEN 성도',
          author_country: user?.country_code || 'KR',
          content: newComment.trim(),
        }),
      })
      if (res.ok) {
        setNewComment('')
        await fetchComments(activeLightbox.id)
        showToast('댓글이 등록되었습니다.')
      }
    } catch (e) {
      alert('댓글 등록 실패')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // WhatsApp 공유
  const shareViaWhatsApp = (title: string, desc: string) => {
    const message = `🕊️ *[AAMEN 역사와 교회 사진첩]*\n📸 *${title}*\n${desc}\n🔗 바로가기: https://aamen.net/history#photos`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  // 파싱 헬퍼
  const parseExtra = (post: HistoryPhotoPost) => {
    if (!post.extra_json) return {}
    try {
      return typeof post.extra_json === 'string' ? JSON.parse(post.extra_json) : post.extra_json
    } catch (e) {
      return {}
    }
  }

  // 필터링
  const filteredPosts = posts.filter((p) => {
    const matchCountry = selectedCountry === 'ALL' || p.author_country === selectedCountry
    const extra = parseExtra(p)
    const tagsStr = Array.isArray(extra.tags) ? extra.tags.join(' ') : ''
    const matchSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tagsStr.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCountry && matchSearch
  })

  const canWrite = currentLevel >= 2 || currentUser

  return (
    <div id="photos" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm mb-10">
      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* 1. 헤더 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 font-black text-xl text-gray-900">
            <Camera size={22} className="text-emerald-600" />
            <span>역사와 교회 사진첩 (History & Church Photos)</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              역사 갤러리
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            아시아 15개국 메노나이트 신앙의 발자취와 역사적인 사역 현장 사진과 스토리를 공유하는 전용 사진첩입니다.
          </p>
        </div>

        {/* 📷 사진등록 버튼: 커뮤니티로 이동하지 않고 이 페이지에서 모달 바로 오픈! */}
        <button
          type="button"
          onClick={() => {
            if (currentLevel === 0 && !currentUser) {
              alert('비회원은 사진을 등록할 수 없습니다. 로그인 후 이용해 주세요.')
              return
            }
            setIsPhotoModalOpen(true)
          }}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Camera size={14} />
          <span>사진등록</span>
        </button>
      </div>

      {/* 2. 15개국 필터 & 검색 바 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="w-full sm:w-56 shrink-0">
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full pl-3.5 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
              <option value="ALL">🌐 15개국 전체 국가</option>
              {NATIONS_15.map((n) => (
                <option key={n.code} value={n.code}>
                  {n.flag} {n.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="역사 사진 제목, 스토리, 태그로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <button
          onClick={fetchPosts}
          className="px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* 3. 사진 카드 목록 */}
      {loading ? (
        <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-gray-100">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">역사와 교회 사진첩을 불러오는 중입니다...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <Camera className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-700">등록된 사진이 없습니다.</p>
          <p className="text-xs text-gray-400 mt-1">우측 상단 [사진등록] 버튼을 눌러 역사 사역 사진을 등록해 보세요.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((item) => {
            const extra = parseExtra(item)
            const allImages = Array.isArray(extra.images) && extra.images.length > 0
              ? extra.images
              : [item.image_url || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80']
            const primaryImg = item.image_url || allImages[0]
            const flag = extra.flag || countryFlags[item.author_country]?.split(' ')[0] || '🌐'
            const location = extra.location || countryFlags[item.author_country]?.split(' ')[1] || item.author_country
            const dateStr = extra.date || (item.created_at ? item.created_at.substring(0, 10) : '')
            const tags: string[] = Array.isArray(extra.tags) ? extra.tags : []

            return (
              <div
                key={item.id}
                onClick={() => handleOpenLightbox(item)}
                className="group bg-gray-50/60 hover:bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/70 hover:border-emerald-300 shadow-2xs hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row gap-5"
              >
                {/* 썸네일 영역 */}
                <div className="md:w-72 lg:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden shrink-0 relative bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={primaryImg}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* 국기 및 위치 배지 */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold flex items-center gap-1.5 border border-white/20">
                    <span>{flag}</span>
                    <span>{location}</span>
                  </div>

                  {/* 다중 사진 배지 */}
                  {allImages.length > 1 && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-bold rounded-full border border-amber-300/30 flex items-center gap-1">
                      <Camera size={10} />
                      <span>{allImages.length}장</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 text-white text-[11px] font-mono opacity-90">
                    {dateStr}
                  </div>
                </div>

                {/* 스토리 영역 */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mb-2">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Calendar size={13} />
                        {dateStr}
                      </span>
                      <span>•</span>
                      <span>작성자: {item.author_name}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-gray-900 group-hover:text-emerald-700 transition-colors mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {item.content}
                    </p>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 하단 액션 바 */}
                  <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700 group-hover:underline flex items-center gap-1">
                      <span>자세히 보기 & 고화질 확대</span>
                      <ArrowRight size={13} />
                    </span>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => handleLike(item.id, e)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-rose-300 hover:text-rose-600 text-gray-600 flex items-center gap-1.5 transition-all shadow-2xs font-bold"
                      >
                        <Heart size={13} className="text-rose-500 fill-rose-500" />
                        <span>{item.likes || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => shareViaWhatsApp(item.title, `${location} (${dateStr}) - ${item.content}`)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-emerald-50 text-gray-700 flex items-center gap-1.5 transition-colors shadow-2xs font-bold"
                      >
                        <Share2 size={13} className="text-emerald-600" />
                        <span className="hidden sm:inline">WhatsApp 공유</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* =========================================================================
          4. 📷 간소화된 역사 사진 등록 모달 (사용자 요청: 국가, 도시, 일자, 인원, URL 입력 완전 제거)
         ========================================================================= */}
      {isPhotoModalOpen && (
        <div
          onClick={() => {
            if (!isSubmitting) setIsPhotoModalOpen(false)
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Camera className="text-purple-600" size={18} />
                <span>역사와 교회 사진 등록</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePhoto} className="space-y-4">
              {/* 1) 사진 제목 * */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">사진 제목 *</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="예: 제2회 아시아 아나뱁티스트 평화 워크숍 현장"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>

              {/* 2) 사역 사진 첨부 (여러 장 선택 가능 · 크기 자동 최적화) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    사역 사진 첨부 (여러 장 선택 가능 · 크기 자동 최적화)
                  </label>
                  <span className="text-[11px] text-purple-700 font-bold">
                    {photoImageUrls.length > 0 ? `${photoImageUrls.length}장 등록됨` : '최대 10장 권장'}
                  </span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="w-full py-3.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border-2 border-dashed border-purple-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <Upload size={16} />
                    <span>
                      {isUploadingImage
                        ? '고화질 최적화 및 업로드 중...'
                        : '📷 사진 여러 장 선택하기 (자동 리사이즈)'}
                    </span>
                  </button>
                </div>

                {/* 최적화 요약 안내 */}
                {optimizationSummary && (
                  <div className="mb-3 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <Sparkles size={14} className="text-emerald-600 shrink-0" />
                    <span>{optimizationSummary}</span>
                  </div>
                )}

                {/* 다중 이미지 미리보기 그리드 */}
                {photoImageUrls.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <div className="text-[11px] font-bold text-gray-500 flex items-center justify-between">
                      <span>미리보기 (첫 번째 사진이 목록 대표 썸네일로 사용됩니다)</span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-purple-600 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>사진 더 추가하기</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto p-2 bg-gray-50/80 rounded-2xl border border-gray-200">
                      {photoImageUrls.map((url, idx) => {
                        const isPrimary = photoImageUrl === url || (!photoImageUrl && idx === 0)
                        return (
                          <div
                            key={idx}
                            className={`group relative h-24 rounded-xl overflow-hidden border-2 transition-all ${
                              isPrimary
                                ? 'border-purple-600 shadow-md ring-2 ring-purple-400/30'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`사진 ${idx + 1}`} className="w-full h-full object-cover" />

                            {isPrimary ? (
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-purple-600 text-white rounded text-[9px] font-black shadow-xs">
                                ★ 대표
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryPhoto(url)}
                                className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 hover:bg-purple-600 text-white rounded text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              >
                                대표로
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemovePhotoItem(idx)}
                              className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                              title="이 사진 삭제"
                            >
                              <X size={11} />
                            </button>

                            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] text-center py-0.5 backdrop-blur-2xs">
                              사진 {idx + 1}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3) 태그 (쉼표로 구분) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={photoTags}
                  onChange={(e) => setPhotoTags(e.target.value)}
                  placeholder="평화역사, 아나뱁티스트, 메노나이트, 15개국연합"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* 4) 사역 스토리 / 설명 * */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">사역 스토리 / 설명 *</label>
                <textarea
                  required
                  rows={4}
                  value={photoDesc}
                  onChange={(e) => setPhotoDesc(e.target.value)}
                  placeholder="사역 현장의 은혜로운 이야기와 역사적 의미를 기록해 주세요..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
                />
              </div>

              {/* 버튼 바 */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? '등록 중...' : '사진 등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. 🔍 상세 라이트박스 팝업 (댓글 & 좋아요 & 삭제 지원)
         ========================================================================= */}
      {activeLightbox && (() => {
        const extra = parseExtra(activeLightbox)
        const allImages = Array.isArray(extra.images) && extra.images.length > 0
          ? extra.images
          : [activeLightbox.image_url || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80']
        const currentImgIndex = Math.min(Math.max(0, lightboxImageIndex), allImages.length - 1)
        const currentImg = allImages[currentImgIndex]
        const flag = extra.flag || countryFlags[activeLightbox.author_country]?.split(' ')[0] || '🌐'
        const location = extra.location || countryFlags[activeLightbox.author_country]?.split(' ')[1] || activeLightbox.author_country
        const dateStr = extra.date || (activeLightbox.created_at ? activeLightbox.created_at.substring(0, 10) : '')
        const tags: string[] = Array.isArray(extra.tags) ? extra.tags : []

        const canDelete =
          currentLevel >= 4 ||
          (currentUser && currentUser.id === activeLightbox.author_id)

        return (
          <div
            onClick={() => setActiveLightbox(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col md:flex-row"
            >
              {/* 좌측: 고화질 사진 뷰어 + 슬라이더 */}
              <div className="md:w-3/5 bg-slate-950 flex flex-col justify-between relative min-h-[300px] md:min-h-[500px]">
                <div className="flex-1 relative flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImg}
                    alt={activeLightbox.title}
                    className="max-h-[55vh] md:max-h-[75vh] w-auto max-w-full object-contain"
                  />

                  {/* 이전/다음 버튼 */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* 하단 썸네일 스트립 */}
                {allImages.length > 1 && (
                  <div className="p-2.5 bg-black/50 backdrop-blur-md flex items-center justify-center gap-2 overflow-x-auto">
                    {allImages.map((img: string, i: number) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setLightboxImageIndex(i)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          i === currentImgIndex
                            ? 'border-emerald-400 scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 우측: 상세 정보 & 댓글 영역 */}
              <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[92vh] bg-white">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200">
                      <span>{flag}</span>
                      <span>{location}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveLightbox(null)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="text-xs text-gray-400 font-mono mb-2">
                    {dateStr} • {activeLightbox.author_name}
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mb-3 leading-snug">
                    {activeLightbox.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                    {activeLightbox.content}
                  </p>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 댓글 섹션 */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <MessageSquare size={13} className="text-purple-600" />
                        <span>댓글 ({comments.length})</span>
                      </span>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {loadingComments ? (
                        <p className="text-xs text-gray-400">댓글을 불러오는 중...</p>
                      ) : comments.length === 0 ? (
                        <p className="text-xs text-gray-400">첫 번째 은혜의 나눔 댓글을 남겨보세요.</p>
                      ) : (
                        comments.map((c) => (
                          <div key={c.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                              <span className="font-bold text-gray-800">{c.author_name}</span>
                              <span>{(c.created_at || '').substring(0, 10)}</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{c.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* 댓글 입력 폼 */}
                    <form onSubmit={handleCreateComment} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="은혜로운 격려 댓글을 남겨주세요..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                      >
                        <Send size={12} />
                      </button>
                    </form>
                  </div>
                </div>

                {/* 하단 바: 좋아요 & 공유 & 삭제 */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLike(activeLightbox.id)}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Heart size={14} className="fill-rose-500" />
                      <span>{activeLightbox.likes || 0}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => shareViaWhatsApp(activeLightbox.title, activeLightbox.content)}
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Share2 size={14} />
                      <span>공유</span>
                    </button>
                  </div>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeletePost(activeLightbox.id)}
                      className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-500 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>삭제</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
