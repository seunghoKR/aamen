'use client'

import { useState, useEffect } from 'react'
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
  ShieldCheck,
  UserPlus,
  Check,
  Filter,
  Trash2,
  Edit3,
  Sliders,
  Save,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  FileText,
  MessageSquare,
  FileCheck,
} from 'lucide-react'

// 등급 메타데이터 (0단계 비회원 ~ 5단계 총괄관리자)
const tierLabels: Record<MemberLevel, { name: string; badgeClass: string; desc: string; roleKey: MemberRole }> = {
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

// 권한 라벨 정의
const permissionDefinitions = [
  { key: 'canWritePost', label: '새 글 작성', desc: '자유게시판 및 나눔방에 새 글 등록 가능' },
  { key: 'canWriteComment', label: '댓글 작성', desc: '게시글에 격려 댓글 작성 가능' },
  { key: 'canEditOwn', label: '본인 글/댓글 수정', desc: '자신이 작성한 게시글 및 댓글 수정 가능' },
  { key: 'canDeleteOwn', label: '본인 글/댓글 삭제', desc: '자신이 작성한 게시글 및 댓글 삭제 가능' },
  { key: 'canManageBoard', label: '게시물 관리/모든 글 삭제', desc: '타인 게시물 삭제 및 게시판 관리자 권한' },
  { key: 'canWriteNotice', label: '공지사항 등록 권한', desc: '상단 고정 및 공식 공지사항 작성' },
  { key: 'canDownloadFiles', label: '교안/자료실 다운로드', desc: '13개 언어 레슨플랜 및 자료 다운로드' },
  { key: 'canAccessAdmin', label: '관리자 대시보드 접근', desc: '관리자 화면(/admin) 접근 권한' },
] as const

export default function AdminMembersPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'permissions'>('members')
  const [members, setMembers] = useState<Member[]>(
    initialMembers.filter((m) => m.role !== ('developer' as any) && !m.name.includes('개발자') && m.email !== 'admin@aamen.net')
  )
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
    // 권한 매트릭스 로드
    try {
      const savedPerms = localStorage.getItem('aamen_tier_permissions')
      if (savedPerms) {
        setTierSettings(JSON.parse(savedPerms))
      }
    } catch (e) {}

    async function loadMembers() {
      try {
        const res = await fetch('/api/members')
        const data = await res.json()
        const list = Array.isArray(data) ? data : data.data || []
        if (list.length > 0) {
          const countryMap: Record<string, { name: string; flag: string }> = {
            KR: { name: '대한민국', flag: '🇰🇷' },
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
          setMembers(parsed.filter((m) => m.role !== ('developer' as any) && !m.name.includes('개발자') && m.email !== 'admin@aamen.net'))
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
    persistMembers(updated, `회원 등급이 [${targetTier.name}]으로 변경되었습니다.`)

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
    persistMembers(updated, `회원 계정 상태가 업데이트되었습니다.`)
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
    if (confirm(`정말 '${name}' 회원을 삭제하시겠습니까?`)) {
      const updated = members.filter((m) => m.id !== id)
      persistMembers(updated, `'${name}' 회원이 삭제되었습니다.`)
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
      setToastMessage('5단계 등급별 권한 설정이 성공적으로 저장되었습니다!')
      setTimeout(() => setToastMessage(null), 2500)
    } catch (e) {
      console.error(e)
    }
  }

  // 권한 기본값 복원
  const handleResetPermissions = () => {
    if (confirm('모든 등급의 권한 설정을 기본 추천값으로 초기화하시겠습니까?')) {
      setTierSettings(defaultTierSettings)
      localStorage.setItem('aamen_tier_permissions', JSON.stringify(defaultTierSettings))
      window.dispatchEvent(new Event('storage'))
      setToastMessage('권한 설정이 기본값으로 복원되었습니다.')
      setTimeout(() => setToastMessage(null), 2500)
    }
  }

  // 새 회원 등록
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMember.name || !newMember.email) return

    const countryMap: Record<string, { name: string; flag: string }> = {
      KR: { name: '대한민국', flag: '🇰🇷' },
      MM: { name: '미얀마', flag: '🇲🇲' },
      VN: { name: '베트남', flag: '🇻🇳' },
      TH: { name: '태국', flag: '🇹🇭' },
      ID: { name: '인도네시아', flag: '🇮🇩' },
      JP: { name: '일본', flag: '🇯🇵' },
      NP: { name: '네팔', flag: '🇳🇵' },
      IN: { name: '인도', flag: '🇮🇳' },
      KH: { name: '캄보디아', flag: '🇰🇭' },
    }

    const cInfo = countryMap[newMember.countryCode] || { name: '기타', flag: '🌐' }
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
    persistMembers(updated, `신규 회원 [${created.name}]이 등록되었습니다.`)
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

  // 검색 및 필터링 (개발자 제외 확실히 보장)
  const filtered = members.filter((m) => {
    if (m.role === ('developer' as any) || m.name.includes('개발자') || m.email === 'admin@aamen.net') {
      return false
    }
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.countryName.includes(searchTerm)
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
            <span>회원 등급 및 권한 관리</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            회원을 5단계 등급으로 구분하고, 새 글 작성·게시물 삭제 등의 권한을 단계별로 체계적으로 부여합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'members' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <UserPlus size={15} />
              <span>신규 회원 등록</span>
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
          <span>회원 명단 및 등급 조정 ({members.length}명)</span>
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
          <span>5단계 등급별 권한 매트릭스 설정</span>
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
                <span className="text-lg font-black text-gray-900">{count}명</span>
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
                placeholder="회원 이름, 이메일, 국가 검색..."
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
                <option value="ALL">전체 5단계 등급 보기</option>
                <option value="5">5단계: 총괄관리자</option>
                <option value="4">4단계: 리더/게시판관리자</option>
                <option value="3">3단계: 사역자/선교사</option>
                <option value="2">2단계: 정회원</option>
                <option value="1">1단계: 준회원</option>
              </select>

              {/* 국가 필터 */}
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ALL">13개국 전체</option>
                <option value="KR">🇰🇷 대한민국</option>
                <option value="MM">🇲🇲 미얀마</option>
                <option value="VN">🇻🇳 베트남</option>
                <option value="TH">🇹🇭 태국</option>
                <option value="ID">🇮🇩 인도네시아</option>
                <option value="JP">🇯🇵 일본</option>
                <option value="NP">🇳🇵 네팔</option>
                <option value="IN">🇮🇳 인도</option>
                <option value="KH">🇰🇭 캄보디아</option>
              </select>
            </div>
          </div>

          {/* 회원 테이블 */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">회원 정보</th>
                    <th className="py-3.5 px-4">국가</th>
                    <th className="py-3.5 px-4">회원 등급 조정 (5단계)</th>
                    <th className="py-3.5 px-4">계정 상태</th>
                    <th className="py-3.5 px-4">가입일</th>
                    <th className="py-3.5 px-6 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((member) => {
                    const currentLvl = member.level || getMemberLevel(member.role)
                    const tierMeta = tierLabels[currentLvl]
                    return (
                      <tr key={member.id} className="hover:bg-gray-50/70 transition-colors">
                        {/* 이름 & 이메일 */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{member.email}</div>
                        </td>

                        {/* 국가 */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-medium text-gray-700 text-xs">
                            <span className="text-base">{member.flag}</span>
                            <span>{member.countryName}</span>
                          </div>
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
                            <option value={5}>5단계: 총괄관리자</option>
                            <option value={4}>4단계: 리더/게시판관리자</option>
                            <option value={3}>3단계: 사역자/선교사</option>
                            <option value={2}>2단계: 정회원</option>
                            <option value={1}>1단계: 준회원</option>
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
                            <option value="active">활동 중</option>
                            <option value="pending">승인 대기</option>
                            <option value="suspended">이용 정지</option>
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
                            title="회원 삭제"
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
                  검색 조건과 일치하는 회원이 없습니다.
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
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start justify-between gap-4">
            <div>
              <p className="font-bold flex items-center gap-1.5 text-sm mb-1">
                <span>🛡️</span>
                <span>등급별 권한 부여 규칙 (차후 권한 확정 가능)</span>
              </p>
              <p className="leading-relaxed text-emerald-800">
                각 등급별로 부여할 권한 체크박스를 필요에 따라 자유롭게 변경하실 수 있습니다. 대표님께서 정하신 권한 규칙은 사이트 전체의 새 글 작성, 게시물 삭제, 댓글 작성 권한에 즉시 연동됩니다.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResetPermissions}
                className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-300 text-xs transition-colors cursor-pointer"
              >
                기본값 복원
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Save size={14} />
                <span>권한 설정 저장</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-600">
                    <th className="py-4 px-6 w-1/3">권한 항목</th>
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
                          {perm.key === 'canManageBoard' && <span className="text-rose-600 font-extrabold">[핵심]</span>}
                          {perm.key === 'canWritePost' && <span className="text-emerald-600 font-extrabold">[핵심]</span>}
                          <span>{perm.label}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{perm.desc}</div>
                      </td>
                      {([1, 2, 3, 4, 5] as MemberLevel[]).map((lvl) => {
                        const isGranted = Boolean(tierSettings[lvl]?.permissions?.[perm.key])
                        return (
                          <td key={lvl} className="py-3.5 px-3 text-center">
                            <label className="inline-flex items-center justify-center p-2 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                              <input
                                type="checkbox"
                                checked={isGranted}
                                onChange={() => handleTogglePermission(lvl, perm.key)}
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
                <span>신규 회원 직접 등록</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">이름 / 성도명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 김사역 성도"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">이메일 주소</label>
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
                  <label className="block text-xs font-bold text-gray-700 mb-1">소속 국가</label>
                  <select
                    value={newMember.countryCode}
                    onChange={(e) => setNewMember({ ...newMember, countryCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="KR">🇰🇷 대한민국</option>
                    <option value="MM">🇲🇲 미얀마</option>
                    <option value="VN">🇻🇳 베트남</option>
                    <option value="TH">🇹🇭 태국</option>
                    <option value="ID">🇮🇩 인도네시아</option>
                    <option value="JP">🇯🇵 일본</option>
                    <option value="NP">🇳🇵 네팔</option>
                    <option value="IN">🇮🇳 인도</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">회원 등급 (5단계)</label>
                  <select
                    value={newMember.level}
                    onChange={(e) => setNewMember({ ...newMember, level: Number(e.target.value) as MemberLevel })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value={1}>1단계: 준회원</option>
                    <option value={2}>2단계: 정회원</option>
                    <option value={3}>3단계: 사역자/선교사</option>
                    <option value={4}>4단계: 리더/게시판관리자</option>
                    <option value={5}>5단계: 총괄관리자</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  회원 등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
