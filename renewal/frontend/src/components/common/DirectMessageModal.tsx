'use client'

import React, { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import {
  Send,
  X,
  Mail,
  User,
  Globe,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react'
import { getStoredUser, type AuthUser } from '@/lib/auth'
import { translateTitleTo15Languages } from '@/lib/gemini'

export interface OpenDmEventDetail {
  receiverId?: string
  receiverName: string
  receiverEmail?: string
  receiverCountry?: string
  contextTitle?: string
}

export function openDirectMessage(detail: OpenDmEventDetail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aamen:open-dm', { detail }))
  }
}

const COUNTRY_FLAGS: Record<string, string> = {
  KR: '🇰🇷 한국',
  MM: '🇲🇲 미얀마',
  VN: '🇻🇳 베트남',
  TH: '🇹🇭 태국',
  ID: '🇮🇩 인도네시아',
  JP: '🇯🇵 일본',
  IN: '🇮🇳 인도',
  NP: '🇳🇵 네팔',
  KH: '🇰🇭 캄보디아',
  LA: '🇱🇦 라오스',
  MN: '🇲🇳 몽골',
  TW: '🇹🇼 대만',
  HK: '🇭🇰 홍콩',
  PH: '🇵🇭 필리핀',
  US: '🇺🇸 미국',
}

interface ServerMember {
  id: string
  name: string
  name_en?: string
  email: string
  country_code: string
  affiliation?: string
  avatar_url?: string | null
  role?: string
}

export default function DirectMessageModal() {
  const locale = useLocale()
  const isKo = locale === 'ko'

  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [members, setMembers] = useState<ServerMember[]>([])

  // Modal target data
  const [targetName, setTargetName] = useState('')
  const [targetId, setTargetId] = useState('')
  const [targetEmail, setTargetEmail] = useState('')
  const [targetCountry, setTargetCountry] = useState('KR')
  const [targetAffiliation, setTargetAffiliation] = useState('')
  const [isUnregisteredAuthor, setIsUnregisteredAuthor] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [enableAutoTranslate, setEnableAutoTranslate] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Auth / Permission warning modals
  const [showAuthWarning, setShowAuthWarning] = useState<'guest' | 'associate' | 'self' | null>(null)

  // Load members from server
  const loadMembers = async () => {
    try {
      const res = await fetch(`/api/members.php?_t=${Date.now()}`)
      if (res.ok) {
        const json = await res.json()
        const raw = Array.isArray(json) ? json : (json.data || json.members || [])
        if (Array.isArray(raw)) {
          setMembers(raw)
          return raw
        }
      }
    } catch (e) {
      console.warn('DirectMessageModal: failed to fetch members', e)
    }
    return []
  }

  useEffect(() => {
    loadMembers()
  }, [])

  // Listen to `aamen:open-dm` event
  useEffect(() => {
    async function handleOpenDm(e: Event) {
      const customEvent = e as CustomEvent<OpenDmEventDetail>
      const detail = customEvent.detail
      if (!detail) return

      const user = getStoredUser()
      setCurrentUser(user)

      // 1. Guest check
      if (!user || user.role === 'guest' || user.tierLevel === 0) {
        setShowAuthWarning('guest')
        return
      }

      // 2. Associate check (Level 1)
      if (user.role === 'associate' || user.tierLevel === 1) {
        setShowAuthWarning('associate')
        return
      }

      // 3. Prevent messaging oneself
      if (
        (detail.receiverId && detail.receiverId === user.id) ||
        (detail.receiverEmail && detail.receiverEmail === user.email) ||
        (detail.receiverName && detail.receiverName === user.name)
      ) {
        setShowAuthWarning('self')
        return
      }

      // Match receiver from member list
      let latestMembers = members
      if (latestMembers.length === 0) {
        latestMembers = await loadMembers()
      }

      let matchedMember: ServerMember | undefined = undefined

      if (detail.receiverId) {
        matchedMember = latestMembers.find((m) => m.id === detail.receiverId)
      }
      if (!matchedMember && detail.receiverEmail) {
        matchedMember = latestMembers.find(
          (m) => m.email?.toLowerCase() === detail.receiverEmail?.toLowerCase()
        )
      }
      if (!matchedMember && detail.receiverName) {
        const cleanReqName = detail.receiverName.trim().toLowerCase()
        matchedMember = latestMembers.find(
          (m) =>
            m.name?.trim().toLowerCase() === cleanReqName ||
            m.name_en?.trim().toLowerCase() === cleanReqName ||
            cleanReqName.includes(m.name?.trim().toLowerCase())
        )
      }

      if (matchedMember) {
        setTargetId(matchedMember.id)
        setTargetName(matchedMember.name)
        setTargetEmail(matchedMember.email || '')
        setTargetCountry(matchedMember.country_code || 'KR')
        setTargetAffiliation(matchedMember.affiliation || '')
        setIsUnregisteredAuthor(false)
      } else {
        // Not a direct member in DB
        setTargetId('')
        setTargetName(detail.receiverName || 'Author')
        setTargetEmail(detail.receiverEmail || '')
        setTargetCountry(detail.receiverCountry || 'KR')
        setTargetAffiliation('')
        setIsUnregisteredAuthor(true)
      }

      setTitle(detail.contextTitle ? `[문의] ${detail.contextTitle}` : '')
      setContent('')
      setErrorMsg(null)
      setSuccessMsg(null)
      setIsOpen(true)
    }

    window.addEventListener('aamen:open-dm', handleOpenDm)
    return () => window.removeEventListener('aamen:open-dm', handleOpenDm)
  }, [members])

  // Handle send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    let finalReceiverId = targetId
    let finalReceiverName = targetName

    if (!finalReceiverId) {
      setErrorMsg(
        isKo
          ? '수신 회원을 선택해 주세요. (가입된 회원을 목록에서 지정해 주세요)'
          : 'Please select a registered recipient member.'
      )
      return
    }

    if (!title.trim()) {
      setErrorMsg(isKo ? '제목을 입력해 주세요.' : 'Please enter a title.')
      return
    }

    if (!content.trim()) {
      setErrorMsg(isKo ? '내용을 입력해 주세요.' : 'Please enter message content.')
      return
    }

    setIsSending(true)
    setErrorMsg(null)

    try {
      let translationsJson: string | null = null
      if (enableAutoTranslate) {
        try {
          const dict = await translateTitleTo15Languages(title)
          translationsJson = JSON.stringify(dict)
        } catch (tErr) {
          console.warn('Translation fallback to null', tErr)
        }
      }

      const res = await fetch('/api/messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          sender_id: currentUser.id,
          sender_name: currentUser.name || 'AAMEN Member',
          sender_country: currentUser.country_code || 'KR',
          sender_role: currentUser.role || 'regular',
          target_type: 'individual',
          receiver_id: finalReceiverId,
          receiver_name: finalReceiverName,
          title: title.trim(),
          content: content.trim(),
          translations_json: translationsJson,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSuccessMsg(
          isKo
            ? `🎉 ${finalReceiverName}님께 쪽지가 성공적으로 전송되었습니다!`
            : `🎉 Message successfully sent to ${finalReceiverName}!`
        )
        setTimeout(() => {
          setIsOpen(false)
          setSuccessMsg(null)
        }, 1500)
      } else {
        setErrorMsg(data.error || (isKo ? '쪽지 발송에 실패했습니다.' : 'Failed to send message.'))
      }
    } catch (err: any) {
      setErrorMsg(err.message || (isKo ? '네트워크 오류가 발생했습니다.' : 'Network error occurred.'))
    } finally {
      setIsSending(false)
    }
  }

  const countryFlag = COUNTRY_FLAGS[targetCountry]?.split(' ')[0] || '🌐'

  return (
    <>
      {/* 1. Auth Warning Modals */}
      {showAuthWarning === 'guest' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              ✉️
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                {isKo ? '로그인이 필요한 기능입니다' : 'Login Required'}
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                {isKo
                  ? 'AAMEN 사역자 및 성도님들과 1:1 쪽지를 나누시려면 먼저 구글 계정으로 로그인해 주세요.'
                  : 'Please log in with your Google account to send direct messages to AAMEN members.'}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <a
                href={`/${locale}/member/login`}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                {isKo ? '구글 로그인하기' : 'Log In'}
              </a>
              <button
                type="button"
                onClick={() => setShowAuthWarning(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs transition-colors cursor-pointer"
              >
                {isKo ? '닫기' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAuthWarning === 'associate' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
              🛡️
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                {isKo ? '정회원(Level 2+) 전용 기능' : 'Regular Members Only (Level 2+)'}
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                {isKo
                  ? '회원 보호 및 안전한 네트워크 소통을 위해 쪽지 발송은 정회원(2단계) 승인 후 가능합니다. 국가 코디네이터 또는 관리자에게 등급 승인을 요청해 주세요.'
                  : 'To protect members from spam, direct messaging is available after Level 2 approval. Please request your country coordinator for verification.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAuthWarning(null)}
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              {isKo ? '확인하였습니다' : 'Got it'}
            </button>
          </div>
        </div>
      )}

      {showAuthWarning === 'self' && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
              💡
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                {isKo ? '내 게시글입니다' : 'Your Own Post'}
              </h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                {isKo
                  ? '회원님 본인이 작성하신 글입니다. 본인에게는 쪽지를 발송할 수 없습니다.'
                  : 'This post was written by yourself. You cannot send a direct message to yourself.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAuthWarning(null)}
              className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              {isKo ? '확인' : 'OK'}
            </button>
          </div>
        </div>
      )}

      {/* 2. Direct Message Compose Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Send size={18} className="-translate-x-0.5 translate-y-0.5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    {isKo ? '1:1 쪽지 보내기' : 'Send Direct Message'}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {isKo ? '게시자에게 직접 소통하는 쪽지를 보냅니다' : 'Send a private message to the author'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Recipient Profile Card */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-white border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  {targetName.substring(0, 1)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-base leading-none">{countryFlag}</span>
                    <span className="font-extrabold text-sm text-gray-900 truncate">{targetName}</span>
                    {targetAffiliation && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">
                        {targetAffiliation}
                      </span>
                    )}
                  </div>
                  {targetEmail ? (
                    <p className="text-[11px] text-emerald-700 font-medium truncate mt-0.5">
                      {targetEmail}
                    </p>
                  ) : (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {isKo ? 'AAMEN 네트워크 등록 회원' : 'AAMEN Network Member'}
                    </p>
                  )}
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 text-[11px] font-black shrink-0">
                {isKo ? '수신자' : 'Recipient'}
              </span>
            </div>

            {/* If unregistered author: allow selecting from active members */}
            {isUnregisteredAuthor && (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      {isKo
                        ? `작성자 '${targetName}'님은 계정 연동 전 샘플 데이터입니다.`
                        : `Author '${targetName}' is not linked to a verified account.`}
                    </p>
                    <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                      {isKo
                        ? '대신 실제 등록된 사역 코디네이터 또는 운영본부 회원에게 문의 쪽지를 전송하시겠습니까?'
                        : 'Would you like to send this inquiry to a registered coordinator instead?'}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <select
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-gray-800 focus:outline-emerald-500"
                    value={targetId}
                    onChange={(e) => {
                      const sel = members.find((m) => m.id === e.target.value)
                      if (sel) {
                        setTargetId(sel.id)
                        setTargetName(sel.name)
                        setTargetEmail(sel.email || '')
                        setTargetCountry(sel.country_code || 'KR')
                        setTargetAffiliation(sel.affiliation || '')
                      }
                    }}
                  >
                    <option value="">{isKo ? '-- 수신 회원 선택하기 --' : '-- Select Registered Member --'}</option>
                    {members
                      .filter((m) => m.id !== currentUser?.id)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          {COUNTRY_FLAGS[m.country_code]?.split(' ')[0] || '🌐'} {m.name} {m.affiliation ? `(${m.affiliation})` : ''} - {m.email}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            {/* Error / Success Toast Messages */}
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Message Form */}
            <form onSubmit={handleSend} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  {isKo ? '쪽지 제목' : 'Subject'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    isKo ? '게시글에 대한 문의나 나눔의 제목을 입력하세요' : 'Enter subject...'
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  {isKo ? '쪽지 내용' : 'Message'} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    isKo
                      ? '따뜻한 격려와 교제, 문의 내용을 자유롭게 적어주세요...'
                      : 'Type your message with encouragement and questions...'
                  }
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed"
                  required
                />
              </div>

              {/* 15개국 자동 번역 옵션 */}
              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableAutoTranslate}
                  onChange={(e) => setEnableAutoTranslate(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 text-xs text-emerald-950 font-bold">
                  <Globe size={14} className="text-emerald-600" />
                  <span>
                    {isKo
                      ? '수신자 국가 언어로 제목 자동 번역하여 전송 (Gemini AI)'
                      : 'Auto-translate subject to recipient language (Gemini AI)'}
                  </span>
                </div>
              </label>

              {/* Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSending}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {isKo ? '취소' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <span>{isKo ? '전송 중...' : 'Sending...'}</span>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>{isKo ? '쪽지 보내기' : 'Send Message'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * 클릭 시 쪽지 작성 팝업을 바로 띄워주는 게시자 이름 컴포넌트
 */
export function AuthorMessageBadge({
  authorName,
  authorId,
  authorCountry,
  authorEmail,
  contextTitle,
  className = '',
  showMailIcon = true,
}: {
  authorName: string
  authorId?: string
  authorCountry?: string
  authorEmail?: string
  contextTitle?: string
  className?: string
  showMailIcon?: boolean
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    openDirectMessage({
      receiverId: authorId,
      receiverName: authorName,
      receiverCountry: authorCountry,
      receiverEmail: authorEmail,
      contextTitle,
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`'${authorName}'님께 1:1 쪽지 보내기`}
      className={`inline-flex items-center gap-1 group font-bold text-gray-800 hover:text-emerald-700 transition-colors cursor-pointer select-none ${className}`}
    >
      <span className="group-hover:underline underline-offset-2">{authorName}</span>
      {showMailIcon && (
        <span className="p-0.5 rounded-md bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
          <Mail size={11} />
        </span>
      )}
    </button>
  )
}
