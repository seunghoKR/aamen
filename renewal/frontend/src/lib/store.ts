// 회원 등급 정의 (0단계 비회원 ~ 5단계 총괄관리자)
export type MemberLevel = 0 | 1 | 2 | 3 | 4 | 5
export type MemberRole =
  | 'guest'
  | 'level1_associate'
  | 'level2_regular'
  | 'level3_worker'
  | 'level4_leader'
  | 'level5_super_admin'
  | 'super_admin'
  | 'country_admin'
  | 'regular'
  | 'associate'

export interface MemberPermissions {
  canWritePost: boolean
  canWriteComment: boolean
  canEditOwn: boolean
  canDeleteOwn: boolean
  canManageBoard: boolean // 게시물 삭제 및 관리
  canWriteNotice: boolean
  canDownloadFiles: boolean
  canAccessAdmin: boolean
}

export interface MemberTierInfo {
  level: MemberLevel
  roleKey: MemberRole
  name: string
  badgeClass: string
  desc: string
  permissions: MemberPermissions
}

export const defaultTierSettings: Record<MemberLevel, MemberTierInfo> = {
  0: {
    level: 0,
    roleKey: 'guest',
    name: '0단계: 비회원 (손님/Guest)',
    badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
    desc: '로그인하지 않은 일반 방문자 (사역자 정보 및 기도제목 비공개/마스킹, 회원 전용 자료 접근 차단)',
    permissions: {
      canWritePost: false,
      canWriteComment: false,
      canEditOwn: false,
      canDeleteOwn: false,
      canManageBoard: false,
      canWriteNotice: false,
      canDownloadFiles: false,
      canAccessAdmin: false,
    },
  },
  1: {
    level: 1,
    roleKey: 'associate',
    name: '1단계: 준회원',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    desc: '가입 대기 및 기본 열람 (게시글 읽기 가능, 글/댓글 작성 제한)',
    permissions: {
      canWritePost: false,
      canWriteComment: false,
      canEditOwn: false,
      canDeleteOwn: false,
      canManageBoard: false,
      canWriteNotice: false,
      canDownloadFiles: false,
      canAccessAdmin: false,
    },
  },
  2: {
    level: 2,
    roleKey: 'regular',
    name: '2단계: 정회원',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    desc: '일반 성도 (글/댓글 작성, 기도 전문 열람, AI 번역, 자료 다운로드)',
    permissions: {
      canWritePost: true,
      canWriteComment: true,
      canEditOwn: true,
      canDeleteOwn: true,
      canManageBoard: false,
      canWriteNotice: false,
      canDownloadFiles: true,
      canAccessAdmin: false,
    },
  },
  3: {
    level: 3,
    roleKey: 'level3_worker',
    name: '3단계: 사역자/선교사',
    badgeClass: 'bg-teal-100 text-teal-900 border-teal-200',
    desc: '현장 사역자 (사역 소식, 기도 제목, 사진 나눔)',
    permissions: {
      canWritePost: true,
      canWriteComment: true,
      canEditOwn: true,
      canDeleteOwn: true,
      canManageBoard: false,
      canWriteNotice: false,
      canDownloadFiles: true,
      canAccessAdmin: false,
    },
  },
  4: {
    level: 4,
    roleKey: 'country_admin',
    name: '4단계: 리더/게시판관리자',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-200',
    desc: '국가 코디네이터 및 게시판 관리 (모든 게시물 삭제, 공지 등록)',
    permissions: {
      canWritePost: true,
      canWriteComment: true,
      canEditOwn: true,
      canDeleteOwn: true,
      canManageBoard: true,
      canWriteNotice: true,
      canDownloadFiles: true,
      canAccessAdmin: false,
    },
  },
  5: {
    level: 5,
    roleKey: 'super_admin',
    name: '5단계: 총괄관리자',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-200',
    desc: '총괄 사이트 관리자 (모든 시스템 및 회원/게시판 총괄)',
    permissions: {
      canWritePost: true,
      canWriteComment: true,
      canEditOwn: true,
      canDeleteOwn: true,
      canManageBoard: true,
      canWriteNotice: true,
      canDownloadFiles: true,
      canAccessAdmin: true,
    },
  },
}

