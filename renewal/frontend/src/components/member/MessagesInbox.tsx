'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import {
  Send,
  Inbox,
  Mail,
  MailOpen,
  PlusCircle,
  RefreshCw,
  Trash2,
  Reply,
  Globe,
  Users,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Search,
  Sparkles,
} from 'lucide-react'
import { translateTitleTo15Languages } from '@/lib/gemini'

interface MessageItem {
  id: string
  sender_id: string
  sender_name: string
  sender_country: string
  sender_role: string
  target_type: 'individual' | 'group_country' | 'group_coordinators' | 'group_all'
  target_country?: string | null
  receiver_id?: string | null
  receiver_name?: string | null
  title: string
  content: string
  translations_json?: string | null
  is_read: number | boolean
  read_at?: string | null
  user_is_read?: number | boolean
  user_read_at?: string | null
  created_at: string
}

interface MemberOption {
  id: string
  name: string
  name_en?: string
  country_code: string
  role?: string
  affiliation?: string
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

interface Props {
  currentUser: any
  currentLevel: number
  onUnreadChange?: (count: number) => void
}

export default function MessagesInbox({ currentUser, currentLevel, onUnreadChange }: Props) {
  const locale = useLocale()
  const isEn = locale !== 'ko'

  const [subTab, setSubTab] = useState<'inbox' | 'outbox'>('inbox')
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // 상세 모달
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null)
  const [showOriginalText, setShowOriginalText] = useState(false)

  // 작성 모달
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [targetType, setTargetType] = useState<'individual' | 'group_country' | 'group_coordinators' | 'group_all'>('individual')
  const [selectedReceiverId, setSelectedReceiverId] = useState('')
  const [selectedReceiverName, setSelectedReceiverName] = useState('')
  const [writeTitle, setWriteTitle] = useState('')
  const [writeContent, setWriteContent] = useState('')
  const [enableAutoTranslate, setEnableAutoTranslate] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [membersList, setMembersList] = useState<MemberOption[]>([])
  const [memberSearchTerm, setMemberSearchTerm] = useState('')

  // 토스트
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const userId = currentUser?.id || 'admin'
  const userCountry = currentUser?.country_code || 'KR'
  const userRole = currentUser?.role || 'regular'
  const canSend = currentLevel >= 2
  const canSendGroup = currentLevel >= 4

