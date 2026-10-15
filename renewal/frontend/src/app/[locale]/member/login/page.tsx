'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ShieldCheck, Mail, Lock, MessageSquare, Send } from 'lucide-react'
import { saveAuthUser, AuthUser } from '@/lib/auth'
import { MemberLevel } from '@/lib/store'
import AuthLanguageSwitcher from '@/components/common/AuthLanguageSwitcher'
import { getAuthText } from '@/data/authTranslations'

interface PresetMember {
  id: string
  name: string
  email: string
  passwords: string[]
  role: AuthUser['role']
  tierLevel: MemberLevel
  country_code: string
  affiliation?: string
  phone?: string
}

const PRESET_MEMBERS: PresetMember[] = [
  {
    id: 'admin',
    name: '이승호',
    email: 'leeshkr@gmail.com',
    passwords: ['seungho0409!', 'a14241425', 'admin1234', 'aamen2026!', '1234'],
    role: 'developer',
    tierLevel: 5,
    country_code: 'KR',
    affiliation: '누리오 (개발자)',
    phone: '+82 10-4069-2739',
  },
  {
    id: 'gimac',
    name: '배용하',
    email: 'gimac1424@gmail.com',
    passwords: ['a14241425', 'aamen1234', 'aamen2026!'],
    role: 'super_admin',
    tierLevel: 5,
    country_code: 'KR',
    affiliation: 'AAMEN 본부',
    phone: '+82 10-0000-0000',
  },
  {
    id: 'Jeanette',
    name: 'Jeanette Hanson',
    email: 'Jeanette.m.hanson@gmail.com',
    passwords: ['Jeanette2026!!', 'aamen2026!'],
    role: 'super_admin',
    tierLevel: 5,
    country_code: 'US',
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
    country_code: 'ID',
    affiliation: 'MWC / MNN',
    phone: '+62 000-0000-0000',
  },
  {
    id: 'Hiro',
    name: 'Hiro Katano',
    email: 'h98484435@gmail.com',
    passwords: ['Hiro2026!!', 'aamen2026!'],
    role: 'country_admin',
    tierLevel: 4,
    country_code: 'US',
    affiliation: '',
    phone: '+1 000-000-0000',
  },
  {
    id: 'bockki',
    name: 'Kim Bockki',
    email: 'bockkikim@gmail.com',
    passwords: ['bockki2026!!', 'aamen2026!'],
    role: 'level3_worker',
    tierLevel: 3,
    country_code: 'KR',
    affiliation: 'MCSK',
    phone: '+82 10-0000-0000',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
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

  // 🌟 구글 인증 로그인 (인증 후 마이페이지로 연결하여 필수 정보 입력 유도)
  const handleGoogleLogin = (asDeveloper: boolean | React.MouseEvent = false) => {
    setIsLoading(true)
    setErrorMessage('')

    setTimeout(() => {
      const isDev = typeof asDeveloper === 'boolean' ? asDeveloper : false
      const user: AuthUser = isDev
        ? {
            id: 'admin',
            name: '이승호',
            email: 'leeshkr@gmail.com',
            provider: 'google',
            role: 'developer',
            tierLevel: 5,
            country_code: 'KR',
            status: 'active',
          }
        : {
            id: 'user_' + Math.floor(1000 + Math.random() * 9000),
            name: '성도 (구글 인증)',
            email: 'member@gmail.com',
            provider: 'google',
            role: 'regular',
            tierLevel: 2,
            country_code: currentLocale === 'ja' ? 'JP' : currentLocale === 'zh-TW' ? 'TW' : currentLocale === 'th' ? 'TH' : 'KR',
            status: 'active',
          }

      saveAuthUser(user)
      setIsLoading(false)
      if (isDev) {
        alert(t('login_success_dev'))
        router.push(getLocalizedPath('/admin'))
      } else {
        alert(t('google_login_success'))
        router.push(getLocalizedPath('/member/mypage?welcome=true'))
      }
    }, 600)
  }

  // 🌐 아시아 13개국 맞춤형 3대 SNS 간편 로그인 핸들러
  const handleSnsLogin = (provider: 'whatsapp' | 'facebook' | 'telegram') => {
    setIsLoading(true)
    setErrorMessage('')

    setTimeout(() => {
      const providerNames = {
        whatsapp: 'WhatsApp',
        facebook: 'Facebook',
        telegram: 'Telegram',
      }
      const user: AuthUser = {
        id: `${provider}_user_${Date.now()}`,
        name: `${providerNames[provider]} 인증 성도`,
        email: `${provider}@aamen.net`,
        provider: provider,
        role: 'regular',
        tierLevel: 2,
        country_code: provider === 'whatsapp' ? 'ID' : provider === 'facebook' ? 'MM' : 'KR',
        status: 'active',
      }
      saveAuthUser(user)
      setIsLoading(false)
      alert(`🎉 ${providerNames[provider]} ${t('login_success_member', { name: providerNames[provider] })}`)
      router.push(getLocalizedPath('/'))
    }, 600)
  }

  // 🔐 실제 API 기반 로그인 핸들러 (개발자, 총괄관리자, 일반회원)
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
        }

        saveAuthUser(authUser)
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

      // 🌟 등록된 회원 및 관리자 계정 인증 (Jeanette, Jeremiah, Paulus, Andi, Hiro, Bockki 등)
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

      setErrorMessage(data.error || t('login_error_credentials'))
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
      setErrorMessage(t('login_error_network'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/70 flex flex-col justify-between">
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

          {/* 🌟 1순위 기본값: 구글 인증 로그인 카드 */}
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
              <span>{isLoading ? t('google_checking') : t('google_login_btn')}</span>
            </button>

            <p className="text-[11px] text-gray-400 leading-snug">
              {t('google_desc')}
            </p>
          </div>

          {/* 🌐 아시아 13개국 맞춤형 3대 SNS 간편 로그인 */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-gray-500 text-center">
              {t('sns_title')}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => handleSnsLogin('whatsapp')}
                disabled={isLoading}
                className="py-2.5 px-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl font-extrabold text-[11px] text-emerald-800 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <MessageSquare size={13} className="text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleSnsLogin('facebook')}
                disabled={isLoading}
                className="py-2.5 px-1.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-2xl font-extrabold text-[11px] text-blue-800 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <span className="font-black text-blue-600 text-xs">f</span>
                <span>Facebook</span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={() => handleSnsLogin('telegram')}
                disabled={isLoading}
                className="py-2.5 px-1.5 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 rounded-2xl font-extrabold text-[11px] text-sky-800 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <Send size={12} className="text-sky-600" />
                <span>Telegram</span>
              </button>
            </div>
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

          {/* 보조: 이메일 로그인 접이식 버튼 */}
          {!showEmailForm ? (
            <button
              onClick={() => setShowEmailForm(true)}
              className="w-full py-2.5 px-4 text-xs font-bold text-gray-600 hover:text-emerald-700 hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Mail size={14} />
              <span>{t('email_toggle_btn')}</span>
            </button>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t('id_label')}
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('id_placeholder')}
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
          )}

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

      <Footer />
    </div>
  )
}
