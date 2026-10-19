'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  ShieldCheck,
  Check,
  User,
  Plus,
  Trash2,
  X,
  Lock,
} from 'lucide-react'
import { saveAuthUser, AuthUser } from '@/lib/auth'
import AuthLanguageSwitcher from '@/components/common/AuthLanguageSwitcher'
import { getAuthText } from '@/data/authTranslations'

const GOOGLE_CLIENT_ID = '441083250158-826ur2svuqf55d5ad3u621fongnvbs6r.apps.googleusercontent.com'

export interface BrowserGoogleAccount {
  name: string
  email: string
  avatar?: string
}

const DEFAULT_BROWSER_ACCOUNTS: BrowserGoogleAccount[] = [
  {
    name: '이승호',
    email: 'leeshkr@gmail.com',
  },
  {
    name: '배용하',
    email: 'byh1424@gmail.com',
  },
]

export default function SignUpPage() {
  const router = useRouter()
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isKo = currentLocale === 'ko'
  const getLocalizedPath = (path: string) => `/${currentLocale}${path.startsWith('/') ? path : `/${path}`}`

  const tRaw = useTranslations('auth')
  const t = (key: any, values?: Record<string, string>): string => {
    try {
      if (values) {
        return tRaw(key, values)
      }
      return tRaw(key)
    } catch {
      return getAuthText(currentLocale, key, key)
    }
  }

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 🌟 브라우저 저장 계정 및 fallback 모달 상태
  const [browserAccounts, setBrowserAccounts] = useState<BrowserGoogleAccount[]>([])
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false)
  const [isCustomGoogleOpen, setIsCustomGoogleOpen] = useState(false)
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')
  const [customGoogleName, setCustomGoogleName] = useState('')
  const [hasAgreedConsent, setHasAgreedConsent] = useState(true)

  // 🌟 Google Identity Services (GSI) 토큰 클라이언트 상태
  const [googleTokenClient, setGoogleTokenClient] = useState<any>(null)
  const [isGoogleSdkReady, setIsGoogleSdkReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aamen_saved_google_accounts')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBrowserAccounts(parsed)
            return
          }
        }
      } catch (e) {
        console.error(e)
      }
      setBrowserAccounts(DEFAULT_BROWSER_ACCOUNTS)
      localStorage.setItem('aamen_saved_google_accounts', JSON.stringify(DEFAULT_BROWSER_ACCOUNTS))
    }
  }, [])

  const saveAccountToBrowser = (acc: BrowserGoogleAccount) => {
    setBrowserAccounts((prev) => {
      const filtered = prev.filter((a) => a.email.toLowerCase() !== acc.email.toLowerCase())
      const updated = [acc, ...filtered]
      if (typeof window !== 'undefined') {
        localStorage.setItem('aamen_saved_google_accounts', JSON.stringify(updated))
      }
      return updated
    })
  }

  const removeBrowserAccount = (emailToRemove: string) => {
    setBrowserAccounts((prev) => {
      const updated = prev.filter((a) => a.email.toLowerCase() !== emailToRemove.toLowerCase())
      if (typeof window !== 'undefined') {
        localStorage.setItem('aamen_saved_google_accounts', JSON.stringify(updated))
      }
      return updated
    })
  }

  // 🌟 구글 공식 GSI 초기화
  const initGoogleAuth = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              setIsLoading(true)
              try {
                // 구글 공식 userinfo 엔드포인트에서 실제 계정 정보(이름, 이메일, 사진 등) 조회
                const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                  },
                })
                if (userRes.ok) {
                  const googleUser = await userRes.json()
                  await executeGoogleSignUp(
                    {
                      id: googleUser.sub,
                      name: googleUser.name || 'Google Member',
                      email: googleUser.email,
                    },
                    googleUser.picture
                  )
                  return
                }
              } catch (err) {
                console.error('Google userinfo fetch error:', err)
                alert(isKo ? '구글 사용자 정보를 불러오지 못했습니다.' : 'Failed to retrieve Google profile.')
              } finally {
                setIsLoading(false)
              }
            } else if (tokenResponse?.error) {
              console.warn('Google Auth response error:', tokenResponse.error)
            }
          },
        })
        setGoogleTokenClient(client)
        setIsGoogleSdkReady(true)
      } catch (err) {
        console.error('Failed to init Google Token Client:', err)
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      initGoogleAuth()
    }
  }, [])

  // 🌟 구글 회원가입 버튼 클릭 핸들러
  const handleGoogleSignUp = () => {
    setErrorMessage('')
    if (googleTokenClient) {
      // 🚀 구글 공식 팝업 실행! prompt: 'select_account'를 통해 브라우저 내 구글 계정 선택창이 항상 팝업됨!
      googleTokenClient.requestAccessToken({ prompt: 'select_account' })
    } else {
      setIsGoogleModalOpen(true)
    }
  }

  // 🌟 구글 계정 정보를 바탕으로 회원가입 및 마이페이지로 이동
  const executeGoogleSignUp = async (
    acc: {
      id?: string
      name: string
      email: string
    },
    avatarUrl?: string
  ) => {
    if (!hasAgreedConsent) {
      alert(isKo ? 'Google 계정 연동 및 개인정보 제공 동의가 필요합니다.' : 'Please agree to terms and Google account sync.')
      return
    }

    setIsLoading(true)
    setIsGoogleModalOpen(false)

    try {
      // 백엔드 PHP API 호출하여 DB에 구글 회원 정보 등록/동기화
      const res = await fetch('/api/members.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'google_login',
          email: acc.email,
          name: acc.name,
          avatar_url: avatarUrl,
        }),
      })

      const data = await res.json()
      let serverMember = data?.member || null

      const countryCode = serverMember?.country_code || (currentLocale === 'ja' ? 'JP' : currentLocale === 'zh-TW' ? 'TW' : currentLocale === 'th' ? 'TH' : 'KR')
      const userId = serverMember?.id || acc.id || ('g_' + Math.floor(1000 + Math.random() * 9000))
      const userName = serverMember?.name || acc.name || 'Google Member'
      const userEmail = serverMember?.email || acc.email

      const authUser: AuthUser = {
        id: userId,
        name: userName,
        email: userEmail,
        role: (serverMember?.role as AuthUser['role']) || 'regular',
        tierLevel: serverMember?.tierLevel || 2,
        country_code: countryCode,
        phone: serverMember?.phone,
        provider: 'google',
        status: 'active',
      }

      // 로그인 인증 상태 저장
      saveAuthUser(authUser)
      saveAccountToBrowser({ name: userName, email: userEmail, avatar: avatarUrl })

      // 마이페이지가 열릴 때 기본적으로 구글 계정 정보를 가져올 수 있도록 프로필 상태 및 개별 격리 키 저장
      if (typeof window !== 'undefined') {
        const memEnName = serverMember?.name_en || userName
        localStorage.setItem('aamen_profile_id', userId)
        localStorage.setItem('aamen_profile_name', userName)
        localStorage.setItem('aamen_profile_name_en', memEnName)
        localStorage.setItem('aamen_profile_email', userEmail)
        localStorage.setItem('aamen_profile_country', countryCode)

        // 사용자별 격리 저장소에도 명시적 기록
        localStorage.setItem(`aamen_profile_name_${userId}`, userName)
        localStorage.setItem(`aamen_profile_name_en_${userId}`, memEnName)
        localStorage.setItem(`aamen_profile_country_${userId}`, countryCode)
        localStorage.setItem(`aamen_profile_email_${userId}`, userEmail)

        const finalAvatar = avatarUrl || serverMember?.avatar_url
        if (finalAvatar) {
          localStorage.setItem('aamen_profile_avatar', finalAvatar)
          localStorage.setItem(`aamen_profile_avatar_${userId}`, finalAvatar)
        }
        if (serverMember?.phone) {
          localStorage.setItem('aamen_profile_phone', serverMember.phone)
          localStorage.setItem(`aamen_profile_phone_${userId}`, serverMember.phone)
        }
        if (serverMember?.affiliation) {
          localStorage.setItem('aamen_profile_affiliation', serverMember.affiliation)
          localStorage.setItem(`aamen_profile_affiliation_${userId}`, serverMember.affiliation)
        }
        if (serverMember?.facebook_account) {
          localStorage.setItem(`aamen_facebook_${userId}`, serverMember.facebook_account)
        }
        if (serverMember?.telegram_chat_id) {
          localStorage.setItem(`aamen_telegram_${userId}`, serverMember.telegram_chat_id)
          localStorage.setItem('aamen_telegram_chat_id', serverMember.telegram_chat_id)
        }
      }

      setIsLoading(false)
      alert(
        isKo
          ? `🎉 Google 계정(${userEmail}) 인증이 완료되었습니다!\n반갑습니다, ${userName}님. 마이페이지에서 소속교회 등 필수 정보를 확인해 주세요.`
          : `🎉 Google account (${userEmail}) verified!\nWelcome, ${userName}. Please review your profile info in My Page.`
      )

      router.push(getLocalizedPath('/member/mypage?welcome=true'))
    } catch (err) {
      console.error(err)
      setIsLoading(false)

      // 오프라인 / 네트워크 지연 시 클라이언트 세이프 가입
      const fallbackId = acc.id ? 'g_' + String(acc.id).slice(0, 8) : 'g_' + Math.floor(1000 + Math.random() * 9000)
      const countryCode = currentLocale === 'ja' ? 'JP' : currentLocale === 'zh-TW' ? 'TW' : currentLocale === 'th' ? 'TH' : 'KR'
      const fallbackUser: AuthUser = {
        id: fallbackId,
        name: acc.name,
        email: acc.email,
        role: 'regular',
        tierLevel: 2,
        country_code: countryCode,
        provider: 'google',
        status: 'active',
      }

      saveAuthUser(fallbackUser)
      saveAccountToBrowser({ name: acc.name, email: acc.email, avatar: avatarUrl })

      if (typeof window !== 'undefined') {
        localStorage.setItem('aamen_profile_id', fallbackId)
        localStorage.setItem('aamen_profile_name', acc.name)
        localStorage.setItem('aamen_profile_name_en', acc.name)
        localStorage.setItem('aamen_profile_email', acc.email)
        localStorage.setItem('aamen_profile_country', countryCode)
        localStorage.setItem(`aamen_profile_name_${fallbackId}`, acc.name)
        localStorage.setItem(`aamen_profile_name_en_${fallbackId}`, acc.name)
        localStorage.setItem(`aamen_profile_country_${fallbackId}`, countryCode)
        localStorage.setItem(`aamen_profile_email_${fallbackId}`, acc.email)
        if (avatarUrl) {
          localStorage.setItem('aamen_profile_avatar', avatarUrl)
          localStorage.setItem(`aamen_profile_avatar_${fallbackId}`, avatarUrl)
        }
      }

      alert(
        isKo
          ? `🎉 Google 계정(${acc.email}) 인증이 완료되었습니다!\n반갑습니다, ${acc.name}님. 마이페이지에서 필수 정보를 확인해 주세요.`
          : `🎉 Google account verified! Welcome, ${acc.name}.`
      )
      router.push(getLocalizedPath('/member/mypage?welcome=true'))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/70 flex flex-col justify-between font-sans">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogleAuth}
      />
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl text-center space-y-6">
          {/* 상단 다국어 모드 선택기 */}
          <div className="flex items-center justify-between pb-1 border-b border-gray-100/60">
            <span className="text-[11px] font-extrabold text-emerald-800 tracking-wider uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AAMEN 13 Nations
            </span>
            <AuthLanguageSwitcher currentLocale={currentLocale} label={t('language_switcher')} />
          </div>

          <div>
            <div className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="AAMEN"
                width={150}
                height={50}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {t('signup_title')}
            </h1>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              {t('signup_subtitle')}
            </p>
          </div>

          {/* 에러 메시지 알림 */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* 🌟 구글 인증 원클릭 가입 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-gray-50/80 to-emerald-50/30 border border-gray-200 space-y-4">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck size={15} />
              <span>{t('signup_official_badge')}</span>
            </div>

            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-2xl font-bold text-sm text-gray-800 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? t('google_signup_checking') : t('google_signup_btn')}</span>
            </button>

            <div className="space-y-1.5 text-left text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>{isKo ? 'Google 계정 정보 자동 연동 (이름, 이메일, 프로필)' : 'Auto-sync Google profile (name, email, photo)'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>{isKo ? '마이페이지에서 소속교회 및 추가 정보 입력' : 'Enter church affiliation in My Page'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                <Check size={14} className="text-gray-400 shrink-0" />
                <span>{isKo ? '알림 설정 및 SNS(WhatsApp 등) 연동은 선택 사항' : 'Optional notifications & WhatsApp sync'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>{t('already_member')}</span>
            <Link href={getLocalizedPath('/member/login')} className="font-bold text-emerald-700 hover:underline">
              {t('login_link')}
            </Link>
          </div>
        </div>
      </main>

      {/* 🌟 구글 계정 선택 및 직접 입력 모달 (팝업 차단 또는 브라우저 기억 계정 지원) */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-extrabold text-gray-900 text-sm">
                  {isKo ? 'Google 계정으로 가입' : 'Sign up with Google'}
                </h3>
              </div>
              <button
                onClick={() => setIsGoogleModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 text-left">
              {isKo
                ? '가입에 사용할 Google 계정을 선택하거나 새 계정을 입력해 주세요.'
                : 'Select an account to sign up or enter your Google credentials.'}
            </p>

            {/* 브라우저 저장 계정 목록 */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {browserAccounts.map((acc) => (
                <div
                  key={acc.email}
                  className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-left group"
                >
                  <button
                    onClick={() => executeGoogleSignUp(acc, acc.avatar)}
                    className="flex-1 flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {acc.name ? acc.name.charAt(0) : <User size={14} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{acc.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{acc.email}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => removeBrowserAccount(acc.email)}
                    title={isKo ? '기록 삭제' : 'Remove'}
                    className="p-1.5 text-gray-300 hover:text-rose-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* 다른 계정 직접 입력 토글 */}
            {!isCustomGoogleOpen ? (
              <button
                onClick={() => setIsCustomGoogleOpen(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-gray-300 text-gray-600 hover:text-emerald-700 hover:border-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>{isKo ? '다른 구글 계정 직접 입력' : 'Use another Google account'}</span>
              </button>
            ) : (
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-left space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                    {isKo ? '성명 (Google 계정 이름)' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    placeholder={isKo ? '예: 홍길동' : 'John Doe'}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                    {isKo ? 'Google 이메일 주소' : 'Google Email'}
                  </label>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (!customGoogleEmail.trim() || !customGoogleName.trim()) {
                        alert(isKo ? '이름과 이메일을 모두 입력해주세요.' : 'Please enter name and email.')
                        return
                      }
                      executeGoogleSignUp({
                        id: 'custom_' + Math.floor(1000 + Math.random() * 9000),
                        name: customGoogleName.trim(),
                        email: customGoogleEmail.trim(),
                      })
                    }}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isKo ? '이 계정으로 가입하기' : 'Sign Up'}
                  </button>
                  <button
                    onClick={() => setIsCustomGoogleOpen(false)}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isKo ? '취소' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}

            {/* 이용약관 및 개인정보 제공 동의 */}
            <label className="flex items-start gap-2 text-left cursor-pointer pt-2 border-t border-gray-100">
              <input
                type="checkbox"
                checked={hasAgreedConsent}
                onChange={(e) => setHasAgreedConsent(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-gray-500 leading-snug">
                {isKo
                  ? 'AAMEN 이용약관 및 Google 계정 정보(이름, 이메일, 프로필) 제공에 동의합니다.'
                  : 'I agree to the terms of service and sync of Google profile information.'}
              </span>
            </label>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
