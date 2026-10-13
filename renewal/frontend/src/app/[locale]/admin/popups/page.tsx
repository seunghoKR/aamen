'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { getAdminTexts } from '@/lib/adminI18n'
import {
  Layers,
  Save,
  Check,
  RefreshCw,
  Eye,
  Upload,
} from 'lucide-react'

interface PopupConfig {
  enabled: boolean
  title: string
  content: string
  imageUrl: string
  buttonText: string
  buttonLink: string
  showDoNotShowToday: boolean
}

const defaultPopupConfigKo: PopupConfig = {
  enabled: true,
  title: '2026 MWC 아시아 아나밥티스트 연합 컨퍼런스 안내',
  content:
    '아시아 13개국 멘토와 청년들이 한자리에 모여 평화와 복음을 나누는 글로벌 연합 수련회가 열립니다. 각국 코디네이터를 통해 참가 신청을 받고 있으니 많은 기도와 참여를 바랍니다.',
  imageUrl:
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
  buttonText: '공지사항 자세히 보기',
  buttonLink: '/community/announcements',
  showDoNotShowToday: true,
}

const defaultPopupConfigEn: PopupConfig = {
  enabled: true,
  title: '2026 MWC Asia Anabaptist Joint Conference Notice',
  content:
    'A pan-Asian gathering where mentors and youth from 13 nations come together to share the gospel of peace. Registration is now open through each country coordinator.',
  imageUrl:
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
  buttonText: 'View Conference Details',
  buttonLink: '/community/announcements',
  showDoNotShowToday: true,
}

