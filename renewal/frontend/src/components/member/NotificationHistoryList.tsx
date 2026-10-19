'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Filter
} from 'lucide-react'
import { NotificationItem } from '../layout/NotificationBell'

interface NotificationHistoryListProps {
  locale: string
  userId: string
}

export default function NotificationHistoryList({ locale, userId }: NotificationHistoryListProps) {
  const router = useRouter()
  const isKo = locale === 'ko'

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'comment' | 'prayer' | 'message'>('all')

  const fetchNotifications = async (showRefresh = false) => {
    if (!userId) return
    if (showRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const res = await fetch(`/api/notifications.php?user_id=${encodeURIComponent(userId)}`)
      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data)
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [userId])

  // 개별 클릭 (읽음 처리 후 이동)
  const handleClickItem = async (item: NotificationItem) => {
    if (!item.is_read || item.is_read === 0) {
      try {
        await fetch('/api/notifications.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'mark_read', id: item.id, user_id: userId })
        })
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, is_read: 1 } : n))
        window.dispatchEvent(new CustomEvent('aamen_notifications_refresh'))
      } catch (e) {
        // ignore
      }
    }

    if (item.link_url) {
      let targetUrl = item.link_url
      if (!targetUrl.startsWith(`/${locale}/`) && !targetUrl.startsWith('http')) {
        targetUrl = targetUrl.startsWith('/') ? `/${locale}${targetUrl}` : `/${locale}/${targetUrl}`
      }
      router.push(targetUrl)
    }
  }

  // 모두 읽음
  const handleMarkAllRead = async () => {
    if (!userId) return
    try {
      await fetch('/api/notifications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_all_read', user_id: userId })
      })
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })))
      window.dispatchEvent(new CustomEvent('aamen_notifications_refresh'))
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
      setNotifications(prev => prev.filter(n => n.id !== id))
      window.dispatchEvent(new CustomEvent('aamen_notifications_refresh'))
    } catch (e) {
      // ignore
    }
  }

  // 전체 삭제
  const handleDeleteAll = async () => {
    if (!userId) return
    const confirmMsg = isKo ? '수신된 모든 알림 내역을 삭제하시겠습니까?' : 'Delete all notification history?'
    if (!window.confirm(confirmMsg)) return
    try {
      await fetch('/api/notifications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_all', user_id: userId })
      })
      setNotifications([])
      window.dispatchEvent(new CustomEvent('aamen_notifications_refresh'))
    } catch (e) {
      // ignore
    }
  }

  const renderIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <span className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 shrink-0"><MessageCircle size={18} /></span>
      case 'amen':
      case 'prayer_support':
        return <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 shrink-0"><Heart size={18} /></span>
      case 'urgent_prayer':
        return <span className="p-2.5 rounded-2xl bg-rose-100 text-rose-600 shrink-0 animate-pulse"><AlertTriangle size={18} /></span>
      case 'message':
        return <span className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-700 shrink-0"><Mail size={18} /></span>
      case 'notice':
      case 'admin_alert':
        return <span className="p-2.5 rounded-2xl bg-blue-100 text-blue-700 shrink-0"><Volume2 size={18} /></span>
      default:
        return <span className="p-2.5 rounded-2xl bg-gray-100 text-gray-600 shrink-0"><Bell size={18} /></span>
    }
  }

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

  // 필터링
  const filteredNotifications = notifications.filter(item => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'unread') return !item.is_read || item.is_read === 0
    if (activeFilter === 'comment') return item.type === 'comment'
    if (activeFilter === 'prayer') return ['amen', 'prayer_support', 'urgent_prayer'].includes(item.type)
    if (activeFilter === 'message') return item.type === 'message'
    return true
  })

  const unreadCount = notifications.filter(n => !n.is_read || n.is_read === 0).length

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
      {/* 카드 상단 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
            <Bell size={22} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-gray-900">
                {isKo ? '실시간 알림 내역' : 'Real-time Notifications'}
              </h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-black bg-rose-500 text-white px-2.5 py-0.5 rounded-full">
                  {unreadCount} {isKo ? '미확인' : 'unread'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isKo ? '기도, 댓글, 쪽지 등 나에게 전달된 최신 알림을 확인하고 관리합니다.' : 'Check and manage latest notifications for prayers, comments, and messages.'}
            </p>
          </div>
        </div>

        {/* 상단 버튼군 */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => fetchNotifications(true)}
            title={isKo ? '새로고침' : 'Refresh'}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
          {notifications.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <CheckCheck size={14} />
                <span>{isKo ? '모두 읽음' : 'Mark all read'}</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteAll}
                className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>{isKo ? '전체 삭제' : 'Delete all'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 필터 탭 바 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeFilter === 'all' 
              ? 'bg-emerald-600 text-white shadow-xs' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isKo ? `전체 (${notifications.length})` : `All (${notifications.length})`}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeFilter === 'unread' 
              ? 'bg-rose-500 text-white shadow-xs' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isKo ? `미확인 (${unreadCount})` : `Unread (${unreadCount})`}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('comment')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeFilter === 'comment' 
              ? 'bg-emerald-600 text-white shadow-xs' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          💬 {isKo ? '댓글' : 'Comments'}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('prayer')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeFilter === 'prayer' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🙏 {isKo ? '기도/아멘' : 'Prayers'}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('message')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeFilter === 'message' 
              ? 'bg-indigo-600 text-white shadow-xs' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✉️ {isKo ? '쪽지' : 'Messages'}
        </button>
      </div>

      {/* 알림 목록 */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw size={24} className="animate-spin text-emerald-600" />
            <span className="text-xs">{isKo ? '알림을 불러오는 중...' : 'Loading notifications...'}</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-12 px-4 text-center border-2 border-dashed border-gray-100 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell size={22} className="opacity-40" />
            </div>
            <p className="text-sm font-bold text-gray-700">
              {isKo ? '해당하는 알림이 없습니다 🕊️' : 'No notifications in this category 🕊️'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {isKo ? '새로운 상호작용이 발생하면 여기에 표시됩니다.' : 'New activities will appear here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isUnread = !item.is_read || item.is_read === 0
            return (
              <div
                key={item.id}
                onClick={() => handleClickItem(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 group ${
                  isUnread
                    ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/70 hover:border-emerald-300 shadow-2xs'
                    : 'bg-gray-50/40 border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                {renderIcon(item.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-ping"></span>
                      )}
                      <h4 className={`text-sm truncate ${isUnread ? 'font-extrabold text-gray-950' : 'font-semibold text-gray-700'}`}>
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium shrink-0">
                      {formatTimeAgo(item.created_at)}
                    </span>
                  </div>

                  {item.body && (
                    <p className={`text-xs leading-relaxed line-clamp-2 ${isUnread ? 'text-gray-800' : 'text-gray-500'}`}>
                      {item.body}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/60 text-[11px]">
                    <div className="flex items-center gap-2">
                      {item.sender_name && (
                        <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                          {item.sender_name}
                        </span>
                      )}
                      <span className="text-gray-400">
                        {item.type === 'comment' && (isKo ? '게시물 댓글' : 'Comment')}
                        {item.type === 'amen' && (isKo ? '저도 기도할게요' : 'Prayer Amen')}
                        {item.type === 'urgent_prayer' && (isKo ? '🚨 긴급 중보기도' : '🚨 Urgent Prayer')}
                        {item.type === 'message' && (isKo ? '✉️ 개인 쪽지' : '✉️ Message')}
                        {item.type === 'system' && (isKo ? '시스템 공지' : 'System')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        <span>{isKo ? '바로가기' : 'View'}</span>
                        <ExternalLink size={11} />
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        title={isKo ? '삭제' : 'Delete'}
                        className="p-1 hover:text-rose-600 text-gray-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
