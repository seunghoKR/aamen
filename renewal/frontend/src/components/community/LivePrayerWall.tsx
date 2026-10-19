'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Heart,
  Globe,
  Share2,
  Flame,
  Check,
  Copy,
  ArrowRight,
  Lock,
  Unlock,
  ShieldCheck,
  Sparkles,
  PenSquare,
  Shield,
  Trash2,
  X,
  RefreshCw,
} from 'lucide-react'
import { MemberLevel, defaultTierSettings } from '@/lib/store'
import { getStoredTierLevel, TIER_EVENT_NAME, TIER_STORAGE_KEY } from '@/components/common/GlobalTierSimulator'
import { getStoredUser } from '@/lib/auth'
import { NATIONS_15 } from './communityI18n'

export interface PrayerItem {
  id: string
  author: string
  countryCode: string
  countryName: string
  isLeader?: boolean
  date: string
  originalLang: string
  originalText: string
  translations: Record<string, string>
  prayCount: number
}

// 6개의 13개국 회원 최근 기도제목 데이터
export const initial6Prayers: PrayerItem[] = [
  {
    id: 'pr_1',
    author: 'Pastor Zaw Min',
    countryCode: 'MM',
    countryName: '미얀마 (Myanmar)',
    isLeader: true,
    date: '2026-09-28',
    originalLang: 'my',
    originalText:
      'ယခုနှစ်တွင် စတင်မည့် ဓမ္မပညာရေး အစီအစဉ်များအတွက်နှင့် ငြိမ်းချမ်းရေးသင်တန်းများ အောင်မြင်စွာ ကျင်းပနိုင်ရန် ဆုတောင်းပေးကြပါရန် မေတ္တာရပ်ခံအပ်ပါသည်။\n정치적 불안과 어려운 시국 속에서도 신학생들과 청년들이 흔들리지 않고 그리스도의 평화 복음을 굳건히 배울 수 있도록 중보를 부탁드립니다.',
    translations: {
      ko: '올해 시작되는 신학 교육 프로그램과 평화 훈련 워크숍이 은혜 가운데 열릴 수 있도록 기도 부탁드립니다.\n정치적 불안과 어려운 시국 속에서도 신학생들과 청년들이 흔들리지 않고 그리스도의 평화 복음을 굳건히 배울 수 있도록 중보를 부탁드립니다.',
      en: 'Please pray for our theological education programs starting this year and for the successful hosting of our peace training workshops.\nMay our students remain steadfast in Christ amid difficult political circumstances.',
      ja: '今年始まる神学教育プログラムと平和構築ワークショップが恵みのうちに実施されるようお祈りください。',
      'zh-TW': '請為我們今年展開的神學教育事工，以及和平培育工作坊能順利舉行代禱。',
      vi: 'Xin cầu nguyện cho chương trình giáo dục thần học và các hội thảo xây dựng hòa bình của chúng tôi trong năm nay.',
      th: 'ขอให้อธิษฐานเผื่อโปรแกรมการศึกษาศาสนศาสตร์และการอบรมการสร้างสันติภาพที่เริ่มขึ้นในปีนี้',
      id: 'Mohon doa untuk program pendidikan teologi dan lokakarya bina damai yang dimulai tahun ini.',
    },
    prayCount: 58,
  },
  {
    id: 'pr_2',
    author: 'Sarah Nguyen',
    countryCode: 'VN',
    countryName: '베트남 (Vietnam)',
    isLeader: true,
    date: '2026-09-27',
    originalLang: 'vi',
    originalText:
      'Cầu nguyện cho thế hệ trẻ trong Hội Thánh biết yêu mến Lời Chúa và dấn thân phục vụ cộng đồng, lan tỏa tinh thần hòa giải.\n4개 현지 가정교회가 연합하여 주일학교 교사 훈련을 잘 마칠 수 있도록 지혜를 더해 주소서.',
    translations: {
      ko: '교회의 다음 세대 청년들이 주님의 말씀을 사랑하고 지역 사회를 섬기며 평화와 화해의 증인이 되도록 기도합니다.\n4개 현지 가정교회가 연합하여 주일학교 교사 훈련을 잘 마칠 수 있도록 지혜를 더해 주소서.',
      en: 'Praying that the next generation of youth in our churches will love God’s Word, serve their local communities, and spread the spirit of reconciliation.\nGrant wisdom as four local home churches unite for Sunday school teacher training.',
      ja: '教会の次世代の若者たちがみ言葉を愛し、地域社会に仕え、和解の精神を広げていけるよう祈ります。',
      'zh-TW': '為教會的青年世代禱告，願他們熱愛真道、服事社區，活出和平與和解的見證。',
      th: 'อธิษฐานเผื่อเยาวชนรุ่นใหม่ในคริสตจักรให้รักในพระคำ และร่วมรับใช้ชุมชนด้วยจิตวิญญาณแห่งสันติภาพ',
      id: 'Berdoa agar generasi muda di gereja mencintai Firman Tuhan dan melayani masyarakat dengan semangat perdamaian.',
    },
    prayCount: 46,
  },
  {
    id: 'pr_3',
    author: 'Somchai Prasert',
    countryCode: 'TH',
    countryName: '태국 (Thailand)',
    isLeader: false,
    date: '2026-09-26',
    originalLang: 'th',
    originalText:
      'ขอบคุณพระเจ้าสำหรับการแปลบทเรียน AAMEN เป็นภาษาไทย ขอพระเจ้าทรงใช้วัสดุเหล่านี้เสริมสร้างคริสตจักรท้องถิ่น\nขอการทรงนำในการจัดค่ายเยาวชนเพื่อสันติภาพในภาคเหนือของไทยในเดือนหน้าด้วยครับ',
    translations: {
      ko: 'AAMEN 레슨이 태국어로 번역된 것에 감사드립니다. 이 교육 자료들이 현지 교회들을 든든히 세우는 데 귀하게 쓰이길 기도합니다.\n다음 달 태국 북부에서 열리는 청소년 평화 캠프 가운데도 주님의 풍성한 은혜를 구합니다.',
      en: 'Thank God for the Thai translation of the AAMEN lessons. May these educational materials strengthen our local churches.\nPlease also pray for our upcoming youth peace camp in Northern Thailand next month.',
      ja: 'AAMENのレッスンがタイ語に翻訳されたことを感謝します。現地の教会が力強く建て上げられますように。',
      'zh-TW': '為 AAMEN 課程翻譯成泰文獻上感恩，願這些教材成為各地方教會培育信徒的寶貴祝福。',
      vi: 'Cảm tạ Chúa vì tài liệu bài học AAMEN đã được dịch sang tiếng Thái, nguyện xin Chúa dùng tài liệu này gây dựng các giáo hội.',
      id: 'Bersyukur atas penerjemahan materi pelajaran AAMEN ke dalam bahasa Thai.',
    },
    prayCount: 63,
  },
  {
    id: 'pr_4',
    author: 'Rajesh Kumar',
    countryCode: 'IN',
    countryName: '인도 (India)',
    isLeader: false,
    date: '2026-09-25',
    originalLang: 'hi',
    originalText:
      'छत्तीसगढ़ के ग्रामीण क्षेत्रों में सूखे और गरीबी से जूझ रहे परिवारों के लिए प्रार्थना करें।\nहमारे मेनोनाइट चर्च के स्वयंसेवक जो भोजन और दवाइयां पहुंचा रहे हैं, उनकी सुरक्षा और संसाधनों की पूर्ति के लिए प्रार्थना की विनती है।',
    translations: {
      ko: '인도 차티스가르 농촌 지역에서 가뭄과 경제적 빈곤으로 고통받는 이웃들을 위해 기도해 주세요.\n식량과 구호 약품을 나누며 그리스도의 사랑을 전하는 자원봉사자들의 안전과 물질 공급을 위해 손 모아 주시기 바랍니다.',
      en: 'Please pray for rural families in Chhattisgarh facing severe drought and hardship.\nPray for the protection and provision of our church volunteers delivering food and medical aid.',
      ja: 'インド・チャッティースガル州の干ばつと貧困に苦しむ農村地域の人々のために祈ってください。',
      'zh-TW': '請為印度恰蒂斯加爾邦面對乾旱與貧困的農村家庭代禱，求神供應物資並保守義工平安。',
      vi: 'Xin cầu nguyện cho các gia đình nông thôn tại Chhattisgarh đang đối mặt với hạn hán và khó khăn.',
      th: 'ขออธิษฐานเผื่อครอบครัวในชนบทของอินเดียที่เผชิญภัยแล้งและความยากลำบาก',
      id: 'Mohon doa bagi keluarga di pedesaan Chhattisgarh yang menghadapi kekeringan.',
    },
    prayCount: 51,
  },
  {
    id: 'pr_5',
    author: 'Sunita Shrestha',
    countryCode: 'NP',
    countryName: '네팔 (Nepal)',
    isLeader: true,
    date: '2026-09-24',
    originalLang: 'ne',
    originalText:
      'हिमाली क्षेत्रका दुर्गम गाउँहरूमा सेवा गर्ने हाम्रा पास्टरहरूलाई सुस्वास्थ्य र बल प्रदान गरियोस्।\nविभिन्न जनजाति युवाहरू बीचको शान्ति र मेलमिलाप तालिम मार्फत समुदायमा प्रेमको ज्योति फैलन सकोस् भनी प्रार्थना गर्दछौं।',
    translations: {
      ko: '히말라야 산간 외딴 마을에서 묵묵히 복음을 전하는 현지 목회자들에게 건강과 사역의 지혜를 더하여 주시기를 기도합니다.\n서로 다른 부족 청년들이 주 안에서 용서와 화해를 배우는 평화 세미나가 큰 결실을 맺게 하소서.',
      en: 'Please pray for our local pastors serving in remote Himalayan mountain villages, asking for health and wisdom.\nMay our peace and reconciliation seminars among diverse tribal youth bear great fruit.',
      ja: 'ヒマラヤの山岳村落で奉仕する牧師たちの健康と知恵のためにお祈りください。',
      'zh-TW': '求神加添力量給在喜馬拉雅偏遠山區服事的傳道人，並願跨部族青年和平營會結出豐盛果子。',
      vi: 'Xin cầu nguyện cho các mục sư đang phục vụ tại các ngôi làng vùng cao Himalaya xa xôi.',
      th: 'ขออธิษฐานเผื่อศิษยาภิบาลที่รับใช้ในหมู่บ้านแถบเทือกเขาหิมาลัย',
      id: 'Doakan para hamba Tuhan yang melayani di desa-desa terpencil pegunungan Himalaya.',
    },
    prayCount: 39,
  },
  {
    id: 'pr_6',
    author: 'Bounmy Keomany',
    countryCode: 'LA',
    countryName: '라오스 (Laos)',
    isLeader: false,
    date: '2026-09-23',
    originalLang: 'lo',
    originalText:
      'ຂໍອະທິຖານໃຫ້ບັນດາຜູ້ຮັບໃຊ້ສັນຕິພາບຕາມລຳແມ່ນ້ຳຂອງ ໃຫ້ມີຄວາມປອດໄພ ແລະ ຄວາມອົດທົນໃນການສຳແດງຄວາມຮັກຂອງພຣະຄຣິດ.\nຂໍໃຫ້ຊຸມຊົນທ້ອງຖິ່ນເຫັນປະຈັກຕາເຖິງຄວາມສາມັກຄີ ແລະ ສັນຕິສຸກທີ່ມາຈາກພຣະເຈົ້າ.',
    translations: {
      ko: '메콩강 유역에서 종교적 제약 속에서도 이웃 사랑과 섬김을 실천하는 평화 사역자들의 안전을 위해 기도합니다.\n지역 사회 주민들이 성도들의 희생과 돌봄을 통해 그리스도의 참된 평화를 발견하게 하소서.',
      en: 'Please pray for the safety and perseverance of peace workers serving along the Mekong River basin.\nMay local communities witness Christ’s love and peace through their faithful care.',
      ja: 'メコン川流域で仕える平和の働き人たちの安全と忍耐のためにお祈りください。',
      'zh-TW': '請為湄公河流域服事的和平同工的安全代禱，願當地居民看見基督的愛與平安。',
      vi: 'Xin cầu nguyện cho sự an toàn của những người kiến tạo hòa bình phục vụ dọc theo lưu vực sông Mê Kông.',
      th: 'ขออธิษฐานเผื่อความปลอดภัยของผู้รับใช้สันติภาพในลຸ່ມแม่น้ำโขง',
      id: 'Doakan keselamatan para pekerja perdamaian di sepanjang lembah Sungai Mekong.',
    },
    prayCount: 44,
  },
]