export default function AdminPopupsPage() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isEn = currentLocale === 'en'
  const t = getAdminTexts(currentLocale).popups
  const defaultPopupConfig = isEn ? defaultPopupConfigEn : defaultPopupConfigKo

  const [config, setConfig] = useState<PopupConfig>(defaultPopupConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. 설정 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aamen_popup_config')
      if (saved) {
        setConfig(JSON.parse(saved))
      }
    } catch (e) {
      console.error(e)
    }

    // 서버 API 동기화
    fetch('/api/banners?admin=1')
      .then((res) => res.json())
      .then((res) => {
        // 서버에서 저장된 팝업 설정이 있다면 반영
      })
      .catch((err) => {})
  }, [])

  const updateConfig = (field: keyof PopupConfig, value: any) => {
    setConfig((prev) => {
      const updated = { ...prev, [field]: value }
      try {
        localStorage.setItem('aamen_popup_config', JSON.stringify(updated))
        window.dispatchEvent(new Event('storage'))
      } catch (e) {}
      return updated
    })
  }

  // 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      updateConfig('imageUrl', reader.result as string)
    }
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('image', file)
    fetch('/api/banners', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.image_url) {
          updateConfig('imageUrl', data.image_url)
        }
      })
      .catch((err) => {})
  }

  // 저장 처리
  const handleSave = () => {
    setIsSaving(true)
    try {
      localStorage.setItem('aamen_popup_config', JSON.stringify(config))
      window.dispatchEvent(new Event('storage'))
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    const confirmMsg = isEn ? 'Reset popup settings to default?' : '팝업 설정을 기본 공지 모달 내용으로 복원하시겠습니까?'
    if (confirm(confirmMsg)) {
      setConfig(defaultPopupConfig)
      localStorage.setItem('aamen_popup_config', JSON.stringify(defaultPopupConfig))
      window.dispatchEvent(new Event('storage'))
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 1. 상단 타이틀 & 조작 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.title}
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>{isEn ? 'Reset to Default' : '기본 팝업 복원'}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {savedSuccess ? <Check size={14} /> : <Save size={14} />}
            <span>{savedSuccess ? t.savedToast : isSaving ? t.savingBtn : t.saveBtn}</span>
          </button>
        </div>
      </div>

      {/* 2. 팝업 활성화 마스터 스위치 */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-3 rounded-2xl ${config.enabled ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
            <Layers size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base text-slate-900">
                {isEn ? 'Display Main Landing Page Popup Modal' : '메인 랜딩페이지 팝업 모달 노출 여부'}
              </span>
              <span
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  config.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {config.enabled ? (isEn ? 'Popup ON' : '팝업 켜짐 (ON)') : (isEn ? 'Popup OFF' : '팝업 숨김 (OFF)')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {config.enabled
                ? (isEn
                    ? 'When visitors access the main landing page, the configured notice popup modal will be displayed.'
                    : '사용자가 메인 홈에 접속하면 설정된 공지 팝업 모달이 노출됩니다.')
                : (isEn
                    ? 'Popup is completely deactivated and will not be displayed to visitors.'
                    : '팝업이 완전히 비활성화되어 사용자에게 나타나지 않습니다.')}
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => updateConfig('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600" />
        </label>
      </div>

      {/* 3. 2열 레이아웃: 왼쪽 설정 폼 + 오른쪽 실시간 라이브 미리보기 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 왼쪽 설정 폼 */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <span>📝</span>
            <span>{isEn ? 'Popup Content & Visual Settings' : '팝업 내용 및 이미지 설정'}</span>
          </h2>

          {/* 팝업 이미지 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-slate-800">
                {isEn ? 'Popup Top Image (Optional)' : '팝업 상단 이미지 (선택)'}
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload size={13} />
                <span>{isEn ? 'Upload Photo from PC' : 'PC 사진 업로드'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <input
              type="url"
              value={config.imageUrl}
              onChange={(e) => updateConfig('imageUrl', e.target.value)}
              placeholder={isEn ? 'https://... or /uploads/... (Leave blank for text-only popup)' : 'https://... 또는 /uploads/... (비워두면 텍스트 전용 팝업)'}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          {/* 팝업 제목 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isEn ? 'Popup Title' : '팝업 제목'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => updateConfig('title', e.target.value)}
              placeholder={isEn ? 'Key notice title for the popup' : '팝업의 핵심 안내 제목'}
              className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 팝업 상세 내용 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isEn ? 'Detailed Announcement Text' : '팝업 상세 안내문'} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={config.content}
              onChange={(e) => updateConfig('content', e.target.value)}
              placeholder={isEn ? 'Enter detailed announcement description, schedule, or guidelines' : '팝업에 표시할 상세 안내 내용이나 일정을 입력해 주세요'}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          {/* 버튼 링크 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {isEn ? 'Action Button Label' : '이동 버튼 문구'}
              </label>
              <input
                type="text"
                value={config.buttonText}
                onChange={(e) => updateConfig('buttonText', e.target.value)}
                placeholder={isEn ? 'e.g. View Notice Details' : '예: 공지사항 자세히 보기'}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {isEn ? 'Button Link URL' : '버튼 이동 링크 URL'}
              </label>
              <input
                type="text"
                value={config.buttonLink}
                onChange={(e) => updateConfig('buttonLink', e.target.value)}
                placeholder="/community/announcements"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* 옵션: 오늘 하루 보지 않기 */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-bold text-slate-800">
              {isEn ? 'Show "Do not show again today" checkbox' : '\'오늘 하루 동안 다시 열지 않기\' 체크박스 노출'}
            </span>
            <input
              type="checkbox"
              checked={config.showDoNotShowToday}
              onChange={(e) => updateConfig('showDoNotShowToday', e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 오른쪽 실시간 라이브 미리보기 */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-8">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Eye size={14} className="text-emerald-600" />
              <span>{isEn ? 'Live Popup Modal Preview' : '실시간 팝업 모달 미리보기'}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Live Preview
            </span>
          </div>

          {/* 시뮬레이션 브라우저 창 속 팝업 */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900/60 p-4 sm:p-6 min-h-[480px] flex items-center justify-center">
            {/* 팝업 모달 카드 */}
            <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in duration-300">
              {config.imageUrl && (
                <div
                  className="h-44 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${config.imageUrl})` }}
                />
              )}
              <div className="p-5 text-left">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold mb-2 border border-emerald-200">
                  <span>NOTICE</span>
                </div>
                <h3 className="text-base font-black text-slate-900 leading-snug mb-2">
                  {config.title || (isEn ? 'Enter notice title' : '제목을 입력하세요')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4 max-h-32 overflow-y-auto">
                  {config.content || (isEn ? 'Enter announcement details' : '공지 내용을 입력하세요')}
                </p>

                {config.buttonText && (
                  <div className="block w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs text-center shadow-xs">
                    {config.buttonText}
                  </div>
                )}
              </div>

              {/* 팝업 하단 닫기 바 */}
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                {config.showDoNotShowToday ? (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 text-emerald-600 rounded" readOnly />
                    <span>{isEn ? 'Do not show again today' : '오늘 하루 보지 않기'}</span>
                  </label>
                ) : <span />}
                <button className="text-slate-700 font-bold hover:text-slate-950 cursor-pointer">
                  {isEn ? 'Close ✕' : '닫기 ✕'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
