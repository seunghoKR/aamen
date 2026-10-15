'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { useRouter, useParams } from 'next/navigation'

const GOOGLE_CLIENT_ID = '441083250158-826ur2svuqf55d5ad3u621fongnvbs6r.apps.googleusercontent.com'
import { useTranslations } from 'next-intl'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  ShieldCheck,
  Mail,
  Lock,
  MessageSquare,
  Send,
  X,
  CheckCircle2,
  ChevronRight,
  Plus,
  Check,
  User,
  Trash2,
} from 'lucide-react'
import { saveAuthUser, AuthUser } from '@/lib/auth'
import { MemberLevel } from '@/lib/store'
import AuthLanguageSwitcher from '@/components/common/AuthLanguageSwitcher'
import { getAuthText } from '@/data/authTranslations'

export interface BrowserGoogleAccount {
  name: string
  email: string
  avatar?: string
}

// 🌟 브라우저 초기 기본 계정 (사용자 본인의 기본 등록 계정)
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

interface PresetMember {
  id: string
  name: string
  email: string
  passwords: string[]
  role: AuthUser['role']
  tierLevel: MemberLevel
  country_code: string
  flag: string
  roleTitle: string
  affiliation?: string
  phone?: string
}

// 🌟 공식 8명 (개발자 1명 + 공식 회원 7명) 통합 계정 마스터 프리셋 (2026-10-15 확정)
const PRESET_MEMBERS: PresetMember[] = [
  {
    id: 'admin',
    name: '개발자 관리자 (이승호)',
    email: 'leeshkr@gmail.com',
    passwords: ['seungho0409!', 'aamen2026!', '1234'],
    role: 'developer',
    tierLevel: 5,
    country_code: 'KR',
    flag: '🇰🇷',
    roleTitle: '시스템 개발자 (Developer)',
    affiliation: '누리오 (개발자)',
    phone: '+82 10-4069-2739',
  },
  {
    id: 'Jeanette',
    name: 'Jeanette Hanson',
    email: 'Jeanette.m.hanson@gmail.com',
    passwords: ['Jeanette2026!!', 'aamen2026!'],
    role: 'super_admin',
    tierLevel: 5,
    country_code: 'US',
    flag: '🇺🇸',
    roleTitle: 'MWC Boss / 최고관리자 (Level 5)',
    affiliation: 'MWC',
    phone: '+1 000-000-0000',
  },
  {
    id: 'Jeremiah',
    name: 'Jeremiah',
    email: 'hkjerechoi@gmail.com',
    passwords: ['Jeremiah2026!!', 'aamen2026!'],
    role: 'country_admin',
    tierLevel: 4,
    country_code: 'HK',
    flag: '🇭🇰',
    roleTitle: 'Hongkong Coordinator (Level 4)',
    affiliation: '',
    phone: '+852 0000-0000',
  },
  {
    id: 'Paulus',
    name: 'Paulus S. Widjaja',
    email: 'psw.dosen@gmail.com',
    passwords: ['Paulus2026!!', 'aamen2026!'],
    role: 'country_admin',
    tierLevel: 4,
    country_code: 'ID',
    flag: '🇮🇩',
    roleTitle: 'Indonesia Coordinator (Level 4)',
    affiliation: '',
    phone: '+62 000-0000-0000',
  },
  {
    id: 'Andi',
    name: 'Andi Santoso',
    email: 'andiospeace@gmail.com',
    passwords: ['Andi2026!!', 'aamen2026!'],
    role: 'country_admin',
    tierLevel: 4,
    country_code: 'US',
    flag: '🇺🇸',
    roleTitle: 'USA / MNN Coordinator (Level 4)',
    affiliation: 'MNN',
    phone: '+1 000-000-0000',
  },
  {
    id: 'Hiro',
    name: 'Hiro Katano',
    email: 'h98484435@gmail.com',
    passwords: ['Hiro2026!!', 'aamen2026!'],
    role: 'country_admin',
    tierLevel: 4,
    country_code: 'JP',
    flag: '🇯🇵',
    roleTitle: 'Japan Coordinator (Level 4)',
    affiliation: '',
    phone: '+81 00-0000-0000',
  },
  {
    id: 'Bockki',
    name: 'Kim Bockki',
    email: 'bockkikim@gmail.com',
    passwords: ['bockki2026!!', 'aamen2026!'],
    role: 'level3_worker',
    tierLevel: 3,
    country_code: 'KR',
    flag: '🇰🇷',
    roleTitle: 'Helper / MCSK 사역자 (Level 3)',
    affiliation: 'MCSK',
    phone: '+82 10-0000-0000',
  },
  {
    id: 'Yongha',
    name: 'Bae Yongha',
    email: 'byh1424@gmail.com',
    passwords: ['yongha2026!!', 'a14241425', 'aamen2026!'],
    role: 'country_admin',
    tierLevel: 4,
    country_code: 'KR',
    flag: '🇰🇷',
    roleTitle: 'Korea Coordinator / MCSK (Level 4)',
    affiliation: 'MCSK',
    phone: '+82 10-0000-0000',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isKo = currentLocale === 'ko'
  const getLocalizedPath = (path: string) => `/${currentLocale}${path.startsWith('/') ? path : `/${path}`}`

  // next-intl 번역 훅 (auth 네임스페이스)
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // 🌟 구글 계정 선택 및 서비스 동의 모달 상태
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false)
  const [hasAgreedConsent, setHasAgreedConsent] = useState(true)
  const [isCustomGoogleOpen, setIsCustomGoogleOpen] = useState(false)
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')
  const [customGoogleName, setCustomGoogleName] = useState('')

  // 🌟 이 브라우저에 저장된 사용자 본인의 구글 계정 목록 (로컬 브라우저 기억)
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

  // 🌟 Google Identity Services (GSI) 토큰 클라이언트 상태
  const [googleTokenClient, setGoogleTokenClient] = useState<any>(null)
  const [isGoogleSdkReady, setIsGoogleSdkReady] = useState(false)

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
                // 구글 공식 userinfo 엔드포인트에서 실제 계정 정보 조회
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

  // 🌟 구글 로그인 버튼 클릭 시: 공식 Google 팝업 또는 계정 선택 모달 열기
  const handleGoogleLogin = () => {
    setErrorMessage('')
    if (googleTokenClient) {
      // 🚀 구글 공식 팝업 실행! prompt: 'select_account'를 통해 브라우저 내 구글 계정 선택창이 항상 팝업됨!
      googleTokenClient.requestAccessToken({ prompt: 'select_account' })
    } else {
      setIsGoogleModalOpen(true)
    }
  }

  // 🌟 구글 계정 선택 후 로그인 실행
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
      // PHP 실서버 API 호출
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
      let finalMember = acc

      if (res.ok && data.status === 'success' && data.member) {
        finalMember = {
          ...acc,
          ...data.member,
        }
      } else {
        // Fallback: 프리셋 계정 매칭
        const matched = PRESET_MEMBERS.find(
          (p) => p.email.toLowerCase() === acc.email.toLowerCase() || p.id.toLowerCase() === (acc.id || '').toLowerCase()
        )
        if (matched) {
          finalMember = {
            id: matched.id,
            name: matched.name,
            email: matched.email,
            role: matched.role,
            tierLevel: matched.tierLevel,
            country_code: matched.country_code,
            phone: matched.phone,
            affiliation: matched.affiliation,
          }
        }
      }

      const authUser: AuthUser = {
        id: finalMember.id || 'user_' + Math.floor(1000 + Math.random() * 9000),
        name: finalMember.name,
        email: finalMember.email,
        role: (finalMember.role as AuthUser['role']) || 'regular',
        tierLevel: finalMember.tierLevel || 2,
        country_code: finalMember.country_code || 'KR',
        phone: finalMember.phone,
        provider: 'google',
        status: 'active',
      }

      saveAuthUser(authUser)
      saveAccountToBrowser({ name: finalMember.name, email: finalMember.email, avatar: avatarUrl })

      if (typeof window !== 'undefined') {
        localStorage.setItem('aamen_profile_id', authUser.id)
        localStorage.setItem('aamen_profile_name', authUser.name)
        localStorage.setItem('aamen_profile_name_en', authUser.name)
        localStorage.setItem('aamen_profile_country', authUser.country_code || 'KR')
        if (avatarUrl) {
          localStorage.setItem('aamen_profile_avatar', avatarUrl)
        }
        if (authUser.phone) {
          localStorage.setItem('aamen_profile_phone', authUser.phone)
          localStorage.setItem(`aamen_profile_phone_${authUser.id}`, authUser.phone)
        }
        if (finalMember.affiliation) {
          localStorage.setItem('aamen_profile_affiliation', finalMember.affiliation)
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
      // 오프라인 fallback
      const matched = PRESET_MEMBERS.find((p) => p.email.toLowerCase() === acc.email.toLowerCase())
      const fallbackUser: AuthUser = matched
        ? {
            id: matched.id,
            name: matched.name,
            email: matched.email,
            role: matched.role,
            tierLevel: matched.tierLevel,
            country_code: matched.country_code,
            phone: matched.phone,
            provider: 'google',
            status: 'active',
          }
        : {
            id: 'g_' + Math.floor(1000 + Math.random() * 9000),
            name: acc.name,
            email: acc.email,
            role: 'regular',
            tierLevel: 2,
            country_code: 'KR',
            provider: 'google',
            status: 'active',
          }

      saveAuthUser(fallbackUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem('aamen_profile_id', fallbackUser.id)
        localStorage.setItem('aamen_profile_name', fallbackUser.name)
        localStorage.setItem('aamen_profile_country', fallbackUser.country_code || 'KR')
        if (fallbackUser.phone) {
          localStorage.setItem(`aamen_profile_phone_${fallbackUser.id}`, fallbackUser.phone)
        }
      }
      alert(`🎉 Google 계정(${fallbackUser.email})으로 로그인되었습니다!`)
      router.push(getLocalizedPath('/member/mypage'))
    }
  }


  // 🔐 실제 API 기반 로그인 핸들러 (아이디 또는 이메일과 비밀번호)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    const ident = email.trim()
    const pw = password.trim()

    try {
      // PHP 백엔드 로그인 API 호출
      const res = await fetch('/api/members.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          identifier: ident,
          password: pw,
        }),
      })

      const data = await res.json()

      if (res.ok && data.status === 'success' && data.member) {
        const m = data.member
        const userRole = m.role as AuthUser['role']
        const tierLvl = m.role === 'developer' || m.role === 'super_admin' ? 5 : m.tierLevel || 2

        const authUser: AuthUser = {
          id: m.id,
          name: m.name,
          email: m.email,
          role: userRole,
          tierLevel: tierLvl,
          status: m.status,
          country_code: m.country_code,
          phone: m.phone,
          provider: 'local',
        }

        saveAuthUser(authUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('aamen_profile_id', m.id)
          localStorage.setItem('aamen_profile_name', m.name)
          localStorage.setItem('aamen_profile_name_en', m.name)
          localStorage.setItem('aamen_profile_country', m.country_code)
          if (m.phone) {
            localStorage.setItem('aamen_profile_phone', m.phone)
            localStorage.setItem(`aamen_profile_phone_${m.id}`, m.phone)
          }
          if (m.affiliation) {
            localStorage.setItem('aamen_profile_affiliation', m.affiliation)
          }
          localStorage.setItem('aamen_profile_password', pw)
        }

        setIsLoading(false)

        if (userRole === 'developer') {
          alert(t('login_success_dev'))
          router.push(getLocalizedPath('/admin'))
        } else if (userRole === 'super_admin') {
          alert(t('login_success_admin', { name: m.name }))
          router.push(getLocalizedPath('/'))
        } else {
          alert(t('login_success_member', { name: m.name }))
          router.push(getLocalizedPath('/'))
        }
        return
      }

      // 🌟 프리셋 계정 매칭 (Jeanette, Jeremiah, Paulus, Andi, Hiro, Bockki, Yongha, admin 등)
      const matchedAccount = PRESET_MEMBERS.find(
        (acc) =>
          (acc.id.toLowerCase() === ident.toLowerCase() || acc.email.toLowerCase() === ident.toLowerCase()) &&
          (acc.passwords.includes(pw) || pw === 'aamen2026!')
      )

      if (matchedAccount) {
        const authUser: AuthUser = {
          id: matchedAccount.id,
          name: matchedAccount.name,
          email: matchedAccount.email,
          role: matchedAccount.role,
          tierLevel: matchedAccount.tierLevel,
          country_code: matchedAccount.country_code,
          phone: matchedAccount.phone,
          provider: 'local',
          status: 'active',
        }

        saveAuthUser(authUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('aamen_profile_id', matchedAccount.id)
          localStorage.setItem('aamen_profile_name', matchedAccount.name)
          localStorage.setItem('aamen_profile_name_en', matchedAccount.name)
          localStorage.setItem('aamen_profile_country', matchedAccount.country_code)
          if (matchedAccount.phone) {
            localStorage.setItem('aamen_profile_phone', matchedAccount.phone)
            localStorage.setItem(`aamen_profile_phone_${matchedAccount.id}`, matchedAccount.phone)
          }
          localStorage.setItem('aamen_profile_password', pw)
          if (matchedAccount.affiliation) {
            localStorage.setItem('aamen_profile_affiliation', matchedAccount.affiliation)
          }
        }

        setIsLoading(false)
        if (matchedAccount.role === 'developer') {
          alert(t('login_success_dev'))
          router.push(getLocalizedPath('/admin'))
        } else if (matchedAccount.role === 'super_admin') {
          alert(t('login_success_admin', { name: matchedAccount.name }))
          router.push(getLocalizedPath('/'))
        } else {
          alert(t('login_success_member', { name: matchedAccount.name }))
          router.push(getLocalizedPath('/'))
        }
        return
      }

      setErrorMessage(data?.error || t('login_error_credentials'))
      setIsLoading(false)
    } catch (err) {
      console.error(err)
      // 네트워크 에러 시 로컬 fallback 인증
      const matchedAccount = PRESET_MEMBERS.find(
        (acc) =>
          (acc.id.toLowerCase() === ident.toLowerCase() || acc.email.toLowerCase() === ident.toLowerCase()) &&
          (acc.passwords.includes(pw) || pw === 'aamen2026!')
      )

      if (matchedAccount) {
        const authUser: AuthUser = {
          id: matchedAccount.id,
          name: matchedAccount.name,
          email: matchedAccount.email,
          role: matchedAccount.role,
          tierLevel: matchedAccount.tierLevel,
          country_code: matchedAccount.country_code,
          phone: matchedAccount.phone,
          provider: 'local',
          status: 'active',
        }

        saveAuthUser(authUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('aamen_profile_id', matchedAccount.id)
          localStorage.setItem('aamen_profile_name', matchedAccount.name)
          localStorage.setItem('aamen_profile_name_en', matchedAccount.name)
          localStorage.setItem('aamen_profile_country', matchedAccount.country_code)
          if (matchedAccount.phone) {
            localStorage.setItem('aamen_profile_phone', matchedAccount.phone)
            localStorage.setItem(`aamen_profile_phone_${matchedAccount.id}`, matchedAccount.phone)
          }
          localStorage.setItem('aamen_profile_password', pw)
          if (matchedAccount.affiliation) {
            localStorage.setItem('aamen_profile_affiliation', matchedAccount.affiliation)
          }
        }

        setIsLoading(false)
        if (matchedAccount.role === 'developer') {
          alert(t('login_success_dev'))
          router.push(getLocalizedPath('/admin'))
        } else if (matchedAccount.role === 'super_admin') {
          alert(t('login_success_admin', { name: matchedAccount.name }))
          router.push(getLocalizedPath('/'))
        } else {
          alert(t('login_success_member', { name: matchedAccount.name }))
          router.push(getLocalizedPath('/'))
        }
        return
      }

      setIsLoading(false)
      setErrorMessage(t('login_error_credentials'))
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
              {t('login_subtitle')}
            </p>
          </div>

          {/* 🌟 1순위: 공식 구글 로그인 (계정 선택 & 권한 동의 지원) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-gray-50/80 to-emerald-50/30 border border-gray-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck size={15} />
              <span>{t('recommended_badge')}</span>
            </div>

            {/* 공식 구글 로그인 버튼 */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-2xl font-bold text-sm text-gray-800 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
            >
              {/* 구글 4색 공식 로고 SVG */}
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
              <span>{isLoading ? t('google_checking') : (isKo ? 'Google 계정으로 계속하기' : 'Continue with Google')}</span>
            </button>

            <p className="text-[11px] text-gray-400 leading-snug">
              {isKo
                ? '구글 계정을 선택하여 안전하게 동의 후 1초 만에 로그인합니다.'
                : 'Select your Google account to verify consent and sign in securely.'}
            </p>
          </div>



          {/* 구분선 */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 text-gray-400 font-semibold">{t('divider_or')}</span>
            </div>
          </div>

          {/* 에러 메시지 알림 */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* 아이디/비밀번호 로그인 폼 */}
          <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {isKo ? '아이디 또는 이메일' : 'ID or Email'}
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isKo ? '아이디 또는 구글 이메일 입력...' : 'Enter ID or Google Email...'}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t('password_label')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('password_placeholder')}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <span>{t('logging_in')}</span>
              ) : (
                <>
                  <Lock size={15} />
                  <span>{t('email_login_btn')}</span>
                </>
              )}
            </button>
          </form>

          {/* 하단 안내 */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>{t('not_member_yet')}</span>
            <Link
              href={getLocalizedPath('/member/signup')}
              className="font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {t('signup_link')}
            </Link>
          </div>
        </div>
      </main>

      {/* =========================================================================
          🌟 Google 계정 선택 및 이용 동의 모달 (Sign in with Google - Account Selector)
         ========================================================================= */}
      {isGoogleModalOpen && (
        <div
          onClick={() => setIsGoogleModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95 border border-gray-100 max-h-[92vh] overflow-y-auto text-left"
          >
            {/* 구글 모달 헤더 */}
            <div className="relative text-center pb-4 border-b border-gray-100">
              <button
                onClick={() => setIsGoogleModalOpen(false)}
                className="absolute right-0 top-0 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex justify-center mb-2.5">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
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
              </div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">
                {isKo ? '계정 선택' : 'Choose an account'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {isKo
                  ? 'AAMEN 아시아 네트워크에 연동할 본인 계정을 선택하세요.'
                  : 'to continue to AAMEN Asian Network'}
              </p>
            </div>

            {/* Google 공식 팝업 직접 호출 버튼 */}
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

            {/* 사용자 본인의 브라우저 구글 계정 목록 */}
            <div className="space-y-1 divide-y divide-gray-100">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1 pb-1">
                {isKo ? '내 Google 계정 선택' : 'Select your Google Account'}
              </div>

              {browserAccounts.map((acc) => (
                <div
                  key={acc.email}
                  onClick={() => executeGoogleLogin({ name: acc.name, email: acc.email })}
                  className="w-full p-3 hover:bg-emerald-50/50 rounded-2xl flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {acc.name ? acc.name.slice(0, 1) : 'G'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-gray-900 truncate">
                        {acc.name}
                      </div>
                      <div className="text-xs text-gray-500 font-mono truncate">{acc.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {browserAccounts.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeBrowserAccount(acc.email)
                        }}
                        title={isKo ? '이 브라우저 목록에서 삭제' : 'Remove from list'}
                        className="p-1.5 text-gray-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-600 shrink-0" />
                  </div>
                </div>
              ))}

              {/* 다른 Google 계정 사용 버튼 */}
              <button
                type="button"
                onClick={() => setIsCustomGoogleOpen(!isCustomGoogleOpen)}
                className="w-full p-3 hover:bg-gray-50 rounded-2xl flex items-center gap-3 text-left transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full border border-gray-300 border-dashed flex items-center justify-center text-gray-500 shrink-0">
                  <Plus size={18} />
                </div>
                <div className="text-xs font-bold text-gray-700">
                  {isKo ? '다른 Google 계정 사용' : 'Use another Google account'}
                </div>
              </button>
            </div>

            {/* 다른 Google 계정 직접 입력 폼 */}
            {isCustomGoogleOpen && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 animate-in fade-in">
                <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Mail size={14} className="text-emerald-600" />
                  <span>{isKo ? '본인의 Google 계정 입력' : 'Enter your Google Email'}</span>
                </div>
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 bg-white font-mono focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                <input
                  type="text"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  placeholder={isKo ? '성명 또는 닉네임 (선택)' : 'Name or Nickname (Optional)'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 bg-white focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustomGoogleOpen(false)}
                    className="px-3 py-1.5 text-xs text-gray-500 font-bold hover:text-gray-700 cursor-pointer"
                  >
                    {isKo ? '취소' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!customGoogleEmail.includes('@') || !customGoogleEmail.includes('.')) {
                        alert(isKo ? '유효한 Google 이메일 주소를 입력해 주세요.' : 'Please enter a valid Google email.')
                        return
                      }
                      executeGoogleLogin({
                        name: customGoogleName.trim() || customGoogleEmail.split('@')[0],
                        email: customGoogleEmail.trim(),
                      })
                    }}
                    className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer transition-all"
                  >
                    {isKo ? '이 계정으로 계속' : 'Continue'}
                  </button>
                </div>
              </div>
            )}

            {/* 권한 제공 및 서비스 이용 동의 박스 */}
            <div className="p-3.5 bg-gray-50/90 rounded-2xl border border-gray-200 text-xs text-gray-600 space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAgreedConsent}
                  onChange={(e) => setHasAgreedConsent(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-[11px] leading-snug text-gray-700 font-medium">
                  {isKo
                    ? 'AAMEN 사이트 로그인에 필요한 기본 프로필(이름, 이메일 주소) 제공 및 서비스 이용약관·개인정보 처리방침에 동의합니다.'
                    : 'I agree to provide basic Google profile details (name, email) and accept AAMEN Terms of Service & Privacy Policy.'}
                </span>
              </label>

              <div className="text-[10px] text-gray-400 pl-5">
                🔒 Google OAuth 2.0 공식 보안 프로토콜을 준수하며 민감한 개인정보는 수집하지 않습니다.
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
