'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Users,
  ShieldCheck,
  Mail,
  Bell,
  MessageSquare,
  Sparkles,
  Smartphone,
  Globe,
  Image as ImageIcon,
  Layers,
  Building2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Search,
  Bookmark
} from 'lucide-react'

interface AdminSiteManualProps {
  locale: string
  isDeveloper?: boolean
}

export default function AdminSiteManual({ locale, isDeveloper = false }: AdminSiteManualProps) {
  const isKo = locale === 'ko'
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    members: true,
    messaging: false,
    notifications: false,
    community: false,
    banners: false,
    troubleshooting: false,
  })

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const expandAll = () => {
    setExpandedSections({
      overview: true,
      members: true,
      messaging: true,
      notifications: true,
      community: true,
      banners: true,
      troubleshooting: true,
    })
  }

  const collapseAll = () => {
    setExpandedSections({
      overview: false,
      members: false,
      messaging: false,
      notifications: false,
      community: false,
      banners: false,
      troubleshooting: false,
    })
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-6">
      {/* 매뉴얼 상단 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {isKo ? '📖 AAMEN 사이트 운영 & 관리자 설명서' : '📖 AAMEN Administrator & Site Manual'}
              </h2>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                Official Guide
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {isKo
                ? '15개국 다국어 운영, 회원 승인, 공지 쪽지 발송, 실시간 알림 등 관리자를 위한 핵심 기능 설명서입니다.'
                : 'Complete operational manual for 15-nation multilingual management, member approvals, group announcements, and notifications.'}
            </p>
          </div>
        </div>

        {/* 컨트롤 버튼군 */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            {isKo ? '모두 펼치기' : 'Expand All'}
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            {isKo ? '모두 접기' : 'Collapse All'}
          </button>
        </div>
      </div>

      {/* 🔍 검색창 */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isKo ? '궁금한 기능이나 키워드를 검색하세요 (예: 회원 승인, 쪽지, 푸시, 배너, 코디네이터...)' : 'Search features (e.g. approval, message, push, banner)...'}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 섹션 1: 🌐 플랫폼 구조 & 15개국 다국어 시스템 */}
      {/* ========================================================================= */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => toggleSection('overview')}
          className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Globe size={18} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                {isKo ? '1. 플랫폼 구조 및 15개국 다국어 지원 시스템' : '1. Architecture & 15-Nation Multilingual System'}
              </h3>
              <p className="text-xs text-gray-500">
                {isKo ? '한국어 및 14개국 모국어 자동 감지, 실시간 교안 번역 아키텍처' : 'Automatic language detection, 15 nations, real-time translations'}
              </p>
            </div>
          </div>
          {expandedSections.overview ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>

        {expandedSections.overview && (
          <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>{isKo ? '15개 참여국 및 지원 언어' : '15 Participating Nations'}</span>
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  한국(KR), 미국/영어(US), 일본(JP), 대만(TW), 홍콩(HK), 베트남(VN), 인도네시아(ID), 태국(TH), 미얀마(MM), 인도(IN), 네팔(NP), 캄보디아(KH), 라오스(LA), 몽골(MN), 필리핀(PH).<br />
                  각 국가 회원은 헤더 우측 상단의 <strong>국가/언어 선택기</strong>를 통해 모국어로 즉시 전환할 수 있습니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
                <h4 className="font-bold text-teal-950 flex items-center gap-1.5 mb-2">
                  <Sparkles size={15} className="text-teal-600" />
                  <span>{isKo ? '접속 위치 & 타임존 자동 감지' : 'Auto Location Detection'}</span>
                </h4>
                <p className="text-xs text-teal-900 leading-relaxed">
                  로그인하지 않은 최초 방문자라도 브라우저 설정 언어(`navigator.language`)와 세계 타임존(`Intl.DateTimeFormat`)을 분석하여 <strong>별도의 선택 없이도 해당 국가 언어로 첫 화면이 자동 제공</strong>됩니다.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
              <h4 className="font-bold text-gray-900 mb-2">💡 15개국어 실시간 자동 번역 (Auto Translation Engine)</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                기도의 벽(Prayer Wall), 공지사항, 또는 관리자 단체 쪽지 발송 시 <strong>[15개국어 자동 번역]</strong> 기능을 켜면, 구글/Gemini AI 번역 엔진이 원문을 15개국 언어로 즉시 번역하여 저장합니다. 따라서 외국 회원이 접속해도 자신의 모국어로 번역된 제목과 내용을 읽을 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 섹션 2: 👥 5단계 회원 등급 및 가입 승인 권한 */}
      {/* ========================================================================= */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => toggleSection('members')}
          className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <Users size={18} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                {isKo ? '2. 5단계 회원 등급 체계 및 가입 승인 권한 정책' : '2. 5-Tier Membership System & Permissions'}
              </h3>
              <p className="text-xs text-gray-500">
                {isKo ? '준회원 승인, 정회원, 국가 코디네이터 및 최고관리자의 권한 상세' : 'Role permissions from Associate (Level 1) to Super Admin (Level 5)'}
              </p>
            </div>
          </div>
          {expandedSections.members ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>

        {expandedSections.members && (
          <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                    <th className="py-2.5 px-3">등급 (Level)</th>
                    <th className="py-2.5 px-3">역할 명칭</th>
                    <th className="py-2.5 px-3">핵심 권한 및 특징</th>
                    <th className="py-2.5 px-3">쪽지/알림 권한</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  <tr className="hover:bg-gray-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-amber-700">Level 1</td>
                    <td className="py-3 px-3 font-bold text-gray-900">준회원 (Associate)</td>
                    <td className="py-3 px-3 text-gray-600">신규 가입 직후 상태. 게시판 열람 및 기도 댓글 작성 가능 (자료 다운로드/글쓰기 제한).</td>
                    <td className="py-3 px-3 text-gray-500">쪽지 수신만 가능 (스팸 방지로 발신 불가)</td>
                  </tr>
                  <tr className="hover:bg-gray-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">Level 2~3</td>
                    <td className="py-3 px-3 font-bold text-gray-900">일반/정회원 (Regular)</td>
                    <td className="py-3 px-3 text-gray-600">관리자 승인 완료 회원. 게시글 작성, 자료실 다운로드, 기도제목 등록 가능.</td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">1:1 쪽지 자유 발송, 실시간 알림 수신</td>
                  </tr>
                  <tr className="hover:bg-gray-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-sky-700">Level 4</td>
                    <td className="py-3 px-3 font-bold text-gray-900">국가관리자 (Coordinator)</td>
                    <td className="py-3 px-3 text-gray-600">해당 국가 대표자. <strong>소속 국가 준회원 가입 승인 권한</strong> 및 대표 연락망.</td>
                    <td className="py-3 px-3 text-sky-800 font-bold">[내 국가 회원 전체 공지 쪽지] 발송 가능</td>
                  </tr>
                  <tr className="hover:bg-gray-50/60">
                    <td className="py-3 px-3 font-mono font-bold text-purple-700">Level 5</td>
                    <td className="py-3 px-3 font-bold text-gray-900">총괄관리자 (Super Admin)</td>
                    <td className="py-3 px-3 text-gray-600">전 국가 회원 관리/승인, 메인 배너, 팝업, 협력단체 등 대시보드 총괄 제어.</td>
                    <td className="py-3 px-3 text-purple-800 font-bold">[전체 회원 브로드캐스트 공지 쪽지] 발송</td>
                  </tr>
                  <tr className="hover:bg-gray-50/60 bg-indigo-50/30">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">Developer</td>
                    <td className="py-3 px-3 font-bold text-gray-900">개발자 (Developer)</td>
                    <td className="py-3 px-3 text-gray-600">시스템 아키텍처, 7대 신념 교안 원문 관리 및 AI 엔진 설정.</td>
                    <td className="py-3 px-3 text-indigo-800 font-bold">모든 시스템 제어 및 콘솔 권한</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
              <ShieldCheck size={20} className="text-purple-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-purple-950 mb-1">{isKo ? '신규 회원 승인 절차 (가입 승인 방법)' : 'Member Approval Process'}</h4>
                <p className="text-xs text-purple-900 leading-relaxed">
                  1. 좌측 메뉴의 <strong>[회원 관리]</strong> 페이지로 이동합니다.<br />
                  2. 상단 필터에서 <strong>[승인 대기 준회원]</strong>을 선택합니다.<br />
                  3. 가입자의 소속 교회/사역 정보를 확인한 후 <strong>[정회원으로 승인]</strong> 버튼을 누르면 즉시 승인되며, 해당 회원에게 환영 알림이 자동 발송됩니다.
                </p>
                <Link
                  href={`/${locale}/admin/members`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline mt-2"
                >
                  <span>{isKo ? '회원 관리 페이지로 바로가기' : 'Go to Members Management'}</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 섹션 3: ✉️ 내부 쪽지함(Messages) 및 그룹 공지 발송 */}
      {/* ========================================================================= */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => toggleSection('messaging')}
          className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <Mail size={18} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                {isKo ? '3. 회원 간 내부 쪽지(메시지) 및 그룹 공지 발송법' : '3. In-App Messaging & Group Announcements'}
              </h3>
              <p className="text-xs text-gray-500">
                {isKo ? '1:1 쪽지, 국가별/전체 공지 쪽지 발송 및 15개국어 자동 번역' : '1:1 Direct Messages, Group Announcements, and 15-Language Auto Translation'}
              </p>
            </div>
          </div>
          {expandedSections.messaging ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>

        {expandedSections.messaging && (
          <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <h4 className="font-bold text-indigo-950 flex items-center gap-1.5 mb-2">
                  <Mail size={15} className="text-indigo-600" />
                  <span>{isKo ? '1:1 개인 쪽지 발송' : '1:1 Direct Message'}</span>
                </h4>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  • <strong>어디서 보내나요?</strong> 마이페이지 <strong>[쪽지함 ✉️]</strong> 탭에서 [쪽지 쓰기]를 누르거나, 게시글 작성자의 이름을 클릭하여 즉시 발송할 수 있습니다.<br />
                  • <strong>권한:</strong> 정회원(Level 2+) 이상이면 15개국 동역자 누구에게나 안전하게 개인 연락처 노출 없이 쪽지를 보낼 수 있습니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                <h4 className="font-bold text-sky-950 flex items-center gap-1.5 mb-2">
                  <Users size={15} className="text-sky-600" />
                  <span>{isKo ? '그룹 공지 쪽지 발송 (코디네이터/관리자 전용)' : 'Group Announcements'}</span>
                </h4>
                <p className="text-xs text-sky-900 leading-relaxed">
                  • <strong>발송 범위 선택:</strong><br />
                  - <strong>[내 국가 회원 전체]:</strong> 국가 코디네이터(Level 4) 및 총괄 관리자(Level 5) 발송 가능.<br />
                  - <strong>[전체 코디네이터 공지]:</strong> 15개국 코디네이터에게만 전달되는 사역 회람 공지.<br />
                  - <strong>[전체 회원 공지]:</strong> AAMEN 네트워크 전체 회원에게 일괄 브로드캐스트.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80">
              <h4 className="font-bold text-amber-950 flex items-center gap-1.5 mb-1.5">
                <span>🌐</span>
                <span>{isKo ? '15개국 자동 번역 발송 꿀팁' : '15-Language Auto-Translation Tip'}</span>
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                공지 쪽지 작성 창에서 <strong>[15개국어 자동 번역 포함]</strong> 체크박스를 켜고 발송하면, 한국어로 작성하더라도 일본 회원에게는 일본어로, 베트남 회원에게는 베트남어로 번역된 제목이 전달되어 언어 장벽 없이 소통할 수 있습니다!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 섹션 4: 🔔 헤더 실시간 알림 센터 & PWA 브라우저 푸시 알림 */}
      {/* ========================================================================= */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => toggleSection('notifications')}
          className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <Bell size={18} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                {isKo ? '4. 헤더 실시간 알림 센터 & PWA 브라우저 푸시 운영법' : '4. In-App Notification Center & PWA Web Push'}
              </h3>
              <p className="text-xs text-gray-500">
                {isKo ? '상단 종(🔔) 아이콘, 댓글/기도 트리거, 스마트폰 홈 화면 앱 푸시 알림' : 'Real-time bell badge, comments/amen triggers, background smartphone push'}
              </p>
            </div>
          </div>
          {expandedSections.notifications ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>

        {expandedSections.notifications && (
          <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                <span className="text-2xl block mb-1">💬</span>
                <span className="font-bold text-xs text-gray-900 block">{isKo ? '댓글 알림' : 'Comment Alert'}</span>
                <span className="text-[11px] text-gray-500">{isKo ? '내 게시물에 새 댓글이 달리면 즉시 알림' : 'When comments are added'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-2xl block mb-1">🙏</span>
                <span className="font-bold text-xs text-amber-950 block">{isKo ? '저도 기도할게요' : 'Prayer Amen'}</span>
                <span className="text-[11px] text-amber-700">{isKo ? '내 기도제목에 동역자가 아멘을 누르면 알림' : 'When members pray together'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-2xl block mb-1">🚨</span>
                <span className="font-bold text-xs text-rose-950 block">{isKo ? '긴급 중보기도' : 'Urgent Prayer'}</span>
                <span className="text-[11px] text-rose-700">{isKo ? '긴급 기도 등록 시 관리자/코디네이터에게 알림' : 'Alerts to coordinators & admins'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">📱 PWA 브라우저 푸시 알림의 특장점</h4>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                <li><strong>앱스토어 다운로드 불필요:</strong> 크롬, 삼성인터넷, 사파리에서 바로 홈 화면에 추가하여 앱처럼 사용 가능합니다.</li>
                <li><strong>무료 운영:</strong> SMS나 카카오 알림톡 비용 없이 W3C 표준 Web Push 프로토콜을 사용하여 <strong>평생 0원</strong>으로 운영됩니다.</li>
                <li><strong>상태 갱신:</strong> 사이트를 닫아두어도 기기 상단 알림창에 팝업이 뜨며, 클릭 시 해당 페이지로 즉시 연결됩니다.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 섹션 5: 🖼️ 메인 배너, 팝업, 협력단체 및 코디네이터 관리 */}
      {/* ========================================================================= */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => toggleSection('banners')}
          className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <ImageIcon size={18} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                {isKo ? '5. 메인 상단 배너, 팝업, 협력단체 및 코디네이터 관리' : '5. Main Banners, Popups, Partners & Coordinators'}
              </h3>
              <p className="text-xs text-gray-500">
                {isKo ? '배너 슬라이더, 긴급 공지 팝업 모달, 글로벌 협력기관 링크 수정법' : 'Manage hero banner slider, modal popups, partner organizations'}
              </p>
            </div>
          </div>
          {expandedSections.banners ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>

        {expandedSections.banners && (
          <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <span className="font-bold text-xs text-gray-900 block mb-1">🖼️ 상단 배너 관리</span>
                <p className="text-xs text-gray-500 mb-2">그라디언트 텍스트형 또는 이미지형 선택. 타이틀, 서브타이틀, 버튼 링크를 실시간 변경합니다.</p>
                <Link href={`/${locale}/admin/banners`} className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                  <span>배너 관리 바로가기</span>
                  <ExternalLink size={11} />
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <span className="font-bold text-xs text-gray-900 block mb-1">📢 공지 팝업 관리</span>
                <p className="text-xs text-gray-500 mb-2">콘퍼런스 일정이나 긴급 공지를 레이어 팝업으로 노출. "오늘 하루 보지 않기" 쿠키가 자동 적용됩니다.</p>
                <Link href={`/${locale}/admin/popups`} className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1">
                  <span>팝업 관리 바로가기</span>
                  <ExternalLink size={11} />
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gray-200">
                <span className="font-bold text-xs text-gray-900 block mb-1">🤝 글로벌 협력단체</span>
                <p className="text-xs text-gray-500 mb-2">MWC, MCC 등 공식 협력단체의 로고, 한/영 소개문구, 웹사이트 링크를 등록하고 노출 순서를 정렬합니다.</p>
                <Link href={`/${locale}/admin/partners`} className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
                  <span>협력단체 관리 바로가기</span>
                  <ExternalLink size={11} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 섹션 6: 💡 자주 묻는 질문 & 관리자 트러블슈팅 */}
      {/* ========================================================================= */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          type="button"
          onClick={() => toggleSection('troubleshooting')}
          className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <HelpCircle size={18} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">
                {isKo ? '6. 자주 묻는 질문 & 관리자 트러블슈팅' : '6. FAQ & Administrator Troubleshooting'}
              </h3>
              <p className="text-xs text-gray-500">
                {isKo ? '회원 권한 문제, 푸시 알림 미수신 시 대처 요령, 다국어 교안 검수' : 'Common issues and quick solutions'}
              </p>
            </div>
          </div>
          {expandedSections.troubleshooting ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
        </button>

        {expandedSections.troubleshooting && (
          <div className="p-5 sm:p-6 space-y-3 text-xs sm:text-sm text-gray-700 bg-white border-t border-gray-100 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Q. 신규 가입 회원이 글을 못 쓴다고 연락이 왔어요!</span>
              <p className="text-xs text-gray-600">
                A. 신규 가입자는 스팸 방지를 위해 <strong>준회원(Level 1)</strong>으로 시작합니다. 관리자 콘솔의 <strong>[회원 관리]</strong>에서 해당 회원을 확인하신 후 <strong>[정회원으로 승인]</strong>해 주시면 즉시 글쓰기와 자료 다운로드가 활성화됩니다.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Q. 스마트폰 푸시 알림이 안 와요!</span>
              <p className="text-xs text-gray-600">
                A. 회원의 스마트폰 브라우저 설정에서 알림 권한이 차단되어 있는지 확인해 주세요. 특히 <strong>아이폰(iOS)</strong>의 경우, Safari 브라우저에서 <strong>[홈 화면에 추가]</strong>한 웹앱 아이콘으로 실행해야만 애플 정책상 푸시 알림을 받을 수 있습니다.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="font-bold text-gray-900 block mb-1">Q. 특정 국가 언어로 번역된 제목에 오역이 있으면 어떻게 하나요?</span>
              <p className="text-xs text-gray-600">
                A. 관리자나 해당 국가 코디네이터가 게시물 수정 창에서 <strong>[국가별 번역 확인/수정]</strong>을 열어 해당 국가 언어의 제목을 직접 자연스럽게 다듬고 저장하실 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
