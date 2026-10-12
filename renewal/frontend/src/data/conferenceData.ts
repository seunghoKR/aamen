// 🕊️ AAMEN 컨퍼런스 데이터 & 다국어 번역 모델
export interface ConferenceArchive {
  edition: string
  year: number
  locationKo: string
  locationEn: string
  themeKo: string
  themeEn: string
  descKo: string
  descEn: string
  participants: string
  badgeColor: string
}

export const conferenceArchives: ConferenceArchive[] = [
  {
    edition: '제1차 (1st)',
    year: 2018,
    locationKo: '태국 방콕',
    locationEn: 'Bangkok, Thailand',
    themeKo: '아시아 아나밥티스트 네트워크의 태동',
    themeEn: 'The Awakening of the Asia Anabaptist Network',
    descKo: '아시아 8개국 교회 대표들이 처음으로 한자리에 모여 교제하고, 메노나이트 평화 신앙의 아시아적 적용을 논의한 역사적인 첫 모임입니다.',
    descEn: 'Historical inaugural assembly of church leaders from 8 Asian nations exploring contextual peace theology.',
    participants: '8개국 65명',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    edition: '제2차 (2nd)',
    year: 2021,
    locationKo: '온라인 글로벌 (Zoom Live)',
    locationEn: 'Online Global (Zoom Live)',
    themeKo: '팬데믹 속의 화해와 소망의 연대',
    themeEn: 'Reconciliation and Hope Amid Global Crisis',
    descKo: '코로나19 팬데믹 가운데 13개국으로 확장된 네트워크 지체들이 온라인으로 모여 긴급 중보기도와 상호 구호 기금을 결의했습니다.',
    descEn: 'Online assembly connecting expanded 13 nations to establish relief funds and intercessory prayer networks.',
    participants: '13개국 210명',
    badgeColor: 'bg-sky-100 text-sky-800',
  },
  {
    edition: '제3차 (3rd)',
    year: 2024,
    locationKo: '태국 치앙마이 (SEAPEC)',
    locationEn: 'Chiang Mai, Thailand',
    themeKo: '차세대 평화 리더십과 7대 신념의 토착화',
    themeEn: 'Next-Gen Peace Leadership & Contextualized Faith',
    descKo: '13개 언어로 완역된 MWC 7대 신념 교안을 현장 교회학교와 청년 사역에 적용하기 위한 실천적 워크숍을 진행했습니다.',
    descEn: 'Equipping youth and emerging educators with the 13-language MWC 7 Core Convictions curriculum.',
    participants: '13개국 140명',
    badgeColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    edition: '제4차 (4th - 예정)',
    year: 2026,
    locationKo: '대한민국 서울 / 오산',
    locationEn: 'Seoul & Osan, South Korea',
    themeKo: '화해의 복음, 하나 된 아시아',
    themeEn: 'The Gospel of Reconciliation, United Asia',
    descKo: '분쟁과 갈등의 아시아 현장에서 평화의 사도로 부르심 받은 13개국 지도자 및 파트너 기구가 함께하는 최대 규모의 정기 총회입니다.',
    descEn: 'Our quadrennial flagship assembly uniting 13 nations and global mission partners to declare Christ’s peace.',
    participants: '13개국 200여 명 예정',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
]

export interface ConferenceTranslations {
  badge: string
  heroTitle: string
  heroSubtitle: string
  registerBtn: string
  whatsappInquiryBtn: string
  viewProgramBtn: string
  pillarsTitle: string
  pillarsSubtitle: string
  pillars: {
    title: string
    desc: string
  }[]
  currentTitle: string
  currentSubtitle: string
  details: {
    datesLabel: string
    datesValue: string
    venueLabel: string
    venueValue: string
    attendeesLabel: string
    attendeesValue: string
    languagesLabel: string
    languagesValue: string
  }
  historyTitle: string
  historySubtitle: string
  scholarshipTitle: string
  scholarshipDesc: string
  scholarshipBtn: string
}

export const conferenceTranslations: Record<string, ConferenceTranslations> = {
  ko: {
    badge: 'AAMEN 공식 연례 최대 중심 행사',
    heroTitle: '아시아 아나밥티스트 연합 컨퍼런스',
    heroSubtitle: '“화해의 복음, 하나 된 아시아” — 13개국 교회 지도자, 사역자, 청년 리더십이 함께 모여 그리스도의 평화와 제자도를 나누는 AAMEN의 가장 중심이 되는 연중 대회입니다.',
    registerBtn: '✍️ 컨퍼런스 참가 신청',
    whatsappInquiryBtn: 'WhatsApp 문의하기',
    viewProgramBtn: '주요 프로그램 안내',
    pillarsTitle: '컨퍼런스 3대 핵심 지향점',
    pillarsSubtitle: '그리스도의 평화, 다국어 제자도, 그리고 13개국 선교적 연대',
    pillars: [
      {
        title: '🕊️ 화해와 비폭력 평화',
        desc: '갈등과 핍박의 현장에서 원수 사랑과 화해의 복음을 선포하며, 아시아 분쟁 지역을 치유하는 평화 신학을 공유합니다.',
      },
      {
        title: '📖 13개 언어 다문화 제자도',
        desc: '언어의 장벽을 넘어 13개국 현지 언어로 완역된 교재를 통해 차세대 사역자를 훈련하고 하나님 나라의 일꾼을 세웁니다.',
      },
      {
        title: '🤝 국경을 넘는 선교적 연대',
        desc: 'MWC, MCC 등 글로벌 기구와 아시아 13개국 교회가 동등한 형제자매로 손을 맞잡고 상호 지원과 중보기도를 이어갑니다.',
      },
    ],
    currentTitle: '2026 제4차 차기 컨퍼런스 안내',
    currentSubtitle: '13개국 대표 코디네이터 및 청년 사역자가 함께하는 총회 겸 연합 컨퍼런스',
    details: {
      datesLabel: '일시',
      datesValue: '2026년 10월 15일(목) ~ 10월 17일(토) (2박 3일)',
      venueLabel: '개최 장소',
      venueValue: '대한민국 서울 / 경기도 오산 아시아 평화 센터 (온라인 Zoom 하이브리드 병행)',
      attendeesLabel: '참가 대상',
      attendeesValue: '13개국 대표 코디네이터, 현장 목회자, 선교사, 청년 대표, 파트너 기구',
      languagesLabel: '진행 언어',
      languagesValue: '영어 & 한국어 기준 (13개 언어 통역 및 자료 지원)',
    },
    historyTitle: '역대 컨퍼런스 발자취 (History & Archives)',
    historySubtitle: '2018년 방콕에서 시작되어 13개국으로 확장된 화해와 평화의 연대 여정',
    scholarshipTitle: '🌏 동남아·남아시아 참가자 장학 지원 펀드',
    scholarshipDesc: '미얀마, 라오스, 캄보디아, 네팔 등 재정적 어려움이 있는 현지 사역자들의 항공료 및 체재비를 지원하는 장학 펀드를 운영하고 있습니다.',
    scholarshipBtn: '장학 펀드 신청 및 후원 안내',
  },
  en: {
    badge: 'AAMEN ANNUAL SIGNATURE ASSEMBLY',
    heroTitle: 'Asia Anabaptist Conference',
    heroSubtitle: '“The Gospel of Reconciliation, United Asia” — The primary flagship gathering where church leaders, grassroots ministers, and emerging youth leaders from 13 nations convene.',
    registerBtn: '✍️ Register for Conference',
    whatsappInquiryBtn: 'Inquire via WhatsApp',
    viewProgramBtn: 'View Program Schedule',
    pillarsTitle: 'Three Core Pillars of the Conference',
    pillarsSubtitle: 'Christ’s Peace, Multilingual Discipleship, and 13-Nation Solidarity',
    pillars: [
      {
        title: '🕊️ Peace & Nonviolent Reconciliation',
        desc: 'Proclaiming the Gospel of enemy-love and restorative peace to heal suffering communities across conflict-affected regions in Asia.',
      },
      {
        title: '📖 13-Language Contextualized Discipleship',
        desc: 'Equipping next-generation Christian leaders across linguistic barriers with the 13-language curriculum and peace educational resources.',
      },
      {
        title: '🤝 Cross-Border Missional Solidarity',
        desc: 'Connecting global partners like MWC and MCC with local churches across 13 Asian nations as equal brothers and sisters in Christ.',
      },
    ],
    currentTitle: 'Upcoming 2026 The 4th Conference',
    currentSubtitle: 'General Assembly & Continental Gathering uniting 13 nations in fellowship',
    details: {
      datesLabel: 'Dates',
      datesValue: 'October 15 (Thu) – 17 (Sat), 2026 (3 Days / 2 Nights)',
      venueLabel: 'Venue',
      venueValue: 'Seoul & Osan Peace Center, South Korea (Hybrid Zoom Live available)',
      attendeesLabel: 'Eligible Attendees',
      attendeesValue: '13 Country Coordinators, Pastors, Youth Leaders, and Partner Delegates',
      languagesLabel: 'Working Languages',
      languagesValue: 'English & Korean with translation support in Asian languages',
    },
    historyTitle: 'Conference Archives & Milestone History',
    historySubtitle: 'From Bangkok in 2018 to 13 nations in 2026: A journey of peace and solidarity',
    scholarshipTitle: '🌏 Solidarity Travel & Scholarship Fund',
    scholarshipDesc: 'We provide travel subsidies and lodging scholarships for grassroots delegates and pastors from financially challenged regions.',
    scholarshipBtn: 'Scholarship Details & Sponsorship',
  },
}
