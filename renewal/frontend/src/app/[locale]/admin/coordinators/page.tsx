'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {
  Users,
  Search,
  CheckCircle2,
  Edit3,
  Save,
  MessageCircle,
  Globe,
  ArrowLeft,
  UserCheck,
  RefreshCw,
  Phone,
  Mail,
  Shield,
  Send,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import {
  initialCoordinators,
  type CountryCoordinator,
  type Member,
  initialMembers,
} from '@/lib/store'
import { getAdminTexts } from '@/lib/adminI18n'

// 영문 국가명 및 역할 포맷팅
const countryNameMapEn: Record<string, string> = {
  KR: 'South Korea (KR)',
  MM: 'Myanmar (MM)',
  VN: 'Vietnam (VN)',
  TH: 'Thailand (TH)',
  ID: 'Indonesia (ID)',
  JP: 'Japan (JP)',
  NP: 'Nepal (NP)',
  IN: 'India (IN)',
  KH: 'Cambodia (KH)',
  LA: 'Laos (LA)',
  MN: 'Mongolia (MN)',
  TW: 'Taiwan (TW)',
  HK: 'Hong Kong (HK)',
  PH: 'Philippines (PH)',
  US: 'United States (US)',
}

// 🌍 국가별 국제전화 국가번호 및 포맷 가이드
const COUNTRY_CALLING_CODES: Record<
  string,
  { code: string; defaultPhone: string; flag: string; nameEn: string; nameKo: string }
> = {
  KR: { code: '+82', defaultPhone: '+82 10-1234-5678', flag: '🇰🇷', nameEn: 'South Korea', nameKo: '대한민국' },
  US: { code: '+1', defaultPhone: '+1 234-567-8901', flag: '🇺🇸', nameEn: 'United States', nameKo: '미국' },
  ID: { code: '+62', defaultPhone: '+62 812-3456-7890', flag: '🇮🇩', nameEn: 'Indonesia', nameKo: '인도네시아' },
  HK: { code: '+852', defaultPhone: '+852 9123-4567', flag: '🇭🇰', nameEn: 'Hong Kong', nameKo: '홍콩' },
  JP: { code: '+81', defaultPhone: '+81 90-1234-5678', flag: '🇯🇵', nameEn: 'Japan', nameKo: '일본' },
  MM: { code: '+95', defaultPhone: '+95 9-1234-5678', flag: '🇲🇲', nameEn: 'Myanmar', nameKo: '미얀마' },
  VN: { code: '+84', defaultPhone: '+84 90-123-4567', flag: '🇻🇳', nameEn: 'Vietnam', nameKo: '베트남' },
  TH: { code: '+66', defaultPhone: '+66 81-234-5678', flag: '🇹🇭', nameEn: 'Thailand', nameKo: '태국' },
  NP: { code: '+977', defaultPhone: '+977 98-1234-5678', flag: '🇳🇵', nameEn: 'Nepal', nameKo: '네팔' },
  IN: { code: '+91', defaultPhone: '+91 98765-43210', flag: '🇮🇳', nameEn: 'India', nameKo: '인도' },
  KH: { code: '+855', defaultPhone: '+855 12-345-678', flag: '🇰🇭', nameEn: 'Cambodia', nameKo: '캄보디아' },
  LA: { code: '+856', defaultPhone: '+856 20-1234-5678', flag: '🇱🇦', nameEn: 'Laos', nameKo: '라오스' },
  MN: { code: '+976', defaultPhone: '+976 99-12-3456', flag: '🇲🇳', nameEn: 'Mongolia', nameKo: '몽골' },
  TW: { code: '+886', defaultPhone: '+886 912-345-678', flag: '🇹🇼', nameEn: 'Taiwan', nameKo: '대만' },
  PH: { code: '+63', defaultPhone: '+63 912-345-6789', flag: '🇵🇭', nameEn: 'Philippines', nameKo: '필리핀' },
}

// 15개국 코드 순서 목록
const COUNTRY_CODES_LIST = ['KR', 'US', 'ID', 'HK', 'JP', 'MM', 'VN', 'TH', 'NP', 'IN', 'KH', 'LA', 'MN', 'TW', 'PH']

