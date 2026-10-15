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
} from 'lucide-react'
import {
  MemberLevel,
  MemberRole,
  defaultTierSettings,
  MemberTierInfo,
} from '@/lib/store'
import { getStoredTierLevel, TIER_EVENT_NAME, TIER_STORAGE_KEY } from '@/components/common/GlobalTierSimulator'

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
  author_name: string
  author_country: string
  author_role: string
  views: number
  likes: number
  is_pinned: boolean
  amen_count: number
  created_at: string
  updated_at: string
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

// 📸 사진첩 사역 데이터
interface PhotoItem {
  id: string
  title: string
  desc: string
  date: string
  location: string
  flag: string
  attendees: string
  imageUrl: string
  tags: string[]
}

const samplePhotos: PhotoItem[] = [
  {
    id: 'ph_1',
    title: '미얀마 양곤 평화 신학 세미나 & 청년 워크숍',
    desc: '시국의 어려움 속에서도 현지 15개 교회 청년 리더들이 함께 모여 그리스도의 비폭력 평화와 화해의 제자도를 공부하며 연대를 다졌습니다.',
    date: '2026-09-18',
    location: 'Yangon, Myanmar',
    flag: '🇲🇲',
    attendees: '42명 참석',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    tags: ['평화제자도', '청년리더', '미얀마'],
  },
  {
    id: 'ph_2',
    title: '태국 치앙마이 아시아 청소년 다문화 평화 캠프',
    desc: '태국, 라오스, 미얀마 접경 지역의 다문화 청소년들이 3박 4일간 함께 생활하며 언어와 문화의 장벽을 넘어 화해의 노래를 불렀습니다.',
    date: '2026-08-12',
    location: 'Chiang Mai, Thailand',
    flag: '🇹🇭',
    attendees: '85명 참석',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    tags: ['청소년캠프', '찬양과나눔', '태국'],
  },
  {
    id: 'ph_3',
    title: '베트남 호치민 주일학교 교사 AAMEN 교재 연수회',
    desc: '베트남어로 완역된 7대 레슨 플랜을 바탕으로 주일학교 공과 교수법을 실습하고 모의 수업을 진행하며 큰 은혜를 나누었습니다.',
    date: '2026-07-25',
    location: 'Ho Chi Minh, Vietnam',
    flag: '🇻🇳',
    attendees: '38명 참석',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    tags: ['교사연수', '7대레슨', '베트남'],
  },
  {
    id: 'ph_4',
    title: '인도네시아 자바섬 평화교회 연합 찬양과 기도의 밤',
    desc: '자카르타와 족자카르타 메노나이트 교회 성도들이 모여 아시아 각국의 평화와 화해를 위한 뜨거운 연합 중보기도회를 가졌습니다.',
    date: '2026-06-30',
    location: 'Java, Indonesia',
    flag: '🇮🇩',
    attendees: '120명 참석',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
    tags: ['연합예배', '찬양의밤', '인도네시아'],
  },
  {
    id: 'ph_5',
    title: '네팔 카트만두 지진 취약지역 평화 긴급 구호 사역',
    desc: '네팔 현지 교회 자원봉사자들과 함께 식량과 긴급 의약품을 전달하고, 고통받는 이웃들에게 그리스도의 위로와 평화를 전했습니다.',
    date: '2026-05-14',
    location: 'Kathmandu, Nepal',
    flag: '🇳🇵',
    attendees: '60가정 지원',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    tags: ['긴급구호', '네팔사역', '나눔'],
  },
  {
    id: 'ph_6',
    title: '한국 메노나이트 연합 여름 평화 아카데미',
    desc: '아시아 7개국 유학생 및 선교사들이 한국에서 모여 갈등 전환(Conflict Transformation) 실무와 회복적 정의를 훈련했습니다.',
    date: '2026-08-05',
    location: 'Seoul, Korea',
    flag: '🇰🇷',
    attendees: '50명 참석',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    tags: ['평화아카데미', '갈등전환', '한국'],
  },
]

// 📚 자료방 카테고리 및 데이터
interface ResourceItem {
  id: string
  category: 'curriculum' | 'education' | 'worship' | 'books' | 'praise'
  categoryName: string
  title: string
  lang: string
  langName: string
  fileSize: string
  fileType: string
  downloads: number
  desc: string
  date: string
}

