'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  RefreshCw, 
  MessageCircle, 
  Heart, 
  AlertTriangle, 
  Mail, 
  Volume2, 
  ExternalLink,
  X
} from 'lucide-react'

export interface NotificationItem {
  id: string
  user_id: string
  sender_id?: string
  sender_name?: string
  type: 'comment' | 'amen' | 'prayer_support' | 'notice' | 'urgent_prayer' | 'message' | 'admin_alert' | string
  title: string
  body: string
  link_url: string
  is_read: number | boolean
  created_at: string
}

interface NotificationBellProps {
  locale: string
  userId?: string
  userRole?: string
  className?: string
}

export default function NotificationBell({ locale, userId, userRole, className = '' }: NotificationBellProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isKo = locale === 'ko'

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 미확인 알림 카운트 조회
  const fetchUnreadCount = async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/notifications.php?action=unread_count&user_id=${encodeURIComponent(userId)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success && typeof data.unread_count === 'number') {
          setUnreadCount(data.unread_count)
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 알림 목록 조회
  const fetchNotifications = async (showSpinner = false) => {
    if (!userId) return
    if (showSpinner) setRefreshing(true)
    try {
      const res = await fetch(`/api/notifications.php?user_id=${encodeURIComponent(userId)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data)
          const unread = data.data.filter((n: NotificationItem) => !n.is_read || n.is_read === 0).length
          setUnreadCount(unread)
        }
      }
    } catch (e) {
      // ignore
    } finally {
      if (showSpinner) setRefreshing(false)
    }
  }

  // 초기 로드 & 주기적 폴링 (30초) & 윈도우 포커스
  useEffect(() => {
    if (!userId) return
    fetchUnreadCount()

    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000)

    const handleFocus = () => {
      fetchUnreadCount()
      if (isOpen) fetchNotifications()
    }

    const handleCustomRefresh = () => {
      fetchUnreadCount()
      fetchNotifications()
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('aamen_notifications_refresh', handleCustomRefresh)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('aamen_notifications_refresh', handleCustomRefresh)
    }
  }, [userId, isOpen])

  // 드롭다운 열릴 때 알림 목록 로드
  const handleToggle = () => {
    const nextState = !isOpen
    setIsOpen(nextState)
    if (nextState && userId) {
      fetchNotifications(true)
    }
  }

  // 개별 알림 클릭 (읽음 처리 + 링크 이동)
  const handleItemClick = async (item: NotificationItem) => {
    if (!item.is_read || item.is_read === 0) {
      try {
        await fetch('/api/notifications.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'mark_read', id: item.id, user_id: userId })
        })
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, is_read: 1 } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (e) {
        // ignore
      }
    }

    setIsOpen(false)

    if (item.link_url) {
      // locale prefix 보정
      let targetUrl = item.link_url
      if (!targetUrl.startsWith(`/${locale}/`) && !targetUrl.startsWith('http')) {
        targetUrl = targetUrl.startsWith('/') ? `/${locale}${targetUrl}` : `/${locale}/${targetUrl}`
      }
      router.push(targetUrl)
    }
  }

  // 모두 읽음 처리
  const handleMarkAllRead = async () => {
    if (!userId) return
    try {
      await fetch('/api/notifications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read', user_id: userId })
      })
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })))
      setUnreadCount(0)
    } catch (e) {
      // ignore
    }
  }

  // 개별 삭제
  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!userId) return
    try {
      await fetch('/api/notifications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id, user_id: userId })
      })
      const target = notifications.find(n => n.id === id)
      if (target && (!target.is_read || target.is_read === 0)) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (e) {
      // ignore
    }
  }

  // 전체 삭제
  const handleDeleteAll = async () => {
    if (!userId) return
    const confirmMsg = isKo ? '모든 알림을 삭제하시겠습니까?' : 'Delete all notifications?'
    if (!window.confirm(confirmMsg)) return
    try {
      await fetch('/api/notifications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_all', user_id: userId })
      })
      setNotifications([])
      setUnreadCount(0)
    } catch (e) {
      // ignore
    }
  }

  // 아이콘 매핑
  const renderIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0"><MessageCircle size={15} /></span>
      case 'amen':
      case 'prayer_support':
        return <span className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0"><Heart size={15} /></span>
      case 'urgent_prayer':
        return <span className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0 animate-pulse"><AlertTriangle size={15} /></span>
      case 'message':
        return <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0"><Mail size={15} /></span>
      case 'notice':
      case 'admin_alert':
        return <span className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0"><Volume2 size={15} /></span>
      default:
        return <span className="p-2 rounded-xl bg-gray-100 text-gray-600 shrink-0"><Bell size={15} /></span>
    }
  }

  // 상대 시간 포맷팅
  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date().getTime()
      const past = new Date(dateStr.replace(' ', 'T')).getTime()
      const diffSec = Math.floor((now - past) / 1000)

      if (diffSec < 60) return isKo ? '방금 전' : 'Just now'
      if (diffSec < 3600) return isKo ? `${Math.floor(diffSec / 60)}분 전` : `${Math.floor(diffSec / 60)}m ago`
      if (diffSec < 86400) return isKo ? `${Math.floor(diffSec / 3600)}시간 전` : `${Math.floor(diffSec / 3600)}h ago`
      if (diffSec < 604800) return isKo ? `${Math.floor(diffSec / 86400)}일 전` : `${Math.floor(diffSec / 86400)}d ago`
      return dateStr.substring(0, 10)
    } catch {
      return dateStr
    }
  }

  if (!userId) return null

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 🔔 벨 버튼 (새 쪽지/알림 시 노란 느낌표 표시) */}
      <button
        type="button"
        onClick={handleToggle}
        title={isKo ? (unreadCount > 0 ? `새로운 알림 및 쪽지가 있습니다 (${unreadCount}개)` : '알림 센터') : (unreadCount > 0 ? `New notifications & messages (${unreadCount})` : 'Notifications')}
        className="relative p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-full transition-all focus:outline-none"
        aria-label="Notifications"
      >
        <Bell size={19} className={unreadCount > 0 ? 'text-amber-600' : 'text-gray-600'} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 text-amber-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse leading-none"
            title={isKo ? `새로운 쪽지/알림 (${unreadCount}개)` : `New notifications (${unreadCount})`}
          >
            !
          </span>
        )}
      </button>

      {/* 📬 드롭다운 레이어 */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* 헤더 */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-emerald-200" />
              <h3 className="font-extrabold text-sm tracking-tight">
                {isKo ? '알림 센터' : 'Notifications'}
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-rose-500/90 text-white px-2 py-0.5 rounded-full">
                  {unreadCount} {isKo ? '새 알림' : 'new'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fetchNotifications(true)}
                title={isKo ? '새로고침' : 'Refresh'}
                className="p-1.5 hover:bg-white/20 rounded-lg text-emerald-100 hover:text-white transition-colors"
              >
                <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              </button>
              {notifications.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    title={isKo ? '모두 읽음' : 'Mark all read'}
                    className="p-1.5 hover:bg-white/20 rounded-lg text-emerald-100 hover:text-white transition-colors text-xs flex items-center gap-1"
                  >
                    <CheckCheck size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    title={isKo ? '전체 삭제' : 'Delete all'}
                    className="p-1.5 hover:bg-rose-500/30 rounded-lg text-emerald-100 hover:text-rose-200 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg text-emerald-100 hover:text-white transition-colors ml-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* 알림 목록 바디 */}
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100/80 overscroll-contain">
            {notifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell size={22} className="opacity-50" />
                </div>
                <p className="text-xs font-bold text-gray-700">
                  {isKo ? '새로운 알림이 없습니다 🕊️' : 'No new notifications 🕊️'}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {isKo ? '기도, 댓글, 쪽지 소식이 여기에 표시됩니다.' : 'Prayers, comments and messages will appear here.'}
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !item.is_read || item.is_read === 0
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                      isUnread 
                        ? 'bg-emerald-50/50 hover:bg-emerald-50/80 border-l-4 border-l-emerald-500' 
                        : 'bg-white hover:bg-gray-50/80 border-l-4 border-l-transparent'
                    }`}
                  >
                    {renderIcon(item.type)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`text-xs truncate ${isUnread ? 'font-black text-gray-950' : 'font-medium text-gray-800'}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                          {formatTimeAgo(item.created_at)}
                        </span>
                      </div>

                      {item.body && (
                        <p className={`text-[11px] line-clamp-2 leading-relaxed ${isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                          {item.body}
                        </p>
                      )}

                      {item.sender_name && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                          {item.sender_name}
                        </span>
                      )}
                    </div>

                    {/* 개별 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(e, item.id)}
                      title={isKo ? '삭제' : 'Delete'}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {/* 푸터 */}
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <Link
              href={`/${locale}/member/mypage?tab=messages`}
              onClick={() => setIsOpen(false)}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
            >
              <Mail size={12} />
              <span>{isKo ? '쪽지함 바로가기' : 'Messages'}</span>
            </Link>

            <Link
              href={`/${locale}/member/mypage?tab=notifications`}
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800 font-medium flex items-center gap-1 hover:underline"
            >
              <span>{isKo ? '알림 설정' : 'Settings'}</span>
              <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
