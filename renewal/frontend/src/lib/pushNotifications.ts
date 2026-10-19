/**
 * AAMEN Web Push Notifications Helper
 * W3C Push API & Service Worker integration
 */

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export async function registerAamenServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushNotificationSupported()) return null
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    return registration
  } catch (err) {
    console.error('Service Worker registration failed:', err)
    return null
  }
}

export async function subscribeToWebPush(userId: string): Promise<{ success: boolean; message?: string }> {
  if (!isPushNotificationSupported()) {
    return { success: false, message: '이 브라우저는 웹 푸시 알림을 지원하지 않습니다.' }
  }

  try {
    // 1. 브라우저 알림 권한 요청
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      return { success: false, message: '알림 권한이 허용되지 않았습니다.' }
    }

    // 2. 서비스 워커 등록 확인
    let registration = await navigator.serviceWorker.getRegistration()
    if (!registration) {
      registration = await registerAamenServiceWorker()
    }
    if (!registration) {
      return { success: false, message: 'Service Worker를 초기화할 수 없습니다.' }
    }

    // 3. 서버에서 VAPID 공개키 가져오기
    const keyRes = await fetch('/api/push_subscribe.php?action=vapid_key')
    const keyData = await keyRes.json()
    if (!keyData.success || !keyData.public_key) {
      return { success: false, message: 'VAPID 공개키를 가져오지 못했습니다.' }
    }

    // 4. PushManager 구독 생성
    const convertedVapidKey = urlBase64ToUint8Array(keyData.public_key)
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    })

    const subJson = subscription.toJSON()

    // 5. 서버 DB에 구독 정보 등록
    const saveRes = await fetch('/api/push_subscribe.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'subscribe',
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subJson.keys?.p256dh,
        auth: subJson.keys?.auth
      })
    })

    const saveResult = await saveRes.json()
    if (saveResult.success) {
      // 로컬 알림 1회 즉시 트리거 (사용자 피드백)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🕊️ AAMEN 알림 설정 완료', {
          body: 'AAMEN 브라우저 푸시 알림이 활성화되었습니다.',
          icon: '/icon-256.png'
        })
      }
      return { success: true, message: '웹 푸시 알림이 정상적으로 등록되었습니다.' }
    } else {
      return { success: false, message: saveResult.error || '구독 정보 저장 실패' }
    }
  } catch (error: any) {
    console.error('Error subscribing to push:', error)
    return { success: false, message: error?.message || '푸시 구독 중 오류가 발생했습니다.' }
  }
}

export async function sendTestWebPush(userId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/push_subscribe.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_test', user_id: userId })
    })
    const data = await res.json()
    
    // 로컬 브라우저 팝업도 함께 발생
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 AAMEN 푸시 테스트', {
        body: '축하합니다! AAMEN 웹앱 알림이 정상적으로 작동하고 있습니다.',
        icon: '/icon-256.png'
      })
    }

    // 알림 리프레시 이벤트 발송 (헤더 종 뱃지 즉시 갱신)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aamen_notifications_refresh'))
    }

    return !!data.success
  } catch {
    return false
  }
}
