'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getAdminTexts } from '@/lib/adminI18n'
import { getStoredUser, AUTH_EVENT_NAME } from '@/lib/auth'
import { getStoredTierLevel, TIER_EVENT_NAME, TIER_STORAGE_KEY } from '@/components/common/GlobalTierSimulator'
import {
  Member,
  MemberRole,
  MemberLevel,
  MemberTierInfo,
  defaultTierSettings,
  getMemberLevel,
  initialMembers,
} from '@/lib/store'
import {
  Users,
  Search,
  UserPlus,
  Check,
  Trash2,
  Sliders,
  Save,
  MessageSquare,
  Send,
  AlertCircle,
  X,
  RotateCcw,
  Key,
  Shield,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Lock,
  Wrench,
  CheckCircle2,
  User,
} from 'lucide-react'

// 등급 메타데이터 (0단계 비회원 ~ 5단계 총괄관리자)
const tierLabelsKo: Record<MemberLevel, { name: string; badgeClass: string; desc: string; roleKey: MemberRole }> = {
  0: {
    name: '0단계: 비회원 (손님)',
    badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
    desc: '비로그인 방문자 (접근 차단)',
    roleKey: 'guest',
  },
  1: {
    name: '1단계: 준회원',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    desc: '가입 승인 대기 및 기본 열람',
    roleKey: 'associate',
  },
  2: {
    name: '2단계: 정회원',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    desc: '일반 성도 (글/댓글 작성, 자료 다운로드)',
    roleKey: 'regular',
  },
  3: {
    name: '3단계: 사역자/선교사',
    badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
    desc: '현장 사역자 (사역 소식, 기도 제목, 사진 나눔)',
    roleKey: 'level3_worker',
  },
  4: {
    name: '4단계: 리더/게시판관리자',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    desc: '국가 코디네이터 및 게시판 관리 (모든 게시물 삭제, 공지 등록)',
    roleKey: 'country_admin',
  },
  5: {
    name: '5단계: 사이트 관리자 (총괄관리자)',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    desc: '사이트 총괄 운영 관리자 (배너, 회원 등급 승인, 코디네이터, 협력단체, 팝업, 매뉴얼 등)',
    roleKey: 'super_admin',
  },
  6: {
    name: '6단계: 개발자 (Developer)',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    desc: '시스템 최고 개발자 (5단계 사이트 운영 전체 + 7대 신념 교안 관리 + 제미나이 AI 엔진 제어)',
    roleKey: 'developer',
  },
}

const tierLabelsEn: Record<MemberLevel, { name: string; badgeClass: string; desc: string; roleKey: MemberRole }> = {
  0: {
    name: 'Tier 0: Guest (Visitor)',
    badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
    desc: 'Non-logged in visitor (restricted access)',
    roleKey: 'guest',
  },
  1: {
    name: 'Tier 1: Associate Member',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    desc: 'Pending registration approval & basic viewing',
    roleKey: 'associate',
  },
  2: {
    name: 'Tier 2: Regular Believer',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    desc: 'General believer (create posts/comments, download)',
    roleKey: 'regular',
  },
  3: {
    name: 'Tier 3: Worker / Missionary',
    badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
    desc: 'Field minister (ministry news, prayer, photos)',
    roleKey: 'level3_worker',
  },
  4: {
    name: 'Tier 4: Leader / Board Admin',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    desc: 'National coordinator & board moderator',
    roleKey: 'country_admin',
  },
  5: {
    name: 'Tier 5: Site Admin',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    desc: 'Site operations admin (banners, member approval, coordinators, partners, popups)',
    roleKey: 'super_admin',
  },
  6: {
    name: 'Tier 6: Developer',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    desc: 'System developer (Level 5 site operations + 7 Convictions curriculum + Gemini AI engine)',
    roleKey: 'developer',
  },
}

// 권한 라벨 정의 (한/영)
const permissionDefinitionsKo = [
  { key: 'canWritePost', label: '새 글 작성', desc: '자유게시판 및 나눔방에 새 글 등록 가능' },
  { key: 'canWriteComment', label: '댓글 작성', desc: '게시글에 격려 댓글 작성 가능' },
  { key: 'canEditOwn', label: '본인 글/댓글 수정', desc: '자신이 작성한 게시글 및 댓글 수정 가능' },
  { key: 'canDeleteOwn', label: '본인 글/댓글 삭제', desc: '자신이 작성한 게시글 및 댓글 삭제 가능' },
  { key: 'canManageBoard', label: '게시물 관리/모든 글 삭제', desc: '타인 게시물 삭제 및 게시판 관리자 권한' },
  { key: 'canWriteNotice', label: '공지사항 등록 권한', desc: '상단 고정 및 공식 공지사항 작성' },
  { key: 'canDownloadFiles', label: '교안/자료실 다운로드', desc: '15개 언어 레슨플랜 및 자료 다운로드' },
  { key: 'canAccessAdmin', label: '관리자 대시보드 접근', desc: '관리자 화면(/admin) 접근 권한' },
] as const

const permissionDefinitionsEn = [
  { key: 'canWritePost', label: 'Create New Post', desc: 'Can publish new posts in Free Board and Sharing Room' },
  { key: 'canWriteComment', label: 'Write Comments', desc: 'Can post encouraging comments on articles' },
  { key: 'canEditOwn', label: 'Edit Own Posts/Comments', desc: 'Can edit own posts and comments anytime' },
  { key: 'canDeleteOwn', label: 'Delete Own Posts/Comments', desc: 'Can delete own posts and comments' },
  { key: 'canManageBoard', label: 'Board Moderation / Delete All', desc: 'Can moderate/delete others\' posts & board admin rights' },
  { key: 'canWriteNotice', label: 'Post Announcements', desc: 'Can pin notices to top & publish official announcements' },
  { key: 'canDownloadFiles', label: 'Download Curriculum / Media', desc: 'Can download 13-language lesson plans and resources' },
  { key: 'canAccessAdmin', label: 'Access Admin Console', desc: 'Authority to access /admin management dashboard' },
] as const

// 영문 국가명 매핑
const countryNameMapEn: Record<string, string> = {
  KR: 'South Korea',
  MM: 'Myanmar',
  VN: 'Vietnam',
  TH: 'Thailand',
  ID: 'Indonesia',
  JP: 'Japan',
  NP: 'Nepal',
  IN: 'India',
  KH: 'Cambodia',
  LA: 'Laos',
  MN: 'Mongolia',
  TW: 'Taiwan',
  HK: 'Hong Kong',
  PH: 'Philippines',
  US: 'United States',
}

const sampleIds = new Set(['m2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9'])
const sampleEmails = new Set([
  'zawmin@aamen.net',
  'sarah.nguyen@aamen.net',
  'somchai@aamen.net',
  'budi.santoso@aamen.net',
  'eunhye.kim@church.kr',
  'kenji.sato@menno.jp',
  'ramesh.ad@nepal.org',
  'sophea.meas@cambodia.org',
])

const isSampleMember = (m: any) =>
  sampleIds.has(m.id) || (m.email && sampleEmails.has(m.email.toLowerCase()))

interface MemberSnsStatus {
  google: boolean
  whatsapp: boolean
  whatsappDetail?: string
  facebook: boolean
  facebookDetail?: string
  telegram: boolean
  telegramDetail?: string
}

