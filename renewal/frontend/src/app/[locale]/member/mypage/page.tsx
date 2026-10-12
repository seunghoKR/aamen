'use client'

import React, { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  User,
  Shield,
  Bell,
  Send,
  Smartphone,
  Lock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Heart,
  MessageSquare,
  FileText,
  Settings,
  Globe,
  LogOut,
  Sparkles,
  Check,
  RefreshCw,
  Clock,
  ShieldCheck,
  Share2,
  Key,
  SmartphoneNfc,
  CheckCircle,
  XCircle,
  X,
} from 'lucide-react'
import { MemberLevel, defaultTierSettings, MemberTierInfo } from '@/lib/store'
import { getStoredTierLevel, TIER_EVENT_NAME, TIER_STORAGE_KEY } from '@/components/common/GlobalTierSimulator'
import { getStoredUser, saveAuthUser, logoutUser, AUTH_EVENT_NAME, type AuthUser } from '@/lib/auth'
import { CHARACTER_LIST, getCharacterItem, CharacterSvg, type CharacterItem } from '@/lib/avatarCharacters'
import {
  getLocalizedTierInfo,
  getLocalizedCountryList,
  getLocalizedCountryName,
  getMyPageTexts,
} from '@/lib/mypageI18n'

export default function MyPage() {
  const locale = useLocale()
  const t = useTranslations('mypage')
  const currentLocale = locale || 'ko'
  const getLocalizedPath = (path: string) => `/${currentLocale}${path.startsWith('/') ? path : `/${path}`}`

  const myTexts = getMyPageTexts(currentLocale)
  const localizedCountries = getLocalizedCountryList(currentLocale)

  const [mounted, setMounted] = useState(false)
  const [currentLevel, setCurrentLevel] = useState<MemberLevel>(0)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const localizedTier = getLocalizedTierInfo(currentLevel, currentLocale)

  // 프로필 정보 (로컬 상태 및 저장)
  const [profileName, setProfileName] = useState('이승호')
  const [profileNameEn, setProfileNameEn] = useState('Seungho Lee')
  const [profileCountry, setProfileCountry] = useState('KR')
  const [profileAffiliation, setProfileAffiliation] = useState('누리오 (개발자)')
  const [profilePhone, setProfilePhone] = useState('+82 10-2345-6789')
  const [isWelcomeBanner, setIsWelcomeBanner] = useState(false)

  // 🎭 인물 캐릭터 이미지 상태 (남·여, 청년·장년, 분위기별 인물 캐릭터)
  const [profileAvatarId, setProfileAvatarId] = useState<string>('m-youth-smart')
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [avatarFilterGender, setAvatarFilterGender] = useState<'all' | 'male' | 'female'>('all')
  const [avatarFilterAge, setAvatarFilterAge] = useState<'all' | 'youth' | 'senior'>('all')
  const currentCharacter = getCharacterItem(profileAvatarId)

  // 🔐 계정 & 보안 상태 (User ID, 비밀번호, Google 연동)
  const [profileId, setProfileId] = useState('admin')
  const [profileEmail, setProfileEmail] = useState('leeshkr@gmail.com')
  const [profilePassword, setProfilePassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // 🧭 프로필 폼 변경 감지용 초기 상태
  const [initialProfile, setInitialProfile] = useState({
    name: '이승호',
    nameEn: 'Seungho Lee',
    affiliation: '누리오 (개발자)',
    country: 'KR',
    phone: '+82 10-2345-6789',
    avatarId: 'm-youth-smart',
  })

  // 🧭 다른 페이지 이동 시도 시 확인 팝업 상태
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [showLeaveModal, setShowLeaveModal] = useState(false)

  // 💡 프로필 수정사항 유무 판별 (Dirty 체크)
  const isProfileDirty = Boolean(
    profileAffiliation !== initialProfile.affiliation ||
    profileName !== initialProfile.name ||
    profileNameEn !== initialProfile.nameEn ||
    profileCountry !== initialProfile.country ||
    profilePhone !== initialProfile.phone ||
    profileAvatarId !== initialProfile.avatarId
  )

  // 🔔 웹앱(PWA) 브라우저 푸시 알림 설정
  const [webPushEnabled, setWebPushEnabled] = useState(true)
  const [notifyPrayer, setNotifyPrayer] = useState(true)
  const [notifyNotice, setNotifyNotice] = useState(true)
  const [notifyComments, setNotifyComments] = useState(false)
  const [pushPermissionStatus, setPushPermissionStatus] = useState<NotificationPermission>('default')

  // ✈️ 텔레그램 알림 설정
  const [telegramEnabled, setTelegramEnabled] = useState(true)
  const [telegramChatId, setTelegramChatId] = useState('5618137472')
  const [telegramEmergencyOnly, setTelegramEmergencyOnly] = useState(false)
  const [isSendingTelegramTest, setIsSendingTelegramTest] = useState(false)

  // 💬 왓츠앱(WhatsApp) 1번 방식 연동 & 소통 설정
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [whatsappCountryCode, setWhatsappCountryCode] = useState('+82')
  const [whatsappPhone, setWhatsappPhone] = useState('010-1234-5678')
  const [whatsappUrgentPrayer, setWhatsappUrgentPrayer] = useState(true)
  const [whatsappWeeklyDigest, setWhatsappWeeklyDigest] = useState(true)
  const [isSendingWhatsAppTest, setIsSendingWhatsAppTest] = useState(false)

  // 🌐 Google 중심 4대 SNS 및 메신저 연동 상태
  const [connectedGoogle, setConnectedGoogle] = useState(true)
  const [connectedWhatsapp, setConnectedWhatsapp] = useState(true)
  const [connectedFacebook, setConnectedFacebook] = useState(true)
  const [facebookProfileName, setFacebookProfileName] = useState('이승호 (Facebook)')
  const [connectedTelegram, setConnectedTelegram] = useState(true)

  // 탭 상태
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'activity' | 'security'>('profile')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 성명에서 직책/괄호 제거하고 순수 이름만 추출하는 헬퍼
  const cleanName = (rawName: string) => {
    if (!rawName) return ''
    const match = rawName.match(/\((.*?)\)/)
    if (match && match[1]) return match[1].trim()
    return rawName.replace(/^개발자\s*관리자\s*|관리자\s*/g, '').trim() || rawName.trim()
  }

  // 국가 코드를 현재 언어에 맞춰 변환하는 헬퍼
  const getCountryDisplayName = (code: string) => {
    return getLocalizedCountryName(code, currentLocale)
  }

  useEffect(() => {
    setMounted(true)
    const storedLvl = getStoredTierLevel()
    setCurrentLevel(storedLvl)

    // 사용자가 직접 입력하여 저장한 프로필 및 계정 정보 확인
    const savedAffiliation = typeof window !== 'undefined' ? localStorage.getItem('aamen_profile_affiliation') : null
    const savedName = typeof window !== 'undefined' ? localStorage.getItem('aamen_profile_name') : null
    const savedNameEn = typeof window !== 'undefined' ? localStorage.getItem('aamen_profile_name_en') : null
    const savedPhone = typeof window !== 'undefined' ? localStorage.getItem('aamen_profile_phone') : null
    const savedAvatar = typeof window !== 'undefined' ? localStorage.getItem('aamen_profile_avatar') : null
    const savedId = typeof window !== 'undefined' ? localStorage.getItem('aamen_profile_id') : null
    const savedPw = typeof window !== 'undefined' ? localStorage.getItem('aamen_profile_password') : null

    let curId = savedId || 'admin'
    let curPw = savedPw || ''
    let curName = savedName || '이승호'
    let curNameEn = savedNameEn || 'Seungho Lee'
    let curEmail = 'leeshkr@gmail.com'
    let curCountry = 'KR'
    let curAffiliation = savedAffiliation || '누리오 (개발자)'
    let curPhone = savedPhone || '+82 10-2345-6789'
    let curAvatar = savedAvatar || 'm-youth-smart'

    if (savedPw) {
      setProfilePassword(savedPw)
    }

    // 텔레그램 알림 설정 불러오기 (저장된 ID가 없으면 기본 5618137472 적용)
    const savedTelegramChatId = typeof window !== 'undefined' ? localStorage.getItem('aamen_telegram_chat_id') : null
    const savedTelegramEnabled = typeof window !== 'undefined' ? localStorage.getItem('aamen_telegram_enabled') : null
    const savedTelegramEmergency = typeof window !== 'undefined' ? localStorage.getItem('aamen_telegram_emergency_only') : null

    if (savedTelegramChatId) {
      setTelegramChatId(savedTelegramChatId)
    } else {
      setTelegramChatId('5618137472')
    }
    if (savedTelegramEnabled !== null) {
      setTelegramEnabled(savedTelegramEnabled === 'true')
    }
    if (savedTelegramEmergency !== null) {
      setTelegramEmergencyOnly(savedTelegramEmergency === 'true')
    }

    // 왓츠앱 설정 불러오기
    const savedWaPhone = typeof window !== 'undefined' ? localStorage.getItem('aamen_whatsapp_phone') : null
    const savedWaCountry = typeof window !== 'undefined' ? localStorage.getItem('aamen_whatsapp_country') : null
    if (savedWaPhone) setWhatsappPhone(savedWaPhone)
    if (savedWaCountry) setWhatsappCountryCode(savedWaCountry)

    // URL 쿼리에 welcome=true가 있거나 신규 구글 가입인 경우 환영 배너 활성화
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchParams.get('welcome') === 'true') {
        setIsWelcomeBanner(true)
      }
    }

    const storedU = getStoredUser()
    setCurrentUser(storedU)
    if (storedU) {
      curId = savedId || storedU.id || 'admin'
      if (!savedName) {
        curName = cleanName(storedU.name) || '이승호'
      }
      curEmail = storedU.email || 'leeshkr@gmail.com'
      if (storedU.country_code) {
        curCountry = storedU.country_code
      }
      if (savedAffiliation) {
        curAffiliation = savedAffiliation
      } else if (storedU.role === 'developer') {
        curAffiliation = '누리오 (개발자)'
      } else if (storedU.role === 'super_admin') {
        curAffiliation = 'AAMEN 총괄 본부 / 한국 메노나이트 교회 연합'
      }
    }

    setProfileId(curId)
    setProfileName(curName)
    setProfileNameEn(curNameEn)
    setProfileEmail(curEmail)
    setProfileCountry(curCountry)
    setProfileAffiliation(curAffiliation)
    setProfilePhone(curPhone)
    setProfileAvatarId(curAvatar)

    // 초기값 세팅 (프로필 폼 변경 감지 기준)
    setInitialProfile({
      name: curName,
      nameEn: curNameEn,
      affiliation: curAffiliation,
      country: curCountry,
      phone: curPhone,
      avatarId: curAvatar,
    })

    // 브라우저 Notification 권한 확인
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermissionStatus(Notification.permission)
    }

    const handleTierChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ level: MemberLevel }>
      if (customEvent.detail && customEvent.detail.level !== undefined) {
        setCurrentLevel(customEvent.detail.level)
      } else {
        setCurrentLevel(getStoredTierLevel())
      }
      const u = getStoredUser()
      setCurrentUser(u)
      if (u) {
        setProfileId(u.id || 'admin')
        setProfileName(cleanName(u.name))
      }
    }

    const handleAuthChange = (e: Event) => {
      const u = getStoredUser()
      setCurrentUser(u)
      setCurrentLevel(getStoredTierLevel())
      if (u) {
        setProfileId(u.id || 'admin')
        setProfileName(cleanName(u.name))
        setProfileEmail(u.email)
      }
    }

    window.addEventListener(TIER_EVENT_NAME, handleTierChange)
    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange)
    return () => {
      window.removeEventListener(TIER_EVENT_NAME, handleTierChange)
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange)
    }
  }, [])

  const currentTier = defaultTierSettings[currentLevel]
  const isGuest = currentLevel === 0

  // 🔔 웹앱 푸시 권한 요청 핸들러
  const requestWebPushPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('이 브라우저는 웹앱 푸시 알림을 지원하지 않습니다.')
      return
    }

    try {
      const perm = await Notification.requestPermission()
      setPushPermissionStatus(perm)
      if (perm === 'granted') {
        setWebPushEnabled(true)
        showToast('🎉 웹앱 팝업 알림이 성공적으로 활성화되었습니다!')
        if ('Notification' in window) {
          new Notification('AAMEN 알림 센터', {
            body: '아시아 13개국 성도들의 기도와 소식이 실시간으로 전달됩니다.',
            icon: '/icon.png',
          })
        }
      } else {
        setWebPushEnabled(false)
        showToast('⚠️ 브라우저 알림 권한이 거부되었습니다.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  // ✈️ 텔레그램 알림 설정 저장 핸들러
  const handleTelegramSave = () => {
    const cleanChatId = telegramChatId.trim()
    if (!cleanChatId) {
      showToast('⚠️ 텔레그램 Chat ID를 입력해 주세요.')
      return
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('aamen_telegram_chat_id', cleanChatId)
      localStorage.setItem('aamen_telegram_enabled', String(telegramEnabled))
      localStorage.setItem('aamen_telegram_emergency_only', String(telegramEmergencyOnly))
    }
    showToast(`🎉 텔레그램 설정이 안전하게 저장되었습니다! (Chat ID: ${cleanChatId})`)
  }

  // ✈️ 텔레그램 실제 봇 API 테스트 알림 전송 핸들러
  const handleTelegramTestSend = async () => {
    const cleanChatId = telegramChatId.trim()
    if (!cleanChatId) {
      showToast('⚠️ 텔레그램 Chat ID를 입력해 주세요.')
      return
    }

    // 발송 시 현재 Chat ID 및 설정을 로컬 스토리지에도 자동 저장!
    if (typeof window !== 'undefined') {
      localStorage.setItem('aamen_telegram_chat_id', cleanChatId)
      localStorage.setItem('aamen_telegram_enabled', String(telegramEnabled))
      localStorage.setItem('aamen_telegram_emergency_only', String(telegramEmergencyOnly))
    }

    setIsSendingTelegramTest(true)
    const testMessage = `🕊️ *[AAMEN 알림 연동 테스트]*\n샬롬! *${profileName || '회원'}*님, AAMEN 공식 봇(@aamen13_bot) 연동이 성공적으로 완료되었습니다.\n\n• 발송 일시: ${new Date().toLocaleString()}\n• 소속 국가: ${getCountryDisplayName(profileCountry)}\n• 소속 사역: ${profileAffiliation || 'AAMEN 네트워크'}\n• 텔레그램 ID: \`${cleanChatId}\`\n\n앞으로 아시아 13개국 긴급 중보기도 및 주요 공지사항이 본 텔레그램으로 실시간 전달됩니다!`

    try {
      const botToken = '8748536633:AAHZLX0sd-05jtTezYsIYFpY-hTYnPRS1qQ'
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: cleanChatId,
          text: testMessage,
          parse_mode: 'Markdown',
        }),
      })

      const data = await res.json()
      if (res.ok && data.ok) {
        showToast(`🎉 텔레그램(ID: ${cleanChatId})으로 테스트 알림이 발송되었습니다!`)
      } else {
        const errorMsg = data.description || '발송 실패'
        console.error('Telegram API error:', data)
        showToast(`⚠️ 텔레그램 발송 실패: ${errorMsg} (봇 대화창에서 /start를 먼저 눌렀는지 확인해 주세요)`)
      }
    } catch (e) {
      console.error(e)
      showToast('⚠️ 텔레그램 통신 중 오류가 발생했습니다. 네트워크 상태를 확인해 주세요.')
    } finally {
      setIsSendingTelegramTest(false)
    }
  }

  // 💬 WhatsApp 설정 저장 핸들러
  const handleWhatsAppSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aamen_whatsapp_phone', whatsappPhone.trim())
      localStorage.setItem('aamen_whatsapp_country', whatsappCountryCode)
      localStorage.setItem('aamen_whatsapp_urgent', String(whatsappUrgentPrayer))
      localStorage.setItem('aamen_whatsapp_weekly', String(whatsappWeeklyDigest))
    }
    showToast('🎉 WhatsApp 알림 및 연동 정보가 안전하게 저장되었습니다.')
  }

  // 💬 WhatsApp 테스트 알림 및 링크 전송 핸들러 (1번 무료 방식)
  const handleWhatsAppTestSend = () => {
    if (!whatsappPhone.trim()) {
      showToast('⚠️ WhatsApp 휴대폰 번호를 입력해 주세요.')
      return
    }
    setIsSendingWhatsAppTest(true)
    setTimeout(() => {
      setIsSendingWhatsAppTest(false)
      const fullPhone = `${whatsappCountryCode}${whatsappPhone.replace(/[^0-9]/g, '')}`
      const testMsg = `🕊️ *[AAMEN 알림 연동 테스트]*\n샬롬! ${profileName}님, 왓츠앱 번호(${fullPhone})로 AAMEN 네트워크 알림 설정이 완료되었습니다.`
      window.open(`https://wa.me/?text=${encodeURIComponent(testMsg)}`, '_blank')
      showToast('💬 WhatsApp 테스트 창이 열렸습니다!')
    }, 600)
  }

  // 💾 기본 회원 프로필 (이름, 소속교회, 국가, 연락처) 직접 저장 핸들러
  const handleProfileSave = (e?: React.FormEvent, onSuccess?: () => void) => {
    if (e) e.preventDefault()

    const cleanLocalName = profileName.trim()
    const cleanEnName = profileNameEn.trim()
    const cleanAffiliation = profileAffiliation.trim()
    const cleanPhone = profilePhone.trim()

    if (!cleanLocalName) {
      showToast('⚠️ [필수] 이름을 입력해 주세요.')
      return
    }
    if (!cleanAffiliation) {
      showToast('⚠️ [필수] 소속 교회 / 선교 단체(기관)명을 입력해 주세요.')
      return
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('aamen_profile_name', cleanLocalName)
      localStorage.setItem('aamen_profile_name_en', cleanEnName)
      localStorage.setItem('aamen_profile_affiliation', cleanAffiliation)
      localStorage.setItem('aamen_profile_phone', cleanPhone)
      localStorage.setItem('aamen_profile_avatar', profileAvatarId)

      // AuthUser 동기화 (헤더와 사이트 전역에 반영)
      if (currentUser) {
        const updated: AuthUser = {
          ...currentUser,
          name: cleanLocalName,
          country_code: profileCountry,
        }
        saveAuthUser(updated)
        setCurrentUser(updated)
      }
    }

    // 초기값 갱신 -> isProfileDirty가 false로 초기화됨!
    setInitialProfile({
      name: cleanLocalName,
      nameEn: cleanEnName,
      affiliation: cleanAffiliation,
      country: profileCountry,
      phone: cleanPhone,
      avatarId: profileAvatarId,
    })

    setIsWelcomeBanner(false)
    showToast('🎉 기본 프로필(이름, 소속교회, 캐릭터)이 성공적으로 저장되었습니다!')
    if (onSuccess) onSuccess()
  }

  // 🔑 계정 & 보안: 로그인 아이디(User ID) 저장 핸들러
  const handleSaveUserId = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const cleanId = profileId.trim()
    if (!cleanId) {
      showToast('⚠️ [필수] 로그인 아이디(User ID)를 입력해 주세요.')
      return
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('aamen_profile_id', cleanId)
      if (currentUser) {
        const updated: AuthUser = {
          ...currentUser,
          id: cleanId,
        }
        saveAuthUser(updated)
        setCurrentUser(updated)
      }
    }
    showToast('🎉 로그인 아이디가 성공적으로 저장되었습니다!')
  }

  // 🔒 계정 & 보안: 비밀번호 저장/변경 핸들러
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanNewPw = newPassword.trim()
    const cleanConfirm = confirmPassword.trim()

    if (!cleanNewPw) {
      showToast('⚠️ 새 비밀번호를 입력해 주세요.')
      return
    }
    if (cleanNewPw.length < 6) {
      showToast('⚠️ 비밀번호는 6자 이상으로 설정해 주세요.')
      return
    }
    if (cleanNewPw !== cleanConfirm) {
      showToast('⚠️ 새 비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('aamen_profile_password', cleanNewPw)
      setProfilePassword(cleanNewPw)
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    showToast('🎉 비밀번호가 안전하게 변경되었습니다!')
  }

  // 🧭 수정사항이 있을 때 다른 페이지 이동 시도 감지 및 팝업 안내창 띄우기
  useEffect(() => {
    if (!isProfileDirty) return

    // 1. 브라우저 창 닫기/새로고침 감지
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    // 2. 페이지 내부 모든 링크 (Header, Footer, 네비게이션) 클릭 가로채기
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target || !target.href || target.href.startsWith('javascript:')) return

      try {
        const url = new URL(target.href, window.location.href)
        const currentUrl = new URL(window.location.href)
        if (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search) {
          e.preventDefault()
          e.stopPropagation()
          setPendingNavigation(target.href)
          setShowLeaveModal(true)
        }
      } catch (err) {
        // url 파싱 실패 시 무시
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('click', handleAnchorClick, true)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('click', handleAnchorClick, true)
    }
  }, [isProfileDirty])

  // 🧭 마이페이지 내부 탭 전환 시에도 수정사항 있을 경우 팝업 안내
  const handleTabChange = (newTab: 'profile' | 'notifications' | 'activity' | 'security') => {
    if (activeTab === 'profile' && isProfileDirty) {
      setPendingNavigation(`tab:${newTab}`)
      setShowLeaveModal(true)
      return
    }
    setActiveTab(newTab)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col antialiased">
      <Header />

      {/* 상단 배너 */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* 🎭 대표 캐릭터 이미지 (클릭 시 변경 팝업) */}
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              title={myTexts.changeCharacterBtn}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl overflow-hidden border-2 border-white/50 shadow-xl shrink-0 relative group cursor-pointer transition-transform hover:scale-105 select-none bg-white p-0.5"
            >
              {isGuest ? (
                <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-100 text-gray-400">
                  👤
                </div>
              ) : (
                <CharacterSvg id={profileAvatarId} className="w-full h-full rounded-[22px]" />
              )}
              <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                ✏️
              </div>
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-baseline gap-2 flex-wrap">
                  <span>{isGuest ? t('guest_title') : (currentLocale === 'ko' ? `${cleanName(profileName)} 님` : currentLocale === 'ja' ? `${cleanName(profileName)} 様` : cleanName(profileName))}</span>
                  {!isGuest && profileNameEn && (
                    <span className="text-xs sm:text-sm font-semibold text-emerald-200/90 font-sans">
                      ({profileNameEn})
                    </span>
                  )}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black shadow-xs border ${
                    isGuest
                      ? 'bg-gray-800 text-gray-300 border-gray-700'
                      : currentUser?.role === 'developer'
                      ? 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40'
                      : currentLevel >= 4
                      ? 'bg-purple-500/20 text-purple-200 border-purple-400/40'
                      : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                  }`}
                >
                  {currentUser?.role === 'developer' ? t('developer_badge') : localizedTier.name}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 font-medium">
                {profileAffiliation}
              </p>
            </div>
          </div>

          {/* 우측 퀵 액션 */}
          <div className="flex items-center gap-2.5">
            {isGuest ? (
              <>
                <Link
                  href={getLocalizedPath('/member/login')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <Lock size={14} />
                  <span>{t('login_btn')}</span>
                </Link>
                <Link
                  href={getLocalizedPath('/member/signup')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl backdrop-blur-md border border-white/20 transition-all"
                >
                  <span>{t('signup_btn')}</span>
                </Link>
              </>
            ) : (
              <>
                {(currentUser?.role === 'developer' || currentUser?.role === 'super_admin' || currentLevel >= 4) && (
                  <Link
                    href={getLocalizedPath('/admin')}
                    className="px-4 py-2 bg-indigo-500/80 hover:bg-indigo-600 text-white font-bold text-xs rounded-2xl backdrop-blur-md border border-indigo-400/30 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Settings size={14} />
                    <span>{currentUser?.role === 'developer' ? (currentLocale === 'ko' ? '개발자 콘솔' : 'Developer Console') : (currentLocale === 'ko' ? '관리자 대시보드' : 'Admin Dashboard')}</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logoutUser()
                    alert('로그아웃되었습니다.')
                  }}
                  className="px-4 py-2 bg-rose-500/80 hover:bg-rose-600 text-white font-bold text-xs rounded-2xl backdrop-blur-md border border-rose-400/30 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>{t('logout_btn')}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 본문 컨테이너 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 mb-16 w-full flex-1">
        {/* 토스트 메시지 */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-950 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-emerald-400 animate-in fade-in slide-in-from-top-2">
            {toastMessage}
          </div>
        )}

        {/* 🎉 Google 인증 완료 환영 및 필수 입력 가이드 배너 */}
        {isWelcomeBanner && (
          <div className="mb-6 p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl shadow-lg border border-emerald-400/40 animate-in fade-in slide-in-from-top-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 shadow-xs">
                🎉
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base sm:text-lg font-black tracking-tight">
                    Google 계정 인증이 완료되었습니다!
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-white text-emerald-900 text-[10px] font-black">
                    기본 연동 완료
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  AAMEN 13개국 정회원 활동을 위해 기본 프로필의 <strong>[이름(현지어/영문), 소속교회]</strong> 필수 정보를 입력해 주세요.<br className="hidden sm:inline" />
                  (로그인 아이디·비밀번호 설정 및 추가 메신저 연동은 <strong>[계정 &amp; 보안]</strong> 탭에서 언제든 진행하실 수 있습니다)
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWelcomeBanner(false)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 self-end sm:self-auto"
            >
              확인
            </button>
          </div>
        )}

        {/* 비회원(0단계) 상태일 때 로그인 유도 알림 배너 */}
        {isGuest && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔒</span>
              <div>
                <h3 className="font-extrabold text-amber-950 text-sm sm:text-base">
                  {t('guest_banner_title')}
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  {t('guest_banner_desc')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={getLocalizedPath('/member/login')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                {t('login_btn')}
              </Link>
              <Link
                href={getLocalizedPath('/member/signup')}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all"
              >
                {t('signup_btn')}
              </Link>
            </div>
          </div>
        )}

        {/* 탭 네비게이션 (13개국어 완벽 대응: 반응형 4분할 그리드 & 잘림 없는 카드) */}
        <div className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-md border border-gray-200/80 mb-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => handleTabChange('profile')}
              className={`w-full min-h-[46px] sm:min-h-[50px] px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center text-center gap-1.5 sm:gap-2 cursor-pointer break-keep select-none ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                  : 'text-gray-700 bg-gray-50/80 hover:bg-emerald-50/60 hover:text-emerald-800 border border-gray-200/60'
              }`}
            >
              <User size={15} className={`shrink-0 ${activeTab === 'profile' ? 'text-white' : 'text-emerald-600'}`} />
              <span className="truncate sm:whitespace-normal">{t('tabs.profile')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('notifications')}
              className={`w-full min-h-[46px] sm:min-h-[50px] px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center text-center gap-1.5 sm:gap-2 cursor-pointer break-keep select-none relative ${
                activeTab === 'notifications'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                  : 'text-gray-700 bg-gray-50/80 hover:bg-emerald-50/60 hover:text-emerald-800 border border-gray-200/60'
              }`}
            >
              <Bell size={15} className={`shrink-0 ${activeTab === 'notifications' ? 'text-white' : 'text-emerald-600'}`} />
              <span className="truncate sm:whitespace-normal">{t('tabs.notifications')}</span>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === 'notifications' ? 'bg-amber-300' : 'bg-emerald-500'}`}></span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('activity')}
              className={`w-full min-h-[46px] sm:min-h-[50px] px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center text-center gap-1.5 sm:gap-2 cursor-pointer break-keep select-none ${
                activeTab === 'activity'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                  : 'text-gray-700 bg-gray-50/80 hover:bg-emerald-50/60 hover:text-emerald-800 border border-gray-200/60'
              }`}
            >
              <Heart size={15} className={`shrink-0 ${activeTab === 'activity' ? 'text-white' : 'text-rose-500'}`} />
              <span className="truncate sm:whitespace-normal">{t('tabs.activity')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('security')}
              className={`w-full min-h-[46px] sm:min-h-[50px] px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center text-center gap-1.5 sm:gap-2 cursor-pointer break-keep select-none ${
                activeTab === 'security'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                  : 'text-gray-700 bg-gray-50/80 hover:bg-emerald-50/60 hover:text-emerald-800 border border-gray-200/60'
              }`}
            >
              <Lock size={15} className={`shrink-0 ${activeTab === 'security' ? 'text-white' : 'text-slate-600'}`} />
              <span className="truncate sm:whitespace-normal">{t('tabs.security')}</span>
            </button>
          </div>
        </div>

        {/* 탭 1: 프로필 & 권한 현황 */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 좌측 2열: 내 기본 정보 카드 */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                  <User size={18} className="text-emerald-600" />
                  <span>{t('profile.title')}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t('profile.subtitle')}
                </p>
              </div>

              {/* 프로필 폼 */}
              <form onSubmit={handleProfileSave} className="space-y-4">
                {/* 🌟 1. 내 캐릭터 이미지 (남·여, 청년·장년, 분위기별 선택) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-indigo-50/40 border border-emerald-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 relative group cursor-pointer transition-transform hover:scale-105 bg-white p-0.5"
                      title="Click to change avatar"
                    >
                      <CharacterSvg id={profileAvatarId} className="w-full h-full rounded-[14px]" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-gray-500">{myTexts.selectedCharacter}</span>
                        <h4 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                          {currentCharacter.title}
                        </h4>
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {currentCharacter.gender === 'male' ? myTexts.filterMale : myTexts.filterFemale} · {currentCharacter.ageGroup === 'youth' ? myTexts.filterYouth : myTexts.filterSenior}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-950 font-bold mt-0.5">
                        ✨ {currentCharacter.mood}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        {currentCharacter.hairDesc} · {currentCharacter.skinDesc} · {currentCharacter.outfitDesc}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Sparkles size={14} className="text-emerald-600" />
                    <span>{myTexts.changeCharacterBtn}</span>
                  </button>
                </div>

                {/* 2. 소속 교회 / 선교 단체 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-emerald-50/40 border border-emerald-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <span>⛪ {t('profile.affiliation')}</span>
                      <span className="text-[10px] font-black text-rose-500">*{myTexts.required}</span>
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      required
                      value={profileAffiliation}
                      onChange={(e) => setProfileAffiliation(e.target.value)}
                      placeholder={myTexts.affiliationPlaceholder}
                      className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-xs sm:text-sm font-bold text-gray-900 focus:outline-emerald-600 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleProfileSave()}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer text-center"
                    >
                      {myTexts.saveAffiliation}
                    </button>
                  </div>
                </div>

                {/* 2. 이름 (Name) - 본인 국가 언어 & 영문명 */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <span>👤 {myTexts.nameSection}</span>
                      <span className="text-[10px] font-black text-rose-500">*{myTexts.required}</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* 본인 국가 언어 이름 */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-gray-600">
                        {t('profile.name')}
                      </label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="예: 이승호, Somchai, Nguyễn 등"
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-xs sm:text-sm font-extrabold text-gray-900 focus:outline-emerald-600 shadow-2xs"
                      />
                    </div>

                    {/* 영문 이름 */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-gray-600">
                        {t('profile.name_en')}
                      </label>
                      <input
                        type="text"
                        value={profileNameEn}
                        onChange={(e) => setProfileNameEn(e.target.value)}
                        placeholder="예: Seungho Lee, Somchai Prasert"
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-xs sm:text-sm font-bold text-gray-900 focus:outline-emerald-600 shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. 소속 국가 & 연락처 카드 그리드 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* 소속 국가 */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                    <label className="block text-[11px] font-bold text-gray-500">{t('profile.country')}</label>
                    <select
                      value={profileCountry}
                      onChange={(e) => setProfileCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-xs sm:text-sm font-bold text-gray-900 focus:outline-emerald-600 shadow-2xs"
                    >
                      {localizedCountries.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 연락처 (전화번호) */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                    <label className="block text-[11px] font-bold text-gray-500">{t('profile.phone')}</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+82 10-2345-6789"
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-xs sm:text-sm font-mono font-bold text-gray-900 focus:outline-emerald-600 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 하단 변경사항 저장 알림 바 */}
                <div className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isProfileDirty
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}>
                  <div className="flex items-center gap-2 text-xs">
                    <span>{isProfileDirty ? '⚠️' : '✅'}</span>
                    <span className="font-bold">
                      {isProfileDirty
                        ? myTexts.dirtyWarning
                        : myTexts.cleanStatus}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer shrink-0 ${
                      isProfileDirty
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/30'
                        : 'bg-emerald-700/80 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {myTexts.saveProfileBtn}
                  </button>
                </div>
              </form>
            </div>

            {/* 우측 1열: 등급 및 권한 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
                  <Shield size={18} className="text-emerald-600" />
                  <h3 className="text-base font-black text-gray-900">{t('tier.title')}</h3>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-emerald-950">
                      {t('tier.current_level', { name: localizedTier.name })}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      Level {currentLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    {localizedTier.desc}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                    <span className="text-gray-600">{t('tier.permission_prayers')}</span>
                    <span className={currentLevel >= 2 ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                      {currentLevel >= 2 ? t('tier.allowed') : t('tier.masked')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                    <span className="text-gray-600">{t('tier.permission_write')}</span>
                    <span className={currentTier.permissions.canWritePost ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                      {currentTier.permissions.canWritePost ? t('tier.allowed') : t('tier.restricted')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                    <span className="text-gray-600">{t('tier.permission_download')}</span>
                    <span className={currentTier.permissions.canDownloadFiles ? 'text-emerald-700 font-bold' : 'text-gray-400'}>
                      {currentTier.permissions.canDownloadFiles ? t('tier.allowed') : t('tier.masked')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                    <span className="text-gray-600">{t('tier.permission_manage')}</span>
                    <span className={currentTier.permissions.canManageBoard ? 'text-purple-700 font-bold' : 'text-gray-400'}>
                      {currentTier.permissions.canManageBoard ? myTexts.adminPerm : myTexts.noPerm}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                    <span className="text-gray-600">{t('tier.permission_admin')}</span>
                    <span className={currentTier.permissions.canAccessAdmin ? 'text-purple-700 font-bold' : 'text-gray-400'}>
                      {currentLevel === 5 ? myTexts.superApproved : currentLevel === 4 ? myTexts.leaderApproved : myTexts.restrictedAccess}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-500">
                {myTexts.simulatorNote}
              </div>
            </div>
          </div>
        )}

        {/* 탭 2: 알림 설정 센터 (웹앱 팝업 & 텔레그램 & 왓츠앱) */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* 💡 선택 사항 안내 배너 */}
            <div className="p-4 rounded-2xl bg-gray-100/90 border border-gray-200 text-gray-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🔔</span>
                <span className="font-bold">
                  {myTexts.notificationOptionalDesc}
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                {myTexts.optionalBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. 웹앱 브라우저 푸시 팝업 알림 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-emerald-100 text-emerald-800 rounded-2xl">
                      <Smartphone size={20} />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-gray-900">
                        {t('notifications.web_push_title')}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {t('notifications.web_push_desc')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 mb-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">{t('notifications.web_push_status')}</span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      {pushPermissionStatus === 'granted'
                        ? t('notifications.web_push_granted')
                        : pushPermissionStatus === 'denied'
                        ? t('notifications.web_push_denied')
                        : t('notifications.web_push_prompt')}
                    </span>
                  </div>
                  {pushPermissionStatus !== 'granted' && (
                    <button
                      onClick={requestWebPushPermission}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      {t('notifications.web_push_btn_enable')}
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100/70 transition-all">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                        중보기도 신규 등록 실시간 팝업
                      </span>
                      <span className="text-[11px] text-gray-500">
                        내가 소속된 국가 및 관심 사역지의 새 기도제목 알림
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyPrayer}
                      onChange={(e) => setNotifyPrayer(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100/70 transition-all">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                        AAMEN 총괄 본부 공지 및 행사 알림
                      </span>
                      <span className="text-[11px] text-gray-500">
                        컨퍼런스, 교육 세미나, 긴급 구호 소식
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyNotice}
                      onChange={(e) => setNotifyNotice(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100/70 transition-all">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                        내 기도제목에 달린 댓글 및 '아멘' 반응
                      </span>
                      <span className="text-[11px] text-gray-500">
                        다른 지체가 내 글에 중보기도로 동참했을 때
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifyComments}
                      onChange={(e) => setNotifyComments(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'Notification' in window) {
                      new Notification('AAMEN 테스트 알림 🕊️', {
                        body: '13개국 웹앱 실시간 브라우저 푸시 알림이 정상적으로 작동하고 있습니다!',
                        icon: '/logo.png',
                      })
                      showToast('🚀 화면에 테스트 알림 팝업이 전송되었습니다!')
                    } else {
                      showToast('이 브라우저는 알림을 지원하지 않습니다.')
                    }
                  }}
                  className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-emerald-600" />
                  <span>{t('notifications.web_push_btn_test')}</span>
                </button>
                <button
                  onClick={() => showToast('웹앱 푸시 알림 설정이 안전하게 저장되었습니다.')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  푸시 설정 저장
                </button>
              </div>
            </div>

            {/* 2. 텔레그램 봇 실시간 알림 카드 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-sky-100 text-sky-800 rounded-2xl">
                      <Send size={20} />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                        <span>{t('notifications.telegram_title')}</span>
                      </h3>
                      <p className="text-xs text-gray-500">
                        {t('notifications.telegram_desc')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-950 block">
                      {t('notifications.telegram_id_label')}
                    </span>
                    <a
                      href="https://t.me/aamen13_bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-sky-700 hover:underline flex items-center gap-1"
                    >
                      <span>봇 시작하기 (@aamen13_bot)</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="예: 781920394 또는 @username"
                      value={telegramChatId}
                      onChange={(e) => setTelegramChatId(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-sky-200 text-xs sm:text-sm font-mono font-bold focus:outline-sky-500"
                    />
                    <button
                      type="button"
                      onClick={handleTelegramTestSend}
                      disabled={isSendingTelegramTest}
                      className="px-3.5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {isSendingTelegramTest ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                      <span>{t('notifications.telegram_test_btn')}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100/70 transition-all">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                        텔레그램 알림 수신 활성화
                      </span>
                      <span className="text-[11px] text-gray-500">
                        AAMEN 네트워크의 공지 및 기도를 텔레그램으로 수신
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={telegramEnabled}
                      onChange={(e) => setTelegramEnabled(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded-md focus:ring-sky-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100/70 transition-all">
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                        긴급 기도제목만 선별 수신
                      </span>
                      <span className="text-[11px] text-gray-500">
                        자연재해, 분쟁 등 각국 코디네이터가 발송한 긴급 중보기도만 수신
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={telegramEmergencyOnly}
                      onChange={(e) => setTelegramEmergencyOnly(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded-md focus:ring-sky-500"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleTelegramSave}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {t('notifications.telegram_save_btn')}
                </button>
              </div>
            </div>

            {/* 3. 💬 왓츠앱(WhatsApp) 메신저 알림 & 소통 연동 카드 (1번 무료 방식) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between lg:col-span-2">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-emerald-100 text-emerald-800 rounded-2xl">
                      <MessageSquare size={20} />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                        <span>{t('notifications.whatsapp_title')}</span>
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {t('notifications.whatsapp_badge')}
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500">
                        {t('notifications.whatsapp_desc')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* 좌측: 전화번호 등록 및 테스트 */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block mb-1">
                        {t('notifications.whatsapp_phone_label')} (국가번호 + 번호)
                      </span>
                      <p className="text-[11px] text-emerald-700 mb-3">
                        등록하신 번호로 긴급 기도제목과 13개국 사역자 단체방 초대 링크가 발송됩니다.
                      </p>

                      <div className="flex items-center gap-2 mb-2">
                        <select
                          value={whatsappCountryCode}
                          onChange={(e) => setWhatsappCountryCode(e.target.value)}
                          className="px-2.5 py-2 bg-white rounded-xl border border-emerald-200 text-xs font-bold focus:outline-emerald-500 shrink-0"
                        >
                          <option value="+82">🇰🇷 +82 (한국)</option>
                          <option value="+62">🇮🇩 +62 (인도네시아)</option>
                          <option value="+66">🇹🇭 +66 (태국)</option>
                          <option value="+84">🇻🇳 +84 (베트남)</option>
                          <option value="+95">🇲🇲 +95 (미얀마)</option>
                          <option value="+91">🇮🇳 +91 (인도)</option>
                          <option value="+977">🇳🇵 +977 (네팔)</option>
                          <option value="+81">🇯🇵 +81 (일본)</option>
                          <option value="+855">🇰🇭 +855 (캄보디아)</option>
                          <option value="+856">🇱🇦 +856 (라오스)</option>
                          <option value="+1">🇺🇸 +1 (미국)</option>
                        </select>

                        <input
                          type="text"
                          placeholder="010-1234-5678"
                          value={whatsappPhone}
                          onChange={(e) => setWhatsappPhone(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white rounded-xl border border-emerald-200 text-xs font-mono font-bold focus:outline-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleWhatsAppTestSend}
                      disabled={isSendingWhatsAppTest}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      {isSendingWhatsAppTest ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                      <span>{t('notifications.whatsapp_test_btn')}</span>
                    </button>
                  </div>

                  {/* 우측: 1:1 대화 및 단체방 퀵 액션 */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block mb-1">
                        사역 연대 바로가기 (무료 Deep Link)
                      </span>
                      <p className="text-[11px] text-gray-500 mb-3">
                        AAMEN 총괄 본부와 1:1 상담 및 사역자 단체방에 바로 입장하실 수 있습니다.
                      </p>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            window.open('https://wa.me/821023456789?text=샬롬!%20AAMEN%20회원%20사역%20문의드립니다.', '_blank')
                          }}
                          className="w-full p-2.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-xs text-gray-800 font-bold flex items-center justify-between transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span>💬</span>
                            <span>{t('notifications.whatsapp_direct_chat')}</span>
                          </span>
                          <ExternalLink size={13} className="text-gray-400" />
                        </button>

                        <button
                          onClick={() => {
                            if (currentLevel < 2) {
                              alert('🔒 13개국 사역자 단체방 초대는 2단계 정회원 이상 승인 회원에게만 제공됩니다.')
                              return
                            }
                            window.open('https://chat.whatsapp.com/sampleInviteCode', '_blank')
                          }}
                          className="w-full p-2.5 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 text-xs text-gray-800 font-bold flex items-center justify-between transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span>👥</span>
                            <span>{t('notifications.whatsapp_group_chat')}</span>
                          </span>
                          <ExternalLink size={13} className="text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={whatsappUrgentPrayer}
                          onChange={(e) => setWhatsappUrgentPrayer(e.target.checked)}
                          className="w-3.5 h-3.5 text-emerald-600 rounded-md focus:ring-emerald-500"
                        />
                        <span className="text-[11px] text-gray-600 font-semibold">긴급 기도 실시간 수신</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={whatsappWeeklyDigest}
                          onChange={(e) => setWhatsappWeeklyDigest(e.target.checked)}
                          className="w-3.5 h-3.5 text-emerald-600 rounded-md focus:ring-emerald-500"
                        />
                        <span className="text-[11px] text-gray-600 font-semibold">주간 사역 다이제스트 수신</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleWhatsAppSave}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {t('notifications.whatsapp_save_btn')}
                </button>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* 탭 3: 내 활동 및 기도 보관함 */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
            <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
              <Heart size={18} className="text-rose-500" />
              <span>{t('activity.title')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100">
                <span className="text-xs font-bold text-rose-800 block">{t('activity.amen_count')}</span>
                <span className="text-2xl font-black text-rose-950 mt-1 block">24 회</span>
                <p className="text-[11px] text-rose-700/80 mt-1">{t('activity.amen_desc')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800 block">{t('activity.my_prayers')}</span>
                <span className="text-2xl font-black text-emerald-950 mt-1 block">3 건</span>
                <p className="text-[11px] text-emerald-700/80 mt-1">{t('activity.my_prayers_desc')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                <span className="text-xs font-bold text-purple-800 block">{t('activity.my_posts')}</span>
                <span className="text-2xl font-black text-purple-950 mt-1 block">8 개</span>
                <p className="text-[11px] text-purple-700/80 mt-1">{t('activity.my_posts_desc')}</p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 font-bold text-xs text-gray-700">
                {t('activity.recent_prayers_title')}
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                <div className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] mr-2">
                      🇲🇲 미얀마
                    </span>
                    <span className="font-bold text-gray-800">Zaw Min 목사님의 신학교 교육 프로그램 평화 워크숍</span>
                    <span className="text-gray-400 text-[11px] block mt-0.5">2026-09-28 동참</span>
                  </div>
                  <span className="text-rose-600 font-bold flex items-center gap-1 shrink-0">
                    <Heart size={12} className="fill-rose-500" /> {t('activity.amen_completed')}
                  </span>
                </div>

                <div className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] mr-2">
                      🇻🇳 베트남
                    </span>
                    <span className="font-bold text-gray-800">Sarah Nguyen 사역자님의 현지 주일학교 교사 훈련</span>
                    <span className="text-gray-400 text-[11px] block mt-0.5">2026-09-27 동참</span>
                  </div>
                  <span className="text-rose-600 font-bold flex items-center gap-1 shrink-0">
                    <Heart size={12} className="fill-rose-500" /> {t('activity.amen_completed')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 탭 4: Google 중심 4대 SNS 연동 & 계정 보안 */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* 💡 선택 사항 및 Google 기본 연동 안내 배너 */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <span className="font-bold">
                  <strong>Google 계정은 기본 연동(수정 불가)</strong>이며, WhatsApp · Facebook · Telegram 등 추가 SNS 연동은 <strong>선택 사항</strong>입니다.
                </span>
              </div>
              <span className="text-[10px] font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                Google 기본 연동
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 좌측: Google 중심 소셜 & 메신저 연동 관리 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                  <Share2 size={18} className="text-emerald-600" />
                  <span>{t('social_accounts.title')}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {t('social_accounts.subtitle')}
                </p>
              </div>

              <div className="space-y-3.5">
                {/* 1. Google 계정 (기본 메인 연동) */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-gray-900">{t('social_accounts.google_title')}</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                          {t('social_accounts.google_status_connected')}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">{profileEmail}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-3 py-1.5 rounded-xl shrink-0">
                    기본 계정
                  </span>
                </div>

                {/* 2. WhatsApp 메신저 (동남아·남아시아 표준) */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-gray-900">{t('social_accounts.whatsapp_title')}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          connectedWhatsapp ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {connectedWhatsapp ? t('social_accounts.status_connected') : t('social_accounts.status_disconnected')}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {connectedWhatsapp ? `${whatsappCountryCode} ${whatsappPhone}` : t('social_accounts.whatsapp_desc')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setConnectedWhatsapp(!connectedWhatsapp)
                      showToast(connectedWhatsapp ? 'WhatsApp 연동이 해제되었습니다.' : 'WhatsApp 번호가 성공적으로 연동되었습니다!')
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      connectedWhatsapp
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {connectedWhatsapp ? t('social_accounts.disconnect_btn') : t('social_accounts.connect_btn')}
                  </button>
                </div>

                {/* 3. Facebook 계정 (미얀마·캄보디아·라오스 핵심) */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs font-black text-lg">
                        f
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-extrabold text-gray-900">{t('social_accounts.facebook_title')}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            connectedFacebook ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {connectedFacebook ? '✅ 연동 완료' : t('social_accounts.status_disconnected')}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {connectedFacebook ? facebookProfileName : t('social_accounts.facebook_desc')}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!connectedFacebook) {
                          setConnectedFacebook(true)
                          setFacebookProfileName(`${cleanName(profileName)} (Facebook)`)
                          showToast('🎉 Facebook 계정 연동이 성공적으로 활성화되었습니다!')
                        } else {
                          setConnectedFacebook(false)
                          showToast('Facebook 연동이 해제되었습니다.')
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        connectedFacebook
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-[#1877F2] hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {connectedFacebook ? t('social_accounts.disconnect_btn') : 'Facebook 연동하기'}
                    </button>
                  </div>

                  {/* 💡 페이스북 연동 방식 설명 배너 */}
                  <div className="pt-2 border-t border-indigo-100 text-[11px] text-indigo-900/80 leading-relaxed flex items-center gap-1.5">
                    <span>💡</span>
                    <span>
                      <strong>연동 방법:</strong> [Facebook 연동하기] 버튼을 누르면 Meta 공식 로그인 팝업을 통해 내 페이스북 프로필과 AAMEN 계정이 1:1로 안전하게 매칭됩니다. (미얀마·캄보디아·라오스 사역 네트워크 전용)
                    </span>
                  </div>
                </div>

                {/* 4. Telegram 계정 (보안 및 채널 알림) */}
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2AABEE] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Send size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-gray-900">{t('social_accounts.telegram_title')}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          connectedTelegram ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {connectedTelegram ? t('social_accounts.status_connected') : t('social_accounts.status_disconnected')}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                        {connectedTelegram ? `ID: ${telegramChatId}` : t('social_accounts.telegram_desc')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setConnectedTelegram(!connectedTelegram)
                      showToast(connectedTelegram ? 'Telegram 연동이 해제되었습니다.' : 'Telegram 계정이 안전하게 연동되었습니다!')
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      connectedTelegram
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-[#2AABEE] hover:bg-sky-600 text-white shadow-xs'
                    }`}
                  >
                    {connectedTelegram ? t('social_accounts.disconnect_btn') : t('social_accounts.connect_btn')}
                  </button>
                </div>
              </div>
            </div>

            {/* 우측: ID / 비밀번호 관리 및 2차 보안 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                    <Key size={18} className="text-gray-700" />
                    <span>아이디 / 비밀번호 관리 및 계정 보안</span>
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    계정 보안 센터
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  {t('security.pw_hint')}
                </p>

                {/* 🔑 1. 로그인 아이디 (User ID) 설정 / 변경 */}
                <div className="p-4.5 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/40 border border-emerald-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <span>🔑 로그인 아이디 (User ID)</span>
                      <span className="text-[10px] font-black text-rose-500">*필수</span>
                    </label>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock size={9} />
                      <span>Google 연동 식별자: {profileEmail}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={profileId}
                      onChange={(e) => setProfileId(e.target.value)}
                      placeholder="로그인 아이디를 입력하세요"
                      className="flex-1 px-3.5 py-2.5 bg-white rounded-xl border border-emerald-300 text-xs sm:text-sm font-black font-mono text-emerald-950 focus:outline-emerald-600 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={handleSaveUserId}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      아이디 저장
                    </button>
                  </div>
                </div>

                {/* 🔒 2. 로그인 비밀번호 변경 폼 */}
                <form onSubmit={handleSavePassword} className="space-y-3.5 text-xs sm:text-sm pt-1">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{t('security.current_pw')}</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="기존 비밀번호 (신규 설정 시 생략 가능)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-emerald-600 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{t('security.new_pw')}</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="6자 이상 영문, 숫자 조합"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-emerald-600 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{t('security.confirm_pw')}</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="새 비밀번호 다시 입력 확인"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-emerald-600 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md cursor-pointer text-xs"
                    >
                      {t('security.save_pw')}
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 mt-4">
                <span className="font-bold block mb-0.5">🔒 계정 보안 팁</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Google 계정 연동을 유지하시면 비밀번호 유출 위험 없이 언제 어디서나 안전하고 신속하게 로그인하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* 🎭 아시아 13개국 인물 캐릭터 선택 모달 (Character Avatar Picker Modal) */}
        {isAvatarModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 animate-in zoom-in-95 overflow-hidden">
              {/* 모달 상단 헤더 */}
              <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                    🎨
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                      {myTexts.charModalTitle}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {myTexts.charModalDesc}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm transition-colors cursor-pointer shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* 필터 탭 (성별 & 연령대) */}
              <div className="px-5 sm:px-6 pt-3 pb-2.5 bg-gray-50/80 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2.5">
                {/* 1. 성별 필터 */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-gray-500 mr-1">{myTexts.genderLabel}</span>
                  {[
                    { id: 'all', label: myTexts.filterAll },
                    { id: 'male', label: `${myTexts.filterMale} (8)` },
                    { id: 'female', label: `${myTexts.filterFemale} (8)` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAvatarFilterGender(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        avatarFilterGender === tab.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 2. 연령대 필터 */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-gray-500 mr-1">{myTexts.ageLabel}</span>
                  {[
                    { id: 'all', label: myTexts.filterAll },
                    { id: 'youth', label: `${myTexts.filterYouth} (8)` },
                    { id: 'senior', label: `${myTexts.filterSenior} (8)` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAvatarFilterAge(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        avatarFilterAge === tab.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 캐릭터 카드 그리드 */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[58vh] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {CHARACTER_LIST
                  .filter((char) => avatarFilterGender === 'all' || char.gender === avatarFilterGender)
                  .filter((char) => avatarFilterAge === 'all' || char.ageGroup === avatarFilterAge)
                  .map((char) => {
                    const isSelected = profileAvatarId === char.id

                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => {
                          setProfileAvatarId(char.id)
                        }}
                        className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center gap-2 cursor-pointer group relative ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/30 shadow-xs'
                            : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50/80 bg-white'
                        }`}
                      >
                        {/* 아바타 SVG 박스 */}
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-2xs bg-white shrink-0 transition-transform group-hover:scale-105">
                          <CharacterSvg id={char.id} className="w-full h-full" />
                        </div>

                        {/* 캐릭터 정보 */}
                        <div className="w-full min-w-0 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xs font-black text-gray-900 truncate">
                              {char.title}
                            </span>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded-md inline-block mt-0.5">
                            {char.gender === 'male' ? myTexts.filterMale : myTexts.filterFemale} · {char.ageGroup === 'youth' ? myTexts.filterYouth : myTexts.filterSenior}
                          </span>
                          <p className="text-[11px] text-emerald-800 font-bold mt-1 line-clamp-1">
                            {char.mood}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-tight">
                            {char.outfitDesc}
                          </p>
                        </div>
                      </button>
                    )
                  })}
              </div>

              {/* 모달 하단 액션 */}
              <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 shadow-2xs bg-white shrink-0">
                    <CharacterSvg id={profileAvatarId} className="w-full h-full" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-gray-900 block truncate">
                      {currentCharacter.title}
                    </span>
                    <span className="text-[11px] text-emerald-700 block truncate">
                      {currentCharacter.mood}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
                >
                  {myTexts.charConfirmBtn}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ⚠️ 저장되지 않은 수정사항 이탈 방지 모달 (Leave Confirmation Modal) */}
        {showLeaveModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-2xl shadow-xs">
                ⚠️
              </div>
              <div>
                <h4 className="text-lg font-black text-gray-900 tracking-tight">
                  {myTexts.leaveModalTitle}
                </h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {myTexts.leaveModalDesc}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLeaveModal(false)
                    setPendingNavigation(null)
                  }}
                  className="py-2.5 px-2 sm:px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {myTexts.leaveKeepEditing}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLeaveModal(false)
                    const dest = pendingNavigation
                    setPendingNavigation(null)
                    if (dest) {
                      if (dest.startsWith('tab:')) {
                        setActiveTab(dest.replace('tab:', '') as any)
                      } else {
                        window.location.href = dest
                      }
                    }
                  }}
                  className="py-2.5 px-2 sm:px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {myTexts.leaveDiscard}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    handleProfileSave(e, () => {
                      setShowLeaveModal(false)
                      const dest = pendingNavigation
                      setPendingNavigation(null)
                      if (dest) {
                        if (dest.startsWith('tab:')) {
                          setActiveTab(dest.replace('tab:', '') as any)
                        } else {
                          window.location.href = dest
                        }
                      }
                    })
                  }}
                  className="py-2.5 px-2 sm:px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {myTexts.leaveSaveAndGo}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

