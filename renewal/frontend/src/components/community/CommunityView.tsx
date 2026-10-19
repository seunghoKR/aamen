'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LivePrayerWall from '@/components/community/LivePrayerWall'
import {
  Bell,
  Heart,
  PlusCircle,
  Search,
  Eye,
  FileText,
  Send,
  Check,
  Flame,
  Lock,
  Unlock,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  ExternalLink,
  MessageCircle,
  FolderOpen,
  Camera,
  Layers,
  Globe,
  X,
  Calendar,
  MapPin,
  Users,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  ArrowRight,
} from 'lucide-react'
import {
  MemberLevel,
  MemberRole,
  defaultTierSettings,
  MemberTierInfo,
} from '@/lib/store'
import { getStoredTierLevel, TIER_EVENT_NAME, TIER_STORAGE_KEY } from '@/components/common/GlobalTierSimulator'
import { getStoredUser } from '@/lib/auth'
import {
  optimizeImage,
  optimizeMultipleImages,
  formatBytes,
  OptimizedResult,
} from '@/lib/imageOptimizer'

interface Comment {
  id: string
  author_name: string
  author_country: string
  author_role: string
  content: string
  created_at: string
}

interface Post {
  id: string
  board_type: 'board' | 'share' | 'announce' | 'prayer' | 'resources' | 'photos'
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
  comments: Comment[]
}

const countryFlags: Record<string, string> = {
  KR: '🇰🇷 대한민국',
  MM: '🇲🇲 미얀마',
  VN: '🇻🇳 베트남',
  TH: '🇹🇭 태국',
  ID: '🇮🇩 인도네시아',
  JP: '🇯🇵 일본',
  NP: '🇳🇵 네팔',
  IN: '🇮🇳 인도',
  KH: '🇰🇭 캄보디아',
  LA: '🇱🇦 라오스',
  MN: '🇲🇳 몽골',
  TW: '🇹🇼 대만',
  US: '🇺🇸 미국',
}

const resourceCategories: { id: string; label: string }[] = [
  { id: 'ALL', label: '전체' },
  { id: 'curriculum', label: '커리큘럼' },
  { id: 'education', label: '교육자료' },
  { id: 'worship', label: '예배자료' },
  { id: 'praise', label: '찬양자료' },
  { id: 'books', label: '서적/팜플렛' },
]

type CommunityTab = 'announce' | 'resources' | 'prayer' | 'photos'

interface Props {
  initialTab?: 'board' | 'share' | 'announce' | 'prayer' | 'resources' | 'photos' | 'announcements'
}