  // 안읽은 메시지 수 조회
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/messages.php?action=unread_count&user_id=${encodeURIComponent(userId)}&country=${userCountry}&role=${userRole}`)
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setUnreadCount(json.unread_count || 0)
          if (onUnreadChange) onUnreadChange(json.unread_count || 0)
        }
      }
    } catch (e) {}
  }, [userId, userCountry, userRole, onUnreadChange])

  // 쪽지 목록 조회
  const fetchMessages = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const action = subTab === 'inbox' ? 'inbox' : 'outbox'
      let res = await fetch(`/api/messages.php?action=${action}&user_id=${encodeURIComponent(userId)}&country=${userCountry}&role=${userRole}`)
      if (!res.ok) {
        res = await fetch(`/api/messages?action=${action}&user_id=${encodeURIComponent(userId)}&country=${userCountry}&role=${userRole}`)
      }
      if (res.ok) {
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setMessages(json.data)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      fetchUnreadCount()
    }
  }, [subTab, userId, userCountry, userRole, fetchUnreadCount])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // 회원 목록 조회 (1:1 쪽지 수신자 선택용)
  useEffect(() => {
    async function loadMembers() {
      try {
        let res = await fetch('/api/members.php')
        if (!res.ok) res = await fetch('/api/members')
        if (res.ok) {
          const json = await res.json()
          if (json.success && Array.isArray(json.data)) {
            setMembersList(json.data.filter((m: any) => m.id !== userId))
          }
        }
      } catch (e) {}
    }
    loadMembers()
  }, [userId])

  // 상세 모달 열기 & 자동 읽음 처리
  const handleOpenDetail = async (msg: MessageItem) => {
    setSelectedMessage(msg)
    setShowOriginalText(false)

    // 받은 편지함의 안읽은 메시지인 경우 읽음 처리
    const isUnread = subTab === 'inbox' && !Boolean(msg.user_is_read || msg.is_read)
    if (isUnread) {
      try {
        await fetch('/api/messages.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'mark_read',
            message_id: msg.id,
            user_id: userId,
          }),
        })
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, user_is_read: 1, is_read: 1 } : m))
        )
        fetchUnreadCount()
      } catch (e) {}
    }
  }

  // 전체 읽음 처리
  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return
    try {
      await fetch('/api/messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_all_read',
          user_id: userId,
          country: userCountry,
          role: userRole,
        }),
      })
      showToast(isEn ? 'All messages marked as read.' : '모든 쪽지를 읽음 처리했습니다.')
      fetchMessages()
    } catch (e) {}
  }

  // 쪽지 삭제
  const handleDelete = async (msgId: string) => {
    if (!confirm(isEn ? 'Are you sure you want to delete this message?' : '이 쪽지를 삭제하시겠습니까?')) return
    try {
      await fetch('/api/messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          message_id: msgId,
          user_id: userId,
          type: subTab,
        }),
      })
      showToast(isEn ? 'Message deleted.' : '쪽지가 삭제되었습니다.')
      setSelectedMessage(null)
      fetchMessages()
    } catch (e) {}
  }

  // 답장 쓰기
  const handleReply = (msg: MessageItem) => {
    setSelectedMessage(null)
    setTargetType('individual')
    setSelectedReceiverId(msg.sender_id)
    setSelectedReceiverName(msg.sender_name)
    setWriteTitle(`Re: ${msg.title}`)
    setWriteContent(`\n\n--- [원문 내용] ---\n${msg.content}`)
    setIsWriteModalOpen(true)
  }

  // 새 쪽지 전송
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!writeTitle.trim() || !writeContent.trim()) {
      alert(isEn ? 'Please enter both title and content.' : '제목과 내용을 모두 입력해 주세요.')
      return
    }

    if (targetType === 'individual' && !selectedReceiverId) {
      alert(isEn ? 'Please select a recipient.' : '수신자를 선택해 주세요.')
      return
    }

    setIsSending(true)
    try {
      let translationsJson: string | null = null

      // 다국어 자동 번역 적용 (그룹 공지 또는 옵션 활성화 시)
      if (enableAutoTranslate) {
        showToast(isEn ? 'Translating into 15 languages...' : '15개국 언어로 자동 번역 중입니다...')
        const translatedTitles = await translateTitleTo15Languages(writeTitle.trim())
        translationsJson = JSON.stringify({
          titles: translatedTitles,
        })
      }

      const payload = {
        action: 'send',
        sender_id: userId,
        sender_name: currentUser?.name || 'AAMEN 성도',
        sender_country: userCountry,
        sender_role: userRole,
        target_type: targetType,
        target_country: targetType === 'group_country' ? userCountry : null,
        receiver_id: targetType === 'individual' ? selectedReceiverId : null,
        receiver_name: targetType === 'individual' ? selectedReceiverName : null,
        title: writeTitle.trim(),
        content: writeContent.trim(),
        translations_json: translationsJson,
      }

      let res = await fetch('/api/messages.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          showToast(isEn ? 'Message sent successfully!' : '쪽지가 성공적으로 발송되었습니다!')
          setIsWriteModalOpen(false)
          setWriteTitle('')
          setWriteContent('')
          setSelectedReceiverId('')
          setSelectedReceiverName('')
          if (subTab === 'outbox') fetchMessages()
        } else {
          alert(json.error || '발송 실패')
        }
      }
    } catch (err: any) {
      alert(err.message || '전송 중 오류가 발생했습니다.')
    } finally {
      setIsSending(false)
    }
  }

  // 다국어 제목 추출
  const getDisplayTitle = (msg: MessageItem) => {
    if (showOriginalText) return msg.title
    if (msg.translations_json) {
      try {
        const parsed = JSON.parse(msg.translations_json)
        if (parsed.titles && parsed.titles[locale]) {
          return parsed.titles[locale]
        }
        if (parsed.titles && parsed.titles.en) {
          return parsed.titles.en
        }
      } catch (e) {}
    }
    return msg.title
  }

  // 타겟 배지 레이블
  const renderTargetBadge = (msg: MessageItem) => {
    switch (msg.target_type) {
      case 'group_country':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 border border-sky-200">
            <Users size={11} />
            <span>{COUNTRY_FLAGS[msg.target_country || 'KR'] || msg.target_country} {isEn ? 'Members Notice' : '국가 공지'}</span>
          </span>
        )
      case 'group_coordinators':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck size={11} />
            <span>{isEn ? 'Coordinators Notice' : '전 코디네이터 공지'}</span>
          </span>
        )
      case 'group_all':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
            <Globe size={11} />
            <span>{isEn ? 'All Members Notice' : '전체 정회원 공지'}</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <User size={11} />
            <span>{isEn ? 'Direct' : '1:1 쪽지'}</span>
          </span>
        )
    }
  }

  const filteredMembers = membersList.filter((m) => {
    if (!memberSearchTerm) return true
    const term = memberSearchTerm.toLowerCase()
    return (
      m.name.toLowerCase().includes(term) ||
      (m.name_en && m.name_en.toLowerCase().includes(term)) ||
      (m.affiliation && m.affiliation.toLowerCase().includes(term)) ||
      m.country_code.toLowerCase().includes(term)
    )
  })

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
      {/* 토스트 */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-2xl border border-emerald-400 animate-in fade-in">
          {toastMsg}
        </div>
      )}

      {/* 헤더 & 상단 툴바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
            <Mail size={18} className="text-emerald-600" />
            <span>{isEn ? 'AAMEN Message Center' : '회원 전용 쪽지함'}</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white shadow-2xs animate-pulse">
                {unreadCount} {isEn ? 'new' : '안읽음'}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEn
              ? 'Send direct messages to fellow members and receive multi-lingual community notices.'
              : '15개국 동역자들과 1:1로 안부를 나누고, 국가별·공동체 공지 쪽지를 안전하게 수신합니다.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 준회원 발신 제한 알림 */}
          {!canSend ? (
            <div className="text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
              <AlertCircle size={13} className="text-amber-600 shrink-0" />
              <span>{isEn ? 'Regular members (Level 2+) can send messages.' : '정회원 승인 후 발신 가능합니다.'}</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setTargetType('individual')
                setSelectedReceiverId('')
                setSelectedReceiverName('')
                setWriteTitle('')
                setWriteContent('')
                setIsWriteModalOpen(true)
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle size={14} />
              <span>{isEn ? 'New Message' : '새 쪽지 쓰기'}</span>
            </button>
          )}

          <button
            onClick={fetchMessages}
            title={isEn ? 'Refresh' : '새로고침'}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 내부 서브 탭 (받은 쪽지함 / 보낸 쪽지함) */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-gray-100 rounded-2xl">
          <button
            onClick={() => setSubTab('inbox')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'inbox'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Inbox size={13} />
            <span>{isEn ? 'Inbox' : '받은 쪽지함'}</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>
          <button
            onClick={() => setSubTab('outbox')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'outbox'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Send size={13} />
            <span>{isEn ? 'Outbox' : '보낸 쪽지함'}</span>
          </button>
        </div>

        {subTab === 'inbox' && unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1"
          >
            <CheckCircle2 size={13} />
            <span>{isEn ? 'Mark all as read' : '모두 읽음'}</span>
          </button>
        )}
      </div>

      {/* 쪽지 리스트 */}
      {loading ? (
        <div className="py-16 text-center text-gray-400">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-emerald-600" />
          <p className="text-xs">{isEn ? 'Loading messages...' : '쪽지 목록을 불러오는 중입니다...'}</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="py-16 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-200">
          <MailOpen size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-700">
            {subTab === 'inbox'
              ? isEn
                ? 'No received messages.'
                : '받은 쪽지가 없습니다.'
              : isEn
              ? 'No sent messages.'
              : '보낸 쪽지가 없습니다.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {subTab === 'inbox'
              ? isEn
                ? 'Messages sent by fellow members will appear here.'
                : '동역자들이 보낸 따뜻한 교제 쪽지와 공지가 이곳에 도착합니다.'
              : isEn
              ? 'Send a message to fellowship with Asian church leaders.'
              : '새 쪽지 쓰기를 눌러 아시아 리더들에게 첫 인사를 건네보세요.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 border border-gray-200/70 rounded-2xl overflow-hidden bg-white">
          {messages.map((msg) => {
            const isUnread = subTab === 'inbox' && !Boolean(msg.user_is_read || msg.is_read)
            const targetDisplayName =
              subTab === 'inbox'
                ? msg.sender_name
                : msg.target_type === 'individual'
                ? msg.receiver_name || msg.receiver_id || '성도'
                : msg.target_type === 'group_country'
                ? `${COUNTRY_FLAGS[msg.target_country || 'KR'] || msg.target_country} 회원 전체`
                : msg.target_type === 'group_coordinators'
                ? '전 코디네이터'
                : '전체 정회원'

            return (
              <div
                key={msg.id}
                onClick={() => handleOpenDetail(msg)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer hover:bg-gray-50/80 ${
                  isUnread ? 'bg-emerald-50/40 font-bold' : ''
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* 읽음/안읽음 인디케이터 */}
                  <div className="pt-1 shrink-0">
                    {subTab === 'inbox' ? (
                      isUnread ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block shadow-2xs" />
                      ) : (
                        <MailOpen size={15} className="text-gray-300" />
                      )
                    ) : (
                      <Send size={14} className="text-gray-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {renderTargetBadge(msg)}
                      <span className="text-xs font-extrabold text-gray-900">
                        {subTab === 'inbox' ? `From: ${targetDisplayName}` : `To: ${targetDisplayName}`}
                      </span>
                      {subTab === 'inbox' && msg.sender_country && (
                        <span className="text-[11px] text-gray-400 font-mono">
                          ({COUNTRY_FLAGS[msg.sender_country]?.split(' ')[0] || msg.sender_country})
                        </span>
                      )}
                      {msg.translations_json && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-bold" title="15개국어 번역 지원">
                          <Globe size={10} />
                          <span>15-Lang</span>
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm text-gray-900 line-clamp-1 ${isUnread ? 'font-extrabold text-emerald-950' : 'font-medium'}`}>
                      {getDisplayTitle(msg)}
                    </h4>

                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-normal">
                      {msg.content}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-gray-400 font-mono block">
                    {msg.created_at.substring(0, 10)}
                  </span>
                  {subTab === 'outbox' && (
                    <span className={`text-[10px] font-bold mt-1 inline-block ${msg.is_read ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {msg.is_read ? (isEn ? 'Read' : '읽음') : (isEn ? 'Unread' : '미확인')}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* =========================================================================
          쪽지 상세 모달 (Detail Modal)
         ========================================================================= */}
      {selectedMessage && (
        <div
          onClick={() => setSelectedMessage(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-5"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {renderTargetBadge(selectedMessage)}
                  <span className="text-xs text-gray-400 font-mono">
                    {selectedMessage.created_at}
                  </span>
                </div>
                <h3 className="text-lg font-black text-gray-900 leading-snug">
                  {getDisplayTitle(selectedMessage)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* 발신 / 수신 정보 바 */}
            <div className="p-3.5 bg-gray-50 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between text-gray-600">
                <span>{isEn ? 'Sender' : '발신자'}:</span>
                <span className="font-extrabold text-gray-900">
                  {selectedMessage.sender_name} ({COUNTRY_FLAGS[selectedMessage.sender_country] || selectedMessage.sender_country})
                </span>
              </div>
              {selectedMessage.receiver_name && (
                <div className="flex items-center justify-between text-gray-600">
                  <span>{isEn ? 'Recipient' : '수신자'}:</span>
                  <span className="font-extrabold text-gray-900">
                    {selectedMessage.receiver_name}
                  </span>
                </div>
              )}
            </div>

            {/* 다국어 번역 토글 버튼 (존재할 경우) */}
            {selectedMessage.translations_json && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowOriginalText((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  <Globe size={13} className="text-emerald-600" />
                  <span>{showOriginalText ? (isEn ? 'View Translated' : '번역문 보기') : (isEn ? 'View Original' : '원문 보기')}</span>
                </button>
              </div>
            )}

            {/* 쪽지 본문 */}
            <div className="p-5 bg-slate-50/70 border border-slate-100 rounded-2xl text-sm text-gray-800 leading-relaxed whitespace-pre-line min-h-[120px]">
              {selectedMessage.content}
            </div>

            {/* 하단 액션 버튼 */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>{isEn ? 'Delete' : '쪽지 삭제'}</span>
              </button>

              <div className="flex items-center gap-2">
                {subTab === 'inbox' && selectedMessage.target_type === 'individual' && canSend && (
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Reply size={14} />
                    <span>{isEn ? 'Reply' : '답장하기'}</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  {isEn ? 'Close' : '닫기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          쪽지 쓰기 모달 (Write Modal)
         ========================================================================= */}
      {isWriteModalOpen && (
        <div
          onClick={() => setIsWriteModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Send size={18} className="text-emerald-600" />
                <span>{isEn ? 'Compose New Message' : '새 쪽지 작성'}</span>
              </h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              {/* 발송 유형 선택 (Level 4 이상만 그룹 발송 선택 가능) */}
              {canSendGroup && (
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                    {isEn ? 'Recipient Type (Level 4+ Authority)' : '수신 대상 선택 (코디네이터 권한)'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTargetType('individual')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        targetType === 'individual'
                          ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-1 ring-emerald-500'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      👤 {isEn ? '1:1 Individual' : '1:1 특정 회원'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetType('group_country')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        targetType === 'group_country'
                          ? 'border-sky-600 bg-sky-50/80 text-sky-900 ring-1 ring-sky-500'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      👥 {COUNTRY_FLAGS[userCountry]?.split(' ')[0]} {isEn ? 'My Country' : '내 소속 국가 회원 전체'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetType('group_coordinators')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        targetType === 'group_coordinators'
                          ? 'border-purple-600 bg-purple-50/80 text-purple-900 ring-1 ring-purple-500'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      🛡️ {isEn ? 'All Coordinators' : '전 코디네이터 공지'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetType('group_all')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        targetType === 'group_all'
                          ? 'border-amber-600 bg-amber-50/80 text-amber-900 ring-1 ring-amber-500'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      🌐 {isEn ? 'All Regular Members' : '전체 정회원 공지'}
                    </button>
                  </div>
                </div>
              )}

              {/* 1:1 수신자 선택 */}
              {targetType === 'individual' && (
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 mb-1.5">
                    {isEn ? 'Select Recipient' : '수신 회원 선택'} *
                  </label>
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={isEn ? 'Search member by name or country...' : '이름, 영문명, 국가로 회원 검색...'}
                      value={memberSearchTerm}
                      onChange={(e) => setMemberSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white">
                    {filteredMembers.length === 0 ? (
                      <div className="p-3 text-center text-xs text-gray-400">
                        {isEn ? 'No members found.' : '검색된 회원이 없습니다.'}
                      </div>
                    ) : (
                      filteredMembers.map((m) => {
                        const isSelected = selectedReceiverId === m.id
                        return (
                          <div
                            key={m.id}
                            onClick={() => {
                              setSelectedReceiverId(m.id)
                              setSelectedReceiverName(m.name)
                            }}
                            className={`p-2.5 text-xs flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 ${
                              isSelected ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{COUNTRY_FLAGS[m.country_code]?.split(' ')[0] || '🌐'}</span>
                              <span>{m.name}</span>
                              {m.name_en && m.name_en !== m.name && (
                                <span className="text-[11px] text-gray-400">({m.name_en})</span>
                              )}
                              {m.affiliation && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 font-semibold">
                                  {m.affiliation}
                                </span>
                              )}
                            </div>
                            {isSelected && <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />}
                          </div>
                        )
                      })
                    )}
                  </div>
                  {selectedReceiverName && (
                    <p className="text-xs text-emerald-700 font-extrabold mt-1">
                      ✓ {isEn ? 'Selected' : '선택됨'}: {selectedReceiverName}
                    </p>
                  )}
                </div>
              )}

              {/* 제목 */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  {isEn ? 'Subject' : '제목'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isEn ? 'Enter message subject...' : '쪽지 제목을 입력하세요...'}
                  value={writeTitle}
                  onChange={(e) => setWriteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                  {isEn ? 'Message Content' : '내용'} *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder={isEn ? 'Write your message here...' : '교제와 사역 소식, 기도 나눔을 따뜻하게 작성해 보세요...'}
                  value={writeContent}
                  onChange={(e) => setWriteContent(e.target.value)}
                  className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
                />
              </div>

              {/* 15개국어 자동번역 체크박스 */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">
                      {isEn ? '15-Nation Auto Translation' : '15개국 언어로 자동 번역하여 전송'}
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      {isEn ? 'Recipient reads in their native language.' : '수신자의 국가 언어로 제목이 자동 번역되어 전달됩니다.'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableAutoTranslate}
                  onChange={(e) => setEnableAutoTranslate(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300 cursor-pointer"
                />
              </div>

              {/* 버튼 바 */}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                >
                  {isEn ? 'Cancel' : '취소'}
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>{isEn ? 'Sending...' : '발송 중...'}</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>{isEn ? 'Send Message' : '쪽지 보내기'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
