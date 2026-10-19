// AAMEN Service Worker for Web Push Notifications & Offline Caching
const SW_VERSION = 'v1.0.0'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// 🔔 백그라운드 푸시 수신 이벤트
self.addEventListener('push', (event) => {
  let data = {
    title: 'AAMEN',
    body: '새로운 소식이 도착했습니다.',
    icon: '/icon-256.png',
    badge: '/favicon-32x32.png',
    url: '/'
  }

  if (event.data) {
    try {
      const parsed = event.data.json()
      data = { ...data, ...parsed }
    } catch (e) {
      data.body = event.data.text()
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: data.icon || '/icon-256.png',
    badge: data.badge || '/favicon-32x32.png',
    data: {
      url: data.url || '/'
    },
    vibrate: [150, 80, 150],
    tag: data.tag || 'aamen-notification',
    renotify: true
  }

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  )
})

// 📲 알림 클릭 시 해당 페이지로 이동 또는 창 포커스
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 이미 열려있는 창이 있다면 해당 창으로 포커스 및 이동
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i]
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      // 열린 창이 없으면 새 창 오픈
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})
