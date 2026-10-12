'use client'

import React from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Lock, ShieldCheck, CheckCircle2, ChevronRight, ArrowLeft, Mail } from 'lucide-react'
import { useLocale } from 'next-intl'

export default function PrivacyPage() {
  const locale = useLocale()
  const currentLocale = locale || 'ko'
  const getLocalizedPath = (path: string) => `/${currentLocale}${path.startsWith('/') ? path : `/${path}`}`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased">
      <Header />

      {/* 상단 배너 */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold mb-4 border border-white/10">
            <ShieldCheck size={14} />
            <span>AAMEN 개인정보 보호 원칙</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            개인정보처리방침 (Privacy Policy)
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-2xl">
            AAMEN은 아시아 13개국 성도님들의 개인정보와 안전을 최우선으로 생각하며, 관련 법령 및 국제 프라이버시 기준을 엄격히 준수합니다.
          </p>
        </div>
      </div>

      {/* 본문 컨테이너 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 mb-20 w-full flex-1">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-sm border border-gray-200/80 space-y-8 text-gray-800 text-xs sm:text-sm leading-relaxed">
          {/* 시행일 안내 */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950">공고일자: 2025년 1월 1일</span>
            <span className="font-bold text-emerald-700">시행일자: 2025년 1월 1일 (최신 개정)</span>
          </div>

          {/* 제1조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제1조</span>
              <span>(개인정보의 처리 목적)</span>
            </h2>
            <p className="text-gray-600">
              <strong>아시아 아나밥티스트 메노나이트 교육 네트워크(AAMEN)</strong>는 다음의 목적을 위하여 최소한의 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 절대 사용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 사전 동의를 받습니다.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 pl-1">
              <li>회원 식별, 본인 확인 및 등급별 권한 관리</li>
              <li>13개국 중보기도 참여 및 교육자료 원본 다운로드 권한 부여</li>
              <li>회원이 요청한 알림 수신 (웹앱 푸시, 텔레그램 봇, WhatsApp 메신저 소통)</li>
              <li>비영리 사역 네트워크 공지 및 긴급 기도제목 전달</li>
            </ul>
          </section>

          {/* 제2조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제2조</span>
              <span>(처리하는 개인정보의 항목)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="font-bold text-emerald-900 text-xs block mb-1">필수 수집 항목</span>
                <p className="text-[11px] text-gray-600">
                  성명(실명 또는 닉네임), 이메일 주소(Google 계정 식별자), 소속 국가 코드
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="font-bold text-gray-700 text-xs block mb-1">선택 수집 항목 (알림 및 교제용)</span>
                <p className="text-[11px] text-gray-600">
                  소속 교회/사역 단체명, 연락처, WhatsApp 전화번호, Telegram Chat ID
                </p>
              </div>
            </div>
          </section>

          {/* 제3조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제3조</span>
              <span>(개인정보의 보유 및 파기)</span>
            </h2>
            <p className="text-gray-600">
              1. 네트워크는 원칙적으로 회원이 회원 탈퇴를 요청하거나 자격을 상실할 때까지 개인정보를 보유 및 이용합니다.<br />
              2. 회원이 탈퇴를 요청한 경우, 네트워크는 지체 없이 해당 개인정보를 재생 불가능한 방법으로 파기합니다.
            </p>
          </section>

          {/* 제4조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제4조</span>
              <span>(개인정보의 제3자 제공 및 영리 목적 이용 금지)</span>
            </h2>
            <p className="text-gray-600">
              AAMEN은 회원의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, <strong>영리 목적, 광고 마케팅, 기업 대상 판매 등 어떠한 목적으로도 제3자에게 제공하거나 판매하지 않습니다.</strong>
            </p>
          </section>

          {/* 제5조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제5조</span>
              <span>(정보주체의 권리 및 행사방법)</span>
            </h2>
            <p className="text-gray-600">
              회원은 언제든지 <strong>마이페이지(My Page)</strong>를 통해 자신의 개인정보를 열람, 정정하거나 알림 수신(푸시, 텔레그램, WhatsApp)을 직접 On/Off 하실 수 있습니다. 또한 계정 연동 해제 및 데이터 삭제를 요청하실 수 있습니다.
            </p>
          </section>

          {/* 제6조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제6조</span>
              <span>(보안 및 암호화 대책)</span>
            </h2>
            <p className="text-gray-600">
              네트워크는 개인정보의 도난, 유출, 위조를 방지하기 위해 SSL/HTTPS 보안 프로토콜을 적용하고 있으며, Google OAuth 2.0 표준 보안 인증 체계를 준용하여 회원 정보를 철저히 암호화하여 보호합니다.
            </p>
          </section>

          {/* 문의처 안내 */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-emerald-600" />
              <span className="text-gray-700">개인정보 보호 관련 문의 및 건의사항:</span>
              <span className="font-mono font-bold text-gray-900">contact@aamen.net</span>
            </div>
            <span className="text-[11px] text-gray-400">AAMEN 글로벌 운영위원회</span>
          </div>

          {/* 하단 링크 안내 */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href={getLocalizedPath('/')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>홈으로 돌아가기</span>
            </Link>

            <Link
              href={getLocalizedPath('/terms')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>이용약관 보기</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
