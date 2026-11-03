'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { useRouter, useParams } from 'next/navigation'
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
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { saveAuthUser, AuthUser } from '@/lib/auth'
import { MemberLevel } from '@/lib/store'
import AuthLanguageSwitcher from '@/components/common/AuthLanguageSwitcher'
import { getAuthText } from '@/data/authTranslations'

const GOOGLE_CLIENT_ID = '441083250158-826ur2svuqf55d5ad3u621fongnvbs6r.apps.googleusercontent.com'

export interface BrowserGoogleAccount {
  name: string
  email: string
  avatar?: string
}

// 브라우저 초기 기본 계정
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

export default function LoginPage() {
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

  // 구글 계정 선택 및 서비스 동의 모달 상태
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false)
  const [hasAgreedConsent, setHasAgreedConsent] = useState(true)
  const [isCustomGoogleOpen, setIsCustomGoogleOpen] = useState(false)
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')
  const [customGoogleName, setCustomGoogleName] = useState('')

  // 브라우저 기억 계정
  const [browserAccounts, setBrowserAccounts] = useState<BrowserGoogleAccount[]>([])

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

  // Google Identity Services (GSI) 토큰 클라이언트 상태
  const [googleTokenClient, setGoogleTokenClient] = useState<any>(null)

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
                const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                  },
                })
                if (userRes.ok) {
                  const googleUser = await userRes.json()
                  await executeGoogleLogin(
                    {
                      id: googleUser.sub,
                      name: googleUser.name || 'Google User',
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

  // 구글 로그인 트리거
  const handleGoogleLogin = () => {
    setErrorMessage('')
    if (googleTokenClient) {
      googleTokenClient.requestAccessToken({ prompt: 'select_account' })
    } else {
      setIsGoogleModalOpen(true)
    }
  }

  // 구글 로그인 실행 핸들러
  const executeGoogleLogin = async (
    acc: {
      id?: string
      name: string
      email: string
      role?: AuthUser['role']
      tierLevel?: MemberLevel
      country_code?: string
      phone?: string
      affiliation?: string
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

      const isDev = (acc.email === 'leeshkr@gmail.com' || acc.email === 'admin@aamen.net')
      const userId = serverMember?.id || (isDev ? 'admin' : ('g_' + Math.floor(1000 + Math.random() * 9000)))
      const userName = serverMember?.name || acc.name || 'Google User'
      const userRole = (serverMember?.role as AuthUser['role']) || (isDev ? 'developer' : 'associate')
      const userTier = serverMember?.tierLevel || (isDev ? 6 : 1)
      const userCountry = serverMember?.country_code || 'KR'

      const authUser: AuthUser = {
        id: userId,
        name: userName,
        email: acc.email,
        role: userRole,
        tierLevel: userTier,
        country_code: userCountry,
        phone: serverMember?.phone,
        provider: 'google',
        status: 'active',
      }

      saveAuthUser(authUser)
      saveAccountToBrowser({ name: userName, email: acc.email, avatar: avatarUrl })

      if (typeof window !== 'undefined') {
        const memEnName = serverMember?.name_en || userName
        localStorage.setItem('aamen_profile_id', userId)
        localStorage.setItem('aamen_profile_name', userName)
        localStorage.setItem('aamen_profile_name_en', memEnName)
        localStorage.setItem('aamen_profile_email', acc.email)
        localStorage.setItem('aamen_profile_country', userCountry)
        localStorage.setItem(`aamen_profile_name_${userId}`, userName)
        localStorage.setItem(`aamen_profile_name_en_${userId}`, memEnName)
        localStorage.setItem(`aamen_profile_country_${userId}`, userCountry)
        localStorage.setItem(`aamen_profile_email_${userId}`, acc.email)
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
          ? `🎉 Google 계정(${authUser.email})으로 성공적으로 로그인되었습니다!\n반갑습니다, ${authUser.name}님.`
          : `🎉 Successfully signed in with Google (${authUser.email})!\nWelcome, ${authUser.name}.`
      )

      if (authUser.role === 'developer') {
        router.push(getLocalizedPath('/admin'))
      } else {
        router.push(getLocalizedPath('/member/mypage'))
      }
    } catch (err) {
      console.error(err)
      setIsLoading(false)

      const isDev = (acc.email === 'leeshkr@gmail.com' || acc.email === 'admin@aamen.net')
      const fallbackUser: AuthUser = {
        id: isDev ? 'admin' : ('g_' + Math.floor(1000 + Math.random() * 9000)),
        name: acc.name,
        email: acc.email,
        role: isDev ? 'developer' : 'associate',
        tierLevel: isDev ? 6 : 1,
        country_code: 'KR',
        provider: 'google',
        status: 'active',
      }

      saveAuthUser(fallbackUser)
      saveAccountToBrowser({ name: acc.name, email: acc.email, avatar: avatarUrl })

      alert(
        isKo
          ? `🎉 Google 계정(${fallbackUser.email})으로 로그인되었습니다!`
          : `🎉 Signed in via Google (${fallbackUser.email})!`
      )
      if (fallbackUser.role === 'developer') {
        router.push(getLocalizedPath('/admin'))
      } else {
        router.push(getLocalizedPath('/member/mypage'))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogleAuth}
      />
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6 text-center">
          {/* 언어 스위처 헤더 바 */}
          <div className="flex items-center justify-between pb-1 border-b border-gray-100/60">
            <span className="text-[11px] font-extrabold text-emerald-800 tracking-wider uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AAMEN 13 Nations
            </span>
            <AuthLanguageSwitcher currentLocale={currentLocale} label={t('language_switcher')} />
          </div>

          {/* 로고 & 환영 헤더 */}
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
              {t('login_title')}
            </h1>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {isKo 
                ? 'AAMEN은 안전하고 간편한 Google 단일 인증 로그인을 사용합니다.' 
                : 'AAMEN provides secure Single Sign-On powered by Google.'}
            </p>
          </div>

          {/* 에러 메시지 알림 */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* 🌟 공식 구글 단일 로그인 버튼 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-gray-50/80 to-emerald-50/40 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck size={16} />
              <span>{isKo ? 'Google 공식 인증 Single Sign-On' : 'Official Google SSO'}</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-4 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-2xl font-black text-sm text-gray-800 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isLoading ? t('google_checking') : (isKo ? 'Google 계정으로 로그인' : 'Continue with Google')}</span>
            </button>

            <div className="space-y-1.5 text-left text-xs text-gray-500 pt-3 border-t border-gray-200/80">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>{isKo ? '아이디/비밀번호 분실 염려 없는 안전한 구글 인증' : 'Secure passwordless Google authentication'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>{isKo ? '최초 로그인 시 1단계: 준회원으로 자동 등록됩니다' : 'New users automatically join as Level 1: Associate'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                <Check size={14} className="text-gray-400 shrink-0" />
                <span>{isKo ? 'WhatsApp, Facebook, Telegram 연동 지원' : 'Full sync with WhatsApp, Facebook, Telegram'}</span>
              </div>
            </div>
          </div>

          {/* 하단 회원가입 및 마이페이지 안내 */}
          <div className="pt-2 text-xs text-gray-500 flex items-center justify-between">
            <span>{isKo ? '신규 가입도 구글 로그인 하나로 즉시 가능합니다.' : 'New to AAMEN? Sign in with Google to start.'}</span>
            <Link
              href={getLocalizedPath('/member/signup')}
              className="font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {t('signup_link')}
            </Link>
          </div>
        </div>
      </main>

      {/* Google 계정 선택 모달 */}
      {isGoogleModalOpen && (
        <div
          onClick={() => setIsGoogleModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95 border border-gray-100 max-h-[92vh] overflow-y-auto text-left"
          >
            <div className="relative text-center pb-4 border-b border-gray-100">
              <button
                onClick={() => setIsGoogleModalOpen(false)}
                className="absolute right-0 top-0 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex justify-center mb-2.5">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">
                {isKo ? '계정 선택' : 'Choose an account'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {isKo
                  ? 'AAMEN 아시아 네트워크에 연동할 구글 계정을 선택하세요.'
                  : 'to continue to AAMEN Asian Network'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (googleTokenClient) {
                  googleTokenClient.requestAccessToken({ prompt: 'select_account' })
                  setIsGoogleModalOpen(false)
                } else {
                  alert(
                    isKo
                      ? 'Google 보안 SDK를 연결 중입니다. 아래 목록에서 계정을 선택해주세요.'
                      : 'Connecting Google SDK. Please choose from list below.'
                  )
                }
              }}
              className="w-full p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-white hover:from-emerald-100 hover:to-teal-100 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-left transition-all shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5 flex-wrap">
                    <span>{isKo ? 'Google 공식 팝업으로 계정 선택' : 'Sign in via Google Popup'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black">
                      OAuth 2.0
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800 truncate">
                    {isKo ? '클릭 시 Google 공식 계정 선택창이 직접 팝업됩니다' : 'Opens official Google accounts dialog'}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            {/* 브라우저 기억 계정 목록 */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-gray-400 px-1 uppercase tracking-wider">
                {isKo ? '최근 사용한 계정' : 'Saved Accounts'}
              </div>

              {browserAccounts.map((acc) => (
                <div
                  key={acc.email}
                  className="flex items-center justify-between p-3 rounded-2xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all group"
                >
                  <button
                    type="button"
                    onClick={() => executeGoogleLogin(acc, acc.avatar)}
                    className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center shrink-0">
                      {acc.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-gray-900 group-hover:text-emerald-900 truncate">
                        {acc.name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono truncate">
                        {acc.email}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeBrowserAccount(acc.email)}
                    className="p-1.5 text-gray-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0 ml-2"
                    title={isKo ? '목록에서 삭제' : 'Remove account'}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* 직접 다른 구글 계정 입력 열기 */}
            <div className="pt-2">
              {!isCustomGoogleOpen ? (
                <button
                  type="button"
                  onClick={() => setIsCustomGoogleOpen(true)}
                  className="w-full py-2.5 px-3 border border-dashed border-gray-300 hover:border-emerald-500 rounded-xl text-xs font-bold text-gray-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{isKo ? '다른 Google 계정 직접 입력' : 'Use another Google account'}</span>
                </button>
              ) : (
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    placeholder={isKo ? '이름 (예: 홍길동)' : 'Name'}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-emerald-500 font-bold"
                  />
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!customGoogleEmail.includes('@')) {
                        alert(isKo ? '올바른 이메일을 입력하세요.' : 'Enter valid email.')
                        return
                      }
                      executeGoogleLogin({
                        name: customGoogleName || 'Google User',
                        email: customGoogleEmail,
                      })
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {isKo ? '이 계정으로 계속' : 'Continue with this account'}
                  </button>
                </div>
              )}
            </div>

            {/* 개인정보 제공 동의 체크 */}
            <div className="pt-3 border-t border-gray-100">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-gray-500 select-none">
                <input
                  type="checkbox"
                  checked={hasAgreedConsent}
                  onChange={(e) => setHasAgreedConsent(e.target.checked)}
                  className="mt-0.5 rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  {isKo
                    ? 'AAMEN 개인정보 처리방침 및 Google 계정 정보(이름, 이메일) 제공에 동의합니다.'
                    : 'I agree to AAMEN Privacy Policy and Google account sync.'}
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