export default function LivePrayerWall() {
  const t = useTranslations('community')
  const locale = useLocale()

  const [prayers, setPrayers] = useState<PrayerItem[]>([])
  const [prayedSet, setPrayedSet] = useState<Record<string, boolean>>({})
  const [translatedSet, setTranslatedSet] = useState<Record<string, boolean>>({})
  const [shareModalItem, setShareModalItem] = useState<PrayerItem | null>(null)
  const [copyFeedback, setCopyFeedback] = useState(false)

  // 기도제목 등록 모달 상태
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [countryCode, setCountryCode] = useState('KR')
  const [isUrgent, setIsUrgent] = useState(false)

  // 전역 회원 등급 (1~5단계) 구독
  const [currentLevel, setCurrentLevel] = useState<MemberLevel>(4)
  const [mounted, setMounted] = useState(false)
  const [noticeToast, setNoticeToast] = useState<string | null>(null)

  const fetchPrayers = async () => {
    try {
      const res = await fetch('/api/prayers.php')
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const mapped: PrayerItem[] = data.map((d: any) => {
            const nation = NATIONS_15.find((n) => n.code === d.country_code)
            const countryLabel = nation
              ? `${nation.flag} ${nation.name[locale as 'ko' | 'en'] || nation.name.ko}`
              : d.country_code || 'KR'
            const fullText = d.content ? (d.title ? `[${d.title}]\n${d.content}` : d.content) : d.title
            return {
              id: d.id,
              author: d.author_name || '성도',
              countryCode: d.country_code || 'KR',
              countryName: countryLabel,
              isLeader: Boolean(d.is_urgent),
              date: (d.created_at || '').substring(0, 10),
              originalLang: d.country_code === 'KR' ? 'ko' : 'en',
              originalText: fullText,
              translations: {
                ko: fullText,
                en: fullText,
              },
              prayCount: d.amen_count || 0,
            }
          })
          setPrayers(mapped)
          return
        }
      }
    } catch (e) {
      console.error(e)
    }
    // DB 데이터가 비어있거나 오류 시 기본 샘플 기도제목 표시
    setPrayers(initial6Prayers)
  }

  useEffect(() => {
    fetchPrayers()
  }, [])

  useEffect(() => {
    setMounted(true)
    setCurrentLevel(getStoredTierLevel())

    const handleTierChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ level: MemberLevel }>
      if (customEvent.detail && customEvent.detail.level) {
        setCurrentLevel(customEvent.detail.level)
      } else {
        setCurrentLevel(getStoredTierLevel())
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === TIER_STORAGE_KEY || e.key === 'aamen_auth_role') {
        setCurrentLevel(getStoredTierLevel())
      }
    }

    window.addEventListener(TIER_EVENT_NAME, handleTierChange)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(TIER_EVENT_NAME, handleTierChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const currentTier = defaultTierSettings[currentLevel]
  const isGuest = currentLevel === 0 // 0단계 비회원/손님
  const isAssociate = currentLevel === 1 // 1단계 준회원/가입대기
  const isRegularOrAbove = currentLevel >= 2 // 2단계 정회원 이상
  const isLeaderOrAdmin = currentLevel >= 4 // 4단계 리더/게시판관리자 이상

  const showToast = (msg: string) => {
    setNoticeToast(msg)
    setTimeout(() => setNoticeToast(null), 3000)
  }

  // 기도제목 등록 모달 열기 핸들러
  const handleOpenPrayerModal = () => {
    if (isGuest) {
      showToast('🚫 ' + (t('toast_guest') || '비회원은 로그인 후 기도제목을 작성하실 수 있습니다.'))
      return
    }
    if (isAssociate) {
      showToast('🔒 ' + (t('toast_associate') || '준회원은 열람만 가능하며, 2단계(정회원) 승인 후 작성이 가능합니다.'))
      return
    }
    const user = getStoredUser()
    if (user?.name) {
      setAuthorName(user.name)
    } else if (currentLevel >= 4) {
      setAuthorName('총괄관리자')
    } else {
      setAuthorName('AAMEN 사역자')
    }
    if (user?.country_code) {
      setCountryCode(user.country_code)
    } else {
      setCountryCode('KR')
    }
    setTitle('')
    setContent('')
    setIsUrgent(false)
    setIsPrayerModalOpen(true)
  }

  // 신규 기도제목 등록 처리
  const handleCreatePrayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      showToast('⚠️ 기도제목과 기도 내용을 모두 입력해 주세요.')
      return
    }

    setSubmitting(true)
    try {
      const user = getStoredUser()
      const res = await fetch('/api/prayers.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          author_name: authorName.trim() || user?.name || 'AAMEN 성도',
          author_id: user?.id || null,
          country_code: countryCode,
          is_urgent: isUrgent ? 1 : 0,
        }),
      })

      if (res.ok) {
        showToast('🙏 중보 기도제목이 은혜 가운데 등록되었습니다. 함께 기도합니다!')
        setTitle('')
        setContent('')
        setIsUrgent(false)
        setIsPrayerModalOpen(false)
        await fetchPrayers()
      } else {
        showToast('❌ 기도제목 등록 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    } catch (err) {
      console.error(err)
      showToast('❌ 서버 연결 실패. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  // 원터치 "함께 기도합니다" 핸들러 (실시간 DB 연동)
  const handlePray = async (id: string) => {
    if (isGuest) {
      showToast('🚫 비회원은 로그인 후 기도에 동참하실 수 있습니다.')
      return
    }
    if (prayedSet[id]) return

    setPrayedSet((prev) => ({ ...prev, [id]: true }))
    setPrayers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, prayCount: item.prayCount + 1 } : item
      )
    )

    try {
      await fetch('/api/prayers.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'amen' }),
      })
    } catch (e) {
      console.error('Failed to sync pray count:', e)
    }
  }

  // 원클릭 AI 번역 토글
  const toggleTranslate = (id: string) => {
    if (isGuest) {
      showToast('🚫 비회원은 로그인 후 AI 번역 기능을 이용하실 수 있습니다.')
      return
    }
    if (isAssociate) {
      showToast('🔒 AI 원클릭 번역은 2단계(정회원) 이상 열람 권한이 필요합니다.')
      return
    }
    setTranslatedSet((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // 관리자용 삭제 핸들러 (4~5단계)
  const handleDeletePrayer = async (id: string, country: string) => {
    if (!isLeaderOrAdmin) return
    if (confirm(`[관리자 권한] ${country}의 기도제목을 삭제하시겠습니까?`)) {
      try {
        await fetch('/api/prayers.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action: 'delete' }),
        })
      } catch (e) {}
      setPrayers((prev) => prev.filter((p) => p.id !== id))
      showToast('기도제목이 성공적으로 삭제되었습니다.')
    }
  }

  const getShareUrl = () => {
    if (typeof window !== 'undefined') return window.location.href
    return 'https://aamen.net'
  }

  const shareViaWhatsApp = (item: PrayerItem) => {
    const text = encodeURIComponent(
      `[AAMEN 함께 기도해요] ${item.countryName}:\n${item.originalText}\n\n함께 기도하기: ${getShareUrl()}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(getShareUrl())
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-emerald-100 shadow-xl shadow-emerald-950/5 relative">
      {/* 알림 토스트 */}
      {noticeToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-top-2 border border-emerald-400">
          {noticeToast}
        </div>
      )}

      {/* 섹션 상단 헤더: 권한별 안내 문구 및 도구 */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-2xl">🙏</span>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {t('prayer_wall')}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              Live Intercession
            </span>

            {/* 현재 적용된 회원 등급 뱃지 (전역 시뮬레이터 연동 상태 표시) */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                isGuest
                  ? 'bg-gray-100 text-gray-800 border-gray-300'
                  : isAssociate
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : isLeaderOrAdmin
                  ? 'bg-purple-50 text-purple-900 border-purple-200'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
            >
              {isGuest ? <Lock size={11} className="text-gray-600" /> : isAssociate ? <Lock size={11} /> : <ShieldCheck size={11} />}
              <span>{currentTier.name} 적용중</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            {isGuest ? (
              <span className="text-gray-700 font-medium">
                🚫 <strong>0단계: 비회원(손님) 모드:</strong> 로그인하지 않은 방문자에게는 사역자 보호를 위해 기도제목이 블러 처리됩니다.
              </span>
            ) : isAssociate ? (
              <span className="text-amber-800 font-medium">
                🔒 <strong>1단계: 준회원 모드:</strong> 사역자 신변 보호를 위해 국가명만 표시되며, 기도제목은 1줄 미리보기로 제공됩니다.
              </span>
            ) : isLeaderOrAdmin ? (
              <span className="text-purple-800 font-medium">
                ⭐ <strong>{currentTier.name}:</strong> 13개국 모든 기도제목 및 사역자 실명 열람, AI 번역, 그리고 <strong>게시판 관리/삭제 권한</strong>이 활성화되어 있습니다.
              </span>
            ) : (
              <span className="text-emerald-800 font-medium">
                🌟 <strong>2단계 이상(정회원):</strong> 13개국 성도들의 전체 기도제목과 사역자 이름을 모두 열람하고 AI 다국어 번역을 이용하실 수 있습니다.
              </span>
            )}
          </p>
        </div>

        {/* 우측 도구: 기도제목 작성 & 더보기 링크 */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleOpenPrayerModal}
            className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isGuest || isAssociate
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <PenSquare size={13} />
            <span>{t('submit_prayer') || '기도제목 나누기'}</span>
          </button>

          <Link
            href={locale === 'ko' ? '/community/prayer' : `/${locale}/community/prayer`}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <span>{t('view_all_prayers')}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 기도 카드 그리드 또는 비어있을 때 안내 */}
      {prayers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/60 rounded-3xl border border-gray-100">
          <Heart className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-gray-700 mb-1">등록된 중보 기도제목이 없습니다.</h4>
          <p className="text-xs text-gray-500 mb-4">첫 번째 기도제목을 작성하여 아시아 15개국 성도들과 함께 기도해 보세요.</p>
          <button
            type="button"
            onClick={handleOpenPrayerModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <PenSquare size={13} />
            <span>첫 기도제목 등록하기</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {prayers.map((item) => {
          const isTranslated = !!translatedSet[item.id]
          const isPrayed = !!prayedSet[item.id]

          // 다국어 번역 텍스트 선택
          const fullText =
            isTranslated && item.translations[locale]
              ? item.translations[locale]
              : isTranslated && item.translations['en']
              ? item.translations['en']
              : item.originalText

          // 1줄 추출 (첫 줄만 가져오기)
          const firstLine = fullText.split('\n')[0]

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-gray-50/70 to-emerald-50/20 border border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all"
            >
              <div>
                {/* 카드 상단: 작성자 및 국가 정보 */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    {isGuest ? (
                      <div className="font-bold text-sm text-gray-500 flex items-center gap-1">
                        <span>🔒 [사역자 비공개]</span>
                      </div>
                    ) : isRegularOrAbove ? (
                      <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5 flex-wrap">
                        <span>{item.author}</span>
                        {item.isLeader && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            ★ {t('leader_badge')}
                          </span>
                        )}
                        {isLeaderOrAdmin && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-extrabold">
                            관리대상
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="font-bold text-sm text-emerald-800 flex items-center gap-1">
                        <span>[{item.countryName.split(' ')[0]}]</span>
                        <span className="text-gray-400 font-normal text-xs">{t('anonymous_member')}</span>
                      </div>
                    )}
                    <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                      {isGuest ? 'AAMEN 아시아 네트워크' : `${item.countryName} · ${item.date}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isGuest && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-300 text-[10px] font-bold">
                        <Lock size={10} /> {t('restricted_guest')}
                      </span>
                    )}
                    {isAssociate && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        <Lock size={10} /> {t('preview_line')}
                      </span>
                    )}
                    {isLeaderOrAdmin && (
                      <button
                        onClick={() => handleDeletePrayer(item.id, item.countryName)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="관리자 권한: 게시물 삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* 기도 본문 내용 (0단계 비회원 블러 / 1단계 준회원 1줄 / 2단계 이상 전문) */}
                <div className="text-gray-800 text-sm leading-relaxed mb-4 min-h-[72px]">
                  {isGuest ? (
                    <div className="relative overflow-hidden rounded-2xl p-4 bg-gray-50/80 border border-gray-200">
                      <p className="blur-[3px] select-none opacity-40 text-gray-500 text-xs leading-relaxed">
                        아시아 13개국 메노나이트 평화 사역자들과 성도들의 긴급 중보기도 내용입니다. 비회원에게는 사역자 보호를 위해 비공개 처리됩니다.
                      </p>
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px] p-2 text-center">
                        <Lock size={16} className="text-gray-700 mb-1" />
                        <span className="text-xs font-bold text-gray-900">회원 전용 기도제목입니다</span>
                        <Link
                          href="/member/login"
                          className="mt-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors"
                        >
                          로그인 후 전체 열람
                        </Link>
                      </div>
                    </div>
                  ) : isRegularOrAbove ? (
                    <p className="whitespace-pre-line">{fullText}</p>
                  ) : (
                    <div>
                      <p className="line-clamp-1 font-medium text-gray-700">
                        {firstLine}...
                      </p>
                      <div className="mt-2 p-2.5 bg-amber-50/90 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-900 shadow-2xs">
                        <Lock size={13} className="shrink-0 text-amber-600" />
                        <span>{t('toast_associate')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 원클릭 AI 다국어 번역 토글 버튼 (정회원 모드일 때 활성화) */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleTranslate(item.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      isRegularOrAbove
                        ? 'text-emerald-600 hover:text-emerald-700 hover:underline'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Globe size={13} />
                    <span>{isTranslated ? t('translate_original') : t('translate_action')}</span>
                  </button>
                  {isTranslated && (
                    <span className="ml-2 text-[10px] bg-emerald-100/70 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                      AI Powered
                    </span>
                  )}
                </div>
              </div>

              {/* 하단 인터랙션 바: 함께 기도합니다(아멘) & 공유 */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handlePray(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isPrayed
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200'
                  }`}
                >
                  <Heart
                    size={13}
                    className={isPrayed ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}
                  />
                  <span>{isPrayed ? t('amen_action') : t('pray_action')}</span>
                  <span className="font-mono text-gray-400 text-[11px] ml-0.5">
                    {item.prayCount}
                  </span>
                </button>

                <div className="flex items-center gap-1 text-gray-400">
                  <button
                    onClick={() => setShareModalItem(item)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    title="공유하기"
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      )}

      {/* 중보 기도제목 작성 모달 (Prayer Request Modal) */}
      {isPrayerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-black text-base sm:text-lg text-gray-900">
                    {locale === 'ko' ? '중보 기도제목 나누기' : 'Share Prayer Request'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {locale === 'ko'
                      ? '아시아 15개국 메노나이트 지체들과 함께 기도로 동역합니다'
                      : 'Partner in prayer with Mennonites across 15 Asian nations'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPrayerModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* 입력 폼 */}
            <form onSubmit={handleCreatePrayer} className="space-y-4">
              {/* 작성자 & 국가 선택 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {locale === 'ko' ? '작성자 (이름 / 사역명)' : 'Author Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={locale === 'ko' ? '이름을 입력하세요' : 'Enter your name'}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {locale === 'ko' ? '소속 국가 (15개국)' : 'Country (15 Nations)'}
                  </label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                  >
                    {NATIONS_15.map((nation) => (
                      <option key={nation.code} value={nation.code}>
                        {nation.flag} {nation.name[locale as 'ko' | 'en'] || nation.name.ko} ({nation.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 기도제목 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {locale === 'ko' ? '기도제목 (핵심 요약)' : 'Prayer Title'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    locale === 'ko'
                      ? '예: 미얀마 신학 교육 및 평화 워크숍을 위한 기도'
                      : 'e.g., Pray for peace workshops and theological education'
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* 기도 상세 내용 */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {locale === 'ko' ? '기도 상세 내용' : 'Prayer Details'}
                </label>
                <textarea
                  required
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    locale === 'ko'
                      ? '함께 기도하고 싶은 상황과 구체적인 중보 기도제목을 나눠주세요.\n(등록된 기도제목은 실시간 기도의 벽에 게시되며 전 아시아 성도들이 함께 기도합니다)'
                      : 'Share specific prayer requests and situations you want us to uphold in prayer.'
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-normal"
                />
              </div>

              {/* 긴급 중보기도 체크박스 */}
              <div className="flex items-center gap-2 p-3 bg-rose-50/70 border border-rose-100 rounded-xl">
                <input
                  type="checkbox"
                  id="is_urgent_checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor="is_urgent_checkbox"
                  className="text-xs font-bold text-rose-900 cursor-pointer flex items-center gap-1.5"
                >
                  <span>🚨 긴급 중보기도 요청</span>
                  <span className="text-[10px] font-normal text-rose-600">(상단 우선 노출 및 긴급 뱃지 표시)</span>
                </label>
              </div>

              {/* 모달 하단 버튼 */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPrayerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {locale === 'ko' ? '취소' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>{locale === 'ko' ? '등록 중...' : 'Submitting...'}</span>
                    </>
                  ) : (
                    <>
                      <PenSquare size={13} />
                      <span>{locale === 'ko' ? '기도제목 등록하기' : 'Submit Prayer'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 공유 모달 */}
      {shareModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h4 className="font-bold text-base text-gray-900 mb-2">기도제목 공유하기</h4>
            <p className="text-xs text-gray-500 mb-4">
              {shareModalItem.countryName}의 중보기도 요청을 메신저로 성도들과 나눠보세요.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => shareViaWhatsApp(shareModalItem)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>WhatsApp으로 공유</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {copyFeedback ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copyFeedback ? '링크가 복사되었습니다!' : '링크 주소 복사'}</span>
              </button>
            </div>

            <button
              onClick={() => setShareModalItem(null)}
              className="mt-4 w-full py-2 text-center text-xs text-gray-400 hover:text-gray-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
