'use client'

import { useState, useEffect } from 'react'
import { ConvictionPageData, convictionPagesEn } from '@/data/convictionsData'
import { Globe, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react'
import { getConvictionDetailI18nTexts } from '@/lib/convictionDetailI18n'

interface ConvictionDetailContentProps {
  initialData: ConvictionPageData
  slug: string
  locale: string
}

export default function ConvictionDetailContent({
  initialData,
  slug,
  locale,
}: ConvictionDetailContentProps) {
  const [data, setData] = useState<ConvictionPageData>(initialData)
  const [showEnOriginal, setShowEnOriginal] = useState(false)
  const [hasCustomSaved, setHasCustomSaved] = useState(false)
  const texts = getConvictionDetailI18nTexts(locale)

  // 클라이언트 마운트 시 관리자가 수정한 커스텀 i18n 데이터가 있으면 즉시 오버라이드
  useEffect(() => {
    try {
      const savedI18n = localStorage.getItem('aamen_convictions_i18n')
      if (savedI18n) {
        const parsed = JSON.parse(savedI18n)
        const customItem = parsed[locale]?.[slug]
        if (customItem && customItem.meta) {
          // 따옴표 글자 쪼개짐 버그('G'o'd')가 있는 구 데이터 필터링
          if (customItem.meta.quote && customItem.meta.quote.includes("' '")) {
            // 오래된 잘못된 캐시 무시
          } else {
            setData(customItem)
            setHasCustomSaved(true)
          }
        }
      }
    } catch (e) {
      console.error('Failed to load customized conviction data:', e)
    }
  }, [locale, slug])

  const enData = convictionPagesEn[slug]
  const displayData = showEnOriginal && enData ? enData : data

  return (
    <div>
      {/* 글로벌 도구 툴바: 영문 원본 대조 토글 및 커스텀 반영 배지 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-emerald-100/70 shadow-xs">
        <div className="flex items-center gap-2">
          {hasCustomSaved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{texts.verifiedBadge}</span>
            </span>
          )}
          <span className="text-xs font-semibold text-emerald-900 bg-emerald-50/70 px-3 py-1 rounded-full border border-emerald-200/60">
            {texts.curriculumLabel}
          </span>
        </div>

        {locale !== 'en' && enData && (
          <button
            type="button"
            onClick={() => setShowEnOriginal(!showEnOriginal)}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
              showEnOriginal
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50 hover:text-emerald-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{showEnOriginal ? texts.viewTranslation : texts.compareWithEnglish}</span>
          </button>
        )}
      </div>

      {/* 본문 렌더링 카드 */}
      <article className="bg-white rounded-3xl p-6 sm:p-12 shadow-xl shadow-teal-950/5 border border-emerald-100/60 overflow-hidden">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: displayData.rawHtml }}
        />
      </article>
    </div>
  )
}
