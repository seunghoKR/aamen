'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  BookOpen,
  Globe,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  Edit3,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  Clock,
  Plus,
  Trash2,
  Code2,
  LayoutTemplate,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  convictionOrder,
  convictionPagesKo,
  convictionPagesEn,
  convictionPagesByLocale,
  type ConvictionPageData,
  type ConvictionTimelineStep,
} from '@/data/convictionsData'
import { locales, localeCountryNames, localeFlags, type Locale } from '@/config/locales'
import { getStoredUser, type AuthUser } from '@/lib/auth'
import { getAdminTexts } from '@/lib/adminI18n'

const STORAGE_KEY = 'aamen_convictions_i18n'

// 타임라인 단계를 HTML로 조합하는 헬퍼 함수
function generateHtmlFromForm(data: {
  themeNum: string
  title: string
  quote: string
  overallObjective: string
  sessionObjective: string
  materials: string[]
  readings: string[]
  timeline: ConvictionTimelineStep[]
}): string {
  const materialsHtml = (data.materials || [])
    .filter((m) => m.trim())
    .map((m) => `<li style="margin-bottom: 8px;">${m}</li>`)
    .join('')

  const readingsHtml = (data.readings || [])
    .filter((r) => r.trim())
    .map((r) => `<li style="margin-bottom: 8px;">${r}</li>`)
    .join('')

  const timelineHtml = (data.timeline || [])
    .map((step) => {
      const itemsHtml = (step.items || [])
        .map((it) => {
          if (it.toLowerCase().startsWith('discussion:') || it.toLowerCase().startsWith('토의:')) {
            return `<p style="margin: 10px 0 5px 0; font-weight: 700; color: #0d9488;">${it}</p>`
          } else if (it.startsWith('-') || it.startsWith('•')) {
            return `<li style="margin-bottom: 6px;">${it.replace(/^[-•]\s*/, '')}</li>`
          } else if (/^\d+[\.:]/.test(it)) {
            return `<li style="margin-bottom: 6px;">${it}</li>`
          } else {
            return `<p style="margin: 0 0 10px 0; color: #475569; line-height: 1.6;">${it}</p>`
          }
        })
        .join('')

      return `
        <div class="lp-timeline-item" style="position: relative; margin-bottom: 40px; padding-left: 10px;">
            <div class="lp-dot" style="position: absolute; left: -29px; top: 0; width: 16px; height: 16px; border-radius: 50%; background: #10b981; border: 4px solid #fff; box-shadow: 0 0 0 2px #10b981;">&nbsp;</div>
            <span class="lp-badge" style="display: inline-block; background: #10b981; color: #fff; padding: 4px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; margin-bottom: 12px;">${step.duration}</span>
            <div>
                <h3 class="lp-timeline-title" style="margin: 0 0 12px 0; font-size: 1.35rem; color: #1e293b; font-weight: 700;">${step.title}</h3>
                <div class="lp-box" style="background: #ffffff; padding: 22px; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04); word-break: keep-all;">
                    ${itemsHtml}
                </div>
            </div>
        </div>`
    })
    .join('')

  return `<div class="lp-container" style="max-width: 900px; margin: 0 auto; font-family: inherit;">
    <div class="lp-header" style="text-align: center; padding: 48px 24px; background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%); color: #fff; border-radius: 20px; margin-bottom: 36px; box-shadow: 0 12px 24px -6px rgba(16, 185, 129, 0.25); word-break: keep-all;">
        <h2 style="font-size: 2.2rem; margin: 0 0 16px 0; font-weight: 800; color: #fff; letter-spacing: -0.02em;">${data.title}</h2>
        <div class="lp-header-desc" style="font-size: 1.15rem; font-style: italic; opacity: 0.95; max-width: 820px; margin: 0 auto; border-left: 4px solid rgba(255,255,255,0.7); padding-left: 20px; text-align: left; line-height: 1.7;">
            &quot;${data.quote}&quot;
        </div>
    </div>

    <div class="lp-card-wrap" style="display: flex; gap: 24px; margin-bottom: 45px; flex-wrap: wrap;">
        <div class="lp-card" style="flex: 1; min-width: 320px; background: #ffffff; padding: 28px; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
            <div class="lp-card-title" style="color: #0d9488; font-size: 1.3rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 18px; font-weight: 700;">
                🎯 Learning Objectives
            </div>
            <div style="margin-bottom: 16px; word-break: keep-all;">
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">Overall Objective:</strong>
                <span style="color: #64748b; line-height: 1.6;">${data.overallObjective}</span>
            </div>
            <div style="word-break: keep-all;">
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">One-Hour Session Objective:</strong>
                <span style="color: #64748b; line-height: 1.6;">${data.sessionObjective}</span>
            </div>
        </div>

        <div class="lp-card" style="flex: 1; min-width: 320px; background: #ffffff; padding: 28px; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
            <div class="lp-card-title" style="color: #4f46e5; font-size: 1.3rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 18px; font-weight: 700;">
                📚 Materials & Required Readings
            </div>
            ${
              materialsHtml
                ? `<div style="margin-bottom: 14px;">
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">Materials:</strong>
                <ul style="margin: 0; padding-left: 20px; color: #64748b; line-height: 1.6;">
                    ${materialsHtml}
                </ul>
            </div>`
                : ''
            }
            ${
              readingsHtml
                ? `<div>
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">Required Readings:</strong>
                <ul style="margin: 0; padding-left: 20px; color: #64748b; line-height: 1.6;">
                    ${readingsHtml}
                </ul>
            </div>`
                : ''
            }
        </div>
    </div>

    <div class="lp-timeline-container" style="position: relative; padding: 10px 0 10px 25px; border-left: 3px solid #cbd5e1; margin-left: 15px;">
        ${timelineHtml}
    </div>
</div>`
}

