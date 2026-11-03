'use client'

import React, { useState } from 'react'
import { getNotificationGuideTexts } from '@/lib/notificationGuideI18n'
import { 
  Smartphone, 
  Download, 
  Share2, 
  PlusSquare, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface AppInstallGuideProps {
  locale: string
  onEnablePush?: () => void
  onTestPush?: () => void
  pushPermissionStatus?: NotificationPermission | 'default'
}

export default function AppInstallGuide({
  locale,
  onEnablePush,
  onTestPush,
  pushPermissionStatus = 'default'
}: AppInstallGuideProps) {
  const isKo = locale === 'ko'
  const tGuide = getNotificationGuideTexts(locale)
  const [activeOsTab, setActiveOsTab] = useState<'android' | 'ios' | 'push'>('android')
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-sky-50/50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs space-y-6">
      {/* 카드 상단 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Smartphone size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-emerald-950">
                {tGuide.installGuideTitle}
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                {tGuide.installGuideBadge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-800/90 mt-0.5">
{tGuide.installGuideDesc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl bg-white/70 hover:bg-white text-emerald-800 transition-colors shrink-0"
          title={isExpanded ? '접기' : '펼치기'}
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* OS 탭 셀렉터 */}
          <div className="flex items-center gap-1.5 p-1 bg-white/80 rounded-2xl border border-emerald-100 max-w-fit">
            <button
              type="button"
              onClick={() => setActiveOsTab('android')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeOsTab === 'android'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-900 hover:bg-emerald-50/50'
              }`}
            >
              <span>🤖</span>
              <span>{tGuide.installTabAndroid}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveOsTab('ios')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeOsTab === 'ios'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-900 hover:bg-emerald-50/50'
              }`}
            >
              <span>🍎</span>
              <span>{tGuide.installTabIos}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveOsTab('push')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeOsTab === 'push'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-emerald-900 hover:bg-emerald-50/50'
              }`}
            >
              <Bell size={13} />
              <span>{tGuide.installTabPush}</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 1. 🤖 안드로이드 설치 안내 */}
          {/* ========================================================================= */}
          {activeOsTab === 'android' && (
            <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-emerald-950 font-extrabold text-sm">
                <span>🤖</span>
                <span>{tGuide.androidStepTitle}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1단계 */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">1</span>
                    <span>{tGuide.androidStep1Title}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {tGuide.androidStep1Desc}
                  </p>
                </div>

                {/* 2단계 */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">2</span>
                    <span>{tGuide.androidStep2Title}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {tGuide.androidStep2Desc}
                  </p>
                </div>

                {/* 3단계 */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-[11px]">3</span>
                    <span>{tGuide.androidStep3Title}</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    {tGuide.androidStep3Desc}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-xl flex items-center gap-2">
                <span>💡</span>
<span>{tGuide.samsungTip}</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. 🍎 아이폰(iOS) 설치 안내 */}
          {/* ========================================================================= */}
          {activeOsTab === 'ios' && (
            <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-emerald-950 font-extrabold text-sm">
                <span>🍎</span>
                <span>{tGuide.iosStepTitle}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1단계 */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">1</span>
                    <span>{tGuide.iosStep1Title}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {tGuide.iosStep1Desc}
                  </p>
                </div>

                {/* 2단계 */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">2</span>
                    <span>{tGuide.androidStep2Title}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {tGuide.iosStep2Desc}
                  </p>
                </div>

                {/* 3단계 */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-[11px]">3</span>
                    <span>{tGuide.iosStep3Title}</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    {tGuide.iosStep3Desc}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">{tGuide.iosNoticeTitle}</span>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    {tGuide.iosNoticeDesc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. 🔔 푸시 알림 켜기 & 트러블슈팅 */}
          {/* ========================================================================= */}
          {activeOsTab === 'push' && (
            <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-emerald-950 font-extrabold text-sm">
                <Bell size={16} className="text-emerald-600" />
                <span>{tGuide.pushStepTitle}</span>
              </div>

              <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">
                    {tGuide.pushStep1Title}
                  </span>
                  <p className="text-gray-600">
                    {tGuide.pushStep1Desc}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">
                    {tGuide.pushStep2Title}
                  </span>
                  <p className="text-gray-600">
                    {tGuide.pushStep2Desc}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-950">
                  <span className="font-bold block mb-1">
                    {tGuide.pushFaqTitle}
                  </span>
                  <p className="text-[11px] text-rose-900 leading-relaxed">
                    {tGuide.pushFaqDesc}
                  </p>
                </div>
              </div>

              {/* 빠른 액션 버튼 바 */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                {pushPermissionStatus !== 'granted' && onEnablePush && (
                  <button
                    type="button"
                    onClick={onEnablePush}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Bell size={13} />
                    <span>{tGuide.pushEnableBtn}</span>
                  </button>
                )}

                {onTestPush && (
                  <button
                    type="button"
                    onClick={onTestPush}
                    className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                  >
                    <Sparkles size={13} className="text-emerald-600" />
                    <span>{tGuide.pushTestBtn}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
