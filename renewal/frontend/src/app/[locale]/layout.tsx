import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale, getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/config/locales'
import GlobalTierSimulator from '@/components/common/GlobalTierSimulator'
import WhatsAppWidget from '@/components/common/WhatsAppWidget'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      <GlobalTierSimulator />
      {/* 왓츠앱 플로팅 위젯 (현재 비활성화 / 추후 필요 시 주석 해제) */}
      {/* <WhatsAppWidget /> */}
    </NextIntlClientProvider>
  )
}