export default function AdminConvictionsPage() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isEn = currentLocale === 'en'
  const t = getAdminTexts(currentLocale).convictions
  const localePath = (p: string) => `/${currentLocale}${p.startsWith('/') ? p : `/${p}`}`

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [selectedLocale, setSelectedLocale] = useState<string>('en')
  const [selectedSlug, setSelectedSlug] = useState<string>('god')

  // 에디터 모드: visual(노코드 비주얼 폼) | code(태그 회색 하이라이트 뷰) | preview(실시간 미리보기)
  const [editorMode, setEditorMode] = useState<'visual' | 'code' | 'preview'>('visual')

  const [allI18nData, setAllI18nData] = useState<Record<string, Record<string, ConvictionPageData>>>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isAiTranslating, setIsAiTranslating] = useState(false)

  // 구조화된 폼 데이터 (코드가 전혀 없는 순수 텍스트 상태)
  const [formData, setFormData] = useState<{
    themeNum: string
    title: string
    quote: string
    overallObjective: string
    sessionObjective: string
    materials: string[]
    readings: string[]
    timeline: ConvictionTimelineStep[]
    rawHtml: string
  }>({
    themeNum: 'Theme 1',
    title: '',
    quote: '',
    overallObjective: '',
    sessionObjective: '',
    materials: [],
    readings: [],
    timeline: [],
    rawHtml: '',
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // 초기 데이터 로드
  useEffect(() => {
    const user = getStoredUser()
    setCurrentUser(user)

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      // 13개국 기본 내장 데이터 전체를 스토어 기본값으로 초기화
      let initialStore: Record<string, Record<string, ConvictionPageData>> = {}
      for (const [loc, data] of Object.entries(convictionPagesByLocale || {})) {
        initialStore[loc] = { ...data }
      }
      if (!initialStore.ko) initialStore.ko = { ...convictionPagesKo }
      if (!initialStore.en) initialStore.en = { ...convictionPagesEn }

      if (saved) {
        const parsed = JSON.parse(saved)
        // 사용자가 저장했던 수정사항들을 국가별로 병합
        for (const [loc, data] of Object.entries(parsed)) {
          initialStore[loc] = {
            ...(initialStore[loc] || {}),
            ...(data as Record<string, ConvictionPageData>),
          }
        }
      }

      setAllI18nData(initialStore)

      if (user && user.role === 'country_admin' && user.country_code) {
        const userLang = user.country_code.toLowerCase()
        if (locales.includes(userLang as Locale)) {
          setSelectedLocale(userLang)
        }
      }
    } catch (e) {
      console.error('Failed to load i18n convictions data:', e)
    }
  }, [])

  // slug 또는 locale 변경 시 해당 국가 언어의 데이터로 폼 채우기
  useEffect(() => {
    const localeDataset = allI18nData[selectedLocale] || convictionPagesByLocale[selectedLocale] || {}
    let target = localeDataset[selectedSlug]
    const enRef = convictionPagesEn[selectedSlug]

    // 타겟 데이터가 없으면 내장 13개국 데이터 우선 탐색, 이후 영어/한국어 폴백
    if (!target) {
      target = convictionPagesByLocale[selectedLocale]?.[selectedSlug] || enRef || convictionPagesKo[selectedSlug]
    }

    if (target) {
      const meta = target.meta || {}
      const fallbackTimeline = enRef?.meta?.timeline || [
        { duration: '5 minutes', title: '1. Welcome & Introduction', items: ['Begin with opening prayer.'] },
        { duration: '20 minutes', title: '2. Scripture & Discussion', items: ['Read key passages together.'] },
        { duration: '25 minutes', title: '3. Group Application', items: ['Discuss practical contexts.'] },
        { duration: '10 minutes', title: '4. Conclusion & Prayer', items: ['Close with prayer.'] },
      ]

      setFormData({
        themeNum: meta.themeNum || enRef?.meta?.themeNum || 'Theme 1',
        title: meta.title || '',
        quote: meta.quote || '',
        overallObjective: meta.overallObjective || '',
        sessionObjective: meta.sessionObjective || '',
        materials: meta.materials && meta.materials.length > 0 ? meta.materials : enRef?.meta?.materials || [],
        readings: meta.readings && meta.readings.length > 0 ? meta.readings : enRef?.meta?.readings || [],
        timeline: meta.timeline && meta.timeline.length > 0 ? meta.timeline : fallbackTimeline,
        rawHtml: target.rawHtml || '',
      })
    }
  }, [selectedLocale, selectedSlug, allI18nData])

  const isSuperAdmin = !currentUser || currentUser.role === 'developer' || currentUser.role === 'super_admin' || currentUser.tierLevel >= 5
  const isCountryAdmin = currentUser?.role === 'country_admin'
  const canEditCurrentLocale =
    isSuperAdmin ||
    (isCountryAdmin && currentUser?.country_code?.toLowerCase() === selectedLocale.toLowerCase())

  const enReference = convictionPagesEn[selectedSlug]

  // 타임라인 항목 수정 헬퍼
  const handleTimelineChange = (index: number, field: keyof ConvictionTimelineStep, value: any) => {
    const updated = [...formData.timeline]
    updated[index] = { ...updated[index], [field]: value }
    const generatedHtml = generateHtmlFromForm({ ...formData, timeline: updated })
    setFormData({ ...formData, timeline: updated, rawHtml: generatedHtml })
  }

  const handleTimelineItemsChange = (index: number, text: string) => {
    const items = text.split('\n').filter((line) => line.trim())
    const updated = [...formData.timeline]
    updated[index] = { ...updated[index], items }
    const generatedHtml = generateHtmlFromForm({ ...formData, timeline: updated })
    setFormData({ ...formData, timeline: updated, rawHtml: generatedHtml })
  }

  const handleAddTimelineStep = () => {
    const newStep: ConvictionTimelineStep = {
      duration: '10 minutes',
      title: `${formData.timeline.length + 1}. 새로운 세션 단계`,
      items: ['세부 진행 활동이나 토의 질문을 입력하세요.'],
    }
    const updated = [...formData.timeline, newStep]
    const generatedHtml = generateHtmlFromForm({ ...formData, timeline: updated })
    setFormData({ ...formData, timeline: updated, rawHtml: generatedHtml })
  }

  const handleRemoveTimelineStep = (index: number) => {
    const updated = formData.timeline.filter((_, i) => i !== index)
    const generatedHtml = generateHtmlFromForm({ ...formData, timeline: updated })
    setFormData({ ...formData, timeline: updated, rawHtml: generatedHtml })
  }

  // 기본 정보 변경 시 자동으로 HTML 동기화
  const handleBasicFieldChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value }
    const generatedHtml = generateHtmlFromForm(updated)
    setFormData({ ...updated, rawHtml: generatedHtml })
  }

  // 저장 핸들러
  const handleSave = () => {
    if (!canEditCurrentLocale) {
      showToast('❌ 수정 권한이 없습니다. 담당 국가의 언어만 수정할 수 있습니다.')
      return
    }

    const compiledHtml = formData.rawHtml || generateHtmlFromForm(formData)

    const updatedData: ConvictionPageData = {
      slug: selectedSlug,
      meta: {
        themeNum: formData.themeNum,
        title: formData.title,
        quote: formData.quote,
        overallObjective: formData.overallObjective,
        sessionObjective: formData.sessionObjective,
        materials: formData.materials,
        readings: formData.readings,
        timeline: formData.timeline,
      },
      rawHtml: compiledHtml,
    }

    const newStore = {
      ...allI18nData,
      [selectedLocale]: {
        ...(allI18nData[selectedLocale] || {}),
        [selectedSlug]: updatedData,
      },
    }

    setAllI18nData(newStore)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore))
      showToast(`✨ [${selectedLocale.toUpperCase()}] ${formData.title} 교안이 안전하게 저장되었습니다!`)
    } catch (e) {
      console.error(e)
      showToast('⚠️ 브라우저 저장 용량 초과 또는 저장 오류가 발생했습니다.')
    }
  }

  // 초기 기본값으로 리셋
  const handleResetToDefault = () => {
    if (!confirm(`[${selectedLocale.toUpperCase()}] 국가 언어의 모든 수정사항을 공식 번역 원본으로 되돌리시겠습니까?`)) return

    const defaultSource = convictionPagesByLocale[selectedLocale]?.[selectedSlug] || convictionPagesEn[selectedSlug]
    if (defaultSource) {
      const meta = defaultSource.meta || {}
      setFormData({
        themeNum: meta.themeNum || 'Theme 1',
        title: meta.title || '',
        quote: meta.quote || '',
        overallObjective: meta.overallObjective || '',
        sessionObjective: meta.sessionObjective || '',
        materials: meta.materials || [],
        readings: meta.readings || [],
        timeline: meta.timeline || enReference?.meta?.timeline || [],
        rawHtml: defaultSource.rawHtml || '',
      })
    }
    showToast(`🔄 [${selectedLocale.toUpperCase()}] 공식 번역 원본으로 복원되었습니다. [저장하기]를 누르면 영구 적용됩니다.`)
  }

  // AI 자동 번역 초안 채우기
  const handleAiAutoTranslate = async () => {
    setIsAiTranslating(true)

    try {
      const defaultSource = convictionPagesByLocale[selectedLocale]?.[selectedSlug]
      if (defaultSource) {
        const meta = defaultSource.meta || {}
        setFormData({
          themeNum: meta.themeNum || 'Theme 1',
          title: meta.title || '',
          quote: meta.quote || '',
          overallObjective: meta.overallObjective || '',
          sessionObjective: meta.sessionObjective || '',
          materials: meta.materials || [],
          readings: meta.readings || [],
          timeline: meta.timeline || enReference?.meta?.timeline || [],
          rawHtml: defaultSource.rawHtml || '',
        })
        showToast(`✨ [${selectedLocale.toUpperCase()}] 국가 언어 공식 번역 초안을 불러왔습니다!`)
      } else {
        showToast('⚠️ 해당 언어의 번역 데이터를 찾을 수 없습니다.')
      }
    } catch (e) {
      console.error(e)
      showToast('⚠️ 번역 데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsAiTranslating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 상단 타이틀 & 권한 뱃지 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-emerald-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.studioBadge}</span>
            </span>
            <span className="text-xs text-gray-400 font-mono">{t.versionSub}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* 권한 상태 표시 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="px-4 py-2.5 bg-gray-50 rounded-2xl border border-gray-200/80 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="font-bold text-gray-700 block">
                {isSuperAdmin
                  ? t.roleSuper
                  : isCountryAdmin
                  ? t.roleCountry(currentUser?.country_code?.toUpperCase() || '')
                  : t.roleGuest}
              </span>
              <span className="text-[11px] text-gray-400">
                {canEditCurrentLocale ? t.editableStatus : t.readOnlyStatus}
              </span>
            </div>
          </div>

          <Link
            href={localePath(`/convictions/${selectedSlug}`)}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold transition-all border border-emerald-200"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isEn ? 'View Live Page' : '실제 페이지 보기'}</span>
          </Link>
        </div>
      </div>

      {/* 13개국 언어 선택 셀렉터 */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-gray-700 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? '13 Asian Nations Languages' : '13개국 언어 선택 (Language Selector)'}</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {isEn ? 'Current Selection: ' : '현재 선택: '}<strong className="text-emerald-700">{localeCountryNames[selectedLocale as Locale] || selectedLocale}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-2">
          {locales.map((loc) => {
            const isSelected = selectedLocale === loc
            return (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocale(loc)}
                className={`py-2 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-md shadow-emerald-700/20 scale-[1.03]'
                    : 'bg-gray-50/70 hover:bg-emerald-50/50 text-gray-700 border-gray-200'
                }`}
              >
                <span className="text-base mb-0.5">{localeFlags[loc]}</span>
                <span className="text-[11px] font-bold block leading-tight">{loc.toUpperCase()}</span>
                <span className={`text-[9px] block truncate max-w-full ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {localeCountryNames[loc].split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 7대 공유된 신념 주제 탭 */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? 'Select Theme (7 Shared Convictions)' : '7대 확신 주제 선택 (7 Themes)'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {convictionOrder.map((item) => {
            const isActive = selectedSlug === item.slug
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => setSelectedSlug(item.slug)}
                className={`py-2.5 px-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-extrabold shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-[10px] font-mono text-emerald-600 block">Theme {item.num}</span>
                <span className="text-xs font-bold truncate max-w-full">{isEn ? item.titleEn : item.titleKo}</span>
                <span className="text-[10px] text-gray-400 truncate max-w-full">{isEn ? item.titleKo : item.titleEn}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 에디터 모드 전환 (비주얼 노코드 vs 스마트 코드 뷰 vs 라이브 미리보기) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditorMode('visual')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              editorMode === 'visual'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>{isEn ? '🎨 Visual Editor (No-Code)' : '🎨 간편 비주얼 에디터 (추천: 노코드)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorMode('code')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              editorMode === 'code'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{isEn ? '💻 Smart Code View' : '💻 코드 분리 보기 (태그 회색 표시)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorMode('preview')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              editorMode === 'preview'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isEn ? '👁️ Live Preview' : '👁️ 실시간 미리보기'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAiAutoTranslate}
            disabled={isAiTranslating || !canEditCurrentLocale}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            title={isEn ? 'Generate draft translation based on English source' : '영문 원본을 기반으로 번역 초안을 채웁니다'}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>{isAiTranslating ? (isEn ? 'Generating Draft...' : '초안 생성 중...') : (isEn ? 'Fill AI Draft' : 'AI 번역 초안 채우기')}</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={!canEditCurrentLocale}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Reset' : '초기화'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!canEditCurrentLocale}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEn ? 'Save' : '저장하기 (Save)'}</span>
          </button>
        </div>
      </div>

      {/* MODE 1: 간편 비주얼 에디터 (No-Code Section Editor) */}
      {editorMode === 'visual' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 좌측: 영문 공식 원본 대조 (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-400">
                  {isEn ? 'Official English Reference' : '공용어 영문 원본 (English Source)'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {enReference?.meta?.themeNum}
              </span>
            </div>

            <div className="space-y-5 text-xs flex-1 overflow-y-auto pr-1">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Theme Title</span>
                <p className="text-slate-100 font-extrabold text-sm bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  {enReference?.meta?.title}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">MWC Shared Conviction Quote</span>
                <blockquote className="italic text-slate-200 bg-slate-800/80 p-3 rounded-xl border-l-4 border-emerald-500 border-slate-700 leading-relaxed">
                  &quot;{enReference?.meta?.quote}&quot;
                </blockquote>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-emerald-400 font-bold block">🎯 Learning Objectives</span>
                <div>
                  <strong className="text-slate-300 block mb-0.5">Overall Objective:</strong>
                  <p className="text-slate-300 leading-relaxed">{enReference?.meta?.overallObjective || 'N/A'}</p>
                </div>
                <div>
                  <strong className="text-slate-300 block mb-0.5">One-Hour Session Objective:</strong>
                  <p className="text-slate-300 leading-relaxed">{enReference?.meta?.sessionObjective || 'N/A'}</p>
                </div>
              </div>

              {/* 60분 타임라인 원본 참조 */}
              {enReference?.meta?.timeline && enReference.meta.timeline.length > 0 && (
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-indigo-400 font-bold block">⏱️ 60-Minute Lesson Timeline</span>
                  {enReference.meta.timeline.map((step, idx) => (
                    <div key={idx} className="pb-2 border-b border-slate-700/60 last:border-0">
                      <div className="flex items-center justify-between font-bold text-slate-200 mb-1">
                        <span>{step.title}</span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-700 rounded-full text-emerald-300 font-mono">
                          {step.duration}
                        </span>
                      </div>
                      <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px]">
                        {step.items.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 우측: 코드가 전혀 없는 비주얼 폼 에디터 (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-sm text-gray-800">
                  {isEn
                    ? `Edit Lesson Plan in ${selectedLocale.toUpperCase()}`
                    : `${localeCountryNames[selectedLocale as Locale] || selectedLocale} 자국어 교안 내용 수정`}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
                <span>{isEn ? 'Edit text easily without code' : '코드 없이 글자만 수정하세요'}</span>
              </span>
            </div>

            {/* 1. 기본 타이틀 */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                {isEn ? 'Theme Title *' : '주제 타이틀 (Theme Title) *'}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleBasicFieldChange('title', e.target.value)}
                disabled={!canEditCurrentLocale}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 font-bold text-gray-800 disabled:bg-gray-50"
                placeholder={isEn ? 'e.g. Theme 1: God' : '예: 주제 1: 하나님 (God)'}
              />
            </div>

            {/* 2. MWC 핵심 고백문 */}
            <div>
              <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                {isEn ? 'Shared Conviction Quote *' : '핵심 신념 고백문 (Shared Conviction Quote) *'}
              </label>
              <textarea
                rows={3}
                value={formData.quote}
                onChange={(e) => handleBasicFieldChange('quote', e.target.value)}
                disabled={!canEditCurrentLocale}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 leading-relaxed text-gray-800 disabled:bg-gray-50"
                placeholder={isEn ? 'Enter official MWC shared conviction statement in local language.' : 'MWC 공식 신념 고백문을 자국어로 입력하세요.'}
              />
            </div>

            {/* 3. 학습 목표 2종 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                <label className="block text-xs font-extrabold text-emerald-900 mb-1.5">
                  {isEn ? 'Overall Objective' : '전체 목표 (Overall Objective)'}
                </label>
                <textarea
                  rows={3}
                  value={formData.overallObjective}
                  onChange={(e) => handleBasicFieldChange('overallObjective', e.target.value)}
                  disabled={!canEditCurrentLocale}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 leading-relaxed text-gray-800 disabled:bg-gray-50"
                  placeholder={isEn ? 'Enter overall session objectives' : '전체 세션 목표 입력'}
                />
              </div>

              <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                <label className="block text-xs font-extrabold text-emerald-900 mb-1.5">
                  {isEn ? 'One-Hour Session Objective' : '1시간 세션 목표 (Session Objective)'}
                </label>
                <textarea
                  rows={3}
                  value={formData.sessionObjective}
                  onChange={(e) => handleBasicFieldChange('sessionObjective', e.target.value)}
                  disabled={!canEditCurrentLocale}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 leading-relaxed text-gray-800 disabled:bg-gray-50"
                  placeholder={isEn ? 'Enter participant goals for this session' : '참가자들이 달성할 목표 입력'}
                />
              </div>
            </div>

            {/* 4. 60분 세션 진행 타임라인 단계별 편집 (진정한 No-Code 에디터!) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-gray-800">
                    {isEn
                      ? `60-Minute Lesson Timeline (${formData.timeline.length} Steps)`
                      : `60분 세션 타임라인 단계별 내용 (${formData.timeline.length}단계)`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddTimelineStep}
                  disabled={!canEditCurrentLocale}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Add Step' : '단계 추가'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.timeline.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={step.duration}
                        onChange={(e) => handleTimelineChange(idx, 'duration', e.target.value)}
                        disabled={!canEditCurrentLocale}
                        className="w-28 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white text-emerald-800 shrink-0"
                        placeholder={isEn ? 'e.g. 5 minutes' : '예: 5분 / 5 minutes'}
                      />
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleTimelineChange(idx, 'title', e.target.value)}
                        disabled={!canEditCurrentLocale}
                        className="flex-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white text-gray-800"
                        placeholder={isEn ? 'Step Title (e.g. 1. Welcome & Opening Prayer)' : '단계 제목 (예: 1. 환영 및 시작 기도)'}
                      />
                      {formData.timeline.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimelineStep(idx)}
                          disabled={!canEditCurrentLocale}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title={isEn ? 'Delete this step' : '이 단계 삭제'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-500 font-medium mb-1">
                        {isEn
                          ? 'Activities, Scripture, and discussion questions (separated by newline)'
                          : '진행 활동, 말씀 봉독, 토의 질문 (줄바꿈으로 구분)'}
                      </label>
                      <textarea
                        rows={3}
                        value={step.items.join('\n')}
                        onChange={(e) => handleTimelineItemsChange(idx, e.target.value)}
                        disabled={!canEditCurrentLocale}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 leading-relaxed text-gray-700 font-sans"
                        placeholder={isEn ? 'Enter step activities or questions line by line.' : '이 단계에서 진행할 활동이나 질문들을 한 줄씩 적어주세요.'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>{isEn ? 'No-Code Auto-Assembly:' : '노코드 자동 생성:'}</strong>{' '}
                {isEn
                  ? 'Simply edit text here and click [Save] at the top, and it will be immediately compiled with glassmorphism cards and responsive timeline layout on the live site! ✨'
                  : '여기서 글자만 입력하고 상단의 [저장하기]를 누르면, 웹사이트의 교안 페이지에 예쁜 글래스모피즘 카드와 반응형 타임라인 디자인으로 즉시 조립되어 서비스됩니다! ✨'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: 스마트 코드 뷰 (태그는 회색, 내용은 강조!) */}
      {editorMode === 'code' && (
        <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-white">
                {isEn
                  ? 'Smart Tag Highlighting Code View'
                  : '태그 구분 스마트 코드 뷰 (HTML Tag & Content Highlighter)'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                <span>{isEn ? 'Gray: System HTML Tags' : '회색: 시스템 HTML 태그'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-300 font-bold">{isEn ? 'Green: Lesson Text (Editable)' : '초록색: 실제 교안 내용 (수정 대상)'}</span>
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            {isEn
              ? 'System HTML tags are dimmed in gray while actual editable lesson sentences are highlighted in vibrant green!'
              : '대표님의 요청대로 HTML 태그는 은은한 회색으로 처리하고, 실제 수정해야 할 자국어 문장은 형광 초록색으로 돋보이게 시각화했습니다!'}
          </p>

          {/* 읽기 전용 스마트 하이라이트 뷰어 */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap">
            {(formData.rawHtml || generateHtmlFromForm(formData))
              .split(/(<[^>]+>)/g)
              .map((part, i) => {
                if (part.startsWith('<') && part.endsWith('>')) {
                  // HTML 태그: 은은한 회색
                  return (
                    <span key={i} className="text-slate-500 font-normal">
                      {part}
                    </span>
                  )
                }
                if (!part.trim()) {
                  return part
                }
                // 실제 문장/내용: 또렷한 초록색 & 굵게
                return (
                  <span
                    key={i}
                    className="text-emerald-300 font-bold bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-800/40 inline-block my-0.5"
                  >
                    {part}
                  </span>
                )
              })}
          </div>

          {/* 고급 사용자를 위한 직접 편집 창 (필요 시 수정 가능) */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {isEn ? 'Direct Raw HTML Editor' : '직접 코드 편집 (Raw HTML Direct Editor)'}
            </label>
            <textarea
              rows={8}
              value={formData.rawHtml || generateHtmlFromForm(formData)}
              onChange={(e) => setFormData({ ...formData, rawHtml: e.target.value })}
              disabled={!canEditCurrentLocale}
              className="w-full px-4 py-3 font-mono text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 leading-relaxed disabled:opacity-50"
            />
          </div>
        </div>
      )}

      {/* MODE 3: 실시간 라이브 미리보기 (Live Preview) */}
      {editorMode === 'preview' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-emerald-100 shadow-md">
          <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                {isEn ? 'Live Rendered Preview' : '실제 렌더링 화면 (Live Preview)'}
              </span>
              <h2 className="text-lg font-bold text-gray-900 mt-0.5">
                {formData.title || (isEn ? 'No Title' : '제목 없음')}
              </h2>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
              {selectedLocale.toUpperCase()}
            </span>
          </div>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: formData.rawHtml || generateHtmlFromForm(formData),
            }}
          />
        </div>
      )}
    </div>
  )
}
