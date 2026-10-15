'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { locales, type Locale } from '@/config/locales'
import { getStoredUser, type AuthUser } from '@/lib/auth'

// 13개국 맞춤형 표시 정보 (미국 US 🇺🇸 적용)
const authCountryDisplay: Record<Locale, { name: string; code: string; flag: string }> = {
  ko: { name: '대한민국', code: 'KR', flag: '🇰🇷' },
  en: { name: 'United States', code: 'US', flag: '🇺🇸' },
  ja: { name: '日本語', code: 'JP', flag: '🇯🇵' },
  'zh-TW': { name: '繁體中文', code: 'TW', flag: '🇹🇼' },
  vi: { name: 'Tiếng Việt', code: 'VN', flag: '🇻🇳' },
  id: { name: 'Bahasa Indonesia', code: 'ID', flag: '🇮🇩' },
  th: { name: 'ไทย', code: 'TH', flag: '🇹🇭' },
  lo: { name: 'ລາວ', code: 'LA', flag: '🇱🇦' },
  my: { name: 'မြန်မာ', code: 'MM', flag: '🇲🇲' },
  ne: { name: 'नेपाली', code: 'NP', flag: '🇳🇵' },
  hi: { name: 'हिन्दी', code: 'IN', flag: '🇮🇳' },
  km: { name: 'ភាសាខ្មែរ', code: 'KH', flag: '🇰🇭' },
  mn: { name: 'Монгол', code: 'MN', flag: '🇲🇳' },
}

const countryCodeToLocale: Record<string, Locale> = {
  KR: 'ko',
  US: 'en',
  JP: 'ja',
  TW: 'zh-TW',
  VN: 'vi',
  ID: 'id',
  TH: 'th',
  LA: 'lo',
  MM: 'my',
  NP: 'ne',
  IN: 'hi',
  KH: 'km',
  MN: 'mn',
}

interface AuthLanguageSwitcherProps {
  currentLocale: string
  label?: string
}

export default function AuthLanguageSwitcher({ currentLocale, label }: AuthLanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeLocale = (locales.includes(currentLocale as Locale) ? currentLocale : 'ko') as Locale
  const activeInfo = authCountryDisplay[activeLocale] || { name: 'Language', code: 'LANG', flag: '🌐' }

  useEffect(() => {
    setCurrentUser(getStoredUser())
  }, [])

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectLocale = (targetLocale: Locale) => {
    localStorage.setItem('aamen_locale_user_selected', 'true')
    if (targetLocale === activeLocale) {
      setIsOpen(false)
      return
    }

    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`
    }

    const basePath = pathname.replace(/^\/(ko|en|ja|zh-TW|mn|vi|id|ne|th|lo|my|hi|km)/, '') || '/'
    const cleanPath = basePath.startsWith('/') ? basePath : `/${basePath}`
    const newPath = `/${targetLocale}${cleanPath}`

    setIsOpen(false)
    router.push(newPath)
  }

  // 로그인 후: 회원 소속 국가를 최상단에, 나머지는 국가 이니셜(Code) 알파벳 순
  // 로그인 전: 전체 13개국을 국가 이니셜(Code) 알파벳 순 (ID, IN, JP, KH, KR, LA, MM, MN, NP, TH, TW, US, VN)
  const userCountry = currentUser?.country_code?.toUpperCase()
  const myCountryLocale = userCountry && countryCodeToLocale[userCountry] ? countryCodeToLocale[userCountry] : null

  const displayLocales = [
    ...(myCountryLocale ? [myCountryLocale] : []),
    ...locales
      .filter((loc) => !myCountryLocale || loc !== myCountryLocale)
      .sort((a, b) => authCountryDisplay[a].code.localeCompare(authCountryDisplay[b].code)),
  ]

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 트리거 버튼 (알약 스타일) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 bg-gray-100/90 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200/90 hover:border-emerald-300 transition-all shadow-2xs cursor-pointer active:scale-95"
        aria-label="언어 모드 선택"
      >
        <span className="text-sm shrink-0 leading-none">{activeInfo.flag}</span>
        <span className="truncate max-w-[100px]">{activeInfo.name}</span>
        <span className="text-[10px] font-mono text-gray-400 font-extrabold uppercase">({activeInfo.code})</span>
        <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 언어 선택 드롭다운 모달/팝오버 */}
      {isOpen && (
        <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-gray-700 flex items-center gap-1.5">
              <Globe size={13} className="text-emerald-600" />
              <span>{label || '참여국 언어 선택'}</span>
            </span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
              {myCountryLocale ? 'Member Mode' : 'A-Z Order'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 p-1 max-h-64 overflow-y-auto">
            {displayLocales.map((loc, idx) => {
              const info = authCountryDisplay[loc]
              const isSelected = loc === activeLocale
              const isMyCountry = loc === myCountryLocale && idx === 0

              return (
                <button
                  key={`${loc}_${idx}`}
                  type="button"
                  onClick={() => handleSelectLocale(loc)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-all cursor-pointer relative ${
                    isMyCountry
                      ? isSelected
                        ? 'bg-emerald-600 text-white font-extrabold shadow-xs'
                        : 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                      : isSelected
                      ? 'bg-gray-100 text-emerald-800 font-extrabold border border-emerald-200'
                      : 'hover:bg-gray-50 text-gray-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base shrink-0 leading-none">{info.flag}</span>
                    <span className="truncate text-xs">{info.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <span className={`text-[10px] font-mono ${isMyCountry && isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {info.code}
                    </span>
                    {isSelected && <Check size={12} className={isMyCountry && isSelected ? 'text-white' : 'text-emerald-600'} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