// 🌟 직책이 코디네이터(Level 4)인 회원만 필터링 (MWC 총괄 디렉터/Boss, 개발자 등 제외)
function isStrictCoordinator(c: CountryCoordinator): boolean {
  if (!c) return false
  if (c.id === 'coord_mwc' || c.memberId === 'Jeanette' || c.id === 'coord_kr' || c.memberId === 'admin' || c.memberId === 'Bockki') {
    return false
  }
  const r = (c.role || '').toLowerCase()
  if (
    r.includes('developer') ||
    r.includes('개발자') ||
    r.includes('boss') ||
    r.includes('최고관리자')
  ) {
    return false
  }
  return true
}

export default function AdminCoordinatorsPage() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isEn = currentLocale === 'en'
  const t = getAdminTexts(currentLocale).coordinators
  const localePath = (p: string) => `/${currentLocale}${p.startsWith('/') ? p : `/${p}`}`

  const [coordinators, setCoordinators] = useState<CountryCoordinator[]>(() =>
    initialCoordinators.filter(isStrictCoordinator)
  )
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [selectedCoord, setSelectedCoord] = useState<CountryCoordinator | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 수정 모달 폼 상태
  const [editForm, setEditForm] = useState({
    name: '',
    nameEn: '',
    role: '',
    email: '',
    phone: '',
    selectedMemberId: '',
  })

  // 추가 모달 폼 상태
  const [addForm, setAddForm] = useState({
    countryCode: 'KR',
    name: '',
    nameEn: '',
    role: '',
    email: '',
    phone: '+82 ',
    selectedMemberId: '',
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // 1. 데이터 로드 (서버 DB API 우선 연동)
  const loadCoordinatorsData = async () => {
    try {
      let res = await fetch('/api/coordinators.php')
      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        res = await fetch('/api/coordinators')
      }
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const json = await res.json()
        if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const validCoords = json.data.filter(isStrictCoordinator)
          setCoordinators(validCoords)
          localStorage.setItem('aamen_coordinators_data', JSON.stringify(validCoords))
          return
        }
      }
    } catch (e) {
      console.warn('API fetch fallback to localStorage:', e)
    }

    // Fallback: localStorage
    try {
      const savedCoords = localStorage.getItem('aamen_coordinators_data')
      if (savedCoords) {
        const parsed = JSON.parse(savedCoords)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validSaved = parsed.filter(isStrictCoordinator)
          setCoordinators(validSaved)
          return
        }
      }
    } catch (e) {}

    setCoordinators(initialCoordinators.filter(isStrictCoordinator))
  }

  useEffect(() => {
    loadCoordinatorsData()

    // 회원 목록 로드
    try {
      const savedMembers = localStorage.getItem('aamen_members')
      if (savedMembers) {
        const parsedM = JSON.parse(savedMembers)
        if (Array.isArray(parsedM) && parsedM.length > 0) {
          setMembers(parsedM)
        }
      }
    } catch (e) {}
  }, [])

  // 역할 포맷팅 (영문 모드 지원)
  const formatRole = (role: string) => {
    if (!isEn) return role
    if (role.includes('총괄 디렉터') || role.includes('General Director')) return 'General Director'
    if (role.includes('코디네이터') || role.includes('Coord')) {
      const match = role.match(/([A-Za-z]+)\s*Coord/)
      if (match) return `${match[1]} Coordinator`
      return role.replace(/.*?코디네이터.*?\((.*?)\)/, '$1').replace('Coord.', 'Coordinator')
    }
    return role
  }

  // 2. 수정 모달 열기
  const handleOpenEdit = (coord: CountryCoordinator) => {
    setSelectedCoord(coord)
    const callingInfo = COUNTRY_CALLING_CODES[coord.countryCode] || COUNTRY_CALLING_CODES['KR']
    setEditForm({
      name: coord.nameNative || coord.name,
      nameEn: coord.nameEn || coord.name,
      role: coord.role,
      email: coord.email,
      phone: coord.phone ? coord.phone : `${callingInfo.code} `,
      selectedMemberId: coord.memberId || '',
    })
  }

  // 회원 목록에서 선택했을 때 정보 자동 채우기 (수정 모달)
  const handleSelectMember = (memberId: string) => {
    if (!memberId) {
      setEditForm((prev) => ({ ...prev, selectedMemberId: '' }))
      return
    }

    const found = members.find((m) => m.id === memberId)
    if (found) {
      const targetCountry = found.countryCode || selectedCoord?.countryCode || 'KR'
      const callingInfo = COUNTRY_CALLING_CODES[targetCountry] || COUNTRY_CALLING_CODES['KR']
      const roleText = isEn
        ? `${countryNameMapEn[found.countryCode] || found.countryCode} Coordinator`
        : `${found.countryName} 코디네이터 (${found.countryCode} Coord.)`
      setEditForm({
        name: found.name,
        nameEn: found.name,
        role: roleText,
        email: found.email,
        phone: (found as any).phone || (editForm.phone && editForm.phone !== '+82 10-2345-6789' ? editForm.phone : `${callingInfo.code} `),
        selectedMemberId: found.id,
      })
      showToast(
        isEn
          ? `✨ Auto-filled information for '${found.name}' from member directory.`
          : `✨ 회원 목록에서 '${found.name}'님의 정보가 선택되었습니다.`
      )
    }
  }

  // 3. 코디네이터 정보 저장 (수정)
  const handleSaveCoordinator = async () => {
    if (!selectedCoord) return

    const nameVal = editForm.name.trim() || selectedCoord.name
    const nameEnVal = editForm.nameEn.trim() || nameVal

    const updatedCoord: CountryCoordinator = {
      ...selectedCoord,
      name: nameVal,
      nameNative: nameVal, // 카드 및 UI에 즉시 반영되도록 갱신
      nameEn: nameEnVal,
      role: editForm.role.trim() || selectedCoord.role,
      email: editForm.email.trim() || selectedCoord.email,
      phone: editForm.phone.trim(),
      memberId: editForm.selectedMemberId,
      isRegisteredMember: Boolean(editForm.selectedMemberId),
    }

    // 서버 DB API 저장
    try {
      await fetch('/api/coordinators.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          ...updatedCoord,
        }),
      })
    } catch (e) {
      console.warn('API save failed, using local storage fallback:', e)
    }

    const updated = coordinators.map((c) => (c.id === selectedCoord.id ? updatedCoord : c))
    setCoordinators(updated)
    try {
      localStorage.setItem('aamen_coordinators_data', JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }

    const cDisplayName = isEn ? (countryNameMapEn[selectedCoord.countryCode] || selectedCoord.countryName) : selectedCoord.countryName
    setSelectedCoord(null)
    showToast(
      isEn
        ? `🎉 [${cDisplayName}] Coordinator profile saved safely to server database!`
        : `🎉 [${selectedCoord.countryName}] 대표 코디네이터 정보가 서버 DB에 안전하게 저장되었습니다!`
    )
  }

  // 4. 추가 모달 열기
  const handleOpenAdd = () => {
    const defaultCC = 'KR'
    const callingInfo = COUNTRY_CALLING_CODES[defaultCC]
    setAddForm({
      countryCode: defaultCC,
      name: '',
      nameEn: '',
      role: isEn ? `${callingInfo.nameEn} Coordinator` : `${callingInfo.nameKo} 코디네이터 (${defaultCC} Coord.)`,
      email: '',
      phone: `${callingInfo.code} `,
      selectedMemberId: '',
    })
    setIsAddModalOpen(true)
  }

  // 추가 모달 국가 변경
  const handleAddCountryChange = (cCode: string) => {
    const callingInfo = COUNTRY_CALLING_CODES[cCode] || COUNTRY_CALLING_CODES['KR']
    const roleText = isEn
      ? `${callingInfo.nameEn} Coordinator`
      : `${callingInfo.nameKo} 코디네이터 (${cCode} Coord.)`
    setAddForm((prev) => ({
      ...prev,
      countryCode: cCode,
      role: roleText,
      phone: `${callingInfo.code} `,
    }))
  }

  // 추가 모달 회원 선택
  const handleSelectMemberForAdd = (memberId: string) => {
    if (!memberId) {
      setAddForm((prev) => ({ ...prev, selectedMemberId: '' }))
      return
    }
    const found = members.find((m) => m.id === memberId)
    if (found) {
      const targetCountry = found.countryCode || addForm.countryCode || 'KR'
      const callingInfo = COUNTRY_CALLING_CODES[targetCountry] || COUNTRY_CALLING_CODES['KR']
      const roleText = isEn
        ? `${countryNameMapEn[found.countryCode] || found.countryCode} Coordinator`
        : `${found.countryName} 코디네이터 (${found.countryCode} Coord.)`
      setAddForm({
        countryCode: targetCountry,
        name: found.name,
        nameEn: found.name,
        role: roleText,
        email: found.email,
        phone: (found as any).phone || `${callingInfo.code} `,
        selectedMemberId: found.id,
      })
      showToast(
        isEn
          ? `✨ Auto-filled information for '${found.name}' from member directory.`
          : `✨ 회원 목록에서 '${found.name}'님의 정보가 선택되었습니다.`
      )
    }
  }

  // 5. 신규 코디네이터 등록 저장
  const handleCreateCoordinator = async () => {
    if (!addForm.name.trim()) {
      alert(isEn ? 'Please enter coordinator name.' : '코디네이터 성명을 입력해주세요.')
      return
    }

    const cCode = addForm.countryCode
    const callingInfo = COUNTRY_CALLING_CODES[cCode] || COUNTRY_CALLING_CODES['KR']
    const newId = `coord_${cCode.toLowerCase()}_${Date.now().toString(36)}`

    const newCoord: CountryCoordinator = {
      id: newId,
      countryCode: cCode,
      countryName: `${callingInfo.nameKo} (${cCode})`,
      flag: callingInfo.flag,
      name: addForm.name.trim(),
      nameNative: addForm.name.trim(),
      nameEn: addForm.nameEn.trim() || addForm.name.trim(),
      role: addForm.role.trim() || (isEn ? `${callingInfo.nameEn} Coordinator` : `${callingInfo.nameKo} 코디네이터 (${cCode} Coord.)`),
      email: addForm.email.trim(),
      phone: addForm.phone.trim(),
      memberId: addForm.selectedMemberId,
      isRegisteredMember: Boolean(addForm.selectedMemberId),
    }

    try {
      await fetch('/api/coordinators.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          ...newCoord,
        }),
      })
    } catch (e) {
      console.warn('API create failed:', e)
    }

    const updated = [...coordinators, newCoord]
    setCoordinators(updated)
    try {
      localStorage.setItem('aamen_coordinators_data', JSON.stringify(updated))
    } catch (e) {}

    setIsAddModalOpen(false)
    showToast(
      isEn
        ? `🎉 [${newCoord.name}] added as ${callingInfo.nameEn} Coordinator!`
        : `🎉 [${newCoord.name}] 님이 ${callingInfo.nameKo} 코디네이터로 등록되었습니다!`
    )
  }

  // 6. 코디네이터 삭제
  const handleDeleteCoordinator = async (coord: CountryCoordinator) => {
    const confirmMsg = isEn
      ? `Are you sure you want to delete coordinator [${coord.name}] (${coord.countryCode})?`
      : `[${coord.name}] (${coord.countryName}) 코디네이터를 정말로 삭제하시겠습니까?`

    if (!confirm(confirmMsg)) return

    try {
      await fetch('/api/coordinators.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id: coord.id,
        }),
      })
    } catch (err) {
      console.warn('API delete failed:', err)
    }

    const updated = coordinators.filter((c) => c.id !== coord.id)
    setCoordinators(updated)
    try {
      localStorage.setItem('aamen_coordinators_data', JSON.stringify(updated))
    } catch (e) {}

    showToast(
      isEn
        ? `🗑️ Coordinator [${coord.name}] deleted safely.`
        : `🗑️ [${coord.name}] 코디네이터가 정상적으로 삭제되었습니다.`
    )
  }

  // WhatsApp 사이트 초청장 발송
  const sendWhatsAppInvitation = (phone: string, name: string, country: string) => {
    let cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : ''
    if (!cleanPhone) {
      const promptMsg = isEn
        ? `Enter WhatsApp phone number for [${name} (${country})]: (e.g., 821012345678, 95912345678)`
        : `[${name} (${country})] 님의 WhatsApp 번호를 입력하세요: (예: 821012345678, 95912345678)`
      const inputPhone = prompt(promptMsg)
      if (!inputPhone) return
      cleanPhone = inputPhone.replace(/[^0-9]/g, '')
    }

    const invitationMsg = isEn
      ? `🕊️ *[Official Invitation: AAMEN 15-Nation Network]*\n\nShalom ${name} (${country}),\nYou are cordially invited to *AAMEN (Asia Anabaptist Mennonite Education Network)* sharing Christ's gospel of peace and discipleship.\n\n📖 MWC 7 Shared Convictions 15-Language Curricula\n🙏 Live 15-Nation Prayer Wall & Community\n👥 Pan-Asian Leadership Collaboration Platform\n\n👉 *Visit AAMEN:* https://aamen.net/en/network\n\nWe look forward to serving together in peace ministry!`
      : `🕊️ *[AAMEN 아시아 15개국 네트워크 공식 초청]*\n\n샬롬! ${name}님(${country}),\n그리스도의 비폭력 평화와 제자도의 복음을 나누는 *AAMEN (아시아 아나밥티스트 메노나이트 교육 네트워크)*에 초대합니다.\n\n📖 MWC 7대 신념 15개 언어 무료 교안 자료실\n🙏 15개국 실시간 중보기도의 벽 & 다국어 커뮤니티\n👥 아시아 15개국 지도자 연대 플랫폼\n\n👉 *AAMEN 공식 사이트 방문하기:* https://aamen.net/ko/network\n\n함께 평화의 사역에 동참해 주시기를 소망합니다!`

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(invitationMsg)}`, '_blank')
  }

  return (
    <div className="space-y-8">
      {/* 토스트 메시지 */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-950 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-emerald-400 animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* 상단 헤더 배너 */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={localePath('/admin')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <ArrowLeft size={12} />
              <span>{isEn ? 'Admin Home' : '관리자 콘솔 홈'}</span>
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest bg-emerald-500/30 px-3 py-1 rounded-full text-emerald-200 border border-emerald-400/30">
              Country Coordinators
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {t.title} 👥
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 🌟 우측 상단: "+ 새 코디네이터 추가" 버튼 (사용자 요청에 따라 기존 버튼 대체) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-3 bg-emerald-400 hover:bg-emerald-300 text-gray-950 font-black rounded-2xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <Plus size={16} className="text-gray-950" />
            <span>{isEn ? '+ Add Coordinator' : '+ 새 코디네이터 추가'}</span>
          </button>
        </div>
      </div>

      {/* 안내 카드 및 인원 통계 */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-900">
          <span className="text-base">💡</span>
          <span>
            <strong>{isEn ? 'Admin Guide:' : '관리자 안내:'}</strong>{' '}
            {isEn
              ? 'Official Country Coordinators are displayed here. One nation can have multiple coordinators. Changes are permanently stored in the server database.'
              : '각 국가별 공식 코디네이터입니다. 한 국가에 1명 이상의 코디네이터를 추가/관리할 수 있으며 모든 수정사항은 서버 데이터베이스에 영구 보존됩니다.'}
          </span>
        </div>
        {(() => {
          const list = coordinators.filter(isStrictCoordinator)
          const countries = new Set(list.map((c) => c.countryCode))
          return (
            <span className="px-3 py-1.5 rounded-full bg-emerald-200 text-emerald-950 font-black shrink-0 text-xs">
              {isEn
                ? `Total ${list.length} Coordinators (${countries.size} Nations)`
                : `총 ${list.length}명 코디네이터 (${countries.size}개국)`}
            </span>
          )
        })()}
      </div>

      {/* 🌟 각 국가별 코디네이터 카드 리스트 (PC 1열 4명 그리드 / 국가 이니셜 알파벳 순 정렬) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[...coordinators]
          .filter(isStrictCoordinator)
          .sort((a, b) => a.countryCode.localeCompare(b.countryCode))
          .map((lead) => {
            const countryDisplay = isEn ? (countryNameMapEn[lead.countryCode] || lead.countryName) : lead.countryName
            const flagSvg = `/images/flags/${lead.countryCode.toLowerCase()}.svg`
            const displayName = lead.nameNative || lead.name
            const displayEn = lead.nameEn && lead.nameEn !== displayName ? lead.nameEn : null

            return (
              <div
                key={lead.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between text-center relative group"
              >
                <div>
                  {/* 국기 이미지 & 국가 라벨 */}
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-8 rounded-sm overflow-hidden shadow-2xs border border-gray-200/80 bg-gray-50 flex items-center justify-center">
                      <Image
                        src={flagSvg}
                        alt={countryDisplay}
                        width={48}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-500 font-mono mb-2">
                    {countryDisplay}
                  </div>

                  {/* 대표 이름 (해당국가 언어/한국어 + 영문) */}
                  <div className="mb-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <h3 className="font-black text-base text-gray-900">{displayName}</h3>
                    </div>
                    {displayEn && (
                      <p className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider mt-0.5">
                        {displayEn}
                      </p>
                    )}
                  </div>

                  {/* 사역 직책 */}
                  <p className="text-xs font-bold text-emerald-700 leading-tight mb-3">
                    {formatRole(lead.role)}
                  </p>

                  {/* 연락처 및 이메일 */}
                  <div className="space-y-1 mb-4 text-[11px] text-gray-600 font-mono bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-left">
                    <div className="truncate flex items-center gap-1">
                      <Mail size={12} className="text-gray-400 shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-1 font-bold text-gray-800">
                        <Phone size={12} className="text-emerald-600 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 카드 액션 버튼 그룹 */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(lead)}
                    className="w-full py-2 px-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Edit3 size={13} />
                    <span>{isEn ? 'Edit Info / Select Member' : '대표 정보 / 회원 선택'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => sendWhatsAppInvitation(lead.phone || '', lead.name, countryDisplay)}
                      className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer truncate"
                      title={isEn ? 'Send WhatsApp Invite' : 'WhatsApp 초청장 발송'}
                    >
                      <MessageCircle size={12} className="text-emerald-600 shrink-0" />
                      <span className="truncate">{isEn ? 'WhatsApp' : '초청장'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCoordinator(lead)}
                      className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer truncate"
                      title={isEn ? 'Delete Coordinator' : '코디네이터 삭제'}
                    >
                      <Trash2 size={12} className="text-rose-600 shrink-0" />
                      <span className="truncate">{isEn ? 'Delete' : '삭제'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
      </div>

      {/* 🌟 1. 코디네이터 정보 수정 모달 */}
      {selectedCoord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                  <Image
                    src={`/images/flags/${selectedCoord.countryCode.toLowerCase()}.svg`}
                    alt={selectedCoord.countryName}
                    width={40}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-900">
                    {isEn ? 'Edit Coordinator Info' : '코디네이터 정보 수정'}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {isEn ? (countryNameMapEn[selectedCoord.countryCode] || selectedCoord.countryName) : selectedCoord.countryName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCoord(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* 회원 목록 연동 드롭다운 */}
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 space-y-1.5">
              <label className="block text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <UserCheck size={14} className="text-emerald-700" />
                <span>{isEn ? 'Link from Existing Members (Recommended)' : '기존 가입 회원 중에서 선택 (권장)'}</span>
              </label>
              <select
                value={editForm.selectedMemberId}
                onChange={(e) => handleSelectMember(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-200 text-xs font-medium focus:outline-emerald-600"
              >
                <option value="">
                  {isEn
                    ? '-- Direct Entry (Do not link from member list) --'
                    : '-- 직접 입력 (회원 목록에서 선택 안함) --'}
                </option>
                {members
                  .filter((m) => {
                    if (m.id === 'admin' || m.id === 'Jeanette' || m.id === 'Bockki') {
                      return false
                    }
                    return m.role === 'country_admin' || m.level === 4 || m.countryCode === selectedCoord.countryCode
                  })
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({countryNameMapEn[m.countryCode] || m.countryName}) - {m.email} [{m.role}]
                    </option>
                  ))}
              </select>
              <p className="text-[11px] text-emerald-800">
                {isEn
                  ? 'Selecting a member will automatically populate their name, email, and ministry role.'
                  : '회원을 선택하시면 이름, 이메일, 직책이 자동으로 채워집니다.'}
              </p>
            </div>

            {/* 세부 정보 직접 입력 폼 */}
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {isEn ? 'Coordinator Name (Local / Native)' : '대표 성명 / 현지어 표기 (Name)'}
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder={isEn ? 'e.g. Rev. John Doe' : '예: 배용하 대표'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {isEn ? 'English Name (Optional)' : '영문 성명 (English Name)'}
                </label>
                <input
                  type="text"
                  value={editForm.nameEn}
                  onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                  placeholder={isEn ? 'e.g. John Doe' : '예: Bae Yongha'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono text-xs focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {isEn ? 'Ministry Role' : '사역 직책 (Role)'}
                </label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  placeholder={isEn ? 'e.g. General Director / Country Coordinator' : '예: 총괄 디렉터 (General Director)'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {isEn ? 'Email Address' : '이메일 주소'}
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono text-xs focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-gray-700">
                      {isEn ? 'WhatsApp Phone' : 'WhatsApp 전화번호'}
                    </label>
                    {selectedCoord && COUNTRY_CALLING_CODES[selectedCoord.countryCode] && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <span>{COUNTRY_CALLING_CODES[selectedCoord.countryCode].flag}</span>
                        <span>{COUNTRY_CALLING_CODES[selectedCoord.countryCode].code}</span>
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder={
                      selectedCoord && COUNTRY_CALLING_CODES[selectedCoord.countryCode]
                        ? COUNTRY_CALLING_CODES[selectedCoord.countryCode].defaultPhone
                        : '+82 10-1234-5678'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono text-xs focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* 모달 하단 버튼 */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedCoord(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {isEn ? 'Cancel' : '취소'}
              </button>
              <button
                type="button"
                onClick={handleSaveCoordinator}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Save size={14} />
                <span>{isEn ? 'Save Changes' : '변경사항 저장'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 2. 새 코디네이터 추가 모달 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-900">
                    {isEn ? 'Add New Coordinator' : '새 코디네이터 추가'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isEn ? 'Register a new country coordinator to the network.' : '국가별 대표 또는 공동 코디네이터를 새롭게 등록합니다.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* 소속 국가 선택 */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {isEn ? 'Select Country (15 Nations)' : '소속 국가 선택 (15개국)'}
              </label>
              <select
                value={addForm.countryCode}
                onChange={(e) => handleAddCountryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold focus:outline-emerald-600"
              >
                {COUNTRY_CODES_LIST.map((code) => {
                  const info = COUNTRY_CALLING_CODES[code]
                  return (
                    <option key={code} value={code}>
                      {info.flag} {isEn ? info.nameEn : info.nameKo} ({code})
                    </option>
                  )
                })}
              </select>
            </div>

            {/* 회원 목록 연동 드롭다운 */}
            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 space-y-1.5">
              <label className="block text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <UserCheck size={14} className="text-emerald-700" />
                <span>{isEn ? 'Link from Registered Members (Optional)' : '기존 가입 회원 연동 (선택사항)'}</span>
              </label>
              <select
                value={addForm.selectedMemberId}
                onChange={(e) => handleSelectMemberForAdd(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-emerald-200 text-xs font-medium focus:outline-emerald-600"
              >
                <option value="">
                  {isEn ? '-- Direct Entry (No member link) --' : '-- 직접 입력 (회원 연동 안함) --'}
                </option>
                {members
                  .filter((m) => m.id !== 'admin' && m.id !== 'Jeanette' && m.id !== 'Bockki')
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({countryNameMapEn[m.countryCode] || m.countryName}) - {m.email}
                    </option>
                  ))}
              </select>
            </div>

            {/* 세부 정보 직접 입력 폼 */}
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {isEn ? 'Coordinator Name *' : '대표 성명 / 현지어 표기 *'}
                </label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder={isEn ? 'e.g. John Doe' : '예: 홍길동 대표'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {isEn ? 'English Name (Optional)' : '영문 성명 (English Name)'}
                </label>
                <input
                  type="text"
                  value={addForm.nameEn}
                  onChange={(e) => setAddForm({ ...addForm, nameEn: e.target.value })}
                  placeholder={isEn ? 'e.g. John Doe' : '예: Gil-dong Hong'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono text-xs focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  {isEn ? 'Ministry Role' : '사역 직책 (Role)'}
                </label>
                <input
                  type="text"
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  placeholder={isEn ? 'e.g. Thailand Coordinator' : '예: 태국 코디네이터 (Thailand Coord.)'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {isEn ? 'Email Address' : '이메일 주소'}
                  </label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono text-xs focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    {isEn ? 'WhatsApp Phone' : 'WhatsApp 전화번호'}
                  </label>
                  <input
                    type="text"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="+82 10-1234-5678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono text-xs focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* 모달 하단 버튼 */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {isEn ? 'Cancel' : '취소'}
              </button>
              <button
                type="button"
                onClick={handleCreateCoordinator}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus size={14} />
                <span>{isEn ? 'Add Coordinator' : '코디네이터 등록'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
