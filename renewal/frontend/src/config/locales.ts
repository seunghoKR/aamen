// 지원 언어/국가 목록 (13개 참여국: 미국 포함, 국가 이니셜 순)
export const locales = [
  'ko',     // 대한민국 (KR)
  'en',     // 미국 (US)
  'ja',     // 일본 (JP)
  'zh-TW',  // 대만 (TW)
  'mn',     // 몽골 (MN)
  'vi',     // 베트남 (VN)
  'id',     // 인도네시아 (ID)
  'ne',     // 네팔 (NP)
  'th',     // 태국 (TH)
  'lo',     // 라오스 (LA)
  'my',     // 미얀마 (MM)
  'hi',     // 인도 (IN)
  'km',     // 캄보디아 (KH)
] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ko'

// 국가 2자리 이니셜 코드 (알파벳 정렬 기준)
export const localeToCode: Record<Locale, string> = {
  id: 'ID',
  hi: 'IN',
  ja: 'JP',
  km: 'KH',
  ko: 'KR',
  lo: 'LA',
  my: 'MM',
  mn: 'MN',
  ne: 'NP',
  th: 'TH',
  'zh-TW': 'TW',
  en: 'US',
  vi: 'VN',
}

// 국가명 형태 표기 (해당 국가 모국어/국가 표기)
export const localeCountryNames: Record<Locale, string> = {
  ko: '대한민국 (KR)',
  en: '미국 (US)',
  ja: '日本 (JP)',
  'zh-TW': '台灣 (TW)',
  mn: 'Монгол (MN)',
  vi: 'Việt Nam (VN)',
  id: 'Indonesia (ID)',
  ne: 'नेपाल (NP)',
  th: 'ไทย (TH)',
  lo: 'ລາວ (LA)',
  my: 'မြန်မာ (MM)',
  hi: 'भारत (IN)',
  km: 'កម្ពុជា (KH)',
}

// 현지어 표기
export const localeNames: Record<Locale, string> = {
  ko: '대한민국 (KR)',
  en: 'United States (US)',
  ja: '日本 (JP)',
  'zh-TW': '台灣 (TW)',
  mn: 'Монгол (MN)',
  vi: 'Việt Nam (VN)',
  id: 'Indonesia (ID)',
  ne: 'नेपाल (NP)',
  th: 'ไทย (TH)',
  lo: 'ລາວ (LA)',
  my: 'မြန်မာ (MM)',
  hi: 'भारत (IN)',
  km: 'កម្ពុជា (KH)',
}

// 국가 플래그 (미국 🇺🇸 적용)
export const localeFlags: Record<Locale, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  ja: '🇯🇵',
  'zh-TW': '🇹🇼',
  mn: '🇲🇳',
  vi: '🇻🇳',
  id: '🇮🇩',
  ne: '🇳🇵',
  th: '🇹🇭',
  lo: '🇱🇦',
  my: '🇲🇲',
  hi: '🇮🇳',
  km: '🇰🇭',
}

// 국가 코드 매핑
export const localeToCountry: Record<Locale, string> = {
  ko: 'kr',
  en: 'us',
  ja: 'jp',
  'zh-TW': 'tw',
  mn: 'mn',
  vi: 'vn',
  id: 'id',
  ne: 'np',
  th: 'th',
  lo: 'la',
  my: 'mm',
  hi: 'in',
  km: 'kh',
}

// 텍스트 방향 (RTL 언어 대응)
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  ko: 'ltr',
  en: 'ltr',
  ja: 'ltr',
  'zh-TW': 'ltr',
  mn: 'ltr',
  vi: 'ltr',
  id: 'ltr',
  ne: 'ltr',
  th: 'ltr',
  lo: 'ltr',
  my: 'ltr',
  hi: 'ltr',
  km: 'ltr',
}
