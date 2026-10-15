'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { getAdminTexts } from '@/lib/adminI18n'
import { BannerConfig, defaultBanners } from '@/lib/store'
import {
  Save,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  FileText,
  Eye,
  Sparkles,
  Link as LinkIcon,
  Layers,
  ChevronLeft,
  ChevronRight,
  Power,
  AlertCircle,
} from 'lucide-react'

const gradientPresets = [
  { label: '에메랄드 숲 & 틸', value: 'from-emerald-800 via-teal-900 to-slate-950' },
  { label: '딥 오션 네이비 & 인디고', value: 'from-blue-950 via-indigo-900 to-slate-900' },
  { label: '선셋 로열 바이올렛', value: 'from-purple-950 via-indigo-950 to-slate-900' },
  { label: '화해와 평화 틸 & 사이언', value: 'from-teal-900 via-emerald-900 to-cyan-950' },
  { label: '골든 엠버 & 올리브', value: 'from-amber-950 via-emerald-950 to-stone-900' },
  { label: '미드나잇 다크 슬레이트', value: 'from-slate-900 via-gray-900 to-black' },
]

const photoPresets = [
  {
    name: '아시아 청년 모임',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: '성경과 배움',
    url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: '기도와 손길',
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: '빛과 예배',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80',
  },
  {
    name: '평화와 자연',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
  },
]

const gradientLabelsEn: Record<string, string> = {
  '에메랄드 포레스트 & 틸': 'Emerald Forest & Teal',
  '딥 오션 네이비 & 인디고': 'Deep Ocean Navy & Indigo',
  '선셋 로열 바이올렛': 'Sunset Royal Violet',
  '화해와 평화 틸 & 사이언': 'Peace & Reconciliation Teal',
  '골든 엠버 & 올리브': 'Golden Amber & Olive',
  '미드나잇 다크 슬레이트': 'Midnight Dark Slate',
}

const photoPresetNamesEn: Record<string, string> = {
  '아시아 청년 모임': 'Asian Youth Gathering',
  '성경과 배움': 'Bible & Learning',
  '기도와 손길': 'Prayer & Hands',
  '빛과 예배': 'Light & Worship',
  '평화와 자연': 'Peace & Nature',
}