export function getMemberLevel(role: MemberRole): MemberLevel {
  if (role === 'super_admin' || role === 'level5_super_admin') return 5
  if (role === 'country_admin' || role === 'level4_leader') return 4
  if (role === 'level3_worker') return 3
  if (role === 'regular' || role === 'level2_regular') return 2
  if (role === 'associate' || role === 'level1_associate') return 1
  return 0
}

export interface Member {
  id: string
  name: string
  email: string
  countryCode: string
  countryName: string
  flag: string
  role: MemberRole
  level?: MemberLevel
  joinedDate: string
  status: 'active' | 'pending' | 'suspended'
  affiliation?: string
  phone?: string
  provider?: string
  facebook_account?: string | null
  telegram_chat_id?: string | null
  google_linked?: boolean | number
  avatar_url?: string | null
}

// 배너 설정 정의 (이미지 또는 텍스트 배너)
export interface BannerConfig {
  id: string
  type: 'gradient_text' | 'image'
  title: string
  subtitle: string
  badgeText: string
  imageUrl?: string
  buttonText: string
  buttonLink: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  bgGradient: string
  active: boolean
  displayOrder?: number
}

// 게시글 정의
export interface BoardPost {
  id: string
  category: 'board' | 'share' | 'announce' | 'prayer'
  title: string
  content: string
  author: string
  countryCode: string
  flag: string
  date: string
  views: number
  likes: number
  fileUrl?: string
  fileName?: string
  fileSize?: string
  comments: {
    id: string
    author: string
    countryCode: string
    flag: string
    date: string
    text: string
  }[]
}

// 5개 기본 배너 프리셋 (이미지 - 텍스트 - 이미지 - 텍스트 - 이미지 혼용)
export const defaultBanners: BannerConfig[] = [
  {
    id: 'banner_01',
    type: 'image',
    title: '아시아 15개국을 잇는 평화와 교육의 공동체',
    subtitle: '언어와 국경을 넘어 그리스도의 비폭력 평화와 제자도를 함께 배웁니다',
    badgeText: 'AAMEN GLOBAL NETWORK',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80',
    buttonText: '함께 기도하기 (기도의 벽)',
    buttonLink: '/community/prayer',
    secondaryButtonText: '7대 확신 교안',
    secondaryButtonLink: '/convictions',
    bgGradient: 'from-emerald-800 via-teal-900 to-slate-950',
    active: true,
    displayOrder: 1,
  },
  {
    id: 'banner_02',
    type: 'gradient_text',
    title: '2026 MWC 아시아 아나밥티스트 연합 컨퍼런스',
    subtitle: '“화해의 복음, 하나 된 아시아” — 각국 코디네이터 및 청년 리더십 참가 신청 접수 중',
    badgeText: 'UPCOMING EVENT 2026',
    imageUrl: '',
    buttonText: '공지사항 바로가기',
    buttonLink: '/community/announcements',
    secondaryButtonText: '네트워크 일정',
    secondaryButtonLink: '/network',
    bgGradient: 'from-blue-950 via-indigo-900 to-slate-900',
    active: true,
    displayOrder: 2,
  },
  {
    id: 'banner_03',
    type: 'image',
    title: '15개 언어로 완역된 7대 신념 교안 자료실',
    subtitle: '하나님, 예수 그리스도, 성령, 평화와 화해 등 교회 주일학교와 신학교를 위한 무료 교육 자료',
    badgeText: 'CURRICULUM & RESOURCES',
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=80',
    buttonText: '자료실 둘러보기',
    buttonLink: '/resources',
    secondaryButtonText: '레슨 플랜 보기',
    secondaryButtonLink: '/convictions/god',
    bgGradient: 'from-teal-900 via-emerald-900 to-cyan-950',
    active: true,
    displayOrder: 3,
  },
  {
    id: 'banner_04',
    type: 'gradient_text',
    title: '“평화를 만드는 사람은 복이 있나니”',
    subtitle: '마태복음 5:9 — 갈등과 분쟁 속에서 평화의 도구로 부르심 받은 아시아 성도들의 고백',
    badgeText: 'SCRIPTURE OF PEACE',
    imageUrl: '',
    buttonText: '열린 나눔터 참여',
    buttonLink: '/community/board',
    secondaryButtonText: '기도의 벽 가기',
    secondaryButtonLink: '/community/prayer',
    bgGradient: 'from-emerald-900 via-teal-950 to-green-950',
    active: true,
    displayOrder: 4,
  },
  {
    id: 'banner_05',
    type: 'image',
    title: '함께 손잡고 드리는 기도의 벽 (Live Prayer Wall)',
    subtitle: '미얀마, 베트남, 인도, 네팔... 15개국에서 실시간으로 올라오는 기도의 제목에 \'아멘\'으로 응답하세요',
    badgeText: 'FELLOWSHIP & PRAYER',
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=80',
    buttonText: '기도 제목 올리기',
    buttonLink: '/community/prayer',
    secondaryButtonText: '은혜 나눔방',
    secondaryButtonLink: '/community/share',
    bgGradient: 'from-purple-950 via-indigo-950 to-slate-900',
    active: true,
    displayOrder: 5,
  },
]