function getMemberSnsStatus(member: Member): MemberSnsStatus {
  const mId = member.id
  // 1. Google: 1회 이상 실제 구글 로그인 성공 회원만 연동 활성화 (일괄 등록된 미로그인 회원은 미연동 처리)
  let isGoogle = Boolean(
    member.google_linked ||
    (member.avatar_url && member.avatar_url.includes('googleusercontent.com')) ||
    mId.toLowerCase() === 'admin' ||
    mId.toLowerCase() === 'yongha'
  )
  if (typeof window !== 'undefined') {
    const localGoogleLinked = localStorage.getItem(`aamen_google_linked_${mId}`)
    if (localGoogleLinked === 'true') isGoogle = true
  }

  // 2. WhatsApp: 유효한 전화번호가 등록되어 있거나 localStorage에 연동 정보가 있는 경우
  let phone = member.phone || ''
  if (typeof window !== 'undefined') {
    const savedWaPhone =
      localStorage.getItem(`aamen_profile_phone_${mId}`) ||
      (mId === 'admin' ? localStorage.getItem('aamen_profile_phone') : null)
    if (savedWaPhone) phone = savedWaPhone
  }
  const hasValidPhone = Boolean(
    phone && !phone.includes('000-0000') && !phone.includes('0000-0000') && phone.length > 7
  )
  const isWhatsapp = hasValidPhone

  // 3. Facebook: 페이스북 계정 링크 또는 localStorage 연동 정보가 있는 경우
  let fbAccount = member.facebook_account || null
  if (typeof window !== 'undefined') {
    const savedFb = localStorage.getItem(`aamen_facebook_${mId}`)
    if (savedFb) fbAccount = savedFb
  }
  if (!fbAccount && mId.toLowerCase() === 'admin') {
    fbAccount = 'https://www.facebook.com/leeshkr'
  }
  const isFacebook = Boolean(fbAccount)

  // 4. Telegram: 텔레그램 봇(@aamen13_bot)에 /start 진행하여 유효한 chat_id가 부여된 경우만 연동 완료
  let tgId = member.telegram_chat_id || null
  if (typeof window !== 'undefined') {
    const savedTg =
      localStorage.getItem(`aamen_telegram_${mId}`) ||
      (mId === 'admin' ? localStorage.getItem('aamen_telegram_chat_id') : null)
    if (savedTg) tgId = savedTg
  }
  if (!tgId && mId.toLowerCase() === 'admin') {
    tgId = '5618137472'
  }
  const isTelegram = Boolean(tgId && tgId.trim() !== '')

  return {
    google: isGoogle,
    whatsapp: isWhatsapp,
    whatsappDetail: hasValidPhone ? phone : undefined,
    facebook: isFacebook,
    facebookDetail: fbAccount || undefined,
    telegram: isTelegram,
    telegramDetail: tgId || undefined,
  }
}