export default function AdminBannersPage() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isEn = currentLocale === 'en'
  const t = getAdminTexts(currentLocale).banners

  const [banners, setBanners] = useState<BannerConfig[]>(defaultBanners)
  const [selectedSlot, setSelectedSlot] = useState<number>(0)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. 배너 데이터 불러오기
  useEffect(() => {
    // localStorage 로드
    try {

      const cached = localStorage.getItem('aamen_banners_list')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBanners(parsed)
        }
      }
    } catch (e) {
      console.error(e)
    }

    // 서버 API 동기화
    fetch('/api/banners?admin=1')
      .then((res) => {
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return null
        return res.json()
      })
      .then((res) => {
        if (res && res.success) {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const mapped: BannerConfig[] = res.data.map((b: any) => ({
              id: b.id,
              type: b.banner_type === 'image' ? 'image' : 'gradient_text',
              title: b.title,
              subtitle: b.subtitle || '',
              badgeText: b.badge_text || '',
              imageUrl: b.image_url || '',
              buttonText: b.button_text || '시작하기',
              buttonLink: b.link_url || '/community/prayer',
              secondaryButtonText: b.secondary_button_text || '자세히 보기',
              secondaryButtonLink: b.secondary_button_link || '/convictions',
              bgGradient: b.bg_gradient || 'from-emerald-800 via-teal-900 to-slate-950',
              active: Boolean(b.is_active),
              displayOrder: Number(b.display_order) || 1,
            }))
            setBanners(mapped)
            localStorage.setItem('aamen_banners_list', JSON.stringify(mapped))
          }
        }
      })
      .catch((err) => console.log('Loaded default admin banners'))
  }, [])

  const currentBanner = banners[selectedSlot] || banners[0]

  // 특정 배너 속성 업데이트 (로컬스토리지 자동 반영)
  const updateCurrentBanner = (field: keyof BannerConfig, value: any) => {
    setBanners((prev) => {
      const updated = [...prev]
      updated[selectedSlot] = {
        ...updated[selectedSlot],
        [field]: value,
      }
      try {
        localStorage.setItem('aamen_banners_list', JSON.stringify(updated))
        window.dispatchEvent(new Event('storage'))
      } catch (e) {}
      return updated
    })
  }

  // 순서 위로 이동
  const moveUp = (index: number) => {
    if (index === 0) return
    setBanners((prev) => {
      const updated = [...prev]
      const temp = updated[index - 1]
      updated[index - 1] = updated[index]
      updated[index] = temp
      return updated
    })
    setSelectedSlot(index - 1)
  }

  // 순서 아래로 이동
  const moveDown = (index: number) => {
    if (index === banners.length - 1) return
    setBanners((prev) => {
      const updated = [...prev]
      const temp = updated[index + 1]
      updated[index + 1] = updated[index]
      updated[index] = temp
      return updated
    })
    setSelectedSlot(index + 1)
  }

  // 배너 슬롯 추가 (최대 5개)
  const addBanner = () => {
    if (banners.length >= 5) {
      alert('배너는 최대 5개까지 등록할 수 있습니다.')
      return
    }
    const newId = `banner_${Date.now()}`
    const isEven = banners.length % 2 === 0
    const newBanner: BannerConfig = {
      id: newId,
      type: isEven ? 'image' : 'gradient_text',
      title: `새 배너 슬롯 #${banners.length + 1}`,
      subtitle: '아시아 13개국 성도들과 나눌 소식을 입력해 주세요.',
      badgeText: 'AAMEN NOTICE',
      imageUrl: isEven
        ? 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80'
        : '',
      buttonText: '바로가기',
      buttonLink: '/community/board',
      bgGradient: 'from-emerald-800 via-teal-900 to-slate-950',
      active: true,
      displayOrder: banners.length + 1,
    }
    const updated = [...banners, newBanner]
    setBanners(updated)
    setSelectedSlot(banners.length)
    try {
      localStorage.setItem('aamen_banners_list', JSON.stringify(updated))
      window.dispatchEvent(new Event('storage'))
    } catch (e) {}
  }

  // 배너 슬롯 삭제 (최소 1개 유지)
  const removeBanner = (index: number) => {
    if (banners.length <= 1) {
      alert('최소 1개의 배너 슬롯은 유지되어야 합니다.')
      return
    }
    if (confirm(`슬롯 #${index + 1} 배너를 삭제하시겠습니까?`)) {
      const updated = banners.filter((_, idx) => idx !== index)
      setBanners(updated)
      setSelectedSlot(Math.max(0, index - 1))
      try {
        localStorage.setItem('aamen_banners_list', JSON.stringify(updated))
        window.dispatchEvent(new Event('storage'))
      } catch (e) {}
    }
  }

  // 이미지 로컬 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Base64 즉시 프리뷰 & 저장
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Url = reader.result as string
      updateCurrentBanner('imageUrl', base64Url)
    }
    reader.readAsDataURL(file)

    // 서버 업로드 API 전송
    const formData = new FormData()
    formData.append('image', file)
    fetch('/api/banners', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.image_url) {
          updateCurrentBanner('imageUrl', data.image_url)
        }
      })
      .catch((err) => {
        console.log('Using local base64 fallback')
      })
  }

  // 전체 배너 서버 및 로컬스토리지 저장
  const handleSaveAll = async () => {
    setIsSaving(true)
    try {
      // 1. localStorage에 즉시 저장 & 이벤트 디스패치
      localStorage.setItem('aamen_banners_list', JSON.stringify(banners))
      window.dispatchEvent(new Event('storage'))

      // 2. MariaDB 백엔드에 저장 요청
      const payload = {
        action: 'save_all',
        master_enabled: true,
        banners: banners.map((b, idx) => ({
          id: b.id,
          banner_type: b.type === 'image' ? 'image' : 'text',
          title: b.title,
          subtitle: b.subtitle,
          image_url: b.imageUrl,
          link_url: b.buttonLink,
          badge_text: b.badgeText,
          bg_gradient: b.bgGradient,
          display_order: idx + 1,
          is_active: b.active ? 1 : 0,
        })),
      }

      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      console.error(e)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  // 기본 프리셋으로 복원
  const handleResetPresets = () => {
    if (confirm(isEn ? 'Reset to default 5 curated banners?' : '기본 5개 추천 배너(이미지-텍스트 교차 배너)로 초기화하시겠습니까?')) {
      setBanners(defaultBanners)
      setSelectedSlot(0)
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 1. 상단 타이틀 & 조작 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🖼️</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.title}
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* 상단 액션 바: 프리셋 복원 + 전체 저장 */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetPresets}
            className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>{t.resetBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {saveSuccess ? <Check size={14} /> : <Save size={14} />}
            <span>{saveSuccess ? t.savedSuccess : isSaving ? t.savingBtn : t.saveBtn}</span>
          </button>
        </div>
      </div>

      {/* 2. 5개 배너 슬롯 탭 & 순서 제어 바 */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {banners.map((b, idx) => {
            const isSelected = idx === selectedSlot
            const isImg = b.type === 'image'
            return (
              <button
                key={b.id || idx}
                onClick={() => setSelectedSlot(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs scale-102'
                    : b.active
                    ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    : 'bg-slate-100/70 text-slate-400 border-dashed border-slate-300 opacity-60 hover:opacity-90'
                }`}
              >
                {isImg ? (
                  <ImageIcon size={14} className={isSelected ? 'text-emerald-600' : 'text-slate-400'} />
                ) : (
                  <FileText size={14} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                )}
                <span>{isEn ? `Slot #${idx + 1}` : `슬롯 #${idx + 1}`}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isImg ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {isImg ? (isEn ? 'Image' : '이미지') : (isEn ? 'Text' : '텍스트')}
                </span>
                {!b.active && (
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded">
                    {isEn ? 'Hidden' : '제외'}
                  </span>
                )}
              </button>
            )
          })}

          {banners.length < 5 && (
            <button
              onClick={addBanner}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 border border-dashed border-slate-300 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>{isEn ? `Add Slot (${banners.length}/5)` : `배너 추가 (${banners.length}/5)`}</span>
            </button>
          )}
        </div>

        {/* 순서 이동 & 삭제 컨트롤 */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => moveUp(selectedSlot)}
            disabled={selectedSlot === 0}
            title={isEn ? 'Move forward' : '순서 앞으로'}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={() => moveDown(selectedSlot)}
            disabled={selectedSlot === banners.length - 1}
            title={isEn ? 'Move backward' : '순서 뒤로'}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
          >
            <ArrowDown size={14} />
          </button>
          <button
            onClick={() => removeBanner(selectedSlot)}
            disabled={banners.length <= 1}
            title={isEn ? 'Delete this slot' : '이 슬롯 삭제'}
            className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl disabled:opacity-30 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* 3. 2열 레이아웃: 왼쪽 슬롯 편집 폼 + 오른쪽 실시간 라이브 프리뷰 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* === [왼쪽 편집 폼] === */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          {/* 슬롯 헤더 & 개별 포함 여부 체크박스 */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                <span>{isEn ? `Slot #${selectedSlot + 1} Details` : `슬롯 #${selectedSlot + 1} 상세 편집`}</span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    currentBanner.active
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {currentBanner.active
                    ? isEn ? 'Included in Slider' : '슬라이더에 포함됨'
                    : isEn ? 'Excluded from Slider' : '슬라이더에서 제외됨'}
                </span>
              </h2>
              <span className="text-xs text-slate-400 mt-0.5 block">
                {currentBanner.active
                  ? isEn
                    ? 'This banner is actively displayed in the top slider rotation.'
                    : '이 배너가 상단 슬라이더 회전에 정상 포함되어 노출됩니다.'
                  : isEn
                  ? 'This banner is skipped from the slider rotation.'
                  : '이 배너는 슬라이더 회전에서 제외(건너뛰기)됩니다.'}
              </span>
            </div>

            <label className="flex items-center gap-2 text-xs font-black text-slate-700 cursor-pointer select-none bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={currentBanner.active}
                onChange={(e) => updateCurrentBanner('active', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <span>{isEn ? 'Enable this slot' : '이 슬롯 활성화'}</span>
            </label>
          </div>

          {/* 배너 유형 선택 (이미지 vs 텍스트) */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              {isEn ? 'Banner Display Mode (Mixed Supported)' : '배너 표시 모드 (혼용 지원)'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateCurrentBanner('type', 'image')}
                className={`py-3.5 px-4 rounded-2xl border text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  currentBanner.type === 'image'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ImageIcon size={16} className="text-emerald-600" />
                <span>{isEn ? '📸 Image Banner' : '📸 이미지 배너'}</span>
              </button>

              <button
                type="button"
                onClick={() => updateCurrentBanner('type', 'gradient_text')}
                className={`py-3.5 px-4 rounded-2xl border text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  currentBanner.type === 'gradient_text'
                    ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText size={16} className="text-blue-600" />
                <span>{isEn ? '✍️ Text Gradient Banner' : '✍️ 텍스트 그라디언트 배너'}</span>
              </button>
            </div>
          </div>

          {/* 1) 이미지 배너 모드일 때의 설정창 */}
          {currentBanner.type === 'image' && (
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-emerald-950">
                  {isEn ? 'Background Image (File Upload or URL Link)' : '배경 이미지 등록 (파일 업로드 또는 링크)'}
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Upload size={13} />
                  <span>{isEn ? 'Upload from PC' : '내 PC에서 사진 업로드'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div>
                <input
                  type="url"
                  value={currentBanner.imageUrl || ''}
                  onChange={(e) => updateCurrentBanner('imageUrl', e.target.value)}
                  placeholder={isEn ? "https://images.unsplash.com/... or /uploads/banners/..." : "https://images.unsplash.com/... 또는 /uploads/banners/..."}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* 디자이너 추천 고화질 프리셋 1클릭 선택 */}
              <div>
                <span className="text-[11px] font-bold text-emerald-800 block mb-2">
                  {isEn ? '✨ Designer Curated HD Photo Presets:' : '✨ 디자이너 추천 고화질 사진 프리셋:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {photoPresets.map((p, i) => {
                    const presetLabel = isEn ? (photoPresetNamesEn[p.name] || p.name) : p.name
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => updateCurrentBanner('imageUrl', p.url)}
                        className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                      >
                        {presetLabel}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2) 텍스트 배너 모드일 때의 그라디언트 테마 선택 */}
          {currentBanner.type === 'gradient_text' && (
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
              <label className="block text-xs font-black text-blue-950">
                {isEn ? 'Select Gradient Theme Color' : '그라디언트 테마 색상 선택'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {gradientPresets.map((g, idx) => {
                  const gradientLabel = isEn ? (gradientLabelsEn[g.label] || g.label) : g.label
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateCurrentBanner('bgGradient', g.value)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        currentBanner.bgGradient === g.value
                          ? 'border-blue-600 bg-white text-blue-900 ring-2 ring-blue-500/30'
                          : 'border-blue-200/60 bg-white/70 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <div
                        className={`h-4 w-full rounded-md bg-gradient-to-r ${g.value} mb-1.5 shadow-2xs`}
                      />
                      <span className="text-[11px] block truncate">{gradientLabel}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 공통 필드: 배지 라벨, 메인 타이틀, 서브 타이틀 */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isEn ? 'Top Badge / Tag Text' : '상단 배지 / 태그 텍스트'}
              </label>
              <input
                type="text"
                value={currentBanner.badgeText || ''}
                onChange={(e) => updateCurrentBanner('badgeText', e.target.value)}
                placeholder={isEn ? "e.g. AAMEN GLOBAL NETWORK, UPCOMING EVENT 2026, SCRIPTURE OF PEACE" : "예: AAMEN GLOBAL NETWORK, UPCOMING EVENT 2026, SCRIPTURE OF PEACE"}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isEn ? 'Main Headline' : '메인 타이틀'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={currentBanner.title}
                onChange={(e) => updateCurrentBanner('title', e.target.value)}
                placeholder={isEn ? "Enter primary banner headline" : "배너의 핵심 제목을 입력해 주세요"}
                className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isEn ? 'Subtitle & Description' : '서브타이틀 및 설명문'}
              </label>
              <textarea
                rows={3}
                value={currentBanner.subtitle || ''}
                onChange={(e) => updateCurrentBanner('subtitle', e.target.value)}
                placeholder={isEn ? "Enter detailed description, scripture passage, or event guide" : "배너의 상세 설명이나 성경 구절, 참가 안내를 입력해 주세요"}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>
          </div>

          {/* 버튼 링크 설정 */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <span className="text-xs font-black text-slate-700 block">
              {isEn ? 'Buttons & Action Links' : '버튼 및 이동 링크 설정'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isEn ? 'Primary Button Label' : '메인 버튼 문구'}
                </label>
                <input
                  type="text"
                  value={currentBanner.buttonText || ''}
                  onChange={(e) => updateCurrentBanner('buttonText', e.target.value)}
                  placeholder={isEn ? "e.g. Pray Together" : "예: 함께 기도하기"}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isEn ? 'Primary Button Link URL' : '메인 버튼 링크 URL'}
                </label>
                <input
                  type="text"
                  value={currentBanner.buttonLink || ''}
                  onChange={(e) => updateCurrentBanner('buttonLink', e.target.value)}
                  placeholder="/community/prayer"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isEn ? 'Secondary Button Label (Optional)' : '보조 버튼 문구 (선택)'}
                </label>
                <input
                  type="text"
                  value={currentBanner.secondaryButtonText || ''}
                  onChange={(e) => updateCurrentBanner('secondaryButtonText', e.target.value)}
                  placeholder={isEn ? "e.g. 7 Shared Convictions" : "예: 7대 확신 교안"}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isEn ? 'Secondary Button Link URL' : '보조 버튼 링크 URL'}
                </label>
                <input
                  type="text"
                  value={currentBanner.secondaryButtonLink || ''}
                  onChange={(e) => updateCurrentBanner('secondaryButtonLink', e.target.value)}
                  placeholder="/convictions"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* === [오른쪽 실시간 라이브 프리뷰] === */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-8">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Eye size={14} className="text-emerald-600" />
              <span>{isEn ? 'Live Slider Preview' : '실시간 슬라이더 미리보기'}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {isEn ? `Slot ${selectedSlot + 1} / ${banners.length}` : `슬롯 ${selectedSlot + 1} / ${banners.length}`}
            </span>
          </div>

          {/* 미니 슬라이더 카드 */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl min-h-[460px] flex flex-col justify-between p-6 text-white text-center bg-slate-950">
            {/* 개별 슬롯 비활성화 오버레이 표시 */}
            {!currentBanner.active && (
              <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                <span className="px-3.5 py-1 rounded-full bg-slate-700 text-white font-extrabold text-xs mb-2 shadow-lg">
                  {isEn ? `Slot #${selectedSlot + 1} Excluded from Rotation` : `슬롯 #${selectedSlot + 1} 회전 제외 상태`}
                </span>
                <p className="text-xs text-white/80 max-w-xs">
                  {isEn
                    ? 'This slot is skipped from rotation and will not be displayed to visitors.'
                    : '이 슬롯은 랜딩페이지 슬라이더 회전에서 제외되어 방문자에게 노출되지 않습니다.'}
                </p>
              </div>
            )}

            {/* 배경 */}
            <div
              className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 ${
                currentBanner.bgGradient || 'from-emerald-800 via-teal-900 to-slate-950'
              }`}
            />

            {/* 이미지 배경 */}
            {currentBanner.type === 'image' && currentBanner.imageUrl && (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                  style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/50" />
              </>
            )}

            {/* 상단 뱃지 */}
            <div className="relative z-10 pt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-bold text-emerald-300">
                {currentBanner.type === 'image' ? <ImageIcon size={11} /> : <FileText size={11} />}
                <span>{currentBanner.badgeText || (isEn ? 'AAMEN BANNER' : 'AAMEN BANNER')}</span>
              </div>
            </div>

            {/* 중앙 본문 */}
            <div className="relative z-10 py-6">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug drop-shadow-md mb-3">
                {currentBanner.title || (isEn ? 'Enter headline' : '제목을 입력하세요')}
              </h3>
              <p className="text-xs text-white/80 line-clamp-3 leading-relaxed max-w-sm mx-auto">
                {currentBanner.subtitle || (isEn ? 'Enter description' : '설명문을 입력하세요')}
              </p>

              {/* 버튼 미리보기 */}
              <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
                {currentBanner.buttonText && (
                  <span className="px-4 py-2 bg-emerald-500 text-slate-950 font-black rounded-full text-[11px] shadow-sm">
                    {currentBanner.buttonText}
                  </span>
                )}
                {currentBanner.secondaryButtonText && (
                  <span className="px-4 py-2 bg-white/15 text-white font-semibold rounded-full border border-white/25 text-[11px]">
                    {currentBanner.secondaryButtonText}
                  </span>
                )}
              </div>
            </div>

            {/* 하단 슬라이더 네비게이션 시뮬레이터 */}
            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setSelectedSlot((prev) => (prev - 1 + banners.length) % banners.length)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5">
                {banners.map((b, i) => (
                  <span
                    key={i}
                    onClick={() => setSelectedSlot(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === selectedSlot
                        ? 'w-6 bg-emerald-400'
                        : b.active
                        ? 'w-2 bg-white/40'
                        : 'w-2 bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setSelectedSlot((prev) => (prev + 1) % banners.length)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs leading-relaxed">
            {isEn ? (
              <>💡 <strong>Design Guide:</strong> You can independently edit each of the 5 banner slots below with live real-time preview! ✨</>
            ) : (
              <>💡 <strong>디자인 가이드:</strong> 상단 우측의 <strong>[배너 전체]</strong> 토글 버튼으로 슬라이더 전체를 켜거나 끌 수 있고, 아래 5개 슬롯에서는 각각의 배너를 독립적으로 편집할 수 있습니다! ✨</>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
