import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { defaultLocale } from '@/config/locales'

// / 접속 시 기본 로케일(/ko 또는 prefix 없음)로 리다이렉트
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}

export const metadata: Metadata = {
  title: 'AAMEN — Asia Anabaptist Mennonite Education Network',
}
