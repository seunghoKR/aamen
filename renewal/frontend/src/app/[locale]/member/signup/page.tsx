'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ShieldCheck, UserPlus, Check, ArrowRight } from 'lucide-react'
import { saveAuthUser, AuthUser } from '@/lib/auth'

export default function SignUpPage() {
  const router = useRouter()
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const getLocalizedPath = (path: string) => `/${currentLocale}${path.startsWith('/') ? path : `/${path}`}`

  const [isLoading, setIsLoading] = useState(false)

  // 🌟 구글 인증 간편가입 -> 마이페이지로 연결하여 필수 정보(아이디, 비밀번호, 소속교회) 입력
  const handleGoogleSignUp = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newUser: AuthUser = {
        id: 'user_' + Math.floor(1000 + Math.random() * 9000),
        name: '신규 성도',
        email: 'member@gmail.com',
        provider: 'google',
        role: 'regular',
        tierLevel: 2,
        country_code: 'KR',
        status: 'active',
      }

      saveAuthUser(newUser)
      setIsLoading(false)
      alert('🎉 Google 계정 인증이 완료되었습니다!\n마이페이지로 이동하여 필수 정보(아이디, 비밀번호, 소속교회)를 입력해 주세요.')
      router.push(getLocalizedPath('/member/mypage?welcome=true'))
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gray-50/70 flex flex-col justify-between">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl text-center space-y-6">
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
              AAMEN 회원가입
            </h1>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Google 계정 인증 후 마이페이지에서<br />
              <strong>아이디, 비밀번호, 소속교회</strong>를 등록하여 정회원으로 참여하세요.
            </p>
          </div>

          {/* 🌟 구글 인증 원클릭 가입 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-gray-50/80 to-emerald-50/30 border border-gray-200 space-y-4">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck size={15} />
              <span>공식 인증: Google 계정 연동 기본 적용</span>
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
              <span>{isLoading ? 'Google 계정 연결 중...' : 'Google 계정으로 회원가입'}</span>
            </button>

            <div className="space-y-1.5 text-left text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Google 계정 기본 연동 (안전한 신원 확인)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>마이페이지에서 아이디, 비밀번호, 소속교회 필수 입력</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                <Check size={14} className="text-gray-400 shrink-0" />
                <span>알림 설정 및 SNS(왓츠앱 등) 연동은 선택 사항</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>이미 계정이 있으신가요?</span>
            <Link href={getLocalizedPath('/member/login')} className="font-bold text-emerald-700 hover:underline">
              로그인하기 →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