export const defaultBanner: BannerConfig = defaultBanners[0]

// 기본 회원 목록 (공식 7명 회원)
export const initialMembers: Member[] = [
  {
    id: 'Jeanette',
    name: 'Jeanette Hanson',
    email: 'Jeanette.m.hanson@gmail.com',
    countryCode: 'US',
    countryName: '미국 (USA)',
    flag: '🇺🇸',
    role: 'super_admin',
    level: 5,
    affiliation: 'MWC',
    phone: '+1 000-000-0000',
    joinedDate: '2026-02-01',
    status: 'active',
  },
  {
    id: 'Jeremiah',
    name: 'Jeremiah',
    email: 'hkjerechoi@gmail.com',
    countryCode: 'HK',
    countryName: '홍콩 (Hong Kong)',
    flag: '🇭🇰',
    role: 'country_admin',
    level: 4,
    affiliation: '',
    phone: '+852 0000-0000',
    joinedDate: '2026-02-01',
    status: 'active',
  },
  {
    id: 'Paulus',
    name: 'Paulus S. Widjaja',
    email: 'psw.dosen@gmail.com',
    countryCode: 'ID',
    countryName: '인도네시아',
    flag: '🇮🇩',
    role: 'country_admin',
    level: 4,
    affiliation: '',
    phone: '+62 000-0000-0000',
    joinedDate: '2026-02-01',
    status: 'active',
  },
  {
    id: 'Andi',
    name: 'Andi Santoso',
    email: 'andiospeace@gmail.com',
    countryCode: 'US',
    countryName: '미국 (USA)',
    flag: '🇺🇸',
    role: 'country_admin',
    level: 4,
    affiliation: 'MNN',
    phone: '+1 000-000-0000',
    joinedDate: '2026-02-01',
    status: 'active',
  },
  {
    id: 'Hiro',
    name: 'Hiro Katano',
    email: 'h98484435@gmail.com',
    countryCode: 'JP',
    countryName: '일본 (Japan)',
    flag: '🇯🇵',
    role: 'country_admin',
    level: 4,
    affiliation: '',
    phone: '+81 00-0000-0000',
    joinedDate: '2026-02-01',
    status: 'active',
  },
  {
    id: 'Bockki',
    name: 'Kim Bockki',
    email: 'bockkikim@gmail.com',
    countryCode: 'KR',
    countryName: '대한민국',
    flag: '🇰🇷',
    role: 'level3_worker',
    level: 3,
    affiliation: 'MCSK',
    phone: '+82 10-0000-0000',
    joinedDate: '2026-02-01',
    status: 'active',
  },
  {
    id: 'Yongha',
    name: 'Bae Yongha',
    email: 'byh1424@gmail.com',
    countryCode: 'KR',
    countryName: '대한민국',
    flag: '🇰🇷',
    role: 'country_admin',
    level: 4,
    affiliation: 'MCSK',
    phone: '+82 10-0000-0000',
    joinedDate: '2026-02-01',
    status: 'active',
  },
]

