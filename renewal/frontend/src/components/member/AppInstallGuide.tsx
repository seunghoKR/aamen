'use client'

import React, { useState } from 'react'
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
                {isKo ? '📱 AAMEN 스마트폰 웹앱 설치 & 푸시 알림 안내' : '📱 Smartphone Web App & Push Notification Guide'}
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                {isKo ? '앱스토어 불필요' : 'PWA App'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-800/90 mt-0.5">
              {isKo
                ? '스마트폰 홈 화면에 AAMEN 앱을 1초 만에 설치하고, 기도 응답과 새 소식을 기기 알림으로 받아보세요!'
                : 'Install AAMEN directly on your smartphone home screen and receive real-time prayer & message notifications!'}
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
              <span>{isKo ? '안드로이드 (갤럭시/Chrome)' : 'Android (Galaxy/Chrome)'}</span>
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
              <span>{isKo ? '아이폰 (iPhone/Safari)' : 'iPhone (iOS/Safari)'}</span>
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
              <span>{isKo ? '알림 켜기 & 해결법' : 'Notification Setup'}</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* 1. 🤖 안드로이드 설치 안내 */}
          {/* ========================================================================= */}
          {activeOsTab === 'android' && (
            <div className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-emerald-950 font-extrabold text-sm">
                <span>🤖</span>
                <span>{isKo ? '안드로이드 (삼성 인터넷 또는 Chrome) 설치 방법 (3단계)' : 'Android Installation Steps'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1단계 */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">1</span>
                    <span>{isKo ? '메뉴 또는 설치 버튼 터치' : 'Tap Install Button'}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isKo ? (
                      <>브라우저 상단 주소창 우측의 <strong>[설치 ⬇️]</strong> 아이콘을 누르거나, 우측 상단 <strong>더보기 메뉴(⋮)</strong>를 누릅니다.</>
                    ) : (
                      <>Tap the <strong>[Install ⬇️]</strong> icon in the address bar or open the browser menu (⋮).</>
                    )}
                  </p>
                </div>

                {/* 2단계 */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">2</span>
                    <span>{isKo ? '[홈 화면에 추가] 선택' : 'Add to Home Screen'}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isKo ? (
                      <>메뉴에서 <strong>[홈 화면에 추가]</strong> 또는 <strong>[앱 설치]</strong>를 선택하고 [추가]를 누릅니다.</>
                    ) : (
                      <>Select <strong>[Add to Home screen]</strong> or <strong>[Install App]</strong> and confirm.</>
                    )}
                  </p>
                </div>

                {/* 3단계 */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-[11px]">3</span>
                    <span>{isKo ? '앱처럼 바로 실행!' : 'Launch like an App!'}</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    {isKo ? (
                      <>스마트폰 홈 화면에 생성된 <strong>AAMEN 아이콘</strong>을 터치하면 상단 주소창 없이 시원한 전체화면 앱으로 실행됩니다.</>
                    ) : (
                      <>Tap the created <strong>AAMEN icon</strong> on your home screen to enjoy a standalone full-screen experience.</>
                    )}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-xl flex items-center gap-2">
                <span>💡</span>
                <span>
                  {isKo
                    ? '삼성 인터넷 브라우저를 쓰시는 경우: 하단 삼선 메뉴(≡) > [현재 페이지 추가] > [홈 화면]을 누르시면 가장 편리합니다.'
                    : 'Samsung Internet tip: Tap the bottom menu (≡) > [Add page to] > [Home screen].'}
                </span>
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
                <span>{isKo ? '아이폰/iPad (Safari 브라우저) 설치 방법 (3단계)' : 'iPhone (Safari) Installation Steps'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* 1단계 */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">1</span>
                    <span>{isKo ? 'Safari 하단 공유 버튼 터치' : 'Tap Safari Share Button'}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isKo ? (
                      <>반드시 <strong>Safari(사파리) 브라우저</strong>로 접속한 후, 화면 하단 중앙의 <strong>공유 아이콘 (네모에 위 화살표 ⬆️)</strong>을 터치합니다.</>
                    ) : (
                      <>Open in <strong>Safari</strong> and tap the <strong>Share button (square with arrow ⬆️)</strong> at the bottom center.</>
                    )}
                  </p>
                </div>

                {/* 2단계 */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">2</span>
                    <span>{isKo ? '[홈 화면에 추가] 선택' : 'Add to Home Screen'}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {isKo ? (
                      <>공유 메뉴를 아래로 스크롤하여 <strong>[홈 화면에 추가 ➕]</strong>를 누른 뒤, 우측 상단 <strong>[추가]</strong>를 터치합니다.</>
                    ) : (
                      <>Scroll down the menu, tap <strong>[Add to Home Screen ➕]</strong>, and tap <strong>[Add]</strong> on the top right.</>
                    )}
                  </p>
                </div>

                {/* 3단계 */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-black">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-[11px]">3</span>
                    <span>{isKo ? '홈 화면 아이콘으로 실행!' : 'Launch from Home Screen'}</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    {isKo ? (
                      <>바탕화면에 생성된 <strong>AAMEN 앱</strong>을 터치하여 실행하면 사파리 주소창 없이 앱스토어 앱과 동일하게 작동합니다.</>
                    ) : (
                      <>Tap the newly created <strong>AAMEN icon</strong> on your iPhone home screen to open the app.</>
                    )}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">{isKo ? '⚠️ 아이폰(iOS) 유저 필독 안내' : '⚠️ Important Notice for iPhone Users'}</span>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    {isKo ? (
                      <>애플의 보안 정책상 <strong>iOS 16.4 이상</strong>부터 웹 푸시를 지원하며, <strong>반드시 [홈 화면에 추가]한 앱 아이콘으로 접속하셔야</strong> 알림 허용 팝업이 활성화됩니다. (일반 사파리 탭에서는 애플 정책으로 푸시가 제한될 수 있습니다.)</>
                    ) : (
                      <>Apple supports web push on <strong>iOS 16.4+</strong>. You must launch the app from the <strong>Home Screen icon</strong> to enable push notifications.</>
                    )}
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
                <span>{isKo ? '브라우저 푸시 알림 켜기 및 문제 해결 방법' : 'Push Notification Activation & Troubleshooting'}</span>
              </div>

              <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">
                    {isKo ? '1단계: [알림 켜기] 버튼 누르고 브라우저 팝업에서 [허용]' : 'Step 1: Click Enable & Allow'}
                  </span>
                  <p className="text-gray-600">
                    {isKo
                      ? '아래 알림 카드에서 [알림 켜기] 버튼을 누른 후, 화면 상단 브라우저 질문에서 [허용 (Allow)]을 터치해 주세요.'
                      : 'Click the [Enable Push] button below and select [Allow] when prompted by your browser.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="font-bold text-gray-900 block mb-1">
                    {isKo ? '2단계: [🔔 알림 테스트] 버튼으로 정상 수신 확인' : 'Step 2: Test Notification'}
                  </span>
                  <p className="text-gray-600">
                    {isKo
                      ? '[알림 테스트] 버튼을 누르면 기기 상단에 띵동~ 하고 AAMEN 테스트 팝업이 뜹니다. 팝업이 뜨면 모든 준비가 완료된 것입니다!'
                      : 'Click the [Test Push] button to verify that a notification alert appears on your device.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-950">
                  <span className="font-bold block mb-1">
                    {isKo ? 'Q. 허용을 눌렀는데도 알림이 안 와요!' : 'Q. Allowed but not receiving notifications?'}
                  </span>
                  <p className="text-[11px] text-rose-900 leading-relaxed">
                    {isKo ? (
                      <>스마트폰 <strong>[설정] > [알림] > [사용 중인 브라우저(또는 AAMEN 앱)]</strong>의 알림 허용 스위치가 켜져 있는지 확인해 주세요. 또한 스마트폰이 <strong>방해금지 모드</strong>나 <strong>집중 모드</strong> 상태일 경우 알림이 무음 처리될 수 있습니다.</>
                    ) : (
                      <>Check your phone's <strong>Settings > Notifications > Browser (or AAMEN)</strong> to ensure notifications are allowed. Also verify that Do Not Disturb mode is off.</>
                    )}
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
                    <span>{isKo ? '지금 알림 권한 켜기' : 'Enable Notifications Now'}</span>
                  </button>
                )}

                {onTestPush && (
                  <button
                    type="button"
                    onClick={onTestPush}
                    className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                  >
                    <Sparkles size={13} className="text-emerald-600" />
                    <span>{isKo ? '🔔 알림 테스트 발송' : 'Test Push Notification'}</span>
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
