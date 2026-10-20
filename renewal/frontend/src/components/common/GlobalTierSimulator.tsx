'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Shield,
  ChevronUp,
  ChevronDown,
  Check,
  ShieldCheck,
  Lock,
  Move,
  CornerDownRight,
  CornerDownLeft,
  CornerUpRight,
  CornerUpLeft,
} from 'lucide-react'
import { MemberLevel, defaultTierSettings } from '@/lib/store'

export const TIER_STORAGE_KEY = 'aamen_current_tier_level'
export const TIER_EVENT_NAME = 'aamen_tier_change'
const SIMULATOR_POS_KEY = 'aamen_simulator_pos'

export function getStoredTierLevel(): MemberLevel {
  if (typeof window === 'undefined') return 0
  try {
    // 1. 권한 시뮬레이터(테스트 레벨) 우선 적용
    const val = localStorage.getItem(TIER_STORAGE_KEY)
    if (val && ['0', '1', '2', '3', '4', '5', '6'].includes(val)) {
      return Number(val) as MemberLevel
    }

    // 2. 시뮬레이터 설정이 없을 때 기본 로그인 사용자 정보 적용
    const userRaw = localStorage.getItem('aamen_current_user')
    if (userRaw) {
      const user = JSON.parse(userRaw)
      if (user.role === 'developer') return 6
      if (user.role === 'super_admin') return 5
      if (user.role === 'country_admin') return 4
      if (user.role === 'regular') return 2
      if (user.role === 'associate') return 1
      if (user.role === 'guest') return 0
      if (typeof user.tierLevel === 'number') return user.tierLevel as MemberLevel
    }
    const role = localStorage.getItem('aamen_auth_role')
    if (role === 'developer') return 6
    if (role === 'super_admin') return 5
    if (role === 'country_admin') return 4
    if (role === 'regular') return 2
    if (role === 'associate') return 1
    if (role === 'guest') return 0
  } catch (e) {}
  return 0
}

export function setStoredTierLevel(level: MemberLevel) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(TIER_STORAGE_KEY, String(level))
    if (level === 6) localStorage.setItem('aamen_auth_role', 'developer')
    else if (level === 5) localStorage.setItem('aamen_auth_role', 'super_admin')
    else if (level === 4) localStorage.setItem('aamen_auth_role', 'country_admin')
    else if (level === 3 || level === 2) localStorage.setItem('aamen_auth_role', 'regular')
    else if (level === 1) localStorage.setItem('aamen_auth_role', 'associate')
    else localStorage.setItem('aamen_auth_role', 'guest')

    window.dispatchEvent(new CustomEvent(TIER_EVENT_NAME, { detail: { level } }))
  } catch (e) {
    console.error('Failed to set stored tier:', e)
  }
}

