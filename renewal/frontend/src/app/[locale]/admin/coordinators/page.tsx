'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

export default function AdminCoordinatorsPage() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const localePath = (p: string) => `/${currentLocale}${p.startsWith('/') ? p : `/${p}`}`

  const [coordinators, setCoordinators] = useState<CountryCoordinator[]>(initialCoordinators)
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
          setCoordinators(parsed)
        }
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
      setEditForm({
        name: found.name,
        role: `${found.countryName} 코디네이터 (${found.countryCode} Coord.)`,
        email: found.email,
        phone: editForm.phone || '+82 10-2345-6789',
        selectedMemberId: found.id,
      })
      showToast(`✨ 회원 목록에서 '${found.name}'님의 정보가 선택되었습니다.`)
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

    setSelectedCoord(null)
    showToast(`🎉 [${selectedCoord.countryName}] 대표 코디네이터 정보가 안전하게 저장되었습니다!`)
  }

  // 기본값으로 초기화
  const handleResetToDefault = () => {
    if (confirm('13개국 코디네이터 데이터를 기본 설정값으로 복원하시겠습니까?')) {
      setCoordinators(initialCoordinators)
      try {
        localStorage.setItem('aamen_coordinators_data', JSON.stringify(initialCoordinators))
      } catch (e) {
        console.error(e)
      }
      showToast('13개국 코디네이터가 기본값으로 초기화되었습니다.')
    }
  }

  // 💬 WhatsApp 사이트 초청장 발송
  const sendWhatsAppInvitation = (phone: string, name: string, country: string) => {
    let cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : ''
    if (!cleanPhone) {
      const inputPhone = prompt(`[${name} (${country})] 님의 WhatsApp 번호를 입력하세요: (예: 821012345678, 95912345678)`)
      if (!inputPhone) return
      cleanPhone = inputPhone.replace(/[^0-9]/g, '')
    }

    const invitationMsg = `🕊️ *[AAMEN 아시아 13개국 네트워크 공식 초청]*\n\n샬롬! ${name}님(${country}),\n그리스도의 비폭력 평화와 제자도의 복음을 나누는 *AAMEN (아시아 아나밥티스트 메노나이트 교육 네트워크)*에 초대합니다.\n\n📖 MWC 7대 신념 13개 언어 무료 교안 자료실\n🙏 13개국 실시간 중보기도의 벽 & 다국어 커뮤니티\n👥 아시아 13개국 지도자 연대 플랫폼\n\n👉 *AAMEN 공식 사이트 방문하기:* https://aamen.net/ko/network\n\n함께 평화의 사역에 동참해 주시기를 소망합니다!`

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
              <span>관리자 콘솔 홈</span>
            </Link>
            <span className="text-xs font-bold uppercase tracking-widest bg-emerald-500/30 px-3 py-1 rounded-full text-emerald-200 border border-emerald-400/30">
              13 Nations Coordinators
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            13개국 대표 코디네이터 관리 👥
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            아시아 13개국의 국가별 대표를 관리하고, 회원 목록에서 직접 선택하여 코디네이터로 임명할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={localePath('/network')}
            target="_blank"
            className="px-4 py-2.5 bg-white text-emerald-900 font-bold rounded-xl text-xs hover:bg-emerald-50 transition-all shadow-xs"
          >
            네트워크 페이지 확인
          </Link>

          <button
            onClick={handleResetToDefault}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all border border-white/20 cursor-pointer"
          >
            기본값 초기화
          </button>
        </div>
      </div>

      {/* 안내 카드 */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-900">
          <span className="text-base">💡</span>
          <span>
            <strong>관리자 안내:</strong> 각 국가 카드의 <strong>[대표 수정]</strong> 버튼을 누르면 가입된 <strong>회원 목록(Member List)</strong>에서 대표를 쉽게 선택하여 연동할 수 있습니다. 전화번호가 있으면 <strong>WhatsApp 초청장</strong>을 1초 만에 전송할 수 있습니다.
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 font-black shrink-0">
          총 13개국 활성
        </span>
      </div>

      {/* 🌟 13개국 대표 코디네이터 카드 리스트 (PC 1열 4명 그리드) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {coordinators.map((lead) => (
          <div
            key={lead.id}
            className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between text-center relative group"
          >
            <div>
              {/* 국기 및 국가 라벨 */}
              <div className="text-3xl mb-1.5">{lead.flag}</div>
              <div className="text-xs font-bold text-gray-500 font-mono mb-2">
                {lead.countryName}
              </div>

              {/* 대표 이름 & 회원 매핑 뱃지 */}
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <h3 className="font-black text-base text-gray-900">{lead.name}</h3>
                {lead.isRegisteredMember && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800" title="가입 회원과 연동됨">
                    회원연동
                  </span>
                )}
              </div>

              {/* 사역 직책 */}
              <p className="text-xs font-bold text-emerald-700 leading-tight mb-3">
                {lead.role}
              </p>

              {/* 연락처 및 이메일 */}
              <div className="space-y-1 mb-4 text-[11px] text-gray-600 font-mono bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-left">
                <div className="truncate flex items-center gap-1">
                  <Mail size={12} className="text-gray-400 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-gray-800">
                  <Phone size={12} className="text-emerald-600 shrink-0" />
                  <span>{lead.phone || '번호 미등록'}</span>
                </div>
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
                <span>대표 정보 / 회원 선택</span>
              </button>

              <button
                type="button"
                onClick={() => sendWhatsAppInvitation(lead.phone, lead.name, lead.countryName)}
                className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle size={13} className="text-emerald-600" />
                <span>WhatsApp 초청장 발송</span>
              </button>
            </div>
          </div>
        ))}
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
                    {selectedCoord.countryName} 대표 코디네이터 설정
                  </h3>
                  <p className="text-xs text-gray-500">
                    회원 목록에서 선택하거나 대표 정보를 직접 입력하세요
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
                <span>회원 목록에서 선택하여 지정 (자동 연동)</span>
              </label>
              <select
                value={editForm.selectedMemberId}
                onChange={(e) => handleSelectMember(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-emerald-300 text-xs sm:text-sm font-bold text-gray-900 focus:outline-emerald-600"
              >
                <option value="">-- 직접 입력 (회원 목록에서 선택 안함) --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.countryName || m.countryCode}) - {m.email} [{m.role}]
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-emerald-800">
                회원을 선택하시면 이름, 이메일, 직책이 자동으로 채워집니다.
              </p>
            </div>

            {/* 세부 정보 직접 입력 폼 */}
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">대표 성명 (Name)</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="예: 이승호 대표"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-bold focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">사역 직책 (Role)</label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  placeholder="예: 총괄 디렉터 (General Director)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">이메일 주소</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-mono text-xs focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">WhatsApp 전화번호</label>
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
                취소
              </button>

              <button
                type="button"
                onClick={handleSaveCoordinator}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                <span>설정 저장하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
