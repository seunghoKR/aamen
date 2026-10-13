'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Building2,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Save,
  RotateCcw,
  Globe,
  Mail,
  Phone,
  CheckCircle2,
  X,
  Search,
} from 'lucide-react'
import { initialPartnerOrgs, type PartnerOrgItem } from '@/lib/store'
import { getAdminTexts } from '@/lib/adminI18n'

// 카테고리 영문 매핑
const categoryMapEn: Record<string, string> = {
  국제기구: 'International Org',
  선교구호: 'Mission & Relief',
  교단연합: 'Denominational Union',
  교육기관: 'Educational Institution',
  평화센터: 'Peace Center',
}

export default function AdminPartnersPage() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isEn = currentLocale === 'en'
  const t = getAdminTexts(currentLocale).partners
  const localePath = (p: string) => `/${currentLocale}${p.startsWith('/') ? p : `/${p}`}`

  const [partners, setPartners] = useState<PartnerOrgItem[]>(initialPartnerOrgs)
  const [searchTerm, setSearchTerm] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 모달 상태
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [selectedPartner, setSelectedPartner] = useState<PartnerOrgItem | null>(null)

  // 폼 입력 상태
  const [formState, setFormState] = useState<Omit<PartnerOrgItem, 'id'>>({
    nameKo: '',
    nameEn: '',
    category: '국제기구',
    websiteUrl: '',
    headquarters: '',
    established: '',
    contactEmail: '',
    phone: '',
    descKo: '',
    descEn: '',
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 로컬 스토리지 데이터 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aamen_partner_orgs')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPartners(parsed)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // 등록 모달 열기
  const handleOpenCreate = () => {
    setModalMode('create')
    setSelectedPartner(null)
    setFormState({
      nameKo: '',
      nameEn: '',
      category: '국제기구',
      websiteUrl: 'https://',
      headquarters: '',
      established: isEn ? `${new Date().getFullYear()}` : `${new Date().getFullYear()}년`,
      contactEmail: '',
      phone: '',
      descKo: '',
      descEn: '',
    })
  }

  // 수정 모달 열기
  const handleOpenEdit = (item: PartnerOrgItem) => {
    setModalMode('edit')
    setSelectedPartner(item)
    setFormState({
      nameKo: item.nameKo,
      nameEn: item.nameEn,
      category: item.category,
      websiteUrl: item.websiteUrl,
      headquarters: item.headquarters,
      established: item.established,
      contactEmail: item.contactEmail,
      phone: item.phone || '',
      descKo: item.descKo,
      descEn: item.descEn,
    })
  }

  // 폼 저장 핸들러 (등록/수정)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formState.nameKo.trim() && !formState.nameEn.trim()) {
      alert(isEn ? 'Please enter an organization name (English or Korean).' : '단체명(한국어 또는 영어)을 입력해주세요.')
      return
    }

    let updatedList: PartnerOrgItem[] = []

    if (modalMode === 'create') {
      const newPartner: PartnerOrgItem = {
        id: `pt_${Date.now()}`,
        nameKo: formState.nameKo.trim() || formState.nameEn.trim(),
        nameEn: formState.nameEn.trim() || formState.nameKo.trim(),
        category: formState.category,
        websiteUrl: formState.websiteUrl.trim() || 'https://aamen.net',
        headquarters: formState.headquarters.trim() || 'Asia',
        established: formState.established.trim() || '2026',
        contactEmail: formState.contactEmail.trim(),
        phone: formState.phone?.trim() || '',
        descKo: formState.descKo.trim(),
        descEn: formState.descEn.trim() || formState.descKo.trim(),
      }
      updatedList = [newPartner, ...partners]
      showToast(isEn ? '✨ New global partner organization registered!' : '✨ 새로운 글로벌 협력단체가 등록되었습니다!')
    } else if (modalMode === 'edit' && selectedPartner) {
      updatedList = partners.map((p) =>
        p.id === selectedPartner.id
          ? {
              ...p,
              nameKo: formState.nameKo.trim() || formState.nameEn.trim(),
              nameEn: formState.nameEn.trim() || formState.nameKo.trim(),
              category: formState.category,
              websiteUrl: formState.websiteUrl.trim(),
              headquarters: formState.headquarters.trim(),
              established: formState.established.trim(),
              contactEmail: formState.contactEmail.trim(),
              phone: formState.phone?.trim() || '',
              descKo: formState.descKo.trim(),
              descEn: formState.descEn.trim() || formState.descKo.trim(),
            }
          : p
      )
      const displayName = isEn ? (formState.nameEn || formState.nameKo) : (formState.nameKo || formState.nameEn)
      showToast(isEn ? `💾 [${displayName}] organization profile updated!` : `💾 [${displayName}] 단체 정보가 수정되었습니다!`)
    }

    setPartners(updatedList)
    localStorage.setItem('aamen_partner_orgs', JSON.stringify(updatedList))
    setModalMode(null)
  }

  // 삭제 핸들러
  const handleDelete = (id: string, name: string) => {
    const confirmMsg = isEn ? `Are you sure you want to delete [${name}]?` : `정말로 [${name}] 단체를 목록에서 삭제하시겠습니까?`
    if (!confirm(confirmMsg)) return
    const updated = partners.filter((p) => p.id !== id)
    setPartners(updated)
    localStorage.setItem('aamen_partner_orgs', JSON.stringify(updated))
    showToast(isEn ? `🗑️ [${name}] was deleted.` : `🗑️ [${name}] 단체가 삭제되었습니다.`)
  }

  // 기본값 복원 핸들러
  const handleResetDefaults = () => {
    const confirmMsg = isEn
      ? 'Reset to initial 6 global partner organizations?'
      : '초기 6개 글로벌 협력단체 기본 데이터로 복원하시겠습니까?'
    if (!confirm(confirmMsg)) return
    setPartners(initialPartnerOrgs)
    localStorage.setItem('aamen_partner_orgs', JSON.stringify(initialPartnerOrgs))
    showToast(isEn ? '🔄 Restored partner organizations to defaults!' : '🔄 협력단체 기본 목록으로 복원되었습니다!')
  }

  // 검색 필터링
  const filteredPartners = partners.filter((p) => {
    const q = searchTerm.toLowerCase()
    return (
      p.nameKo.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.headquarters.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* 토스트 메시지 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 상단 타이틀 바 */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
              Partners & Associations
            </span>
            <span className="text-xs text-gray-400 font-medium">{isEn ? 'Admin Only' : '관리자 전용'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="text-blue-600" size={28} />
            <span>{t.title}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isEn ? 'Reset to initial partners' : '초기 6개 공식 단체로 초기화'}
          >
            <RotateCcw size={14} />
            <span>{isEn ? 'Reset Defaults' : '기본값 복원'}</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>{t.btnAddPartner}</span>
          </button>
        </div>
      </div>

      {/* 안내 박스 및 검색창 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 p-5 rounded-2xl flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shrink-0 mt-0.5">
            🌐
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-blue-950">
              {isEn ? 'Multilingual Dynamic Routing System' : '다국어 자동 분기 시스템'}
            </h4>
            <p className="text-xs text-blue-800 mt-1 leading-relaxed">
              {isEn
                ? 'When visitors access the site in Korean (KO), Korean org name and description are shown. When visiting in any of the 12 other language editions (EN, JA, VI, ID, etc.), international English (EN) information is automatically displayed.'
                : '사용자가 사이트를 한국어(KO)로 접속하면 단체명/설명(한국어)이 노출되고, 영어를 포함한 12개 해외 국가(EN, JA, VI, ID 등)로 접속하면 국제 공용어인 영어(EN) 정보가 자동으로 표기됩니다.'}
            </p>
          </div>
        </div>

        {/* 검색 바 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-center">
          <label className="text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1">
            <Search size={13} />
            <span>{isEn ? 'Search Partners' : '협력단체 검색'}</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isEn ? 'Org name, category, headquarters...' : '단체명, 카테고리, 본부...'}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 협력단체 목록 (PC 2열 그리드) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredPartners.map((item) => {
          const displayCategory = isEn ? (categoryMapEn[item.category] || item.category) : item.category
          const primaryName = isEn ? (item.nameEn || item.nameKo) : item.nameKo
          const secondaryName = isEn ? item.nameKo : item.nameEn
          const establishedDisplay = isEn ? `Est: ${item.established.replace('년', '')}` : `설립: ${item.established}`

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200/90 hover:border-blue-300 hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                {/* 상단 뱃지 & 액션 버튼 */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-black text-[10px]">
                      {displayCategory}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">{establishedDisplay}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                      title={isEn ? 'Edit' : '수정하기'}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, primaryName)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title={isEn ? 'Delete' : '삭제하기'}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* 단체명 (한/영) */}
                <h3 className="text-lg font-black text-gray-900 leading-snug mb-0.5">
                  {primaryName}
                </h3>
                <p className="text-xs font-semibold text-gray-500 font-mono mb-3">
                  {secondaryName}
                </p>

                {/* 소개글 미리보기 */}
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 mb-3 space-y-1.5">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <strong className="text-gray-900">{isEn ? '🇺🇸 EN: ' : '🇰🇷 KO: '}</strong>
                    {isEn ? (item.descEn || '(English description not set)') : (item.descKo || '(한국어 소개 미입력)')}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    <strong className="text-gray-700 not-italic">{isEn ? '🇰🇷 KO: ' : '🇺🇸 EN: '}</strong>
                    {isEn ? (item.descKo || '(Korean description not set)') : (item.descEn || '(English description not set)')}
                  </p>
                </div>

                {/* 메타 정보 */}
                <div className="text-[11px] text-gray-500 space-y-1 mb-4">
                  <div>📍 <strong>{isEn ? 'Headquarters:' : '본부:'}</strong> {item.headquarters}</div>
                  {item.contactEmail && (
                    <div>✉️ <strong>{isEn ? 'Email:' : '이메일:'}</strong> {item.contactEmail}</div>
                  )}
                  {item.phone && (
                    <div>📞 <strong>{isEn ? 'Contact:' : '연락처:'}</strong> {item.phone}</div>
                  )}
                </div>
              </div>

              {/* 하단 웹사이트 링크 및 수정 바로가기 */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{isEn ? 'Official Website' : '공식 사이트'}</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 size={12} />
                  <span>{isEn ? 'Edit Info' : '정보 수정'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 등록 및 수정 모달 */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {modalMode === 'create' ? <Plus size={16} /> : <Edit3 size={16} />}
                </div>
                <h3 className="font-black text-lg text-gray-900">
                  {modalMode === 'create'
                    ? (isEn ? 'Register New Global Partner' : '새 글로벌 협력단체 등록')
                    : (isEn ? 'Edit Partner Organization' : '협력단체 정보 수정')}
                </h3>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 단체명(한국어) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? '🇰🇷 Org Name (Korean) *' : '🇰🇷 단체명 (한국어) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.nameKo}
                    onChange={(e) => setFormState({ ...formState, nameKo: e.target.value })}
                    placeholder={isEn ? 'e.g. 메노나이트 세계 협의회 (MWC)' : '예: 메노나이트 세계 협의회 (MWC)'}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                {/* 단체명(영어) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? '🇺🇸 Org Name (English - 12 Nations) *' : '🇺🇸 단체명 (영어 - 12개국용) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.nameEn}
                    onChange={(e) => setFormState({ ...formState, nameEn: e.target.value })}
                    placeholder={isEn ? 'e.g. Mennonite World Conference' : '예: Mennonite World Conference'}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 카테고리 */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Category' : '카테고리 구분'}
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  >
                    <option value="국제기구">{isEn ? 'International Org' : '국제기구'}</option>
                    <option value="선교구호">{isEn ? 'Mission & Relief' : '선교구호'}</option>
                    <option value="교단연합">{isEn ? 'Denominational Union' : '교단연합'}</option>
                    <option value="교육기관">{isEn ? 'Educational Institution' : '교육기관'}</option>
                    <option value="평화센터">{isEn ? 'Peace Center' : '평화센터'}</option>
                  </select>
                </div>

                {/* 설립연도 */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Established Year' : '설립연도'}
                  </label>
                  <input
                    type="text"
                    value={formState.established}
                    onChange={(e) => setFormState({ ...formState, established: e.target.value })}
                    placeholder={isEn ? 'e.g. 1925' : '예: 1925년 또는 1925'}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                {/* 본부 위치 */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? 'Headquarters (HQ)' : '본부 위치 (HQ)'}
                  </label>
                  <input
                    type="text"
                    value={formState.headquarters}
                    onChange={(e) => setFormState({ ...formState, headquarters: e.target.value })}
                    placeholder={isEn ? 'e.g. Seoul, Korea / Bangkok' : '예: Seoul, Korea / Bangkok'}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              {/* 공식 웹사이트 URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isEn ? '🌐 Official Website URL *' : '🌐 공식 웹사이트 URL *'}
                </label>
                <input
                  type="url"
                  required
                  value={formState.websiteUrl}
                  onChange={(e) => setFormState({ ...formState, websiteUrl: e.target.value })}
                  placeholder="https://example.org"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 이메일 */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? '✉️ Contact Email' : '✉️ 대표 이메일'}
                  </label>
                  <input
                    type="email"
                    value={formState.contactEmail}
                    onChange={(e) => setFormState({ ...formState, contactEmail: e.target.value })}
                    placeholder="info@organization.org"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 전화/WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isEn ? '📞 Phone Number / WhatsApp' : '📞 전화번호 / WhatsApp'}
                  </label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+82 2 1234 5678"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 소개글(한국어) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isEn ? '🇰🇷 Org Description (Shown in Korean mode)' : '🇰🇷 단체 소개 (한국어 모드 노출)'}
                </label>
                <textarea
                  rows={2}
                  value={formState.descKo}
                  onChange={(e) => setFormState({ ...formState, descKo: e.target.value })}
                  placeholder={isEn ? 'Enter Korean description shown to Korean visitors.' : '한국어 사용자에게 보여질 단체 소개글을 입력하세요.'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                />
              </div>

              {/* 소개글(영어) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isEn ? '🇺🇸 Org Description (Shown in 12 International modes)' : '🇺🇸 단체 소개 (영어 - 해외 12개국 모드 노출)'}
                </label>
                <textarea
                  rows={2}
                  value={formState.descEn}
                  onChange={(e) => setFormState({ ...formState, descEn: e.target.value })}
                  placeholder="Enter organization introduction for the 12 international language versions."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isEn ? 'Cancel' : '취소'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Save size={14} />
                  <span>
                    {modalMode === 'create'
                      ? (isEn ? 'Complete Registration' : '새 단체 등록 완료')
                      : (isEn ? 'Save Changes' : '수정 사항 저장')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