export default function CommunityView({ initialTab = 'announce' }: Props) {
  const normalizeTab = (t?: string): CommunityTab => {
    if (t === 'prayer') return 'prayer'
    if (t === 'photos' || t === 'photo') return 'photos'
    if (t === 'resources' || t === 'share' || t === 'board') return 'resources'
    return 'announce'
  }

  const [activeTab, setActiveTab] = useState<CommunityTab>(normalizeTab(initialTab))
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // 공지사항 한/영 필터 ('ALL' | 'KO' | 'EN')
  const [noticeLangFilter, setNoticeLangFilter] = useState<'ALL' | 'KO' | 'EN'>('ALL')

  // 자료방 5대 카테고리 및 13개국 언어 필터
  const [resourceCategory, setResourceCategory] = useState<string>('ALL')
  const [resourceLang, setResourceLang] = useState<string>('ALL')

  // 사진첩 라이트박스 모달 상태
  const [activeLightbox, setActiveLightbox] = useState<Post | null>(null)

  // 5단계 회원 등급 시뮬레이션
  const [currentLevel, setCurrentLevel] = useState<MemberLevel>(4)
  const [tierPermissions, setTierPermissions] = useState<Record<MemberLevel, MemberTierInfo>>(defaultTierSettings)

  // 상세 모달 & 글쓰기 모달들
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 📢 공지사항 등록 모달 상태 (이미지 첨부 지원)
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false)
  const [noticeTitle, setNoticeTitle] = useState('')
  const [noticeContent, setNoticeContent] = useState('')
  const [noticeCountry, setNoticeCountry] = useState('KR')
  const [noticeIsPinned, setNoticeIsPinned] = useState(false)
  const [noticeImageUrl, setNoticeImageUrl] = useState('')
  const [isUploadingNoticeImage, setIsUploadingNoticeImage] = useState(false)
  const noticeFileInputRef = useRef<HTMLInputElement>(null)

  // 📚 자료 등록 모달 상태 (실제 파일 업로드 연동)
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)
  const [resTitle, setResTitle] = useState('')
  const [resCategory, setResCategory] = useState('curriculum')
  const [resLang, setResLang] = useState('KR')
  const [resFileUrl, setResFileUrl] = useState('')
  const [resFileType, setResFileType] = useState('PDF')
  const [resFileSize, setResFileSize] = useState('2.5 MB')
  const [resFileName, setResFileName] = useState('')
  const [isUploadingResourceFile, setIsUploadingResourceFile] = useState(false)
  const [resDesc, setResDesc] = useState('')
  const resFileInputRef = useRef<HTMLInputElement>(null)

  // 📸 사진 등록 모달 상태 (다중 업로드 + 자동 리사이즈)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [photoTitle, setPhotoTitle] = useState('')
  const [photoDesc, setPhotoDesc] = useState('')
  const [photoCountry, setPhotoCountry] = useState('KR')
  const [photoLocation, setPhotoLocation] = useState('Seoul, Korea')
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().substring(0, 10))
  const [photoAttendees, setPhotoAttendees] = useState('')
  const [photoTags, setPhotoTags] = useState('')
  const [photoImageUrl, setPhotoImageUrl] = useState('')
  const [photoImageUrls, setPhotoImageUrls] = useState<string[]>([])
  const [optimizedPreviews, setOptimizedPreviews] = useState<OptimizedResult[]>([])
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [optimizationSummary, setOptimizationSummary] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 사진첩 라이트박스 다중 이미지 인덱스 상태
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0)

  // 권한 설정 로드
  useEffect(() => {
    setCurrentLevel(getStoredTierLevel())
    try {
      const savedPerms = localStorage.getItem('aamen_tier_permissions')
      if (savedPerms) {
        setTierPermissions(JSON.parse(savedPerms))
      }
    } catch (e) {}

    const handleTierChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ level: MemberLevel }>
      if (customEvent.detail && customEvent.detail.level) {
        setCurrentLevel(customEvent.detail.level)
      } else {
        setCurrentLevel(getStoredTierLevel())
      }
    }

    window.addEventListener(TIER_EVENT_NAME, handleTierChange)
    return () => {
      window.removeEventListener(TIER_EVENT_NAME, handleTierChange)
    }
  }, [])

  const currentTierInfo = tierPermissions[currentLevel] || defaultTierSettings[currentLevel]
  const canWriteNotice = currentLevel >= 4
  const canWriteResource = currentLevel >= 3
  const canWritePhoto = currentLevel >= 3
  const isLeaderOrAdmin = currentLevel >= 4

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 💬 WhatsApp 공유 헬퍼
  const shareViaWhatsApp = (title: string, desc: string, linkPath = '/community') => {
    const fullUrl = `https://aamen.net${linkPath}`
    const message = `🕊️ *[AAMEN 아시아 소통광장]*\n📌 *${title}*\n${desc}\n🔗 확인하기: ${fullUrl}`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  // DB API에서 게시물 목록 패치 (공지사항, 자료방, 사진첩)
  const fetchPosts = useCallback(async () => {
    if (activeTab === 'prayer') {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const roleParam = currentLevel === 0 ? 'guest' : currentLevel === 1 ? 'associate' : currentLevel >= 4 ? 'country_admin' : 'regular'
      const res = await fetch(`/api/posts?type=${activeTab}&search=${encodeURIComponent(searchTerm)}&role=${roleParam}`)
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setPosts(data.data)
        } else {
          setPosts([])
        }
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error(error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [activeTab, searchTerm, currentLevel])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // 공지 단일 상세 조회
  const handleOpenDetail = async (postId: string) => {
    setIsDetailLoading(true)
    try {
      const roleParam = currentLevel === 0 ? 'guest' : currentLevel === 1 ? 'associate' : currentLevel >= 4 ? 'country_admin' : 'regular'
      const res = await fetch(`/api/posts?id=${postId}&role=${roleParam}`)
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json()
        if (data.success) {
          setSelectedPost(data.data)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsDetailLoading(false)
    }
  }

  // 게시물 삭제 핸들러 (관리자/작성자)
  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (!confirm(`정말로 [${postTitle}] 게시물을 삭제하시겠습니까?`)) return

    try {
      // POST 액션 디스패치로 서버 메소드 제한 없이 100% 확실하게 삭제
      const res = await fetch('/api/posts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id: postId,
        }),
      })
      if (res.ok) {
        showToast('게시물이 성공적으로 삭제되었습니다.')
        setPosts((prev) => prev.filter((p) => p.id !== postId))
        if (selectedPost?.id === postId) setSelectedPost(null)
        if (activeLightbox?.id === postId) setActiveLightbox(null)
      } else {
        showToast('게시물 삭제 중 오류가 발생했습니다.')
      }
    } catch (e) {
      console.error(e)
      showToast('네트워크 오류가 발생했습니다.')
    }
  }

  // 📢 공지사항 등록
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      alert('제목과 내용을 모두 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    const user = getStoredUser()
    const extraData = {
      image_url: noticeImageUrl.trim() || undefined,
    }

    try {
      const res = await fetch('/api/posts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_type: 'announce',
          title: noticeTitle.trim(),
          content: noticeContent.trim(),
          author_id: user?.id || 'admin',
          author_name: user?.name || 'AAMEN 운영본부',
          author_country: noticeCountry,
          author_role: 'country_admin',
          is_pinned: noticeIsPinned ? 1 : 0,
          image_url: noticeImageUrl.trim() || undefined,
          extra_json: JSON.stringify(extraData),
        }),
      })

      if (res.ok) {
        showToast('✨ 새 공지사항이 등록되었습니다.')
        setNoticeTitle('')
        setNoticeContent('')
        setNoticeImageUrl('')
        setIsNoticeModalOpen(false)
        fetchPosts()
      } else {
        alert('공지사항 등록에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      alert('서버 통신 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 📢 공지사항 이미지 업로드 핸들러
  const handleNoticeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingNoticeImage(true)
    try {
      const optimized = await optimizeImage(file, { maxWidth: 1600, quality: 0.85 })
      const formData = new FormData()
      formData.append('type', 'notices')
      formData.append('image', optimized.file)

      const res = await fetch('/api/upload.php', { method: 'POST', body: formData })
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.image_url) {
          setNoticeImageUrl(json.image_url)
          showToast('📸 공지 포스터 이미지가 등록되었습니다.')
        } else {
          alert(json.error || '이미지 업로드 실패')
        }
      } else {
        // posts.php fallback
        const fbRes = await fetch('/api/posts.php', { method: 'POST', body: formData })
        if (fbRes.ok) {
          const json = await fbRes.json()
          if (json.success && json.image_url) {
            setNoticeImageUrl(json.image_url)
            showToast('📸 공지 포스터 이미지가 등록되었습니다.')
          }
        }
      }
    } catch (err) {
      console.error(err)
      alert('공지 이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploadingNoticeImage(false)
      if (noticeFileInputRef.current) noticeFileInputRef.current.value = ''
    }
  }

  // 📚 자료 등록
  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resTitle.trim() || !resDesc.trim()) {
      alert('자료 제목과 설명을 모두 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    const user = getStoredUser()
    const extraData = {
      lang: resLang,
      fileUrl: resFileUrl.trim() || '#',
      fileType: resFileType,
      fileSize: resFileSize,
      fileName: resFileName || resTitle.trim(),
      date: new Date().toISOString().substring(0, 10),
    }

    try {
      const res = await fetch('/api/posts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_type: 'resources',
          category: resCategory,
          title: resTitle.trim(),
          content: resDesc.trim(),
          author_id: user?.id || 'worker',
          author_name: user?.name || '교육사역팀',
          author_country: resLang === 'ALL' ? 'KR' : resLang,
          author_role: 'level3_worker',
          image_url: resFileUrl.trim(),
          extra_json: JSON.stringify(extraData),
        }),
      })

      if (res.ok) {
        showToast('✨ 새 교육/예배 자료가 등록되었습니다.')
        setResTitle('')
        setResDesc('')
        setResFileUrl('')
        setResFileName('')
        setIsResourceModalOpen(false)
        fetchPosts()
      } else {
        alert('자료 등록에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      alert('서버 통신 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 📚 자료실 실제 파일(PDF, HWP, ZIP 등) 업로드 핸들러
  const handleResourceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingResourceFile(true)
    try {
      const formData = new FormData()
      formData.append('type', 'resources')
      formData.append('file', file)

      const res = await fetch('/api/upload.php', { method: 'POST', body: formData })
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setResFileUrl(json.file_url)
          setResFileName(json.file_name || file.name)
          if (json.file_size) setResFileSize(json.file_size)
          if (json.file_type) setResFileType(json.file_type)
          if (!resTitle.trim()) {
            setResTitle(file.name.substring(0, file.name.lastIndexOf('.')) || file.name)
          }
          showToast(`📁 [${file.name}] 자료 파일이 업로드되었습니다.`)
        } else {
          alert(json.error || '자료 파일 업로드 실패')
        }
      } else {
        alert('자료 파일 서버 업로드에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      alert('자료 파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploadingResourceFile(false)
      if (resFileInputRef.current) resFileInputRef.current.value = ''
    }
  }

  // 📸 이미지 파일 다중 업로드 및 브라우저 자동 리사이즈 핸들러
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingImage(true)
    setOptimizationSummary('사진 해상도 및 용량 자동 최적화 중...')

    try {
      // 1. 브라우저 Canvas로 스마트폰 4K 고화질 원본 자동 리사이징 & 고품질 압축
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

      // 2. FormData에 다중 이미지 탑재 (다중 전용 모드로 전송)
      const formData = new FormData()
      formData.append('type', 'posts')
      optimized.forEach((opt) => {
        formData.append('images[]', opt.file)
      })

      // 3. 서버 업로드 전송 (upload.php 우선, fallback posts.php)
      let res = await fetch('/api/upload.php', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        res = await fetch('/api/posts.php', {
          method: 'POST',
          body: formData,
        })
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
            setOptimizedPreviews((prev) => [...prev, ...optimized])
            showToast(`📸 ${uploadedUrls.length}장의 사진이 안전하게 등록되었습니다.`)
          }
        } else {
          alert(json.error || '사진 업로드 실패')
        }
      } else {
        alert('서버 업로드에 실패했습니다. (HTTP ' + res.status + ')')
      }
    } catch (err) {
      console.error(err)
      alert('사진 최적화 및 업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // 업로드된 사진 목록에서 개별 삭제
  const handleRemovePhotoItem = (index: number) => {
    setPhotoImageUrls((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      if (photoImageUrl === prev[index]) {
        setPhotoImageUrl(updated[0] || '')
      }
      return updated
    })
    setOptimizedPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // 대표 사진 설정
  const handleSetPrimaryPhoto = (url: string) => {
    setPhotoImageUrl(url)
    showToast('★ 대표 썸네일로 설정되었습니다.')
  }

  // 📸 사진 등록 완료 처리
  const handleCreatePhoto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photoTitle.trim() || !photoDesc.trim()) {
      alert('사진 제목과 사역 스토리를 모두 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    const user = getStoredUser()
    const parsedTags = photoTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)

    const allImages = photoImageUrls.length > 0 
      ? photoImageUrls 
      : photoImageUrl ? [photoImageUrl] : []

    const primaryImg = photoImageUrl || allImages[0] || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80'

    const extraData = {
      location: photoLocation.trim() || 'Asia',
      date: photoDate,
      attendees: photoAttendees.trim() || '참석',
      tags: parsedTags,
      flag: countryFlags[photoCountry]?.split(' ')[0] || '🌐',
      images: allImages,
    }

    try {
      const res = await fetch('/api/posts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board_type: 'photos',
          title: photoTitle.trim(),
          content: photoDesc.trim(),
          author_id: user?.id || 'worker',
          author_name: user?.name || '현장사역자',
          author_country: photoCountry,
          author_role: 'level3_worker',
          image_url: primaryImg,
          extra_json: JSON.stringify(extraData),
        }),
      })

      if (res.ok) {
        showToast('✨ 새 사역 현장 사진이 등록되었습니다.')
        setPhotoTitle('')
        setPhotoDesc('')
        setPhotoImageUrl('')
        setPhotoImageUrls([])
        setOptimizedPreviews([])
        setOptimizationSummary(null)
        setPhotoTags('')
        setPhotoAttendees('')
        setIsPhotoModalOpen(false)
        fetchPosts()
      } else {
        alert('사진 등록에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      alert('서버 통신 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 헬퍼: extra_json 파싱
  const parseExtra = (post: Post) => {
    if (!post.extra_json) return {}
    try {
      return JSON.parse(post.extra_json)
    } catch (e) {
      return {}
    }
  }

  // 헬퍼: 게시물 대표 이미지 추출 (공지사항, 자료방, 사진첩 통일)
  const getPostImageUrl = (post: Post | null | undefined): string | null => {
    if (!post) return null
    if (post.image_url && post.image_url.trim()) return post.image_url.trim()
    const extra = parseExtra(post)
    if (extra.image_url && typeof extra.image_url === 'string' && extra.image_url.trim()) {
      return extra.image_url.trim()
    }
    if (Array.isArray(extra.images) && extra.images.length > 0) {
      return extra.images[0]
    }
    return null
  }

  // 공지사항 필터링
  const filteredNoticePosts = posts.filter((p) => {
    if (noticeLangFilter === 'ALL') return true
    if (noticeLangFilter === 'KO') return p.author_country === 'KR' || p.title.match(/[\uAC00-\uD7AF]/)
    if (noticeLangFilter === 'EN') return p.author_country !== 'KR' || !p.title.match(/[\uAC00-\uD7AF]/)
    return true
  })

  // 자료방 필터링
  const filteredResources = posts.filter((p) => {
    const extra = parseExtra(p)
    const matchCat = resourceCategory === 'ALL' || (p.category || 'education') === resourceCategory
    const matchLang = resourceLang === 'ALL' || (extra.lang || p.author_country) === resourceLang || extra.lang === 'ALL'
    const matchSearch =
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCat && matchLang && matchSearch
  })

  // 사진첩 필터링
  const filteredPhotos = posts.filter((p) => {
    const extra = parseExtra(p)
    const tagsStr = (extra.tags || []).join(' ')
    return (
      !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (extra.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tagsStr.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <Header />

      {/* 알림 토스트 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-500/40 animate-in fade-in slide-in-from-bottom-2 text-sm font-semibold">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 상단 타이틀 배너 */}
          <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-sky-900 text-white rounded-3xl p-8 sm:p-10 mb-8 shadow-md">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-widest mb-3 backdrop-blur-sm">
              AAMEN Asian Fellowship & Network
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">소통 광장</h1>
            <p className="text-white/85 text-sm sm:text-base max-w-2xl leading-relaxed">
              공지사항, 교육 자료방, 13개국 실시간 기도의 벽, 생생한 사역 사진첩을 통해 아시아 메노나이트 평화 공동체가 하나로 이어집니다.
            </p>
          </div>

          {/* 4대 핵심 게시판 탭 버튼 */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'announce', label: '📢 공지사항 (Notice)' },
                { id: 'resources', label: '📚 자료방 (Resources)' },
                { id: 'prayer', label: '🙏 함께 기도해요 (Prayer)' },
                { id: 'photos', label: '📸 사진첩 (Photos)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as CommunityTab)
                    setSearchTerm('')
                  }}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 탭별 신규 등록 액션 버튼 */}
            {activeTab === 'announce' && (
              <button
                onClick={() => {
                  if (currentLevel === 0) {
                    showToast('🚫 비회원은 글을 작성할 수 없습니다. 로그인 후 이용해 주세요.')
                    return
                  }
                  if (!canWriteNotice) {
                    showToast('🔒 공지사항 작성은 리더 및 관리자(4단계 이상) 권한이 필요합니다.')
                    return
                  }
                  setIsNoticeModalOpen(true)
                }}
                className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-sm transition-all bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>공지사항 등록</span>
              </button>
            )}

            {activeTab === 'resources' && (
              <button
                onClick={() => {
                  if (currentLevel === 0) {
                    showToast('🚫 비회원은 자료를 등록할 수 없습니다. 로그인 후 이용해 주세요.')
                    return
                  }
                  if (!canWriteResource) {
                    showToast('🔒 자료 등록은 3단계 사역자/선교사 이상 권한이 필요합니다.')
                    return
                  }
                  setIsResourceModalOpen(true)
                }}
                className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-sm transition-all bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>새 자료 등록</span>
              </button>
            )}

            {activeTab === 'photos' && (
              <button
                onClick={() => {
                  if (currentLevel === 0) {
                    showToast('🚫 비회원은 사진을 등록할 수 없습니다. 로그인 후 이용해 주세요.')
                    return
                  }
                  if (!canWritePhoto) {
                    showToast('🔒 사진첩 등록은 3단계 사역자/선교사 이상 승인이 필요합니다.')
                    return
                  }
                  setIsPhotoModalOpen(true)
                }}
                className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-sm transition-all bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>현장 사진 등록</span>
              </button>
            )}
          </div>

          {/* =========================================================================
              1. 📢 공지사항 (한/영 2개 국어 전용 리더 라운지)
             ========================================================================= */}
          {activeTab === 'announce' && (
            <div>
              {/* 리더 전용 라운지 안내 배너 & 언어 필터 */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    🌐
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                      <span>아시아 리더 공지 라운지 (Korean & English Dual Lounge)</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black">
                        리더 전용
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      아시아 13개국 코디네이터와 리더 회원들을 위해 한국어(KO)와 영어(EN) 2개 국어로 운영되는 공식 알림판입니다.
                    </p>
                  </div>
                </div>

                {/* 한/영 필터 스위처 */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-emerald-200 self-stretch sm:self-auto justify-center">
                  {[
                    { id: 'ALL', label: '🌐 전체 (ALL)' },
                    { id: 'KO', label: '🇰🇷 한국어 (KO)' },
                    { id: 'EN', label: '🇺🇸 English (EN)' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setNoticeLangFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        noticeLangFilter === f.id
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-gray-600 hover:text-emerald-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 검색 및 새로고침 */}
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="공지사항 제목 또는 내용 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                  />
                </div>
                <button
                  onClick={fetchPosts}
                  className="px-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">새로고침</span>
                </button>
              </div>

              {/* 공지 목록 */}
              {loading ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">공지사항을 불러오는 중입니다...</p>
                </div>
              ) : filteredNoticePosts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-2xs">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-700 font-bold text-sm mb-1">등록된 공지사항이 없습니다.</p>
                  <p className="text-xs text-gray-400 mb-4">공지사항 등록 버튼을 눌러 첫 번째 소식을 전해 보세요.</p>
                  {canWriteNotice && (
                    <button
                      onClick={() => setIsNoticeModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs cursor-pointer"
                    >
                      <PlusCircle size={14} />
                      <span>공지사항 등록</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredNoticePosts.map((post) => {
                    const postImg = getPostImageUrl(post)
                    return (
                      <div
                        key={post.id}
                        onClick={() => handleOpenDetail(post.id)}
                        className="group bg-white rounded-2xl border border-gray-200/90 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col sm:flex-row items-stretch gap-5 p-4 sm:p-5"
                      >
                        {/* 1. 이미지 (썸네일/포스터) */}
                        <div className="w-full sm:w-56 sm:min-w-[224px] h-44 sm:h-auto rounded-xl overflow-hidden bg-slate-100 relative shrink-0">
                          {postImg ? (
                            <img
                              src={postImg}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full min-h-[140px] bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 flex flex-col items-center justify-center p-4 text-white text-center">
                              <Bell className="w-8 h-8 text-emerald-200 mb-2 opacity-90 group-hover:scale-110 transition-transform" />
                              <span className="text-[11px] font-black tracking-wider text-emerald-100 uppercase">
                                AAMEN NOTICE
                              </span>
                              <span className="text-[10px] text-emerald-200/80 mt-0.5">공식 공지사항</span>
                            </div>
                          )}
                          {post.is_pinned && (
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-xs flex items-center gap-1">
                              <span>📌</span>
                              <span>고정</span>
                            </span>
                          )}
                        </div>

                        {/* 2. 제목 + 내용 + 메타 정보 */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            {/* 배지 & 일시 */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-black text-[10px]">
                                {post.author_country === 'KR' ? '🇰🇷 KO 한국어' : '🇺🇸 EN English'}
                              </span>
                              <span className="text-xs text-gray-500 font-medium">
                                {post.created_at.substring(0, 10)}
                              </span>
                              {post.author_name && (
                                <span className="text-xs text-gray-500 font-medium">
                                  · by {post.author_name}
                                </span>
                              )}
                            </div>

                            {/* 제목 */}
                            <h4 className="font-extrabold text-base sm:text-lg text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2 leading-snug">
                              {post.title}
                            </h4>

                            {/* 내용 */}
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                              {post.content.replace(/<[^>]*>?/gm, '')}
                            </p>
                          </div>

                          {/* 하단 액션 바 */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                              <span>공지 전문 읽기</span>
                              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  shareViaWhatsApp(post.title, post.content.substring(0, 80))
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Share2 size={13} />
                                <span>WhatsApp</span>
                              </button>
                              {isLeaderOrAdmin && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeletePost(post.id, post.title)
                                  }}
                                  className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="삭제"
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              2. 📚 자료방 (5대 카테고리 + 13개국 언어 스위처)
             ========================================================================= */}
          {activeTab === 'resources' && (
            <div>
              {/* 자료방 상단 안내 바 */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    📚
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-sky-950 flex items-center gap-2">
                      <span>교육 및 예배 자료 나눔방 (AAMEN Resource Library)</span>
                      <span className="px-2 py-0.5 rounded-full bg-sky-200 text-sky-900 text-[10px] font-black">
                        13개국 자료실
                      </span>
                    </h3>
                    <p className="text-xs text-sky-700 mt-0.5">
                      아시아 주일학교 공과 교재, 찬양집, 예배 순서지, 소책자를 각국 모국어로 무료 다운로드하실 수 있습니다.
                    </p>
                  </div>
                </div>

                {/* 5대 카테고리 필터 */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {resourceCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setResourceCategory(cat.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        resourceCategory === cat.id
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white text-gray-700 border border-sky-200 hover:bg-sky-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 13개 참여국 필터 칩 바 */}
              <div className="bg-white p-3.5 rounded-2xl border border-gray-200 mb-6 flex items-center gap-2 overflow-x-auto text-xs">
                <span className="font-black text-gray-700 shrink-0 ml-1">국가 선택:</span>
                {[
                  { id: 'ALL', label: '전체 (ALL)' },
                  { id: 'ID', label: '🇮🇩 인도네시아 (ID)' },
                  { id: 'IN', label: '🇮🇳 인도 (IN)' },
                  { id: 'JP', label: '🇯🇵 일본 (JP)' },
                  { id: 'KH', label: '🇰🇭 캄보디아 (KH)' },
                  { id: 'KR', label: '🇰🇷 대한민국 (KR)' },
                  { id: 'LA', label: '🇱🇦 라오스 (LA)' },
                  { id: 'MM', label: '🇲🇲 미얀마 (MM)' },
                  { id: 'MN', label: '🇲🇳 몽골 (MN)' },
                  { id: 'NP', label: '🇳🇵 네팔 (NP)' },
                  { id: 'TH', label: '🇹🇭 태국 (TH)' },
                  { id: 'TW', label: '🇹🇼 대만 (TW)' },
                  { id: 'US', label: '🇺🇸 미국 (US)' },
                  { id: 'VN', label: '🇻🇳 베트남 (VN)' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setResourceLang(l.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      resourceLang === l.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* 검색 바 */}
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="교안 제목, 설명, 언어로 자료 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                  />
                </div>
                <button
                  onClick={fetchPosts}
                  className="px-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">새로고침</span>
                </button>
              </div>

              {/* 자료 리스트 카드 그리드 */}
              {loading ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                  <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">자료를 불러오는 중입니다...</p>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-2xs">
                  <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-700 font-bold text-sm mb-1">등록된 교육 및 예배 자료가 없습니다.</p>
                  <p className="text-xs text-gray-400 mb-4">새 자료 등록 버튼을 눌러 교재와 예배 자료를 공유해 보세요.</p>
                  {canWriteResource && (
                    <button
                      onClick={() => setIsResourceModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 shadow-xs cursor-pointer"
                    >
                      <PlusCircle size={14} />
                      <span>새 자료 등록</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredResources.map((res) => {
                    const extra = parseExtra(res)
                    const catLabel = resourceCategories.find((c) => c.id === res.category)?.label || res.category || '자료'
                    const langLabel = countryFlags[extra.lang || res.author_country] || extra.lang || res.author_country || '통합'

                    return (
                      <div
                        key={res.id}
                        className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold">
                              {catLabel}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-gray-400">
                              {langLabel} · {extra.fileType || 'PDF'}
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-gray-900 mb-1.5 leading-snug">{res.title}</h4>
                          <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">{res.content}</p>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] text-gray-400 font-mono">
                            {extra.fileSize ? `용량: ${extra.fileSize}` : res.created_at.substring(0, 10)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => shareViaWhatsApp(res.title, `[AAMEN 자료실] ${res.content}`)}
                              className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-700 transition-colors"
                              title="WhatsApp으로 공유"
                            >
                              <Share2 size={14} />
                            </button>
                            {extra.fileUrl && extra.fileUrl !== '#' ? (
                              <a
                                href={extra.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Download size={13} />
                                <span>다운로드</span>
                              </a>
                            ) : (
                              <button
                                onClick={() => alert(`[${res.title}] 자료 상세 준비 중입니다.`)}
                                className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Download size={13} />
                                <span>다운로드</span>
                              </button>
                            )}
                            {isLeaderOrAdmin && (
                              <button
                                onClick={() => handleDeletePost(res.id, res.title)}
                                className="p-1.5 rounded-xl text-gray-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="삭제"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              3. 🙏 함께 기도해요 (LivePrayerWall)
             ========================================================================= */}
          {activeTab === 'prayer' && <LivePrayerWall />}

          {/* =========================================================================
              4. 📸 사진첩 (목록에 이미지와 내용이 함께 표시되는 매거진 스타일)
             ========================================================================= */}
          {activeTab === 'photos' && (
            <div>
              {/* 사진첩 헤더 바 */}
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    📸
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-purple-950 flex items-center gap-2">
                      <span>아시아 사역 현장 사진첩 (Ministry Photo Gallery)</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[10px] font-black">
                        생생한 현장
                      </span>
                    </h3>
                    <p className="text-xs text-purple-700 mt-0.5">
                      13개국 메노나이트 평화 사역자들과 성도들의 감동적인 사역 현장 사진과 스토리를 나눕니다.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (currentLevel === 0) {
                      showToast('🚫 비회원은 사진을 등록할 수 없습니다. 로그인 후 이용해 주세요.')
                      return
                    }
                    if (!canWritePhoto) {
                      showToast('🔒 사진첩 등록은 3단계 사역자/선교사 이상 승인이 필요합니다.')
                      return
                    }
                    setIsPhotoModalOpen(true)
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Camera size={14} />
                  <span>현장 사진 등록</span>
                </button>
              </div>

              {/* 검색 바 */}
              <div className="flex gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="사역 사진 제목, 국가, 내용으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                  />
                </div>
                <button
                  onClick={fetchPosts}
                  className="px-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">새로고침</span>
                </button>
              </div>

              {/* 사진첩 카드 리스트 */}
              {loading ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                  <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">사진첩을 불러오는 중입니다...</p>
                </div>
              ) : filteredPhotos.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-2xs">
                  <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-700 font-bold text-sm mb-1">등록된 사역 현장 사진이 없습니다.</p>
                  <p className="text-xs text-gray-400 mb-4">현장 사진 등록 버튼을 눌러 은혜로운 사역 현장을 공유해 보세요.</p>
                  {canWritePhoto && (
                    <button
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 shadow-xs cursor-pointer"
                    >
                      <Camera size={14} />
                      <span>현장 사진 등록</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPhotos.map((photo) => {
                    const extra = parseExtra(photo)
                    const imgUrl = photo.image_url || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80'
                    const flagText = extra.flag || countryFlags[photo.author_country]?.split(' ')[0] || '🌐'
                    const locationText = extra.location || photo.author_country || 'Asia'
                    const dateText = extra.date || photo.created_at.substring(0, 10)
                    const attendeesText = extra.attendees || ''
                    const tagsList: string[] = Array.isArray(extra.tags) ? extra.tags : []

                    const imagesList: string[] = Array.isArray(extra.images) && extra.images.length > 0 ? extra.images : [imgUrl]

                    return (
                      <div
                        key={photo.id}
                        onClick={() => {
                          setLightboxImageIndex(0)
                          setActiveLightbox(photo)
                        }}
                        className="group rounded-3xl overflow-hidden bg-white border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          {/* 썸네일 이미지 */}
                          <div className="relative h-52 overflow-hidden bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[11px] font-bold flex items-center gap-1.5">
                              <span>{flagText}</span>
                              <span>{locationText}</span>
                            </div>
                            {imagesList.length > 1 && (
                              <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/70 text-white text-[10px] font-black rounded-lg backdrop-blur-sm flex items-center gap-1">
                                <ImageIcon size={11} />
                                <span>+{imagesList.length}장</span>
                              </div>
                            )}
                            {attendeesText && (
                              <div className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-purple-600/90 text-white text-[10px] font-black rounded-lg backdrop-blur-sm">
                                {attendeesText}
                              </div>
                            )}
                          </div>

                          {/* 본문 내용 */}
                          <div className="p-5">
                            <div className="text-[11px] font-mono text-purple-700 font-bold mb-1.5 flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{dateText}</span>
                            </div>
                            <h4 className="font-black text-base text-gray-900 group-hover:text-purple-700 transition-colors mb-2 leading-snug">
                              {photo.title}
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
                              {photo.content}
                            </p>

                            {/* 사역 태그 */}
                            {tagsList.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {tagsList.map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 카드 하단 액션 바 */}
                        <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-bold text-purple-700 group-hover:underline">
                            크게 보기 & 스토리 →
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                shareViaWhatsApp(photo.title, `${locationText} · ${photo.content}`)
                              }}
                              className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 text-gray-500 transition-colors"
                              title="WhatsApp으로 사진 소식 전송"
                            >
                              <Share2 size={13} />
                            </button>
                            {isLeaderOrAdmin && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeletePost(photo.id, photo.title)
                                }}
                                className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                                title="사진 삭제"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 📸 사진첩 라이트박스 팝업 (다중 이미지 갤러리 슬라이더 탑재) */}
      {activeLightbox && (() => {
        const extra = parseExtra(activeLightbox)
        const allImages: string[] = Array.isArray(extra.images) && extra.images.length > 0 
          ? extra.images 
          : [activeLightbox.image_url || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80']
        
        const currentImgIndex = Math.min(Math.max(0, lightboxImageIndex), allImages.length - 1)
        const currentImgUrl = allImages[currentImgIndex] || allImages[0]

        const flagText = extra.flag || countryFlags[activeLightbox.author_country]?.split(' ')[0] || '🌐'
        const locationText = extra.location || activeLightbox.author_country || 'Asia'
        const dateText = extra.date || activeLightbox.created_at.substring(0, 10)
        const attendeesText = extra.attendees || ''
        const tagsList: string[] = Array.isArray(extra.tags) ? extra.tags : []

        return (
          <div
            onClick={() => setActiveLightbox(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* 이미지 갤러리 영역 */}
              <div className="md:w-3/5 bg-black flex flex-col items-center justify-center relative min-h-[340px] select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImgUrl}
                  alt={`${activeLightbox.title} (${currentImgIndex + 1}/${allImages.length})`}
                  className="w-full h-full object-contain max-h-[55vh] md:max-h-[70vh] transition-all duration-300"
                />

                {/* 다중 사진 슬라이드 좌우 네비게이션 */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setLightboxImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md backdrop-blur-xs"
                      title="이전 사진"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightboxImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md backdrop-blur-xs"
                      title="다음 사진"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* 페이지 인디케이터 */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-white text-[11px] font-bold">
                      📸 {currentImgIndex + 1} / {allImages.length}
                    </div>

                    {/* 하단 썸네일 스트립 바 */}
                    <div className="absolute bottom-3 inset-x-4 flex justify-center gap-1.5 overflow-x-auto py-1">
                      {allImages.map((u, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setLightboxImageIndex(i)}
                          className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                            i === currentImgIndex
                              ? 'border-purple-400 scale-105 shadow-md ring-2 ring-purple-400/40'
                              : 'border-white/40 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={u} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <button
                  onClick={() => setActiveLightbox(null)}
                  className="absolute top-4 right-4 md:hidden w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 사진 상세 정보 */}
              <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black">
                      {flagText} {locationText}
                    </span>
                    <button
                      onClick={() => setActiveLightbox(null)}
                      className="hidden md:block text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="text-xs font-mono text-gray-400 mb-1 flex items-center gap-1">
                    <Calendar size={13} />
                    <span>{dateText}</span>
                    {attendeesText && (
                      <>
                        <span>·</span>
                        <span>{attendeesText}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mb-3 leading-snug">
                    {activeLightbox.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                    {activeLightbox.content}
                  </p>

                  {tagsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {tagsList.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => shareViaWhatsApp(activeLightbox.title, activeLightbox.content)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Share2 size={14} />
                    <span>WhatsApp으로 소식 전송</span>
                  </button>
                  {isLeaderOrAdmin && (
                    <button
                      onClick={() => handleDeletePost(activeLightbox.id, activeLightbox.title)}
                      className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                      title="사진 삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* 📢 공지사항 상세 모달 */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  📢 공지사항
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-2 mb-1">{selectedPost.title}</h3>
                <div className="text-xs text-gray-400">
                  {selectedPost.author_name} · {selectedPost.created_at.substring(0, 10)}
                </div>
              </div>
              <button onClick={() => setSelectedPost(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* 공지 포스터 / 첨부 이미지 */}
            {getPostImageUrl(selectedPost) && (
              <div className="mb-5 rounded-2xl overflow-hidden max-h-96 bg-slate-50 border border-emerald-100 flex items-center justify-center">
                <img
                  src={getPostImageUrl(selectedPost)!}
                  alt={selectedPost.title}
                  className="w-full max-h-96 object-contain"
                />
              </div>
            )}

            <div className="py-4 border-t border-b border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-6">
              {selectedPost.content}
            </div>

            <div className="flex justify-between items-center gap-2">
              <div>
                {isLeaderOrAdmin && (
                  <button
                    onClick={() => handleDeletePost(selectedPost.id, selectedPost.title)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    삭제하기
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => shareViaWhatsApp(selectedPost.title, selectedPost.content.substring(0, 80))}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Share2 size={13} />
                  <span>WhatsApp 공유</span>
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📢 공지사항 등록 모달 */}
      {isNoticeModalOpen && (
        <div
          onClick={() => setIsNoticeModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <PlusCircle className="text-emerald-600" size={18} />
                <span>새 공지사항 작성</span>
              </h3>
              <button
                onClick={() => setIsNoticeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">공지 제목 *</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="공지사항 제목을 입력하세요"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">대상 국가/언어</label>
                  <select
                    value={noticeCountry}
                    onChange={(e) => setNoticeCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="KR">🇰🇷 한국어 (KR)</option>
                    <option value="US">🇺🇸 English (US/International)</option>
                    <option value="MM">🇲🇲 미얀마 (MM)</option>
                    <option value="VN">🇻🇳 베트남 (VN)</option>
                    <option value="TH">🇹🇭 태국 (TH)</option>
                    <option value="ID">🇮🇩 인도네시아 (ID)</option>
                    <option value="JP">🇯🇵 일본 (JP)</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={noticeIsPinned}
                      onChange={(e) => setNoticeIsPinned(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>상단 고정 공지로 등록</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">공지 본문 내용 *</label>
                <textarea
                  required
                  rows={6}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="공지 내용을 상세히 작성해 주세요..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {/* 📸 공지 포스터/이미지 첨부 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">포스터 / 첨부 사진 (선택)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noticeImageUrl}
                    onChange={(e) => setNoticeImageUrl(e.target.value)}
                    placeholder="https://... 또는 파일 선택"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="file"
                    ref={noticeFileInputRef}
                    onChange={handleNoticeImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => noticeFileInputRef.current?.click()}
                    disabled={isUploadingNoticeImage}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Upload size={13} />
                    <span>{isUploadingNoticeImage ? '최적화 중...' : '사진 첨부'}</span>
                  </button>
                </div>
                {noticeImageUrl && (
                  <div className="relative mt-2 h-28 rounded-xl overflow-hidden bg-gray-100 border border-emerald-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={noticeImageUrl} alt="공지 이미지" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNoticeImageUrl('')}
                      className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? '등록 중...' : '공지 등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📚 자료 등록 모달 */}
      {isResourceModalOpen && (
        <div
          onClick={() => setIsResourceModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <FolderOpen className="text-sky-600" size={18} />
                <span>새 교육 및 예배 자료 등록</span>
              </h3>
              <button
                onClick={() => setIsResourceModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">자료 제목 *</label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="예: AAMEN 7대 신념 표준 주일학교 교안"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">자료 분류</label>
                  <select
                    value={resCategory}
                    onChange={(e) => setResCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="curriculum">커리큘럼</option>
                    <option value="education">교육자료</option>
                    <option value="worship">예배자료</option>
                    <option value="praise">찬양자료</option>
                    <option value="books">서적/팜플렛</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">해당 국가/언어</label>
                  <select
                    value={resLang}
                    onChange={(e) => setResLang(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="ALL">🌐 13개국 통합 (ALL)</option>
                    <option value="KR">🇰🇷 대한민국 (KR)</option>
                    <option value="US">🇺🇸 미국/영어 (US)</option>
                    <option value="MM">🇲🇲 미얀마 (MM)</option>
                    <option value="VN">🇻🇳 베트남 (VN)</option>
                    <option value="TH">🇹🇭 태국 (TH)</option>
                    <option value="ID">🇮🇩 인도네시아 (ID)</option>
                    <option value="JP">🇯🇵 일본 (JP)</option>
                    <option value="NP">🇳🇵 네팔 (NP)</option>
                    <option value="KH">🇰🇭 캄보디아 (KH)</option>
                    <option value="LA">🇱🇦 라오스 (LA)</option>
                    <option value="MN">🇲🇳 몽골 (MN)</option>
                    <option value="TW">🇹🇼 대만 (TW)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">파일 형식</label>
                  <input
                    type="text"
                    value={resFileType}
                    onChange={(e) => setResFileType(e.target.value)}
                    placeholder="예: PDF, DOCX, PPTX"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">파일 용량 (선택)</label>
                  <input
                    type="text"
                    value={resFileSize}
                    onChange={(e) => setResFileSize(e.target.value)}
                    placeholder="예: 3.5 MB"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  자료 파일 첨부 (PDF, HWP, DOCX, PPTX, ZIP 등) 또는 다운로드 링크
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={resFileUrl}
                    onChange={(e) => setResFileUrl(e.target.value)}
                    placeholder="https://... 또는 우측 파일 업로드"
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                  <input
                    type="file"
                    ref={resFileInputRef}
                    onChange={handleResourceFileUpload}
                    accept=".pdf,.hwp,.hwpx,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt,image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => resFileInputRef.current?.click()}
                    disabled={isUploadingResourceFile}
                    className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Upload size={14} />
                    <span>{isUploadingResourceFile ? '업로드중...' : '파일 선택'}</span>
                  </button>
                </div>
                {resFileName && (
                  <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between text-xs text-sky-800">
                    <span className="font-bold flex items-center gap-1.5 truncate">
                      <FileText size={14} className="shrink-0" />
                      <span>{resFileName}</span>
                    </span>
                    <span className="text-[11px] font-mono text-sky-600 shrink-0 ml-2">
                      {resFileType} · {resFileSize}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">자료 설명 *</label>
                <textarea
                  required
                  rows={4}
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  placeholder="자료에 대한 주요 내용 및 활용법을 설명해 주세요..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? '등록 중...' : '자료 등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📸 사진 등록 모달 */}
      {isPhotoModalOpen && (
        <div
          onClick={() => setIsPhotoModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Camera className="text-purple-600" size={18} />
                <span>현장 사역 사진 등록</span>
              </h3>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">사진 제목 *</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="예: 미얀마 양곤 평화 신학 세미나 & 워크숍"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">사역 국가</label>
                  <select
                    value={photoCountry}
                    onChange={(e) => setPhotoCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="KR">🇰🇷 대한민국 (KR)</option>
                    <option value="MM">🇲🇲 미얀마 (MM)</option>
                    <option value="TH">🇹🇭 태국 (TH)</option>
                    <option value="VN">🇻🇳 베트남 (VN)</option>
                    <option value="ID">🇮🇩 인도네시아 (ID)</option>
                    <option value="JP">🇯🇵 일본 (JP)</option>
                    <option value="NP">🇳🇵 네팔 (NP)</option>
                    <option value="IN">🇮🇳 인도 (IN)</option>
                    <option value="KH">🇰🇭 캄보디아 (KH)</option>
                    <option value="LA">🇱🇦 라오스 (LA)</option>
                    <option value="MN">🇲🇳 몽골 (MN)</option>
                    <option value="TW">🇹🇼 대만 (TW)</option>
                    <option value="US">🇺🇸 미국 (US)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">지역 / 도시명</label>
                  <input
                    type="text"
                    value={photoLocation}
                    onChange={(e) => setPhotoLocation(e.target.value)}
                    placeholder="예: Yangon, Myanmar"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">사역 일자</label>
                  <input
                    type="date"
                    value={photoDate}
                    onChange={(e) => setPhotoDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">참석 인원 (선택)</label>
                  <input
                    type="text"
                    value={photoAttendees}
                    onChange={(e) => setPhotoAttendees(e.target.value)}
                    placeholder="예: 42명 참석"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* 📸 사진 다중 첨부 & 자동 리사이징 업로더 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    사역 사진 첨부 (여러 장 선택 가능 · 크기 자동 최적화)
                  </label>
                  <span className="text-[11px] text-purple-700 font-bold">
                    {photoImageUrls.length > 0 ? `${photoImageUrls.length}장 등록됨` : '최대 10장 권장'}
                  </span>
                </div>

                {/* 다중 파일 선택 & 드롭 영역 */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="flex-1 py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 border-2 border-dashed border-purple-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <Upload size={16} />
                    <span>
                      {isUploadingImage
                        ? '고화질 최적화 및 업로드 중...'
                        : '📷 사진 여러 장 선택하기 (자동 리사이즈)'}
                    </span>
                  </button>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={photoImageUrl}
                      onChange={(e) => setPhotoImageUrl(e.target.value)}
                      placeholder="https://... 이미지 URL 직접 입력"
                      className="w-full sm:w-60 px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-[11px]"
                    />
                  </div>
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

                            {/* 뱃지: 대표 */}
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

                            {/* 삭제 버튼 */}
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

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={photoTags}
                  onChange={(e) => setPhotoTags(e.target.value)}
                  placeholder="평화제자도, 청년리더, 워크숍"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">사역 스토리 / 설명 *</label>
                <textarea
                  required
                  rows={4}
                  value={photoDesc}
                  onChange={(e) => setPhotoDesc(e.target.value)}
                  placeholder="현장에서 있었던 은혜로운 사역 이야기와 기도 제목을 적어주세요..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed"
                />
              </div>

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
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? '등록 중...' : '사진 등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