export default function GlobalTierSimulator() {
  const [currentLevel, setCurrentLevel] = useState<MemberLevel>(4)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 📍 자유 드래그 앤 드롭 위치 상태 (화면 좌표 x, y)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  })
  const hasMovedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const initial = getStoredTierLevel()
    setCurrentLevel(initial)

    const checkRole = () => {
      try {
        const uRaw = localStorage.getItem('aamen_current_user')
        if (uRaw) {
          const u = JSON.parse(uRaw)
          setCurrentUserRole(u.role || null)
          return
        }
        const r = localStorage.getItem('aamen_auth_role')
        setCurrentUserRole(r || null)
      } catch (e) {
        setCurrentUserRole(null)
      }
    }

    checkRole()

    // 저장된 위치 불러오기 또는 기본 위치(우측 하단)로 설정하여 좌측 대시보드 버튼 가림 방지
    try {
      const savedPos = localStorage.getItem(SIMULATOR_POS_KEY)
      if (savedPos) {
        const parsed = JSON.parse(savedPos)
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          // 화면 밖으로 벗어난 경우 보정
          const safeX = Math.max(10, Math.min(window.innerWidth - 320, parsed.x))
          const safeY = Math.max(10, Math.min(window.innerHeight - 60, parsed.y))
          setPosition({ x: safeX, y: safeY })
        }
      } else {
        // 기본 위치: 우측 하단 (대시보드 사이드바의 "사이트 돌아가기" 버튼과 겹치지 않음!)
        const defaultX = Math.max(10, window.innerWidth - 340)
        const defaultY = Math.max(10, window.innerHeight - 70)
        setPosition({ x: defaultX, y: defaultY })
      }
    } catch (e) {
      setPosition({ x: Math.max(10, window.innerWidth - 340), y: Math.max(10, window.innerHeight - 70) })
    }

    const handleTierChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ level: MemberLevel }>
      if (customEvent.detail && customEvent.detail.level !== undefined) {
        setCurrentLevel(customEvent.detail.level)
      } else {
        setCurrentLevel(getStoredTierLevel())
      }
      checkRole()
    }

    const handleAuthChange = () => {
      checkRole()
      setCurrentLevel(getStoredTierLevel())
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === TIER_STORAGE_KEY || e.key === 'aamen_auth_role' || e.key === 'aamen_current_user') {
        setCurrentLevel(getStoredTierLevel())
        checkRole()
      }
    }

    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.max(10, Math.min(window.innerWidth - 320, prev.x)),
        y: Math.max(10, Math.min(window.innerHeight - 60, prev.y)),
      }))
    }

    window.addEventListener(TIER_EVENT_NAME, handleTierChange)
    window.addEventListener('aamen_auth_change', handleAuthChange)
    window.addEventListener('storage', handleStorage)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener(TIER_EVENT_NAME, handleTierChange)
      window.removeEventListener('aamen_auth_change', handleAuthChange)
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 드래그 시작 (Pointer Event)
  const handlePointerDown = (e: React.PointerEvent) => {
    // 팝업 패널 내부 클릭은 드래그 제외
    if ((e.target as HTMLElement).closest('.simulator-popup-panel')) return

    setIsDragging(true)
    hasMovedRef.current = false
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    }

    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  // 드래그 중
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStartRef.current.startX
    const deltaY = e.clientY - dragStartRef.current.startY

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMovedRef.current = true
    }

    const newX = Math.max(10, Math.min(window.innerWidth - 320, dragStartRef.current.posX + deltaX))
    const newY = Math.max(10, Math.min(window.innerHeight - 60, dragStartRef.current.posY + deltaY))

    setPosition({ x: newX, y: newY })
  }

  // 드래그 종료
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch (err) {}

    // 위치 저장
    if (hasMovedRef.current) {
      try {
        localStorage.setItem(SIMULATOR_POS_KEY, JSON.stringify(position))
      } catch (err) {}
    } else {
      // 드래그하지 않고 단순 클릭한 경우 팝업 토글!
      setIsOpen((prev) => !prev)
    }
  }

  // 4개 모서리 퀵 이동 프리셋 함수
  const moveToCorner = (corner: 'bl' | 'br' | 'tr' | 'tl') => {
    let nextX = 20
    let nextY = 20
    const w = window.innerWidth
    const h = window.innerHeight

    if (corner === 'bl') {
      nextX = 20
      nextY = h - 70
    } else if (corner === 'br') {
      nextX = w - 340
      nextY = h - 70
    } else if (corner === 'tr') {
      nextX = w - 340
      nextY = 80
    } else if (corner === 'tl') {
      nextX = 20
      nextY = 80
    }

    const clampedX = Math.max(10, Math.min(w - 320, nextX))
    const clampedY = Math.max(10, Math.min(h - 60, nextY))
    const newPos = { x: clampedX, y: clampedY }
    setPosition(newPos)
    try {
      localStorage.setItem(SIMULATOR_POS_KEY, JSON.stringify(newPos))
    } catch (e) {}
  }

  if (!mounted) return null

  // 🔒 로그인 전 및 일반 회원/관리자에게는 권한 테스트 바를 완전히 숨김!
  // 오직 "개발자(developer)" 계정으로 로그인했을 때만 권한 시뮬레이터가 활성화됩니다.
  if (currentUserRole !== 'developer') {
    return null
  }

  const currentTier = defaultTierSettings[currentLevel]
  const isNearTop = position.y < 350 // 화면 상단 쪽에 있으면 팝업을 아래로 열기

  const handleSelectLevel = (lvl: MemberLevel) => {
    setCurrentLevel(lvl)
    setStoredTierLevel(lvl)
  }

  return (
    <div
      ref={containerRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      className="fixed z-[9999] font-sans antialiased select-none touch-none"
    >
      {/* 5단계 등급 선택 팝업 패널 */}
      {isOpen && (
        <div
          className={`simulator-popup-panel w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-emerald-300 overflow-hidden duration-200 ${
            isNearTop
              ? 'mt-3 animate-in fade-in slide-in-from-top-3'
              : 'mb-3 -translate-y-full -mt-2 animate-in fade-in slide-in-from-bottom-3'
          }`}
          style={{
            position: 'absolute',
            left: position.x > window.innerWidth / 2 ? 'auto' : 0,
            right: position.x > window.innerWidth / 2 ? 0 : 'auto',
            top: isNearTop ? '100%' : '0',
          }}
        >
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
                  <ShieldCheck size={18} className="text-emerald-300" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                    전역 권한 시뮬레이터
                    <span className="text-[10px] bg-amber-400 text-gray-950 font-black px-1.5 py-0.5 rounded-full">DEV TEST</span>
                  </h4>
                  <p className="text-[11px] text-emerald-100 opacity-90 mt-0.5">
                    마우스로 끌어서 원하는 위치에 놓을 수 있습니다
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="닫기"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* 퀵 위치 이동 프리셋 버튼 바 */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-emerald-200/80 font-medium flex items-center gap-1">
                <Move size={11} /> 퀵 모서리 이동:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveToCorner('bl')}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/25 transition-colors font-bold"
                  title="좌측 하단으로 이동"
                >
                  ↙ 좌하
                </button>
                <button
                  type="button"
                  onClick={() => moveToCorner('br')}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/25 transition-colors font-bold"
                  title="우측 하단으로 이동"
                >
                  ↘ 우하
                </button>
                <button
                  type="button"
                  onClick={() => moveToCorner('tr')}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/25 transition-colors font-bold"
                  title="우측 상단으로 이동"
                >
                  ↗ 우상
                </button>
                <button
                  type="button"
                  onClick={() => moveToCorner('tl')}
                  className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/25 transition-colors font-bold"
                  title="좌측 상단으로 이동"
                >
                  ↖ 좌상
                </button>
              </div>
            </div>
          </div>

          {/* 등급 목록 (0단계 비회원 ~ 5단계 사이트 관리자 ~ 6단계 개발자) */}
          <div className="p-3 space-y-2 max-h-[58vh] overflow-y-auto">
            {([0, 1, 2, 3, 4, 5, 6] as MemberLevel[]).map((lvl) => {
              const info = defaultTierSettings[lvl]
              const isSelected = currentLevel === lvl

              return (
                <button
                  key={lvl}
                  onClick={() => handleSelectLevel(lvl)}
                  className={`w-full text-left p-2.5 rounded-2xl transition-all border flex items-start gap-3 ${
                    isSelected
                      ? lvl === 0
                        ? 'bg-gray-100 border-gray-400 ring-2 ring-gray-400/20 shadow-xs'
                        : lvl === 6
                        ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white hover:bg-gray-50/80 border-gray-100'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 ${
                      isSelected
                        ? lvl === 0
                          ? 'bg-gray-700 text-white'
                          : lvl === 6
                          ? 'bg-indigo-600 text-white'
                          : 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {lvl}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`text-xs font-bold ${isSelected ? 'text-gray-950' : 'text-gray-900'}`}>
                        {info.name}
                      </span>
                      {isSelected && (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                          lvl === 6 ? 'text-indigo-800 bg-indigo-100/90' : 'text-emerald-700 bg-emerald-100/80'
                        }`}>
                          <Check size={11} /> 현재 적용중
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      {info.desc}
                    </p>

                    {/* 권한 요약 태그 */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {lvl === 0 && (
                        <span className="text-[9px] bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-medium border border-gray-300">
                          🚫 비회원/로그아웃: 사역자 보호, 기도제목 블러 마스킹
                        </span>
                      )}
                      {lvl === 1 && (
                        <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                          🔒 가입대기 준회원: 기도제목 1줄 미리보기, 글쓰기 제한
                        </span>
                      )}
                      {lvl === 2 && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                          ✨ 정회원: 기도 전문 열람, AI 번역, 일반 글쓰기 및 자료 다운로드
                        </span>
                      )}
                      {lvl === 3 && (
                        <span className="text-[9px] bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-medium border border-teal-200">
                          🌿 사역자: 사역 소식 및 사진첩 나눔 권한
                        </span>
                      )}
                      {lvl === 4 && (
                        <span className="text-[9px] bg-sky-50 text-sky-800 px-1.5 py-0.5 rounded font-medium border border-sky-200">
                          ⭐ 국가 코디네이터: 모든 글 관리·삭제, 공지사항 등록
                        </span>
                      )}
                      {lvl === 5 && (
                        <span className="text-[9px] bg-purple-50 text-purple-800 px-1.5 py-0.5 rounded font-medium border border-purple-200">
                          👑 5단계 사이트 관리자: 배너, 회원 등급 승인, 코디네이터, 협력단체, 팝업 등 운영 총괄
                        </span>
                      )}
                      {lvl === 6 && (
                        <span className="text-[9px] bg-indigo-50 text-indigo-900 px-1.5 py-0.5 rounded font-medium border border-indigo-200">
                          🛠️ 6단계 개발자: 5단계 운영 권한 전체 + 7대 신념 교안 관리 + 제미나이 AI 엔진 제어
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 하단 푸터 안내 */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>랜딩, 대시보드, 커뮤니티 전역 즉시 반영</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-700 font-bold hover:underline"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 🚀 자유 드래그 가능한 플로팅 알약 트리거 버튼 */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-full text-white shadow-2xl border-2 backdrop-blur-md transition-shadow cursor-grab active:cursor-grabbing ${
          isDragging ? 'scale-105 shadow-emerald-500/30' : 'hover:scale-105'
        } ${
          currentLevel === 0
            ? 'bg-gray-900 border-gray-400'
            : currentLevel >= 6
            ? 'bg-indigo-950/90 border-indigo-400'
            : currentLevel === 5
            ? 'bg-purple-950/90 border-purple-400'
            : currentLevel === 4
            ? 'bg-sky-950/90 border-sky-400'
            : 'bg-gray-900/90 border-emerald-400/90'
        }`}
        title="클릭하여 권한을 변경하거나, 드래그하여 화면 원하는 곳으로 옮기세요!"
      >
        {/* 드래그 가능 핸들 아이콘 */}
        <span className="text-gray-400 group-hover:text-white transition-colors">
          <Move size={12} />
        </span>

        <span className="relative flex h-2.5 w-2.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              currentLevel === 0
                ? 'bg-gray-400'
                : currentLevel >= 6
                ? 'bg-indigo-400'
                : currentLevel === 5
                ? 'bg-purple-400'
                : currentLevel === 4
                ? 'bg-sky-400'
                : 'bg-emerald-400'
            }`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              currentLevel === 0
                ? 'bg-gray-400'
                : currentLevel >= 6
                ? 'bg-indigo-400'
                : currentLevel === 5
                ? 'bg-purple-400'
                : currentLevel === 4
                ? 'bg-sky-400'
                : 'bg-emerald-400'
            }`}
          ></span>
        </span>

        <Shield
          size={14}
          className={
            currentLevel === 0
              ? 'text-gray-300'
              : currentLevel >= 6
              ? 'text-indigo-300'
              : currentLevel === 5
              ? 'text-purple-300'
              : currentLevel === 4
              ? 'text-sky-300'
              : 'text-emerald-400'
          }
        />

        <span className="text-xs font-black tracking-tight text-emerald-200">
          권한 테스트:
        </span>

        <span className="text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
          {currentTier.name.split(':')[0]} ({currentTier.name.split(':')[1]?.trim()})
        </span>

        {isOpen ? (
          <ChevronDown size={14} className="text-emerald-300" />
        ) : (
          <ChevronUp size={14} className="text-emerald-300" />
        )}
      </div>
    </div>
  )
}
