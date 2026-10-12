// 📅 AAMEN 월간 사역 일정 데이터 모델
export interface AamenEventItem {
  id: string
  month: number // 1 ~ 12
  startDate: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
  timeStr: string // e.g. "14:00 - 17:00 (KST)"
  titleKo: string
  titleEn: string
  descKo: string
  descEn: string
  locationKo: string
  locationEn: string
  isOnline: boolean
  organizer: string
  category: '컨퍼런스' | '기도회' | '워크숍' | '총회' | '교육'
  badgeColor: string
}

export const initialAamenEvents: AamenEventItem[] = [
  {
    id: 'evt_2026_01',
    month: 1,
    startDate: '2026-01-15',
    timeStr: '20:00 - 21:30 (KST, UTC+9)',
    titleKo: '2026 아시아 13개국 신년 연합 온라인 기도회',
    titleEn: '2026 Asia 13 Nations New Year Online Prayer Fellowship',
    descKo: '13개국 코디네이터와 현지 성도들이 새해 사역과 아시아 평화를 위해 함께 모여 드리는 실시간 다국어 동시통역 기도회입니다.',
    descEn: 'Real-time multilingual prayer gathering with 13 country coordinators and local believers praying for Asian peace and new year ministries.',
    locationKo: '온라인 화상회의 (Zoom Live)',
    locationEn: 'Online Zoom Live',
    isOnline: true,
    organizer: 'AAMEN 사무국 & 인도네시아 코디네이션',
    category: '기도회',
    badgeColor: 'bg-sky-100 text-sky-800',
  },
  {
    id: 'evt_2026_02',
    month: 2,
    startDate: '2026-02-18',
    endDate: '2026-02-20',
    timeStr: '3박 4일 전일정',
    titleKo: 'MWC 아시아 청년 리더십 평화 세미на (태국 치앙마이)',
    titleEn: 'MWC Asian Youth Leadership Peace Seminar (Chiang Mai)',
    descKo: '미얀마, 태국, 베트남, 캄보디아 등 아시아 차세대 지도자 60명을 대상으로 메노나이트 7대 확신과 비폭력 화해 사역을 훈련합니다.',
    descEn: 'Equipping 60 next-generation leaders across Asia with MWC 7 Core Convictions and nonviolent reconciliation practices.',
    locationKo: '태국 치앙마이 SEAPEC 센터',
    locationEn: 'SEAPEC Center, Chiang Mai, Thailand',
    isOnline: false,
    organizer: 'MWC 아시아 위원회 & SEAPEC',
    category: '워크숍',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'evt_2026_03',
    month: 3,
    startDate: '2026-03-26',
    timeStr: '19:30 - 21:00 (KST)',
    titleKo: '사순절 고난주간 아시아 화해와 평화 묵상회',
    titleEn: 'Lenten Season Asian Peace & Reconciliation Devotion',
    descKo: '십자가의 평화와 원수 사랑의 복음을 묵상하는 13개국 연합 고난주간 묵상 및 성찬의 시간입니다.',
    descEn: 'Asian regional devotion meditating on the Cross of peace and loving enemies during the Lenten journey.',
    locationKo: 'AAMEN 라이브 스트리밍 & 각국 가정교회',
    locationEn: 'AAMEN Live Streaming & Local House Churches',
    isOnline: true,
    organizer: 'AAMEN 교육위원회',
    category: '교육',
    badgeColor: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'evt_2026_05',
    month: 5,
    startDate: '2026-05-10',
    timeStr: '15:00 - 18:00 (KST)',
    titleKo: '아시아 분쟁·박해 지역 긴급 중보기도의 날',
    titleEn: 'Asia Emergency Intercessory Prayer Day for Persecuted Regions',
    descKo: '미얀마 및 분쟁 지역 난민 교회와 고통받는 지체들을 위한 13개국 집중 중보기도회 및 긴급 구호 헌금 모금 안내가 진행됩니다.',
    descEn: 'Focused intercessory prayer and emergency relief update for displaced believers and refugee churches in conflict zones.',
    locationKo: '온라인 Zoom & 13개국 실시간 기도의 벽',
    locationEn: 'Zoom & 13 Nations Live Prayer Wall',
    isOnline: true,
    organizer: 'MCC 아시아 & AAMEN 기도네트워크',
    category: '기도회',
    badgeColor: 'bg-rose-100 text-rose-800',
  },
  {
    id: 'evt_2026_07',
    month: 7,
    startDate: '2026-07-22',
    endDate: '2026-07-25',
    timeStr: '3박 4일 집중 캠프',
    titleKo: '2026 아시아 아나밥티스트 신학 및 교재 번역 심포지엄',
    titleEn: '2026 Asian Anabaptist Theology & Curriculum Translation Symposium',
    descKo: '13개 언어로 완역된 7대 신념 교재의 현장 피드백을 공유하고 각국 주일학교 및 신학교 교재 현지화 작업을 진행합니다.',
    descEn: 'Sharing field feedback on the 13-language curriculum and adapting localized materials for Sunday schools and seminaries.',
    locationKo: '필리핀 마닐라 아시아연합신학원',
    locationEn: 'Manila, Philippines',
    isOnline: false,
    organizer: 'AAN (Asia Anabaptist Network) & KMA',
    category: '컨퍼런스',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'evt_2026_10',
    month: 10,
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    timeStr: '공식 총회 (2박 3일)',
    titleKo: '제4차 아시아 아나밥티스트 메노나이트 정기 총회',
    titleEn: 'The 4th Asia Anabaptist Mennonite General Assembly',
    descKo: '13개국 대표 코디네이터, 국제 파트너 기구 대표단, 현장 사역자 150여 명이 모여 미래 비전과 협력 사역을 결의합니다.',
    descEn: '150 official delegates from 13 nations convening to establish strategic vision and mutual solidarity for the next quadrennium.',
    locationKo: '대한민국 서울 / 경기도 오산 컨벤션홀',
    locationEn: 'Seoul & Osan, South Korea',
    isOnline: false,
    organizer: 'AAMEN 총회 조직위원회 & KMA',
    category: '총회',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'evt_2026_12',
    month: 12,
    startDate: '2026-12-24',
    timeStr: '20:00 - 21:30 (KST)',
    titleKo: '13개국 성탄 평화의 촛불 예배 (Christmas Peace Vigil)',
    titleEn: '13 Nations Christmas Peace Vigil & Candlelight Worship',
    descKo: '평화의 왕으로 오신 예수 그리스도를 찬양하며 13개국 언어로 울려 퍼지는 다국어 연합 성탄 전야 예배입니다.',
    descEn: 'Multilingual Christmas Eve worship praising the Prince of Peace in 13 Asian languages with candle lighting fellowship.',
    locationKo: '온라인 글로벌 스트리밍 (YouTube & Zoom)',
    locationEn: 'Online Global Streaming (YouTube & Zoom)',
    isOnline: true,
    organizer: 'AAMEN 문화사역팀',
    category: '기도회',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
]

// 🔗 구글 캘린더에 일정 바로 추가 URL 생성기 (Google Calendar Template Link)
export function generateGoogleCalendarUrl(event: AamenEventItem, isKo: boolean): string {
  const title = isKo ? event.titleKo : event.titleEn
  const desc = (isKo ? event.descKo : event.descEn) + `\n\n📌 주관: ${event.organizer}\n🌐 자세히 보기: https://aamen.net/network/schedule`
  const location = isKo ? event.locationKo : event.locationEn

  // 날짜 형식 변환: YYYYMMDDTHHmmssZ 또는 YYYYMMDD
  const sDate = event.startDate.replace(/-/g, '')
  let eDate = event.endDate ? event.endDate.replace(/-/g, '') : sDate

  // eDate가 sDate와 같으면 하루 종일 이벤트 처리를 위해 +1일 하거나 같은 날짜 범위로 지정
  const dates = `${sDate}/${eDate}`

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `[AAMEN] ${title}`,
    dates: dates,
    details: desc,
    location: location,
    ctz: 'Asia/Seoul',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
