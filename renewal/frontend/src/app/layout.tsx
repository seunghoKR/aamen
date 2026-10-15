import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AAMEN — Asia Anabaptist Mennonite Education Network',
    template: '%s | AAMEN',
  },
  description:
    '13개국 아시아 아나밥티스트 메노나이트 신앙 공동체가 언어 장벽 없이 배우고, 나누고, 연결되는 플랫폼',
  metadataBase: new URL('https://aamen.net'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-white font-pretendard antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