// 기본 게시글 샘플 (전체 삭제 완료)
export const initialPosts: BoardPost[] = []

// 👥 15개국 대표 코디네이터 데이터 모델
export interface CountryCoordinator {
  id: string
  countryCode: string
  countryName: string
  flag: string
  name: string
  nameNative: string
  nameEn: string
  role: string
  email: string
  phone?: string
  memberId?: string // 연결된 회원 ID
  isRegisteredMember?: boolean
}

// 국가 이니셜(Code) 알파벳 순서로 정렬된 15개국 대표 목록 (HK, ID, IN, JP, KH, KR, LA, MM, MN, NP, PH, TH, TW, US, VN) (ID, IN, JP, KH, KR, LA, MM, MN, NP, PH, TH, TW, VN)
export const initialCoordinators: CountryCoordinator[] = [
  {
    "id": "coord_hk",
    "countryCode": "HK",
    "countryName": "홍콩 (HK)",
    "flag": "🇭🇰",
    "name": "Jeremiah",
    "nameNative": "Jeremiah",
    "nameEn": "Jeremiah",
    "role": "홍콩 코디네이터 (Hong Kong Coord.)",
    "email": "hkjerechoi@gmail.com",
    "memberId": "Jeremiah",
    "isRegisteredMember": true
  },
  {
    "id": "coord_id",
    "countryCode": "ID",
    "countryName": "인도네시아 (ID)",
    "flag": "🇮🇩",
    "name": "Paulus S. Widjaja",
    "nameNative": "Paulus S. Widjaja",
    "nameEn": "Paulus S. Widjaja",
    "role": "인도네시아 코디네이터 (Indonesia Coord.)",
    "email": "psw.dosen@gmail.com",
    "memberId": "Paulus",
    "isRegisteredMember": true
  },
  {
    "id": "coord_in",
    "countryCode": "IN",
    "countryName": "인도 (IN)",
    "flag": "🇮🇳",
    "name": "Priya Sharma",
    "nameNative": "प्रिया शर्मा",
    "nameEn": "Priya Sharma",
    "role": "인도 코디네이터 (India Coord.)",
    "email": "priya.sharma@india.org",
    "memberId": "priya",
    "isRegisteredMember": true
  },
  {
    "id": "coord_jp",
    "countryCode": "JP",
    "countryName": "일본 (JP)",
    "flag": "🇯🇵",
    "name": "Hiro Katano",
    "nameNative": "片野 ヒロ",
    "nameEn": "Hiro Katano",
    "role": "일본 코디네이터 (Japan Coord.)",
    "email": "h98484435@gmail.com",
    "memberId": "Hiro",
    "isRegisteredMember": true
  },
  {
    "id": "coord_kh",
    "countryCode": "KH",
    "countryName": "캄보디아 (KH)",
    "flag": "🇰🇭",
    "name": "Sokha Chea",
    "nameNative": "សុខា ជា",
    "nameEn": "Sokha Chea",
    "role": "캄보디아 코디네이터 (Cambodia Coord.)",
    "email": "sokha.chea@cambodia.org",
    "memberId": "sokha",
    "isRegisteredMember": false
  },
  {
    "id": "coord_kr_yongha",
    "countryCode": "KR",
    "countryName": "대한민국 (KR)",
    "flag": "🇰🇷",
    "name": "Bae Yongha",
    "nameNative": "배용하",
    "nameEn": "Bae Yongha",
    "role": "한국 코디네이터 (Korea Coord. / MCSK)",
    "email": "byh1424@gmail.com",
    "memberId": "Yongha",
    "isRegisteredMember": true
  },
  {
    "id": "coord_la",
    "countryCode": "LA",
    "countryName": "라오스 (LA)",
    "flag": "🇱🇦",
    "name": "Kham Souk",
    "nameNative": "ຄຳສຸກ",
    "nameEn": "Kham Souk",
    "role": "라오스 코디네이터 (Laos Coord.)",
    "email": "kham.souk@laos.net",
    "memberId": "kham",
    "isRegisteredMember": false
  },
  {
    "id": "coord_mm",
    "countryCode": "MM",
    "countryName": "미얀마 (MM)",
    "flag": "🇲🇲",
    "name": "Zaw Min",
    "nameNative": "ဇော်မင်း",
    "nameEn": "Zaw Min",
    "role": "미얀마 코디네이터 (Myanmar Coord.)",
    "email": "zawmin@aamen.net",
    "memberId": "zawmin",
    "isRegisteredMember": true
  },
  {
    "id": "coord_mn",
    "countryCode": "MN",
    "countryName": "몽골 (MN)",
    "flag": "🇲🇳",
    "name": "Bat-Erdene",
    "nameNative": "Бат-Эрдэнэ",
    "nameEn": "Bat-Erdene",
    "role": "몽골 코디네이터 (Mongolia Coord.)",
    "email": "baterdene@mongolia.net",
    "memberId": "baterdene",
    "isRegisteredMember": false
  },
  {
    "id": "coord_np",
    "countryCode": "NP",
    "countryName": "네팔 (NP)",
    "flag": "🇳🇵",
    "name": "Ramesh Adhikari",
    "nameNative": "रमेश अधिकारी",
    "nameEn": "Ramesh Adhikari",
    "role": "네팔 코디네이터 (Nepal Coord.)",
    "email": "ramesh.ad@nepal.org",
    "memberId": "ramesh",
    "isRegisteredMember": true
  },
  {
    "id": "coord_ph",
    "countryCode": "PH",
    "countryName": "필리핀 (PH)",
    "flag": "🇵🇭",
    "name": "Juan Dela Cruz",
    "nameNative": "Juan Dela Cruz",
    "nameEn": "Juan Dela Cruz",
    "role": "필리핀 코디네이터 (Philippines Coord.)",
    "email": "juan.delacruz@aamen.ph",
    "memberId": "juan",
    "isRegisteredMember": false
  },
  {
    "id": "coord_th",
    "countryCode": "TH",
    "countryName": "태국 (TH)",
    "flag": "🇹🇭",
    "name": "Somchai Prasert",
    "nameNative": "สมชาย ประเสริฐ",
    "nameEn": "Somchai Prasert",
    "role": "태국 코디네이터 (Thailand Coord.)",
    "email": "somchai@aamen.net",
    "memberId": "somchai",
    "isRegisteredMember": true
  },
  {
    "id": "coord_tw",
    "countryCode": "TW",
    "countryName": "대만 (TW)",
    "flag": "🇹🇼",
    "name": "Lin Mei-Ling",
    "nameNative": "林美玲",
    "nameEn": "Lin Mei-Ling",
    "role": "대만 코디네이터 (Taiwan Coord.)",
    "email": "meiling.lin@taiwan.org",
    "memberId": "meiling",
    "isRegisteredMember": false
  },
  {
    "id": "coord_us_andi",
    "countryCode": "US",
    "countryName": "미국 (USA)",
    "flag": "🇺🇸",
    "name": "Andi Santoso",
    "nameNative": "Andi Santoso",
    "nameEn": "Andi Santoso",
    "role": "미국 코디네이터 (USA / MNN Coord.)",
    "email": "andiospeace@gmail.com",
    "memberId": "Andi",
    "isRegisteredMember": true
  },
  {
    "id": "coord_vn",
    "countryCode": "VN",
    "countryName": "베트남 (VN)",
    "flag": "🇻🇳",
    "name": "Sarah Nguyen",
    "nameNative": "Nguyễn Thị Sarah",
    "nameEn": "Sarah Nguyen",
    "role": "베트남 코디네이터 (Vietnam Coord.)",
    "email": "sarah.nguyen@aamen.net",
    "memberId": "sarah",
    "isRegisteredMember": true
  }
]