const sampleResources: ResourceItem[] = [
  {
    id: 'res_1',
    category: 'curriculum',
    categoryName: '커리큘럼',
    title: 'AAMEN 7대 신념 표준 주일학교 교안 (전체 통합본)',
    lang: 'KR',
    langName: '대한민국 (KR)',
    fileSize: '4.8 MB',
    fileType: 'DOCX / PDF',
    downloads: 342,
    desc: 'MWC 7대 확신을 12주 과정으로 체계적으로 배울 수 있도록 구성된 표준 공과 교재 교사용 지침서입니다.',
    date: '2026-09-10',
  },
  {
    id: 'res_2',
    category: 'education',
    categoryName: '교육자료',
    title: 'AAMEN Standard Peace Lesson Plans (International Edition)',
    lang: 'US',
    langName: '미국 (US)',
    fileSize: '3.9 MB',
    fileType: 'PDF',
    downloads: 512,
    desc: 'Complete 7 theme lesson plans for Asian peace educators, youth pastors, and seminar facilitators.',
    date: '2026-09-12',
  },
  {
    id: 'res_3',
    category: 'worship',
    categoryName: '예배자료',
    title: '13개국 평화 주일 연합 예배 순서지 및 기도문 모음',
    lang: 'ALL',
    langName: '13개국 통합 (ALL)',
    fileSize: '2.1 MB',
    fileType: 'PDF',
    downloads: 210,
    desc: '아시아 평화 주일(Peace Sunday)을 기념하여 각국 교회에서 사용할 수 있는 설교문 및 대표 기도문입니다.',
    date: '2026-08-20',
  },
  {
    id: 'res_4',
    category: 'praise',
    categoryName: '찬양자료',
    title: '아시아 아나밥티스트 찬양집 악보 및 가사집 (50곡)',
    lang: 'US',
    langName: '미국 (US)',
    fileSize: '8.4 MB',
    fileType: 'PDF',
    downloads: 560,
    desc: '영어 및 현지어 가사가 수록된 4부 화음 평화 찬양집과 기타 코드 악보 세트입니다.',
    date: '2026-07-15',
  },
  {
    id: 'res_5',
    category: 'books',
    categoryName: '서적/팜플렛',
    title: '아나밥티스트 역사와 신앙 에센스 (소책자)',
    lang: 'KR',
    langName: '대한민국 (KR)',
    fileSize: '1.5 MB',
    fileType: 'PDF',
    downloads: 285,
    desc: '메노나이트 역사의 기원과 16세기 재세례파의 비폭력 평화 운동을 알기 쉽게 정리한 입문서입니다.',
    date: '2026-06-05',
  },
  {
    id: 'res_6',
    category: 'education',
    categoryName: '교육자료',
    title: 'Rencana Pelajaran AAMEN (Edisi Bahasa Indonesia)',
    lang: 'ID',
    langName: '인도네시아 (ID)',
    fileSize: '3.6 MB',
    fileType: 'PDF',
    downloads: 320,
    desc: 'Panduan kurikulum pendidikan damai AAMEN yang diterjemahkan lengkap ke dalam bahasa Indonesia.',
    date: '2026-08-01',
  },
  {
    id: 'res_7',
    category: 'curriculum',
    categoryName: '커리큘럼',
    title: 'AAMEN บทเรียนสันติภาพภาษาไทย (Thai Peace Curriculum)',
    lang: 'TH',
    langName: '태국 (TH)',
    fileSize: '4.1 MB',
    fileType: 'PDF',
    downloads: 295,
    desc: 'หลักสูตรการศึกษาเพื่อสันติภาพและบทเรียนสำหรับคริสตจักรท้องถิ่นในประเทศไทย',
    date: '2026-08-15',
  },
  {
    id: 'res_8',
    category: 'education',
    categoryName: '교육자료',
    title: 'Tài liệu Giáo dục Hòa bình AAMEN (Bản tiếng Việt)',
    lang: 'VN',
    langName: '베트남 (VN)',
    fileSize: '3.8 MB',
    fileType: 'PDF',
    downloads: 260,
    desc: 'Tài liệu hướng dẫn bài học giáo lý và hòa bình dành cho thanh thiếu niên tại Việt Nam.',
    date: '2026-07-20',
  },
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

  // 공지사항 한/영 2개 국어 필터 ('ALL' | 'KO' | 'EN')
  const [noticeLangFilter, setNoticeLangFilter] = useState<'ALL' | 'KO' | 'EN'>('ALL')

  // 자료방 5대 카테고리 및 13개국 언어 필터
  const [resourceCategory, setResourceCategory] = useState<string>('ALL')
  const [resourceLang, setResourceLang] = useState<string>('ALL')

  // 사진첩 라이트박스 모달 상태
  const [activeLightbox, setActiveLightbox] = useState<PhotoItem | null>(null)

  // 5단계 회원 등급 시뮬레이션
  const [currentLevel, setCurrentLevel] = useState<MemberLevel>(4)
  const [tierPermissions, setTierPermissions] = useState<Record<MemberLevel, MemberTierInfo>>(defaultTierSettings)

  // 상세 모달 & 글쓰기 모달
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 새 글 작성 폼 상태
  const [newBoardType, setNewBoardType] = useState<string>('announce')
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newAuthor, setNewAuthor] = useState('이은혜 사역자')
  const [newCountry, setNewCountry] = useState('KR')

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
  const canWritePost = Boolean(currentTierInfo?.permissions?.canWritePost)
  const canManageBoard = Boolean(currentTierInfo?.permissions?.canManageBoard)
  const canWriteComment = Boolean(currentTierInfo?.permissions?.canWriteComment)

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

  // DB API에서 게시물 목록 패치 (공지사항 등)
  const fetchPosts = useCallback(async () => {
    if (activeTab === 'prayer' || activeTab === 'photos' || activeTab === 'resources') {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const roleParam = currentLevel === 0 ? 'guest' : currentLevel === 1 ? 'associate' : currentLevel >= 4 ? 'country_admin' : 'regular'
      const res = await fetch(`/api/posts?type=${activeTab}&search=${encodeURIComponent(searchTerm)}&role=${roleParam}`)
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json()
        if (data.success) {
          setPosts(data.data)
        }
      }
    } catch (error) {
      // API 오류 시 기본 상태 유지
    } finally {
      setLoading(false)
    }
  }, [activeTab, searchTerm, currentLevel])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

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
      // API 오류 시 안전하게 무시
    } finally {
      setIsDetailLoading(false)
    }
  }

  // 공지사항 언어 필터링
  const filteredNoticePosts = posts.filter((p) => {
    if (noticeLangFilter === 'ALL') return true
    if (noticeLangFilter === 'KO') return p.author_country === 'KR' || p.title.match(/[\uAC00-\uD7AF]/)
    if (noticeLangFilter === 'EN') return p.author_country !== 'KR' || !p.title.match(/[\uAC00-\uD7AF]/)
    return true
  })

  // 자료방 필터링
  const filteredResources = sampleResources.filter((r) => {
    const matchCat = resourceCategory === 'ALL' || r.category === resourceCategory
    const matchLang = resourceLang === 'ALL' || r.lang === resourceLang || r.lang === 'ALL'
    const matchSearch =
      !searchTerm ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.desc.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCat && matchLang && matchSearch
  })

  // 사진첩 필터링
  const filteredPhotos = samplePhotos.filter((ph) => {
    return (
      !searchTerm ||
      ph.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ph.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ph.desc.toLowerCase().includes(searchTerm.toLowerCase())
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
                  onClick={() => setActiveTab(tab.id as CommunityTab)}
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

            {activeTab === 'announce' && (
              <button
                onClick={() => {
                  if (currentLevel === 0) {
                    showToast('🚫 비회원은 글을 작성할 수 없습니다. 로그인 후 이용해 주세요.')
                    return
                  }
                  if (currentLevel < 4) {
                    showToast('🔒 공지사항 작성은 리더 및 관리자(4단계 이상) 권한이 필요합니다.')
                    return
                  }
                  setNewBoardType('announce')
                  setIsWriteModalOpen(true)
                }}
                className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-sm transition-all bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>공지사항 등록</span>
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
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-semibold text-sm">등록된 공지사항이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNoticePosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handleOpenDetail(post.id)}
                      className="bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full font-black text-[10px]">
                            📢 공지
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {post.author_country === 'KR' ? '🇰🇷 KO' : '🇺🇸 EN'} · {post.created_at.substring(0, 10)}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-gray-900 mb-1">{post.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{post.content.replace(/<[^>]*>?/gm, '')}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            shareViaWhatsApp(post.title, post.content.substring(0, 80))
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Share2 size={13} />
                          <span>WhatsApp 공유</span>
                        </button>
                      </div>
                    </div>
                  ))}
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
                        13개국 완역
                      </span>
                    </h3>
                    <p className="text-xs text-sky-700 mt-0.5">
                      아시아 주일학교 공과 교재, 찬양집, 예배 순서지, 소책자를 각국 모국어로 무료 다운로드하실 수 있습니다.
                    </p>
                  </div>
                </div>

                {/* 5대 카테고리 필터 */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'ALL', label: '전체' },
                    { id: 'curriculum', label: '커리큘럼' },
                    { id: 'education', label: '교육자료' },
                    { id: 'worship', label: '예배자료' },
                    { id: 'praise', label: '찬양자료' },
                    { id: 'books', label: '서적/팜플렛' },
                  ].map((cat) => (
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

              {/* 13개 참여국 필터 칩 바 (국가 이니셜 알파벳 순 정렬) */}
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
                  { id: 'NE', label: '🇳🇵 네팔 (NP)' },
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
              <div className="relative mb-6">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="교안 제목, 설명, 언어로 자료 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                />
              </div>

              {/* 자료 리스트 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold">
                          {res.categoryName}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-gray-400">
                          {res.langName} · {res.fileType}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-gray-900 mb-1.5 leading-snug">{res.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">{res.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 font-mono">
                        용량: {res.fileSize} (다운로드 {res.downloads}회)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => shareViaWhatsApp(res.title, `[AAMEN 자료실] ${res.desc}`)}
                          className="p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-700 transition-colors"
                          title="WhatsApp으로 공유"
                        >
                          <Share2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (currentLevel < 2) {
                              alert('🔒 교재 다운로드는 2단계 정회원 이상 승인 회원만 가능합니다.')
                              return
                            }
                            alert(`[${res.title}] 다운로드를 시작합니다.`)
                          }}
                          className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download size={13} />
                          <span>다운로드</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                    if (currentLevel < 3) {
                      showToast('🔒 사진첩 등록은 3단계 사역자/선교사 이상 승인이 필요합니다.')
                      return
                    }
                    alert('사진 등록 모달을 준비 중입니다.')
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Camera size={14} />
                  <span>현장 사진 등록</span>
                </button>
              </div>

              {/* 검색 바 */}
              <div className="relative mb-6">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="사역 사진 제목, 국가, 내용으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                />
              </div>

              {/* 사진첩 카드 리스트 (이미지 + 내용이 함께 표시되는 정갈한 매거진 스타일) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setActiveLightbox(photo)}
                    className="group rounded-3xl overflow-hidden bg-white border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* 고해상도 썸네일 이미지 */}
                      <div className="relative h-52 overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[11px] font-bold flex items-center gap-1.5">
                          <span>{photo.flag}</span>
                          <span>{photo.location}</span>
                        </div>
                        <div className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-purple-600/90 text-white text-[10px] font-black rounded-lg backdrop-blur-sm">
                          {photo.attendees}
                        </div>
                      </div>

                      {/* 본문 내용 */}
                      <div className="p-5">
                        <div className="text-[11px] font-mono text-purple-700 font-bold mb-1.5 flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{photo.date}</span>
                        </div>
                        <h4 className="font-black text-base text-gray-900 group-hover:text-purple-700 transition-colors mb-2 leading-snug">
                          {photo.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
                          {photo.desc}
                        </p>

                        {/* 사역 태그 */}
                        <div className="flex flex-wrap gap-1.5">
                          {photo.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 카드 하단 액션 바 */}
                    <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-purple-700 group-hover:underline">
                        크게 보기 & 스토리 →
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          shareViaWhatsApp(photo.title, `${photo.location} · ${photo.desc}`)
                        }}
                        className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 text-gray-500 transition-colors"
                        title="WhatsApp으로 사진 소식 전송"
                      >
                        <Share2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 📸 사진첩 라이트박스 팝업 */}
      {activeLightbox && (
        <div
          onClick={() => setActiveLightbox(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* 고해상도 이미지 */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeLightbox.imageUrl}
                alt={activeLightbox.title}
                className="w-full h-full object-contain max-h-[60vh] md:max-h-none"
              />
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
                    {activeLightbox.flag} {activeLightbox.location}
                  </span>
                  <button
                    onClick={() => setActiveLightbox(null)}
                    className="hidden md:block text-gray-400 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="text-xs font-mono text-gray-400 mb-1 flex items-center gap-1">
                  <Calendar size={13} />
                  <span>{activeLightbox.date}</span>
                  <span>·</span>
                  <span>{activeLightbox.attendees}</span>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-3 leading-snug">
                  {activeLightbox.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                  {activeLightbox.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {activeLightbox.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={() => shareViaWhatsApp(activeLightbox.title, activeLightbox.desc)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 size={14} />
                  <span>WhatsApp으로 소식 전송</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 공지 상세 모달 */}
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
              <button onClick={() => setSelectedPost(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="py-4 border-t border-b border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-6">
              {selectedPost.content}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => shareViaWhatsApp(selectedPost.title, selectedPost.content.substring(0, 80))}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 size={13} />
                <span>WhatsApp으로 공유하기</span>
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
      )}

      <Footer />
    </div>
  )
}
