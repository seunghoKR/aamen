import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/config/locales'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // 기본 locale(ko)는 URL에 prefix 없이
})

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!_next|api|_vercel|.*\\..*).*)',
  ],
}
