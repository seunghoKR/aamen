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

// 🌟 직책이 코디네이터(Level 4)인 회원만 필터링 (MWC 총괄 디렉터/Boss, 개발자, 최고관리자, Helper 등 엄격 제외)
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
    r.includes('최고관리자') ||
    r.includes('helper') ||
    r.includes('사역자') ||
    r.includes('디렉터') ||
    r.includes('director')
  ) {
    return false
  }
  return r.includes('코디네이터') || r.includes('coord')
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
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 수정 모달 폼 상태
  const [editForm, setEditForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    selectedMemberId: '',
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 데이터 로드
  useEffect(() => {
    try {
      const savedCoords = localStorage.getItem('aamen_coordinators_data')
      if (savedCoords) {
        const parsed = JSON.parse(savedCoords)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validSaved = parsed.filter(isStrictCoordinator)
          const existingIds = new Set(validSaved.map((c: any) => c.id))
          const missing = initialCoordinators.filter(isStrictCoordinator).filter((c) => !existingIds.has(c.id))
          const merged = [...validSaved, ...missing]
          setCoordinators(merged)
        } else {
          setCoordinators(initialCoordinators.filter(isStrictCoordinator))
        }
      } else {
        setCoordinators(initialCoordinators.filter(isStrictCoordinator))
      }

      const savedMembers = localStorage.getItem('aamen_members')
      if (savedMembers) {
        const parsedM = JSON.parse(savedMembers)
        if (Array.isArray(parsedM) && parsedM.length > 0) {
          setMembers(parsedM)
        }
      }
    } catch (e) {
      console.error(e)
    }
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

  // 수정 모달 열기
  const handleOpenEdit = (coord: CountryCoordinator) => {
    setSelectedCoord(coord)
    setEditForm({
      name: coord.name,
      role: coord.role,
      email: coord.email,
      phone: coord.phone || '',
      selectedMemberId: coord.memberId || '',
    })
  }

  // 회원 목록에서 선택했을 때 정보 자동 채우기
  const handleSelectMember = (memberId: string) => {
    if (!memberId) {
      setEditForm((prev) => ({ ...prev, selectedMemberId: '' }))
      return
    }

    const found = members.find((m) => m.id === memberId)
    if (found) {
      const roleText = isEn
        ? `${countryNameMapEn[found.countryCode] || found.countryCode} Coordinator`
        : `${found.countryName} 코디네이터 (${found.countryCode} Coord.)`
      setEditForm({
        name: found.name,
        role: roleText,
        email: found.email,
        phone: editForm.phone || '+82 10-2345-6789',
        selectedMemberId: found.id,
      })
      showToast(
        isEn
          ? `✨ Auto-filled information for '${found.name}' from member directory.`
          : `✨ 회원 목록에서 '${found.name}'님의 정보가 선택되었습니다.`
      )
    }
  }

  // 코디네이터 정보 저장
  const handleSaveCoordinator = () => {
    if (!selectedCoord) return

    const updated = coordinators.map((c) => {
      if (c.id === selectedCoord.id) {
        return {
          ...c,
          name: editForm.name.trim() || c.name,
          role: editForm.role.trim() || c.role,
          email: editForm.email.trim() || c.email,
          phone: editForm.phone.trim(),
          memberId: editForm.selectedMemberId,
          isRegisteredMember: Boolean(editForm.selectedMemberId),
        }
      }
      return c
    })

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
        ? `🎉 [${cDisplayName}] Coordinator profile saved safely!`
        : `🎉 [${selectedCoord.countryName}] 대표 코디네이터 정보가 안전하게 저장되었습니다!`
    )
  }

  // 기본값으로 초기화
  const handleResetToDefault = () => {
    const confirmMsg = isEn
      ? 'Reset all country coordinator data to initial defaults?'
      : '각 국가별 코디네이터 데이터를 기본 설정값으로 복원하시겠습니까?'
    if (confirm(confirmMsg)) {
      const defaultList = initialCoordinators.filter(isStrictCoordinator)
      setCoordinators(defaultList)
      try {
        localStorage.setItem('aamen_coordinators_data', JSON.stringify(defaultList))
      } catch (e) {
        console.error(e)
      }
      showToast(isEn ? 'Restored country coordinators to default settings.' : '각 국가별 코디네이터가 기본값으로 초기화되었습니다.')
    }
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

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={localePath('/network')}
            target="_blank"
            className="px-4 py-2.5 bg-white text-emerald-900 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-all shadow-xs"
          >
            {isEn ? 'View Network Page' : '네트워크 페이지 확인'}
          </Link>

          <button
            onClick={handleResetToDefault}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all border border-white/20 cursor-pointer"
          >
            {isEn ? 'Reset to Default' : '기본값 초기화'}
          </button>
        </div>
      </div>

      {/* 안내 카드 */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-900">
          <span className="text-base">💡</span>
          <span>
            <strong>{isEn ? 'Admin Guide:' : '관리자 안내:'}</strong>{' '}
            {isEn
              ? 'Only official Country Coordinators (Level 4) are displayed here. Developers, Boss, and Workers are excluded.'
              : '각 국가별 코디네이터(Level 4) 직책을 가진 대표자만 표시됩니다. (시스템 개발자, 최고관리자, 사역자 등 다른 직책은 엄격히 제외됩니다.)'}
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 font-black shrink-0">
          {isEn
            ? `${coordinators.filter(isStrictCoordinator).length} Nations Active`
            : `총 ${coordinators.filter(isStrictCoordinator).length}개국 활성`}
        </span>
      </div>

      {/* 🌟 각 국가별 코디네이터 카드 리스트 (PC 1열 4명 그리드 / 국가 이니셜 알파벳 순) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[...coordinators]
          .filter(isStrictCoordinator)
          .sort((a, b) => a.countryCode.localeCompare(b.countryCode))
          .map((lead) => {
            const countryDisplay = isEn ? (countryNameMapEn[lead.countryCode] || lead.countryName) : lead.countryName
            const flagSvg = `/images/flags/${lead.countryCode.toLowerCase()}.svg`
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

                  {/* 대표 이름 (해당국가 언어 + 영문) & 회원 매핑 뱃지 */}
                  <div className="mb-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <h3 className="font-black text-base text-gray-900">{lead.nameNative || lead.name}</h3>
                      {lead.isRegisteredMember && (
                        <span
                          className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800"
                          title={isEn ? 'Linked with registered member' : '가입 회원과 연동됨'}
                        >
                          {isEn ? 'Linked Member' : '회원연동'}
                        </span>
                      )}
                    </div>
                    {lead.nameEn && (
                      <p className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider mt-0.5">
                        {lead.nameEn}
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

                  <button
                    type="button"
                    onClick={() => sendWhatsAppInvitation(lead.phone || '', lead.name, countryDisplay)}
                    className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle size={13} className="text-emerald-600" />
                    <span>{isEn ? 'Send WhatsApp Invite' : 'WhatsApp 초청장 발송'}</span>
                  </button>
                </div>
              </div>
            )
          })}
      </div>

      {/* ✏️ 대표 코디네이터 수정 및 회원 선택 모달 */}
      {selectedCoord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCoord.flag}</span>
                <div>
                  <h3 className="font-black text-lg text-gray-900">
                    {isEn
                      ? `${countryNameMapEn[selectedCoord.countryCode] || selectedCoord.countryName} Coordinator Settings`
                      : `${selectedCoord.countryName} 대표 코디네이터 설정`}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {isEn
                      ? 'Select from registered member list or enter coordinator details manually'
                      : '회원 목록에서 선택하거나 대표 정보를 직접 입력하세요'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCoord(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 🌟 1순위: 가입된 회원 목록에서 선택 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
              <label className="block text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <UserCheck size={14} className="text-emerald-600" />
                <span>
                  {isEn
                    ? 'Select from Member Directory (Auto-fill)'
                    : '회원 목록에서 선택하여 지정 (자동 연동)'}
                </span>
              </label>
              <select
                value={editForm.selectedMemberId}
                onChange={(e) => handleSelectMember(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-emerald-300 text-xs sm:text-sm font-bold text-gray-900 focus:outline-emerald-600"
              >
                <option value="">
                  {isEn
                    ? '-- Direct Entry (Do not link from member list) --'
                    : '-- 직접 입력 (회원 목록에서 선택 안함) --'}
                </option>
                {members
                  .filter((m) => {
                    // 개발자(admin), Boss(Jeanette), 사역자(Bockki) 제외하고 순수 코디네이터(country_admin / level 4)만 허용
                    if (m.id === 'admin' || m.id === 'Jeanette' || m.id === 'Bockki') {
                      return false
                    }
                    return m.role === 'country_admin' || m.level === 4
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
                  {isEn ? 'Coordinator Name' : '대표 성명 (Name)'}
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder={isEn ? 'e.g. Rev. John Doe' : '예: 이승호 대표'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold focus:outline-emerald-600"
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
                  <label className="block font-bold text-gray-700 mb-1">
                    {isEn ? 'WhatsApp Phone Number' : 'WhatsApp 전화번호'}
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+82 10-1234-5678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono text-xs focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* 모달 하단 버튼 */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedCoord(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
              >
                {isEn ? 'Cancel' : '취소'}
              </button>

              <button
                type="button"
                onClick={handleSaveCoordinator}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                <span>{isEn ? 'Save Settings' : '설정 저장하기'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