export default function AdminMembersPage() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isEn = currentLocale === 'en'
  const t = getAdminTexts(currentLocale).members

  const tierLabels = isEn ? tierLabelsEn : tierLabelsKo
  const permissionDefinitions = isEn ? permissionDefinitionsEn : permissionDefinitionsKo

  const [activeTab, setActiveTab] = useState<'members' | 'permissions'>('members')
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('ALL')
  const [filterCountry, setFilterCountry] = useState<string>('ALL')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 🌟 수동 저장 상태: 아직 서버에 저장되지 않은 회원별 등급 변경 임시 상태
  const [pendingLevels, setPendingLevels] = useState<Record<string, MemberLevel>>({})
  const [savingMemberIds, setSavingMemberIds] = useState<Record<string, boolean>>({})

  // 🌟 변경 후 다른 페이지로 이동 시 이탈 방지 경고 문구
  useEffect(() => {
    const hasUnsaved = Object.keys(pendingLevels).length > 0
    if (!hasUnsaved) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = isEn
        ? 'You have unsaved member tier changes. Are you sure you want to leave?'
        : '저장되지 않은 회원 등급 수정사항이 있습니다. 저장하지 않고 페이지를 이동하시겠습니까?'
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [pendingLevels, isEn])

  // 5단계 권한 설정 상태 (localStorage 및 기본값 연동)
  const [tierSettings, setTierSettings] = useState<Record<MemberLevel, MemberTierInfo>>(defaultTierSettings)

  // 🌟 개발자 최고 권한 여부 (Level 6 이상 또는 role이 developer)
  const [isDeveloper, setIsDeveloper] = useState(false)

  // 🌟 개발자 회원 정보 인스펙터 & 보안/비밀번호 모달 상태
  const [inspectorMember, setInspectorMember] = useState<Member | null>(null)
  const [inspectorTab, setInspectorTab] = useState<'profile' | 'sns' | 'security'>('profile')
  const [inspectorForm, setInspectorForm] = useState<Partial<Member>>({})
  const [newResetPassword, setNewResetPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSavingInspector, setIsSavingInspector] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // 신규 회원 등록 모달 상태 (신규 회원은 반드시 1단계: 준회원으로 기본 진입)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    countryCode: 'KR',
    countryName: '대한민국',
    flag: '🇰🇷',
    level: 1 as MemberLevel,
  })

  // 1. 초기 로드: MariaDB API 및 권한/개발자 상태 동기화
  useEffect(() => {
    // 🌟 오직 6단계(개발자) 시뮬레이터/권한 레벨일 때만 개발자 관리 기능 활성화
    const checkDev = (lvl?: number) => {
      const currentLvl = typeof lvl === 'number' ? lvl : getStoredTierLevel()
      setIsDeveloper(currentLvl >= 6)
    }
    checkDev()

    const handleAuthChange = () => checkDev()
    const handleTierChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ level: MemberLevel }>
      if (customEvent.detail && typeof customEvent.detail.level === 'number') {
        checkDev(customEvent.detail.level)
      } else {
        checkDev()
      }
    }
    const handleStorage = () => checkDev()
    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange)
    window.addEventListener(TIER_EVENT_NAME, handleTierChange)
    window.addEventListener('storage', handleStorage)
    try {
      const savedPerms = localStorage.getItem('aamen_tier_permissions')
      if (savedPerms) {
        setTierSettings(JSON.parse(savedPerms))
      }
    } catch (e) {}

    async function loadMembers() {
      try {
        let res = await fetch('/api/members.php')
        if (!res.ok) res = await fetch('/api/members')
        if (!res.ok) return
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) return
        const data = await res.json()
        const list = Array.isArray(data) ? data : data.data || []
        const countryMap: Record<string, { name: string; flag: string }> = {
            KR: { name: '대한민국', flag: '🇰🇷' },
            US: { name: '미국', flag: '🇺🇸' },
            MM: { name: '미얀마', flag: '🇲🇲' },
            VN: { name: '베트남', flag: '🇻🇳' },
            TH: { name: '태국', flag: '🇹🇭' },
            ID: { name: '인도네시아', flag: '🇮🇩' },
            JP: { name: '일본', flag: '🇯🇵' },
            NP: { name: '네팔', flag: '🇳🇵' },
            IN: { name: '인도', flag: '🇮🇳' },
            KH: { name: '캄보디아', flag: '🇰🇭' },
            LA: { name: '라오스', flag: '🇱🇦' },
            MN: { name: '몽골', flag: '🇲🇳' },
            TW: { name: '대만', flag: '🇹🇼' },
            HK: { name: '홍콩', flag: '🇭🇰' },
          }

        // 개발자 계정 철저히 필터링
        const filteredList = list.filter(
          (m: any) => m.role !== 'developer' && !m.name?.includes('개발자') && m.email !== 'admin@aamen.net'
        )

        const formatted: Member[] = filteredList.map((m: any) => {
          const cInfo = countryMap[m.country_code] || { name: m.country_code, flag: '🌐' }
          const lvl = getMemberLevel(m.role as MemberRole)
          return {
            id: m.id,
            name: m.name,
            name_en: m.name_en || null,
            email: m.email,
            countryCode: m.country_code,
            countryName: cInfo.name,
            flag: cInfo.flag,
            role: m.role as MemberRole,
            level: lvl,
            status: (m.status || 'active') as any,
            joinedDate: (m.created_at || '').substring(0, 10),
            created_at: m.created_at || '',
            updated_at: m.updated_at || '',
            affiliation: m.affiliation || '',
            phone: m.phone || '',
            bio: m.bio || '',
            provider: m.provider || 'google',
            facebook_account: m.facebook_account || null,
            telegram_chat_id: m.telegram_chat_id || null,
            google_linked: true,
            avatar_url: m.avatar_url || null,
          }
        })
        setMembers(formatted)
        try {
          localStorage.setItem('aamen_members', JSON.stringify(formatted))
        } catch (e) {}
        return
      } catch (e) {
        console.error('Failed to load server members, fallback to local', e)
      }

      try {
        const saved = localStorage.getItem('aamen_members')
        if (saved) {
          const parsed: Member[] = JSON.parse(saved)
          setMembers(parsed)
        }
      } catch (e) {}
    }

    loadMembers()

    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange)
      window.removeEventListener(TIER_EVENT_NAME, handleTierChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  // 저장 헬퍼
  const persistMembers = (updated: Member[], msg: string) => {
    setMembers(updated)
    try {
      localStorage.setItem('aamen_members', JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }

  // 🌟 개발자 인스펙터 모달 열기
  const openInspector = (member: Member) => {
    setInspectorMember(member)
    setInspectorForm({
      name: member.name,
      name_en: member.name_en || '',
      email: member.email,
      countryCode: member.countryCode,
      affiliation: member.affiliation || '',
      phone: member.phone || '',
      bio: member.bio || '',
      role: member.role,
      status: member.status,
      facebook_account: member.facebook_account || '',
      telegram_chat_id: member.telegram_chat_id || '',
      google_linked: member.google_linked ? 1 : 0,
      avatar_url: member.avatar_url || '',
      password: member.password || '',
    })
    setInspectorTab('profile')
    setNewResetPassword('')
    setShowPassword(false)
  }

  // 🌟 개발자 권한 비밀번호 강제 리셋 핸들러
  const handleAdminResetPassword = async (memberId: string, customPw?: string) => {
    const pwToSet = (customPw || newResetPassword).trim()
    if (!pwToSet) {
      alert(isEn ? 'Please enter a new password.' : '새 비밀번호를 입력해주세요.')
      return
    }

    setIsSavingInspector(true)
    try {
      let res = await fetch('/api/members.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_reset_password',
          id: memberId,
          user_id: memberId,
          password: pwToSet,
          new_password: pwToSet,
        }),
      })
      if (!res.ok) {
        res = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'admin_reset_password',
            id: memberId,
            user_id: memberId,
            password: pwToSet,
            new_password: pwToSet,
          }),
        })
      }

      const data = await res.json()
      if (data.status === 'success') {
        const updated = members.map((m) =>
          m.id === memberId ? { ...m, password: pwToSet } : m
        )
        persistMembers(
          updated,
          isEn
            ? `Password for [${inspectorMember?.name || memberId}] has been reset successfully!`
            : `[${inspectorMember?.name || memberId}] 회원의 비밀번호가 [${pwToSet}]로 재설정되었습니다!`
        )
        if (inspectorMember && inspectorMember.id === memberId) {
          setInspectorMember((prev) => (prev ? { ...prev, password: pwToSet } : null))
          setInspectorForm((prev) => ({ ...prev, password: pwToSet }))
        }
        setNewResetPassword('')
      } else {
        alert(data.error || (isEn ? 'Failed to reset password.' : '비밀번호 재설정에 실패했습니다.'))
      }
    } catch (e: any) {
      console.error('Reset password error:', e)
      alert((isEn ? 'Failed to reset password: ' : '비밀번호 재설정 오류: ') + e.message)
    } finally {
      setIsSavingInspector(false)
    }
  }

  // 🌟 개발자 인스펙터 전체 정보 일괄 저장
  const handleSaveInspectorDetails = async () => {
    if (!inspectorMember) return
    setIsSavingInspector(true)

    try {
      const payload = {
        action: 'admin_update_member',
        id: inspectorMember.id,
        user_id: inspectorMember.id,
        ...inspectorForm,
      }

      let res = await fetch('/api/members.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        res = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const data = await res.json()
      if (data.status === 'success') {
        const updatedData = data.member || { ...inspectorMember, ...inspectorForm }
        const updated = members.map((m) =>
          m.id === inspectorMember.id ? { ...m, ...updatedData } : m
        )
        persistMembers(
          updated,
          isEn
            ? `[${inspectorMember.name}] details and integration status updated.`
            : `[${inspectorMember.name}] 회원의 정보 및 연동 상태가 성공적으로 저장되었습니다.`
        )
        setInspectorMember(updatedData)
      } else {
        alert(data.error || (isEn ? 'Failed to update member.' : '회원 정보 수정에 실패했습니다.'))
      }
    } catch (e: any) {
      console.error('Update member error:', e)
      alert((isEn ? 'Update failed: ' : '수정 실패: ') + e.message)
    } finally {
      setIsSavingInspector(false)
    }
  }

  // 🌟 1) 등급 드롭다운 임시 선택 (실시간 저장이 아닌 수동 저장 대기)
  const handleSelectLevelPending = (id: string, newLevel: MemberLevel) => {
    const member = members.find((m) => m.id === id)
    const originalLevel = member ? (member.level || getMemberLevel(member.role)) : 2

    setPendingLevels((prev) => {
      const next = { ...prev }
      if (newLevel === originalLevel) {
        delete next[id]
      } else {
        next[id] = newLevel
      }
      return next
    })
  }

  // 🌟 2) 단일 회원 등급 수동 저장
  const handleSaveMemberLevel = async (id: string) => {
    const newLevel = pendingLevels[id]
    if (newLevel === undefined) return

    setSavingMemberIds((prev) => ({ ...prev, [id]: true }))
    const targetTier = tierLabels[newLevel]
    const updated = members.map((m) =>
      m.id === id ? { ...m, level: newLevel, role: targetTier.roleKey } : m
    )

    try {
      let res = await fetch('/api/members.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_role', id, role: targetTier.roleKey }),
      })
      if (!res.ok) {
        res = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update_role', id, role: targetTier.roleKey }),
        })
      }

      persistMembers(
        updated,
        isEn
          ? `Saved: Member tier updated to [${targetTier.name}].`
          : `저장 완료: 회원 등급이 [${targetTier.name}]으로 안전하게 반영되었습니다.`
      )

      // 저장 완료 후 pending 목록에서 제거
      setPendingLevels((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    } catch (e) {
      console.error('Role update error:', e)
      alert(isEn ? 'Failed to save member tier.' : '회원 등급 저장 중 오류가 발생했습니다.')
    } finally {
      setSavingMemberIds((prev) => ({ ...prev, [id]: false }))
    }
  }

  // 🌟 3) 단일 회원 등급 변경 취소
  const handleCancelMemberLevel = (id: string) => {
    setPendingLevels((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  // 🌟 4) 변경된 전체 회원 등급 일괄 저장
  const handleSaveAllPending = async () => {
    const pendingIds = Object.keys(pendingLevels)
    if (pendingIds.length === 0) return

    let currentUpdated = [...members]
    for (const id of pendingIds) {
      const newLvl = pendingLevels[id]
      const targetTier = tierLabels[newLvl]
      currentUpdated = currentUpdated.map((m) =>
        m.id === id ? { ...m, level: newLvl, role: targetTier.roleKey } : m
      )
      try {
        await fetch('/api/members.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update_role', id, role: targetTier.roleKey }),
        })
      } catch (e) {}
    }

    persistMembers(
      currentUpdated,
      isEn
        ? `All ${pendingIds.length} member tiers saved successfully.`
        : `수정된 ${pendingIds.length}명의 회원 등급이 모두 안전하게 저장되었습니다.`
    )
    setPendingLevels({})
  }

  // 🌟 5) 변경사항 모두 취소
  const handleCancelAllPending = () => {
    if (confirm(isEn ? 'Discard all unsaved tier changes?' : '저장되지 않은 모든 등급 수정을 취소하시겠습니까?')) {
      setPendingLevels({})
    }
  }

  // 하위 호환용 래퍼
  const handleLevelChange = async (id: string, newLevel: MemberLevel) => {
    handleSelectLevelPending(id, newLevel)
  }

  // 회원 상태 변경 (active / pending / suspended)
  const handleStatusChange = async (id: string, newStatus: 'active' | 'pending' | 'suspended') => {
    const updated = members.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    persistMembers(
      updated,
      isEn ? 'Member account status updated.' : '회원 계정 상태가 업데이트되었습니다.'
    )
    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id, status: newStatus }),
      })
    } catch (e) {
      console.error('Status update error:', e)
    }
  }

  // 회원 삭제
  const handleDeleteMember = async (id: string, name: string) => {
    const confirmMsg = isEn
      ? `Are you sure you want to delete member '${name}'?`
      : `정말 '${name}' 회원을 삭제하시겠습니까?`
    if (confirm(confirmMsg)) {
      const updated = members.filter((m) => m.id !== id)
      persistMembers(
        updated,
        isEn ? `Member '${name}' was deleted.` : `'${name}' 회원이 삭제되었습니다.`
      )
      try {
        await fetch('/api/members.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id }),
        })
      } catch (e) {
        console.error('Delete member error:', e)
      }
    }
  }

  // 🌟 다중 선택 체크박스 핸들러
  const handleToggleSelectAll = () => {
    if (filtered.length === 0) return
    const allFilteredIds = filtered.map((m) => m.id)
    const isAllSelected = allFilteredIds.every((id) => selectedMemberIds.includes(id))

    if (isAllSelected) {
      setSelectedMemberIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)))
    } else {
      setSelectedMemberIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])))
    }
  }

  const handleToggleSelectMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // 🗑️ 선택된 회원 일괄 삭제 핸들러
  const handleDeleteSelected = async () => {
    if (selectedMemberIds.length === 0) return

    const count = selectedMemberIds.length
    const confirmMsg = isEn
      ? `Are you sure you want to delete ${count} selected member(s)?`
      : `정말 선택한 ${count}명의 회원을 일괄 삭제하시겠습니까?`

    if (confirm(confirmMsg)) {
      const idsToDelete = new Set(selectedMemberIds)
      const updated = members.filter((m) => !idsToDelete.has(m.id))
      persistMembers(
        updated,
        isEn
          ? `${count} member(s) have been deleted.`
          : `${count}명의 회원이 성공적으로 삭제되었습니다.`
      )

      try {
        for (const id of selectedMemberIds) {
          fetch('/api/members.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id }),
          }).catch(() => {})
        }
      } catch (e) {
        console.error('Batch delete error:', e)
      }

      setSelectedMemberIds([])
    }
  }

  // 권한 체크박스 토글
  const handleTogglePermission = (lvl: MemberLevel, permKey: keyof MemberTierInfo['permissions']) => {
    setTierSettings((prev) => {
      const updated = {
        ...prev,
        [lvl]: {
          ...prev[lvl],
          permissions: {
            ...prev[lvl].permissions,
            [permKey]: !prev[lvl].permissions[permKey],
          },
        },
      }
      return updated
    })
  }

  // 권한 설정 저장
  const handleSavePermissions = () => {
    try {
      localStorage.setItem('aamen_tier_permissions', JSON.stringify(tierSettings))
      window.dispatchEvent(new Event('storage'))
      setToastMessage(
        isEn
          ? '5-tier permission matrix settings saved successfully!'
          : '5단계 등급별 권한 설정이 성공적으로 저장되었습니다!'
      )
      setTimeout(() => setToastMessage(null), 2500)
    } catch (e) {
      console.error(e)
    }
  }

  // 권한 기본값 복원
  const handleResetPermissions = () => {
    const confirmMsg = isEn
      ? 'Reset all tier permission rules to recommended default values?'
      : '모든 등급의 권한 설정을 기본 추천값으로 초기화하시겠습니까?'
    if (confirm(confirmMsg)) {
      setTierSettings(defaultTierSettings)
      localStorage.setItem('aamen_tier_permissions', JSON.stringify(defaultTierSettings))
      window.dispatchEvent(new Event('storage'))
      setToastMessage(
        isEn ? 'Permission rules restored to defaults.' : '권한 설정이 기본값으로 복원되었습니다.'
      )
      setTimeout(() => setToastMessage(null), 2500)
    }
  }

  // 새 회원 등록
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMember.name || !newMember.email) return

    const countryMap: Record<string, { name: string; flag: string }> = {
      KR: { name: isEn ? 'South Korea' : '대한민국', flag: '🇰🇷' },
      US: { name: isEn ? 'United States' : '미국', flag: '🇺🇸' },
      MM: { name: isEn ? 'Myanmar' : '미얀마', flag: '🇲🇲' },
      VN: { name: isEn ? 'Vietnam' : '베트남', flag: '🇻🇳' },
      TH: { name: isEn ? 'Thailand' : '태국', flag: '🇹🇭' },
      ID: { name: isEn ? 'Indonesia' : '인도네시아', flag: '🇮🇩' },
      JP: { name: isEn ? 'Japan' : '일본', flag: '🇯🇵' },
      NP: { name: isEn ? 'Nepal' : '네팔', flag: '🇳🇵' },
      IN: { name: isEn ? 'India' : '인도', flag: '🇮🇳' },
      KH: { name: isEn ? 'Cambodia' : '캄보디아', flag: '🇰🇭' },
    }

    const cInfo = countryMap[newMember.countryCode] || { name: isEn ? 'Other' : '기타', flag: '🌐' }
    const targetTier = tierLabels[newMember.level]

    const created: Member = {
      id: `m_${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      countryCode: newMember.countryCode,
      countryName: cInfo.name,
      flag: cInfo.flag,
      role: targetTier.roleKey,
      level: newMember.level,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
    }

    const updated = [created, ...members]
    persistMembers(
      updated,
      isEn
        ? `New member [${created.name}] has been registered.`
        : `신규 회원 [${created.name}]이 등록되었습니다.`
    )

    try {
      fetch('/api/members.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: created.id,
          name: created.name,
          email: created.email,
          country_code: created.countryCode,
          role: created.role,
          status: created.status,
        }),
      }).catch(() => {})
    } catch (e) {}

    setIsModalOpen(false)
    setNewMember({
      name: '',
      email: '',
      countryCode: 'KR',
      countryName: '대한민국',
      flag: '🇰🇷',
      level: 1,
    })
  }

  // 검색 및 필터링 (개발자 및 샘플 제외 확실히 보장)
  const filtered = members.filter((m) => {
    if (
      m.role === ('developer' as any) ||
      m.name.includes('개발자') ||
      m.email === 'admin@aamen.net' ||
      isSampleMember(m)
    ) {
      return false
    }
    const cDisplayName = isEn ? (countryNameMapEn[m.countryCode] || m.countryName) : m.countryName
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cDisplayName.toLowerCase().includes(searchTerm.toLowerCase())
    const mLevel = m.level || getMemberLevel(m.role)
    const matchesLevel = filterLevel === 'ALL' || String(mLevel) === filterLevel
    const matchesCountry = filterCountry === 'ALL' || m.countryCode === filterCountry
    return matchesSearch && matchesLevel && matchesCountry
  })

  return (
    <div className="space-y-8">
      {/* 알림 토스트 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-500/40 animate-in fade-in slide-in-from-bottom-2 text-sm font-semibold">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 🛠️ 개발자 권한 전용 알림 & 안내 배너 */}
      {isDeveloper && (
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-3xl border border-indigo-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-inner">
              <Wrench size={22} className="text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm text-white">
                  {isEn ? 'Developer Authority Active' : '개발자(Developer) 최고 관리 권한 활성화됨'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500 text-white shadow-xs">
                  Level 6 Developer
                </span>
              </div>
              <p className="text-xs text-indigo-200/90 mt-1 leading-relaxed">
                {isEn
                  ? 'You have complete access to inspect each member’s raw profile, SNS & messenger sync status, and reset passwords directly.'
                  : '각 회원의 모든 세부 정보(소셜 연동 여부, 전화번호, 이메일, 계정 식별자) 확인 및 비밀번호 직접 리셋/수정 권한이 적용되었습니다. 명단 우측의 [개발자 관리] 버튼을 클릭하세요.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 상단 타이틀 & 탭 네비게이션 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>👥</span>
            <span>{t.title}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'members' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <UserPlus size={15} />
              <span>{isEn ? 'Add Member' : '신규 회원 등록'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 서브 탭: 회원 명단 vs 5단계 등급별 권한 설정 */}
      <div className="flex border-b border-gray-200 gap-4">
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'members'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Users size={16} />
          <span>{isEn ? `Member Directory (${members.length})` : `회원 명단 및 등급 조정 (${members.length}명)`}</span>
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'permissions'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          <Sliders size={16} />
          <span>{isEn ? '5-Tier Permission Matrix' : '5단계 등급별 권한 매트릭스 설정'}</span>
        </button>
      </div>

      {/* 5단계 등급 통계 카드 (1단계 ~ 5단계) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {([1, 2, 3, 4, 5] as MemberLevel[]).map((lvl) => {
          const info = tierLabels[lvl]
          const count = members.filter((m) => (m.level || getMemberLevel(m.role)) === lvl).length
          return (
            <div key={lvl} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${info.badgeClass}`}>
                  {info.name}
                </span>
                <span className="text-lg font-black text-gray-900">{count}{isEn ? '' : '명'}</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">{info.desc}</p>
            </div>
          )
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: 회원 명단 및 등급 조정 */}
      {/* ============================================================== */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* 검색 및 필터 바 */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 min-w-[240px] items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-200">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* 등급 필터 */}
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ALL">{isEn ? 'All 5 Tiers' : '전체 5단계 등급 보기'}</option>
                <option value="5">{isEn ? 'Tier 5: Super Admin' : '5단계: 총괄관리자'}</option>
                <option value="4">{isEn ? 'Tier 4: Leader / Board Admin' : '4단계: 리더/게시판관리자'}</option>
                <option value="3">{isEn ? 'Tier 3: Worker / Missionary' : '3단계: 사역자/선교사'}</option>
                <option value="2">{isEn ? 'Tier 2: Regular Believer' : '2단계: 정회원'}</option>
                <option value="1">{isEn ? 'Tier 1: Associate Member' : '1단계: 준회원'}</option>
              </select>

              {/* 국가 필터 */}
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ALL">{isEn ? 'All 15 Nations' : '15개국 전체'}</option>
                <option value="KR">🇰🇷 {isEn ? 'South Korea' : '대한민국'}</option>
                <option value="US">🇺🇸 {isEn ? 'United States' : '미국'}</option>
                <option value="ID">🇮🇩 {isEn ? 'Indonesia' : '인도네시아'}</option>
                <option value="TH">🇹🇭 {isEn ? 'Thailand' : '태국'}</option>
                <option value="VN">🇻🇳 {isEn ? 'Vietnam' : '베트남'}</option>
                <option value="MM">🇲🇲 {isEn ? 'Myanmar' : '미얀마'}</option>
                <option value="IN">🇮🇳 {isEn ? 'India' : '인도'}</option>
                <option value="NP">🇳🇵 {isEn ? 'Nepal' : '네팔'}</option>
                <option value="JP">🇯🇵 {isEn ? 'Japan' : '일본'}</option>
                <option value="KH">🇰🇭 {isEn ? 'Cambodia' : '캄보디아'}</option>
                <option value="LA">🇱🇦 {isEn ? 'Laos' : '라오스'}</option>
                <option value="MN">🇲🇳 {isEn ? 'Mongolia' : '몽골'}</option>
                <option value="TW">🇹🇼 {isEn ? 'Taiwan' : '대만'}</option>
                <option value="HK">🇭🇰 {isEn ? 'Hong Kong' : '홍콩'}</option>
                <option value="PH">🇵🇭 {isEn ? 'Philippines' : '필리핀'}</option>
              </select>
            </div>
          </div>

          {/* 🌟 다중 선택 일괄 액션 바 */}
          {selectedMemberIds.length > 0 && (
            <div className="p-4 px-5 bg-rose-50 border border-rose-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  {selectedMemberIds.length}
                </span>
                <span className="text-sm font-black text-rose-950">
                  {isEn
                    ? `${selectedMemberIds.length} member(s) selected`
                    : `총 ${selectedMemberIds.length}명의 회원이 선택되었습니다.`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMemberIds([])}
                  className="px-3.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition-colors cursor-pointer shadow-2xs"
                >
                  {isEn ? 'Deselect All' : '선택 해제'}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>{isEn ? 'Delete Selected' : '선택 회원 일괄 삭제'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 🌟 미저장 회원 등급 변경사항 플로팅 알림 바 */}
          {Object.keys(pendingLevels).length > 0 && (
            <div className="sticky top-4 z-40 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-5 py-3.5 rounded-2xl shadow-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={20} className="text-slate-950 shrink-0" />
                <div>
                  <span className="font-black text-xs sm:text-sm block">
                    {isEn
                      ? `You have ${Object.keys(pendingLevels).length} unsaved tier change(s).`
                      : `저장되지 않은 회원 등급 수정사항이 ${Object.keys(pendingLevels).length}건 있습니다.`}
                  </span>
                  <span className="text-[11px] text-amber-950 font-semibold">
                    {isEn
                      ? 'Click [Save] next to the dropdown or [Save All] below to apply changes to the server.'
                      : '각 회원 우측의 [저장] 버튼이나 우측의 [전체 일괄 저장]을 클릭해야 최종 서버에 반영됩니다.'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCancelAllPending}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-gray-800 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  <span>{isEn ? 'Discard All' : '모두 취소'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveAllPending}
                  className="px-4 py-1.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save size={13} className="text-emerald-400" />
                  <span>{isEn ? 'Save All' : '전체 일괄 저장'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 회원 테이블 */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        aria-label="Select all"
                        checked={filtered.length > 0 && filtered.every((m) => selectedMemberIds.includes(m.id))}
                        onChange={handleToggleSelectAll}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-6">{isEn ? 'Member Info' : '회원 정보'}</th>
                    <th className="py-3.5 px-4">{isEn ? 'Country' : '국가'}</th>
                    <th className="py-3.5 px-4 text-center">{isEn ? 'Connected SNS' : 'SNS 연동'}</th>
                    <th className="py-3.5 px-4">{isEn ? 'Tier Adjustment (5 Levels)' : '회원 등급 조정 (5단계)'}</th>
                    <th className="py-3.5 px-4">{isEn ? 'Account Status' : '계정 상태'}</th>
                    <th className="py-3.5 px-4">{isEn ? 'Joined Date' : '가입일'}</th>
                    <th className="py-3.5 px-6 text-right">{isEn ? 'Actions' : '관리'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((member) => {
                    const pendingLvl = pendingLevels[member.id]
                    const currentLvl = pendingLvl !== undefined ? pendingLvl : (member.level || getMemberLevel(member.role))
                    const isTierChanged = pendingLvl !== undefined
                    const isSaving = Boolean(savingMemberIds[member.id])
                    const tierMeta = tierLabels[currentLvl]
                    const countryDisplay = isEn ? (countryNameMapEn[member.countryCode] || member.countryName) : member.countryName
                    const isSelected = selectedMemberIds.includes(member.id)
                    return (
                      <tr
                        key={member.id}
                        className={`hover:bg-gray-50/70 transition-colors ${
                          isSelected ? 'bg-rose-50/40' : ''
                        }`}
                      >
                        {/* 다중 선택 체크박스 */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectMember(member.id)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                          />
                        </td>

                        {/* 이름 & 이메일 */}
                        <td className="py-4 px-6">
                          {isDeveloper ? (
                            <button
                              type="button"
                              onClick={() => openInspector(member)}
                              className="text-left group cursor-pointer focus:outline-none"
                              title={isEn ? 'Click to inspect full details (Dev only)' : '클릭하여 회원 전체 상세정보 및 연동/보안 확인 (개발자 전용)'}
                            >
                              <div className="font-bold text-gray-900 flex items-center gap-2 flex-wrap group-hover:text-indigo-600 transition-colors">
                                <span className="underline decoration-dotted underline-offset-4 decoration-gray-300 group-hover:decoration-indigo-500">
                                  {member.name}
                                </span>
                                {member.name_en && (
                                  <span className="text-xs text-gray-400 font-normal">({member.name_en})</span>
                                )}
                                {member.affiliation && (
                                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                    {member.affiliation}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-400 font-mono mt-0.5 group-hover:text-gray-600 transition-colors">
                                {member.email}
                              </div>
                            </button>
                          ) : (
                            <div>
                              <div className="font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                                <span>{member.name}</span>
                                {member.name_en && (
                                  <span className="text-xs text-gray-400 font-normal">({member.name_en})</span>
                                )}
                                {member.affiliation && (
                                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                    {member.affiliation}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-400 font-mono mt-0.5">{member.email}</div>
                            </div>
                          )}
                        </td>

                        {/* 국가 */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-medium text-gray-700 text-xs">
                            <span className="text-base">{member.flag}</span>
                            <span>{countryDisplay}</span>
                          </div>
                        </td>

                        {/* SNS 연동 상태 아이콘 (Google, WhatsApp, Facebook, Telegram) */}
                        <td className="py-4 px-4 whitespace-nowrap text-center">
                          {(() => {
                            const sns = getMemberSnsStatus(member)
                            return (
                              <div className="inline-flex items-center gap-1.5 p-1 bg-gray-50/80 rounded-xl border border-gray-100 shadow-2xs">
                                {/* 1. Google 계정 (1회 이상 구글 로그인 완료 회원만 컬러 활성화) */}
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-help hover:scale-110 ${
                                    sns.google
                                      ? 'bg-white border border-gray-200/80 shadow-2xs'
                                      : 'bg-gray-200/60 border border-gray-200/50 opacity-30 grayscale'
                                  }`}
                                  title={
                                    sns.google
                                      ? isEn
                                        ? `Google Connected (First login verified: ${member.email})`
                                        : `Google 연동 완료 (최초 로그인 인증됨: ${member.email})`
                                      : isEn
                                      ? `Google Pending (First Google login required: ${member.email})`
                                      : `Google 미연동 (최초 1회 구글 로그인 인증 필요: ${member.email})`
                                  }
                                >
                                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                    <path
                                      fill="#4285F4"
                                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                      fill="#34A853"
                                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                      fill="#FBBC05"
                                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    />
                                    <path
                                      fill="#EA4335"
                                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                    />
                                  </svg>
                                </div>

                                {/* 2. WhatsApp 메신저 */}
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-help hover:scale-110 ${
                                    sns.whatsapp
                                      ? 'bg-emerald-600 text-white shadow-2xs ring-1 ring-emerald-500/30'
                                      : 'bg-gray-200/60 text-gray-400 opacity-30 grayscale'
                                  }`}
                                  title={
                                    sns.whatsapp
                                      ? isEn
                                        ? `WhatsApp Connected: ${sns.whatsappDetail}`
                                        : `WhatsApp 연동 완료: ${sns.whatsappDetail}`
                                      : isEn
                                      ? 'WhatsApp Not Connected'
                                      : 'WhatsApp 미연동'
                                  }
                                >
                                  <MessageSquare size={12} />
                                </div>

                                {/* 3. Telegram 계정 (봇 /start 인증 완료 시에만 컬러 활성화) */}
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-help hover:scale-110 ${
                                    sns.telegram
                                      ? 'bg-[#2AABEE] text-white shadow-2xs ring-1 ring-sky-500/30'
                                      : 'bg-gray-200/60 text-gray-400 opacity-30 grayscale'
                                  }`}
                                  title={
                                    sns.telegram
                                      ? isEn
                                        ? `Telegram Connected (/start verified, Chat ID: ${sns.telegramDetail})`
                                        : `Telegram 연동 완료 (/start 인증됨, Chat ID: ${sns.telegramDetail})`
                                      : isEn
                                      ? 'Telegram Not Connected (@aamen13_bot /start required)'
                                      : 'Telegram 미연동 (@aamen13_bot /start 인증 필요)'
                                  }
                                >
                                  <Send size={11} className="-translate-x-0.5 translate-y-0.5" />
                                </div>
                              </div>
                            )
                          })()}
                        </td>

                        {/* 회원 등급 선택 드롭다운 (5단계) 및 수동 저장 버튼 */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <select
                              value={currentLvl}
                              onChange={(e) => handleSelectLevelPending(member.id, Number(e.target.value) as MemberLevel)}
                              className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all ${
                                isTierChanged
                                  ? 'ring-2 ring-amber-400 border-amber-500 bg-amber-50 text-amber-950 font-black'
                                  : tierMeta.badgeClass
                              }`}
                            >
                              <option value={5}>{tierLabels[5].name}</option>
                              <option value={4}>{tierLabels[4].name}</option>
                              <option value={3}>{tierLabels[3].name}</option>
                              <option value={2}>{tierLabels[2].name}</option>
                              <option value={1}>{tierLabels[1].name}</option>
                            </select>

                            {/* 변경 시에만 우측에 수동 [저장] 및 [취소] 버튼 노출 */}
                            {isTierChanged && (
                              <div className="flex items-center gap-1 animate-in fade-in zoom-in-95">
                                <button
                                  type="button"
                                  onClick={() => handleSaveMemberLevel(member.id)}
                                  disabled={isSaving}
                                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-xl text-[11px] shadow-sm flex items-center gap-1 transition-all cursor-pointer animate-pulse"
                                  title={isEn ? 'Save Tier Change' : '변경한 등급 저장하기'}
                                >
                                  <Save size={12} />
                                  <span>{isSaving ? (isEn ? 'Saving...' : '저장중...') : (isEn ? '저장' : '저장')}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCancelMemberLevel(member.id)}
                                  disabled={isSaving}
                                  className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all cursor-pointer"
                                  title={isEn ? 'Cancel' : '취소'}
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 계정 상태 */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <select
                            value={member.status}
                            onChange={(e) =>
                              handleStatusChange(member.id, e.target.value as 'active' | 'pending' | 'suspended')
                            }
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                              member.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : member.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <option value="active">{isEn ? 'Active' : '활동 중'}</option>
                            <option value="pending">{isEn ? 'Pending' : '승인 대기'}</option>
                            <option value="suspended">{isEn ? 'Suspended' : '이용 정지'}</option>
                          </select>
                        </td>

                        {/* 가입일 */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                          {member.joinedDate}
                        </td>

                        {/* 관리 (개발자 관리 & 삭제) */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {isDeveloper && (
                              <button
                                type="button"
                                onClick={() => openInspector(member)}
                                className="px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-200 ring-1 ring-indigo-500/50"
                                title={isEn ? 'View All Member Details & Security (Dev only)' : '회원 전체 정보 및 연동/비밀번호 관리 (개발자 전용)'}
                              >
                                <Wrench size={13} className="text-indigo-200" />
                                <span>{isEn ? 'Dev Inspector' : '개발자 관리'}</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMember(member.id, member.name)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title={isEn ? 'Delete Member' : '회원 삭제'}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">
                  {isEn ? 'No members found matching the search criteria.' : '검색 조건과 일치하는 회원이 없습니다.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: 5단계 등급별 권한 매트릭스 설정 */}
      {/* ============================================================== */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold flex items-center gap-1.5 text-sm mb-1">
                <span>🛡️</span>
                <span>{isEn ? 'Tier-based Permission Rules (Adjustable anytime)' : '등급별 권한 부여 규칙 (차후 권한 확정 가능)'}</span>
              </p>
              <p className="leading-relaxed text-emerald-800">
                {isEn
                  ? 'You can freely customize the permission checkboxes for each member tier. Rules set here apply immediately across the entire site for creating posts, comments, and moderation.'
                  : '각 등급별로 부여할 권한 체크박스를 필요에 따라 자유롭게 변경하실 수 있습니다. 대표님께서 정하신 권한 규칙은 사이트 전체의 새 글 작성, 게시물 삭제, 댓글 작성 권한에 즉시 연동됩니다.'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResetPermissions}
                className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-300 text-xs transition-colors cursor-pointer"
              >
                {isEn ? 'Reset to Defaults' : '기본값 복원'}
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Save size={14} />
                <span>{isEn ? 'Save Permissions' : '권한 설정 저장'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-600">
                    <th className="py-4 px-6 w-1/3">{isEn ? 'Permission Item' : '권한 항목'}</th>
                    {([1, 2, 3, 4, 5] as MemberLevel[]).map((lvl) => (
                      <th key={lvl} className="py-4 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black border ${tierLabels[lvl].badgeClass}`}>
                          {tierLabels[lvl].name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {permissionDefinitions.map((perm) => (
                    <tr key={perm.key} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-1.5">
                          {perm.key === 'canManageBoard' && <span className="text-rose-600 font-extrabold">{isEn ? '[Key]' : '[핵심]'}</span>}
                          {perm.key === 'canWritePost' && <span className="text-emerald-600 font-extrabold">{isEn ? '[Key]' : '[핵심]'}</span>}
                          <span>{perm.label}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{perm.desc}</div>
                      </td>
                      {([1, 2, 3, 4, 5] as MemberLevel[]).map((lvl) => {
                        const isGranted = Boolean(tierSettings[lvl]?.permissions?.[perm.key as keyof MemberTierInfo['permissions']])
                        return (
                          <td key={lvl} className="py-3.5 px-3 text-center">
                            <label className="inline-flex items-center justify-center p-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                              <input
                                type="checkbox"
                                checked={isGranted}
                                onChange={() => handleTogglePermission(lvl, perm.key as keyof MemberTierInfo['permissions'])}
                                className="w-4 h-4 text-emerald-600 rounded-md border-gray-300 focus:ring-emerald-500 cursor-pointer"
                              />
                            </label>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 신규 회원 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UserPlus size={18} className="text-emerald-600" />
                <span>{isEn ? 'Direct Member Registration' : '신규 회원 직접 등록'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isEn ? 'Name / Believer Name' : '이름 / 성도명'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? 'e.g. John Doe' : '예: 김사역 성도'}
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isEn ? 'Email Address' : '이메일 주소'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@aamen.net"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Country' : '소속 국가'}
                  </label>
                  <select
                    value={newMember.countryCode}
                    onChange={(e) => setNewMember({ ...newMember, countryCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="KR">🇰🇷 {isEn ? 'South Korea' : '대한민국'}</option>
                    <option value="US">🇺🇸 {isEn ? 'United States' : '미국'}</option>
                    <option value="ID">🇮🇩 {isEn ? 'Indonesia' : '인도네시아'}</option>
                    <option value="TH">🇹🇭 {isEn ? 'Thailand' : '태국'}</option>
                    <option value="VN">🇻🇳 {isEn ? 'Vietnam' : '베트남'}</option>
                    <option value="MM">🇲🇲 {isEn ? 'Myanmar' : '미얀마'}</option>
                    <option value="IN">🇮🇳 {isEn ? 'India' : '인도'}</option>
                    <option value="NP">🇳🇵 {isEn ? 'Nepal' : '네팔'}</option>
                    <option value="JP">🇯🇵 {isEn ? 'Japan' : '일본'}</option>
                    <option value="KH">🇰🇭 {isEn ? 'Cambodia' : '캄보디아'}</option>
                    <option value="LA">🇱🇦 {isEn ? 'Laos' : '라오스'}</option>
                    <option value="MN">🇲🇳 {isEn ? 'Mongolia' : '몽골'}</option>
                    <option value="TW">🇹🇼 {isEn ? 'Taiwan' : '대만'}</option>
                    <option value="HK">🇭🇰 {isEn ? 'Hong Kong' : '홍콩'}</option>
                    <option value="PH">🇵🇭 {isEn ? 'Philippines' : '필리핀'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Member Tier (5 Levels)' : '회원 등급 (5단계)'}
                  </label>
                  <select
                    value={newMember.level}
                    onChange={(e) => setNewMember({ ...newMember, level: Number(e.target.value) as MemberLevel })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value={1}>{tierLabels[1].name}</option>
                    <option value={2}>{tierLabels[2].name}</option>
                    <option value={3}>{tierLabels[3].name}</option>
                    <option value={4}>{tierLabels[4].name}</option>
                    <option value={5}>{tierLabels[5].name}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isEn ? 'Cancel' : '취소'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  {isEn ? 'Complete Registration' : '회원 등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🌟 개발자 회원 정보 인스펙터 & 보안/비밀번호 관리 모달 (6단계 개발자 권한 전용) */}
      {isDeveloper && inspectorMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col my-auto">
            {/* 모달 헤더 */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md overflow-hidden relative">
                  {inspectorMember.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={inspectorMember.avatar_url}
                      alt={inspectorMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{inspectorMember.name.substring(0, 2)}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">
                      {inspectorMember.name}
                    </h3>
                    {inspectorMember.name_en && (
                      <span className="text-xs text-gray-400 font-medium">({inspectorMember.name_en})</span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${tierLabels[inspectorMember.level || getMemberLevel(inspectorMember.role)].badgeClass}`}>
                      {tierLabels[inspectorMember.level || getMemberLevel(inspectorMember.role)].name}
                    </span>
                    {isDeveloper && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center gap-1">
                        <Wrench size={10} />
                        <span>{isEn ? 'Dev Inspector' : '개발자 인스펙터'}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                    <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{inspectorMember.email}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectorMember(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex border-b border-gray-100 gap-2 mt-4 shrink-0">
              <button
                type="button"
                onClick={() => setInspectorTab('profile')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  inspectorTab === 'profile'
                    ? 'border-indigo-600 text-indigo-700 font-black'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                <User size={13} />
                <span>{isEn ? 'Profile Info' : '기본 프로필'}</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('sns')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  inspectorTab === 'sns'
                    ? 'border-indigo-600 text-indigo-700 font-black'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                <Globe size={13} />
                <span>{isEn ? 'SNS / Integration' : '소셜 & 메신저 연동'}</span>
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="py-4 overflow-y-auto space-y-4 flex-1 pr-1">
              {/* TAB 1: 기본 프로필 */}
              {inspectorTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        {isEn ? 'Name' : '이름'}
                      </label>
                      <input
                        type="text"
                        value={inspectorForm.name || ''}
                        onChange={(e) => setInspectorForm({ ...inspectorForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        {isEn ? 'English Name' : '영문 이름 (Name EN)'}
                      </label>
                      <input
                        type="text"
                        value={inspectorForm.name_en || ''}
                        onChange={(e) => setInspectorForm({ ...inspectorForm, name_en: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        {isEn ? 'Email' : '이메일 주소'}
                      </label>
                      <input
                        type="email"
                        value={inspectorForm.email || ''}
                        onChange={(e) => setInspectorForm({ ...inspectorForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        {isEn ? 'Phone / WhatsApp' : '전화번호 / 연락처'}
                      </label>
                      <input
                        type="text"
                        value={inspectorForm.phone || ''}
                        onChange={(e) => setInspectorForm({ ...inspectorForm, phone: e.target.value })}
                        placeholder="+82 10-0000-0000"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        {isEn ? 'Affiliation / Church' : '소속 단체 / 교회'}
                      </label>
                      <input
                        type="text"
                        value={inspectorForm.affiliation || ''}
                        onChange={(e) => setInspectorForm({ ...inspectorForm, affiliation: e.target.value })}
                        placeholder="예: MCSK, MWC, 한국아나밥티스트센터"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        {isEn ? 'Country' : '소속 국가'}
                      </label>
                      <select
                        value={inspectorForm.countryCode || 'KR'}
                        onChange={(e) => setInspectorForm({ ...inspectorForm, countryCode: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="KR">🇰🇷 {isEn ? 'South Korea' : '대한민국'}</option>
                        <option value="US">🇺🇸 {isEn ? 'United States' : '미국'}</option>
                        <option value="ID">🇮🇩 {isEn ? 'Indonesia' : '인도네시아'}</option>
                        <option value="TH">🇹🇭 {isEn ? 'Thailand' : '태국'}</option>
                        <option value="VN">🇻🇳 {isEn ? 'Vietnam' : '베트남'}</option>
                        <option value="MM">🇲🇲 {isEn ? 'Myanmar' : '미얀마'}</option>
                        <option value="IN">🇮🇳 {isEn ? 'India' : '인도'}</option>
                        <option value="NP">🇳🇵 {isEn ? 'Nepal' : '네팔'}</option>
                        <option value="JP">🇯🇵 {isEn ? 'Japan' : '일본'}</option>
                        <option value="KH">🇰🇭 {isEn ? 'Cambodia' : '캄보디아'}</option>
                        <option value="LA">🇱🇦 {isEn ? 'Laos' : '라오스'}</option>
                        <option value="MN">🇲🇳 {isEn ? 'Mongolia' : '몽골'}</option>
                        <option value="TW">🇹🇼 {isEn ? 'Taiwan' : '대만'}</option>
                        <option value="HK">🇭🇰 {isEn ? 'Hong Kong' : '홍콩'}</option>
                        <option value="PH">🇵🇭 {isEn ? 'Philippines' : '필리핀'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      {isEn ? 'Bio / Description' : '자기소개 (Bio)'}
                    </label>
                    <textarea
                      rows={2}
                      value={inspectorForm.bio || ''}
                      onChange={(e) => setInspectorForm({ ...inspectorForm, bio: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1.5 font-mono text-gray-600">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isEn ? 'Google Account:' : '구글 계정:'}</span>
                      <span className="font-bold text-gray-800">{inspectorMember.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{isEn ? 'Joined Date:' : '가입 일시:'}</span>
                      <span>{inspectorMember.created_at || inspectorMember.joinedDate}</span>
                    </div>
                    {inspectorMember.updated_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">{isEn ? 'Last Updated:' : '최근 수정:'}</span>
                        <span>{inspectorMember.updated_at}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SNS 및 메신저 연동 진단 */}
              {inspectorTab === 'sns' && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-2xl text-xs text-blue-900 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{isEn ? 'SNS Integration Diagnosis' : 'SNS 및 메신저 연동 상태 정밀 진단'}</p>
                      <p className="text-[11px] text-blue-800 mt-0.5">
                        {isEn
                          ? 'Check and manage the member’s Google, WhatsApp, and Telegram connections.'
                          : '회원의 구글 소셜 로그인, 왓츠앱 연락처, 텔레그램 봇 연동 상태를 확인하고 직접 조정할 수 있습니다.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {/* 1. Google 계정 연동 */}
                    <div className="p-3.5 bg-white border border-gray-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-gray-900">Google OAuth 2.0</span>
                            {inspectorForm.google_linked ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {isEn ? 'Connected' : '연동 완료'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gray-100 text-gray-600 border border-gray-200">
                                {isEn ? 'Not Connected' : '미연동'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                            {inspectorForm.email}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setInspectorForm({
                            ...inspectorForm,
                            google_linked: inspectorForm.google_linked ? 0 : 1,
                          })
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          inspectorForm.google_linked
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {inspectorForm.google_linked
                          ? (isEn ? 'Disable Google' : '구글 연동 해제')
                          : (isEn ? 'Force Enable' : '강제 연동 활성화')}
                      </button>
                    </div>

                    {/* 2. WhatsApp 메신저 */}
                    <div className="p-3.5 bg-white border border-gray-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <MessageSquare size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-gray-900">WhatsApp Messenger</span>
                            {inspectorForm.phone && inspectorForm.phone.length > 7 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {isEn ? 'Valid Phone' : '번호 등록됨'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                                {isEn ? 'No Phone' : '미등록'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                            {inspectorForm.phone || (isEn ? 'No phone number' : '등록된 전화번호 없음')}
                          </p>
                        </div>
                      </div>

                      {inspectorForm.phone && (
                        <a
                          href={`https://wa.me/${inspectorForm.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <ExternalLink size={12} />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>

                    {/* 3. Telegram 계정 */}
                    <div className="p-3.5 bg-white border border-gray-200 rounded-2xl space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#2AABEE] text-white flex items-center justify-center shrink-0">
                            <Send size={15} className="-translate-x-0.5 translate-y-0.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-gray-900">Telegram Bot (@aamen13_bot)</span>
                              {inspectorForm.telegram_chat_id ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 border border-sky-200">
                                  {isEn ? 'Bot Verified' : '봇 연동 인증됨'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gray-100 text-gray-600 border border-gray-200">
                                  {isEn ? 'Pending /start' : '/start 인증 대기'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-gray-400 shrink-0">Chat ID:</span>
                        <input
                          type="text"
                          value={inspectorForm.telegram_chat_id || ''}
                          onChange={(e) => setInspectorForm({ ...inspectorForm, telegram_chat_id: e.target.value })}
                          placeholder="5618137472 (숫자 Chat ID)"
                          className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 모달 하단 액션 버튼 바 */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setInspectorMember(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {isEn ? 'Close' : '닫기'}
              </button>

              <button
                type="button"
                onClick={handleSaveInspectorDetails}
                disabled={isSavingInspector}
                className="px-5 py-2 bg-slate-950 hover:bg-slate-900 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} className="text-emerald-400" />
                <span>{isSavingInspector ? (isEn ? 'Saving...' : '저장 중...') : (isEn ? 'Save All Changes' : '수정사항 전체 저장')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