// 🤝 글로벌 협력단체 데이터 모델 & 초기 목록
export interface PartnerOrgItem {
  id: string
  nameKo: string
  nameEn: string
  category: string
  websiteUrl: string
  descKo: string
  descEn: string
  headquarters: string
  established: string
  contactEmail: string
  phone?: string
}

export const initialPartnerOrgs: PartnerOrgItem[] = [
  {
    id: 'pt_1',
    nameKo: '메노나이트 세계 협의회 (MWC)',
    nameEn: 'Mennonite World Conference',
    category: '국제기구',
    websiteUrl: 'https://mwc-cmm.org',
    headquarters: 'Bogotá, Colombia & Kitchener, Canada',
    established: '1925',
    contactEmail: 'info@mwc-cmm.org',
    descKo: '전 세계 80여 개국 150만 신자들의 글로벌 아나밥티스트 메노나이트 신앙 공동체입니다. AAMEN의 7대 신념의 신학적 뿌리입니다.',
    descEn: 'A global community of Anabaptist-related churches worldwide representing 1.5 million baptized believers in 80 nations.',
  },
  {
    id: 'pt_2',
    nameKo: '메노나이트 중앙위원회 (MCC)',
    nameEn: 'Mennonite Central Committee',
    category: '선교구호',
    websiteUrl: 'https://mcc.org',
    headquarters: 'Akron, PA, USA & Winnipeg, Canada',
    established: '1920',
    contactEmail: 'mailbox@mcc.org',
    descKo: '아시아를 비롯한 전 세계 분쟁 지역과 빈곤 지역에서 구호, 개발, 평화 사역을 감당하는 글로벌 기독교 비정부기구입니다.',
    descEn: 'A worldwide ministry of Anabaptist churches sharing God’s love through relief, development, and peace in more than 45 countries.',
  },
  {
    id: 'pt_3',
    nameKo: '아시아 아나밥티스트 네트워크 (AAN)',
    nameEn: 'Asia Anabaptist Network',
    category: '선교구호',
    websiteUrl: 'https://aamen.net/network',
    headquarters: 'Bangkok, Thailand',
    established: '2016',
    contactEmail: 'network@aamen.net',
    descKo: '아시아 각국의 평화 연구소, 신학교, 지역 공동체가 모여 신학 자료와 사역 경험을 상호 교류하는 연합 플랫폼입니다.',
    descEn: 'A regional platform connecting Anabaptist theological institutes, peace centers, and local fellowships across Asia.',
  },
  {
    id: 'pt_4',
    nameKo: '한국 메노나이트 교회 연합 (KMA)',
    nameEn: 'Korean Mennonite Association',
    category: '교단연합',
    websiteUrl: 'https://kma.or.kr',
    headquarters: 'Seoul, Korea',
    established: '2001',
    contactEmail: 'kma@kma.or.kr',
    descKo: '한반도 평화와 화해의 복음을 실천하며 아시아 사역자 교육과 교재 번역을 주도하는 한국 교회 연합체입니다.',
    descEn: 'Fellowship of Korean Mennonite congregations committed to active peacemaking, reconciliation, and Asian network support.',
  },
  {
    id: 'pt_5',
    nameKo: '동남아시아 평화 교육 센터 (SEAPEC)',
    nameEn: 'Southeast Asia Peace Education Center',
    category: '선교구호',
    websiteUrl: 'https://seapec.org',
    headquarters: 'Chiang Mai, Thailand',
    established: '2019',
    contactEmail: 'office@seapec.org',
    descKo: '미얀마, 태국, 라오스, 캄보디아 다문화 청소년들을 위한 갈등 해결 및 평화 커리큘럼을 연구·보급합니다.',
    descEn: 'Dedicated to empowering Southeast Asian youth leaders with contextualized peace education and restorative practices.',
  },
  {
    id: 'pt_6',
    nameKo: '아시아 기독교 평화 연대 (ACPA)',
    nameEn: 'Asian Christian Peace Alliance',
    category: '선교구호',
    websiteUrl: 'https://aamen.net',
    headquarters: 'Manila, Philippines',
    established: '2022',
    contactEmail: 'peace@acpa-asia.org',
    descKo: '필리핀 및 동남아시아 분쟁 지역의 화해 사역과 비폭력 평화 교육 훈련을 지원하는 초교파 선교 연대체입니다.',
    descEn: 'An ecumenical alliance supporting reconciliation ministries and nonviolent peace training across Southeast Asia.',
  },
]

