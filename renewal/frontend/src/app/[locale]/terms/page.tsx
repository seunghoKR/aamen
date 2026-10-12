'use client'

import React from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FileText, Shield, CheckCircle2, ChevronRight, Globe, ArrowLeft } from 'lucide-react'
import { useLocale } from 'next-intl'

export default function TermsPage() {
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
            <Shield size={14} />
            <span>AAMEN 서비스 이용약관</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            이용약관 (Terms of Service)
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed max-w-2xl">
            아시아 아나밥티스트 메노나이트 교육 네트워크(AAMEN)의 다국어 플랫폼과 교육 자료, 중보기도 커뮤니티 서비스를 이용해 주시는 모든 성도님들을 환영합니다.
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
              <span>(목적)</span>
            </h2>
            <p className="text-gray-600">
              본 약관은 <strong>아시아 아나밥티스트 메노나이트 교육 네트워크(AAMEN)</strong>(이하 "네트워크")가 제공하는 웹사이트, 13개국 다국어 교육 교안 자료실, 기도의 벽(Prayer Wall), 알림 서비스(PWA 웹푸시, WhatsApp, Telegram) 및 제반 커뮤니티 서비스(이하 "서비스")의 이용조건 및 절차, 회원과 네트워크 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제2조</span>
              <span>(용어의 정의)</span>
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600 pl-1">
              <li><strong>"서비스"</strong>란 네트워크가 PC, 모바일 등 단말기에 구애받지 않고 아시아 13개국 회원들에게 제공하는 교육, 예배, 교제, 중보기도 및 알림 기능을 의미합니다.</li>
              <li><strong>"회원"</strong>이란 본 약관에 동의하고 Google 계정 또는 아이디/비밀번호를 통해 가입하여 네트워크가 승인한 성도 및 사역자를 말합니다.</li>
              <li><strong>"등급"</strong>이란 회원의 역할 및 검증 수준에 따라 부여되는 단계(0단계 손님, 1단계 준회원, 2단계 정회원, 3단계 사역자, 4단계 국가 코디네이터, 5단계 총괄 관리자)를 의미합니다.</li>
              <li><strong>"콘텐츠"</strong>란 네트워크 내에 게시된 MWC 7대 신념 교안, 나눔글, 중보기도 제목, 사진 앨범 및 번역 자료를 말합니다.</li>
            </ul>
          </section>

          {/* 제3조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제3조</span>
              <span>(회원가입 및 계정 관리)</span>
            </h2>
            <p className="text-gray-600">
              1. 회원가입은 이용자가 본 약관 및 개인정보처리방침에 동의한 후 Google 계정 원클릭 인증 또는 기본 가입 양식을 작성하여 신청합니다.<br />
              2. 회원은 본인의 Google 계정 및 비밀번호를 안전하게 관리할 책임이 있으며, 타인에게 양도하거나 대여할 수 없습니다.<br />
              3. 네트워크는 회원이 등록한 정보가 허위이거나 타인의 명의를 도용한 경우 회원 자격을 제한하거나 박탈할 수 있습니다.
            </p>
          </section>

          {/* 제4조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제4조</span>
              <span>(자료실 및 교육 콘텐츠의 비영리 이용)</span>
            </h2>
            <p className="text-gray-600">
              1. 네트워크가 제공하는 7대 공유된 신념 교안, 주일학교 커리큘럼, 평화 교육 자료는 <strong>그리스도의 복음과 평화, 제자도 사역을 위한 비영리 목적</strong>으로 자유롭게 열람, 인쇄, 교회 교육에 활용하실 수 있습니다.<br />
              2. 본 사이트의 모든 교육 자료를 상업적 목적으로 무단 재판매하거나 유료 출판물에 도용하는 행위는 엄격히 금지됩니다.
            </p>
          </section>

          {/* 제5조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제5조</span>
              <span>(중보기도와 커뮤니티 예절)</span>
            </h2>
            <p className="text-gray-600">
              1. AAMEN은 아시아 13개국의 언어와 문화가 공존하는 평화의 신앙 공동체입니다. 모든 회원은 타 국가 지체를 그리스도의 사랑으로 존중해야 합니다.<br />
              2. 비방, 분쟁 유발, 정치적 선동, 상업적 광고, 음해성 글은 관리자에 의해 사전 통보 없이 삭제될 수 있으며 활동이 제한될 수 있습니다.<br />
              3. 민감한 사역지의 기도제목은 현지 사역자의 안전을 고려하여 외부로 무단 유출하지 않습니다.
            </p>
          </section>

          {/* 제6조 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="text-emerald-600 font-mono">제6조</span>
              <span>(면책 조항)</span>
            </h2>
            <p className="text-gray-600">
              1. 천재지변, 전시, 각국 통신망 장애 또는 기술적 불가항력으로 인해 일시적으로 서비스가 중단될 경우 네트워크는 책임을 지지 않습니다.<br />
              2. 회원이 자발적으로 게시판에 공개한 개인 연락처로 인해 발생하는 사적 분쟁에 대해서는 회원이 책임을 부담합니다.
            </p>
          </section>

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
              href={getLocalizedPath('/privacy')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>개인정보처리방침 보기</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
