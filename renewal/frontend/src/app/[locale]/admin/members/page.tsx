'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getAdminTexts } from '@/lib/adminI18n'
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
    name: '5단계: 총괄관리자',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    desc: '사이트 최고 관리자 (모든 시스템 총괄)',
    roleKey: 'super_admin',
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
    name: 'Tier 5: Super Admin',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
    desc: 'Site super administrator (full system management)',
    roleKey: 'super_admin',
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
  // 1. Google (모든 가입 회원은 구글 계정 인증 기본)
  const isGoogle = true

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

  // 4. Telegram: 텔레그램 Chat ID 또는 localStorage 연동 정보가 있는 경우
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
  const isTelegram = Boolean(tgId)

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
  const [members, setMembers] = useState<Member[]>(
    initialMembers.filter(
      (m) =>
        m.role !== ('developer' as any) &&
        !m.name.includes('개발자') &&
        m.email !== 'admin@aamen.net' &&
        !isSampleMember(m)
    )
  )
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('ALL')
  const [filterCountry, setFilterCountry] = useState<string>('ALL')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 5단계 권한 설정 상태 (localStorage 및 기본값 연동)
  const [tierSettings, setTierSettings] = useState<Record<MemberLevel, MemberTierInfo>>(defaultTierSettings)

  // 신규 회원 등록 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    countryCode: 'KR',
    countryName: '대한민국',
    flag: '🇰🇷',
    level: 2 as MemberLevel,
  })

  // 1. 초기 로드: MariaDB API 및 localStorage 동기화
  useEffect(() => {
    try {
      const savedPerms = localStorage.getItem('aamen_tier_permissions')
      if (savedPerms) {
        setTierSettings(JSON.parse(savedPerms))
      }
    } catch (e) {}

    async function loadMembers() {
      try {
        const res = await fetch('/api/members')
        if (!res.ok) return
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) return
        const data = await res.json()
        const list = Array.isArray(data) ? data : data.data || []
        if (list.length > 0) {
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
            (m: any) => m.role !== 'developer' && !m.name.includes('개발자') && m.email !== 'admin@aamen.net'
          )

          const formatted: Member[] = filteredList.map((m: any) => {
            const cInfo = countryMap[m.country_code] || { name: m.country_code, flag: '🌐' }
            const lvl = getMemberLevel(m.role as MemberRole)
            return {
              id: m.id,
              name: m.name,
              email: m.email,
              countryCode: m.country_code,
              countryName: cInfo.name,
              flag: cInfo.flag,
              role: m.role as MemberRole,
              level: lvl,
              status: (m.status || 'active') as any,
              joinedDate: (m.created_at || '').substring(0, 10),
              affiliation: m.affiliation || '',
              phone: m.phone || '',
              provider: m.provider || 'google',
              facebook_account: m.facebook_account || null,
              telegram_chat_id: m.telegram_chat_id || null,
            }
          })
          setMembers(formatted)
          return
        }
      } catch (e) {
        console.error('Failed to load server members, fallback to local', e)
      }

      try {
        const saved = localStorage.getItem('aamen_members')
        if (saved) {
          const parsed: Member[] = JSON.parse(saved)
          const existingIds = new Set(parsed.map((m) => m.id))
          const missing = initialMembers.filter((m) => !existingIds.has(m.id))
          const merged = [...missing, ...parsed].filter(
            (m) =>
              m.role !== ('developer' as any) &&
              !m.name.includes('개발자') &&
              m.email !== 'admin@aamen.net' &&
              !isSampleMember(m)
          )
          setMembers(merged)
          localStorage.setItem('aamen_members', JSON.stringify(merged))
        } else {
          const initialList = initialMembers.filter(
            (m) =>
              m.role !== ('developer' as any) &&
              !m.name.includes('개발자') &&
              m.email !== 'admin@aamen.net' &&
              !isSampleMember(m)
          )
          setMembers(initialList)
          localStorage.setItem('aamen_members', JSON.stringify(initialList))
        }
      } catch (e) {}
    }

    loadMembers()
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

  // 5단계 등급 변경 (서버 DB 실시간 동기화)
  const handleLevelChange = async (id: string, newLevel: MemberLevel) => {
    const targetTier = tierLabels[newLevel]
    const updated = members.map((m) =>
      m.id === id ? { ...m, level: newLevel, role: targetTier.roleKey } : m
    )
    persistMembers(
      updated,
      isEn
        ? `Member tier changed to [${targetTier.name}].`
        : `회원 등급이 [${targetTier.name}]으로 변경되었습니다.`
    )

    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_role', id, role: targetTier.roleKey }),
      })
    } catch (e) {
      console.error('Role update error:', e)
    }
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
        await fetch('/api/members', {
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
          fetch('/api/members', {
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
    setIsModalOpen(false)
    setNewMember({
      name: '',
      email: '',
      countryCode: 'KR',
      countryName: '대한민국',
      flag: '🇰🇷',
      level: 2,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                <option value="MM">🇲🇲 {isEn ? 'Myanmar' : '미얀마'}</option>
                <option value="VN">🇻🇳 {isEn ? 'Vietnam' : '베트남'}</option>
                <option value="TH">🇹🇭 {isEn ? 'Thailand' : '태국'}</option>
                <option value="ID">🇮🇩 {isEn ? 'Indonesia' : '인도네시아'}</option>
                <option value="JP">🇯🇵 {isEn ? 'Japan' : '일본'}</option>
                <option value="NP">🇳🇵 {isEn ? 'Nepal' : '네팔'}</option>
                <option value="IN">🇮🇳 {isEn ? 'India' : '인도'}</option>
                <option value="KH">🇰🇭 {isEn ? 'Cambodia' : '캄보디아'}</option>
                <option value="LA">🇱🇦 {isEn ? 'Laos' : '라오스'}</option>
                <option value="MN">🇲🇳 {isEn ? 'Mongolia' : '몽골'}</option>
                <option value="TW">🇹🇼 {isEn ? 'Taiwan' : '대만'}</option>
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
                    const currentLvl = member.level || getMemberLevel(member.role)
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
                          <div className="font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                            <span>{member.name}</span>
                            {member.affiliation && (
                              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                                {member.affiliation}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">{member.email}</div>
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
                                {/* 1. Google 계정 (기본 인증 연동) */}
                                <div
                                  className="w-6 h-6 rounded-lg bg-white border border-gray-200/80 flex items-center justify-center shadow-2xs cursor-help hover:scale-110 transition-transform"
                                  title={
                                    isEn
                                      ? `Google Authenticated (${member.email})`
                                      : `Google 계정 인증 연동됨 (${member.email})`
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

                                {/* 3. Facebook 계정 */}
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs transition-all cursor-help hover:scale-110 ${
                                    sns.facebook
                                      ? 'bg-[#1877F2] text-white shadow-2xs ring-1 ring-blue-500/30'
                                      : 'bg-gray-200/60 text-gray-400 opacity-30 grayscale'
                                  }`}
                                  title={
                                    sns.facebook
                                      ? isEn
                                        ? `Facebook Connected: ${sns.facebookDetail}`
                                        : `Facebook 연동 완료: ${sns.facebookDetail}`
                                      : isEn
                                      ? 'Facebook Not Connected'
                                      : 'Facebook 미연동'
                                  }
                                >
                                  f
                                </div>

                                {/* 4. Telegram 계정 */}
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-help hover:scale-110 ${
                                    sns.telegram
                                      ? 'bg-[#2AABEE] text-white shadow-2xs ring-1 ring-sky-500/30'
                                      : 'bg-gray-200/60 text-gray-400 opacity-30 grayscale'
                                  }`}
                                  title={
                                    sns.telegram
                                      ? isEn
                                        ? `Telegram Connected (ID: ${sns.telegramDetail})`
                                        : `Telegram 연동 완료 (ID: ${sns.telegramDetail})`
                                      : isEn
                                      ? 'Telegram Not Connected'
                                      : 'Telegram 미연동'
                                  }
                                >
                                  <Send size={11} className="-translate-x-0.5 translate-y-0.5" />
                                </div>
                              </div>
                            )
                          })()}
                        </td>

                        {/* 회원 등급 선택 드롭다운 (5단계) */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <select
                            value={currentLvl}
                            onChange={(e) => handleLevelChange(member.id, Number(e.target.value) as MemberLevel)}
                            className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
                              tierMeta.badgeClass
                            }`}
                          >
                            <option value={5}>{tierLabels[5].name}</option>
                            <option value={4}>{tierLabels[4].name}</option>
                            <option value={3}>{tierLabels[3].name}</option>
                            <option value={2}>{tierLabels[2].name}</option>
                            <option value={1}>{tierLabels[1].name}</option>
                          </select>
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

                        {/* 관리 (삭제) */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title={isEn ? 'Delete Member' : '회원 삭제'}
                          >
                            <Trash2 size={15} />
                          </button>
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
                    <option value="MM">🇲🇲 {isEn ? 'Myanmar' : '미얀마'}</option>
                    <option value="VN">🇻🇳 {isEn ? 'Vietnam' : '베트남'}</option>
                    <option value="TH">🇹🇭 {isEn ? 'Thailand' : '태국'}</option>
                    <option value="ID">🇮🇩 {isEn ? 'Indonesia' : '인도네시아'}</option>
                    <option value="JP">🇯🇵 {isEn ? 'Japan' : '일본'}</option>
                    <option value="NP">🇳🇵 {isEn ? 'Nepal' : '네팔'}</option>
                    <option value="IN">🇮🇳 {isEn ? 'India' : '인도'}</option>
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
    </div>
  )
}
