// 지원 언어/국가 목록 (15개 참여국: 홍콩, 필리핀 포함)
export const locales = [
  'ko',     // 대한민국 (KR)
  'en',     // 미국 (US)
  'ja',     // 일본 (JP)
  'zh-TW',  // 대만 (TW)
  'zh-HK',  // 홍콩 (HK)
  'tl',     // 필리핀 (PH)
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

// 국가 2자리 이니셜 코드 (알파벳 정렬 기준: HK, ID, IN, JP, KH, KR, LA, MM, MN, NP, PH, TH, TW, US, VN)
export const localeToCode: Record<Locale, string> = {
  'zh-HK': 'HK',
  id: 'ID',
  hi: 'IN',
  ja: 'JP',
  km: 'KH',
  ko: 'KR',
  lo: 'LA',
  my: 'MM',
  mn: 'MN',
  ne: 'NP',
  tl: 'PH',
  th: 'TH',
  'zh-TW': 'TW',
  en: 'US',
  vi: 'VN',
}

// 국가 이니셜 알파벳 순서로 정렬된 15개국 로케일 목록 (대시보드 교안 관리 등에서 사용)
export const nationOrderedLocales: Locale[] = [
  'zh-HK', // HK: 홍콩
  'id',    // ID: 인도네시아
  'hi',    // IN: 인도
  'ja',    // JP: 일본
  'km',    // KH: 캄보디아
  'ko',    // KR: 대한민국
  'lo',    // LA: 라오스
  'my',    // MM: 미얀마
  'mn',    // MN: 몽골
  'ne',    // NP: 네팔
  'tl',    // PH: 필리핀
  'th',    // TH: 태국
  'zh-TW', // TW: 대만
  'en',    // US: 미국
  'vi',    // VN: 베트남
]

// 국가명 형태 표기 (해당 국가 모국어/국가 표기)
export const localeCountryNames: Record<Locale, string> = {
  'zh-HK': '香港 (HK)',
  id: 'Indonesia (ID)',
  hi: 'भारत (IN)',
  ja: '日本 (JP)',
  km: 'កម្ពុជា (KH)',
  ko: '대한민국 (KR)',
  lo: 'ລາວ (LA)',
  my: 'မြန်မာ (MM)',
  mn: 'Монгол (MN)',
  ne: 'नेपाल (NP)',
  tl: 'Pilipinas (PH)',
  th: 'ไทย (TH)',
  'zh-TW': '台灣 (TW)',
  en: '미국 (US)',
  vi: 'Việt Nam (VN)',
}

// 현지어 정식 표기
export const localeNames: Record<Locale, string> = {
  'zh-HK': '香港 (Hong Kong)',
  id: 'Indonesia (ID)',
  hi: 'भारत (IN)',
  ja: '日本 (JP)',
  km: 'កម្ពុជា (KH)',
  ko: '대한민국 (KR)',
  lo: 'ລາວ (LA)',
  my: 'မြန်မာ (MM)',
  mn: 'Монгол (MN)',
  ne: 'नेपाल (NP)',
  tl: 'Pilipinas (PH)',
  th: 'ไทย (TH)',
  'zh-TW': '台灣 (TW)',
  en: 'United States (US)',
  vi: 'Việt Nam (VN)',
}

// 국가 플래그 이모지
export const localeFlags: Record<Locale, string> = {
  'zh-HK': '🇭🇰',
  id: '🇮🇩',
  hi: '🇮🇳',
  ja: '🇯🇵',
  km: '🇰🇭',
  ko: '🇰🇷',
  lo: '🇱🇦',
  my: '🇲🇲',
  mn: '🇲🇳',
  ne: '🇳🇵',
  tl: '🇵🇭',
  th: '🇹🇭',
  'zh-TW': '🇹🇼',
  en: '🇺🇸',
  vi: '🇻🇳',
}

// 국가 소문자 코드 매핑
export const localeToCountry: Record<Locale, string> = {
  'zh-HK': 'hk',
  id: 'id',
  hi: 'in',
  ja: 'jp',
  km: 'kh',
  ko: 'kr',
  lo: 'la',
  my: 'mm',
  mn: 'mn',
  ne: 'np',
  tl: 'ph',
  th: 'th',
  'zh-TW': 'tw',
  en: 'us',
  vi: 'vn',
}

// 텍스트 방향 (RTL 언어 대응)
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  'zh-HK': 'ltr',
  id: 'ltr',
  hi: 'ltr',
  ja: 'ltr',
  km: 'ltr',
  ko: 'ltr',
  lo: 'ltr',
  my: 'ltr',
  mn: 'ltr',
  ne: 'ltr',
  tl: 'ltr',
  th: 'ltr',
  'zh-TW': 'ltr',
  en: 'ltr',
  vi: 'ltr',
}
