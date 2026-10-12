export interface CharacterAvatar {
  id: string
  name: string
  nameEn: string
  countryCode: string
  countryName: string
  flag: string
  emoji: string
  region: 'east_asia' | 'southeast_asia' | 'south_asia' | 'central_global'
  bgGradient: string
  tag: string
  desc: string
}

export const AAMEN_CHARACTERS: CharacterAvatar[] = [
  // 1. 한국
  {
    id: 'kr-minjun',
    name: '민준 (Minjun)',
    nameEn: 'Minjun',
    countryCode: 'KR',
    countryName: '대한민국',
    flag: '🇰🇷',
    emoji: '👨‍💼',
    region: 'east_asia',
    bgGradient: 'from-blue-500 to-indigo-600',
    tag: '평화사역 코디네이터',
    desc: '아시아 13개국 지체들을 따뜻하게 연결하는 청년 리더',
  },
  {
    id: 'kr-jiwoo',
    name: '지우 (Jiwoo)',
    nameEn: 'Jiwoo',
    countryCode: 'KR',
    countryName: '대한민국',
    flag: '🇰🇷',
    emoji: '👩‍💼',
    region: 'east_asia',
    bgGradient: 'from-violet-500 to-purple-600',
    tag: '다음세대 교육 디렉터',
    desc: '7대 공통신념 교안과 평화 교육을 이끄는 교육 간사',
  },
  // 2. 인도네시아
  {
    id: 'id-bagus',
    name: '바구스 (Bagus)',
    nameEn: 'Bagus',
    countryCode: 'ID',
    countryName: '인도네시아',
    flag: '🇮🇩',
    emoji: '👨‍🌾',
    region: 'southeast_asia',
    bgGradient: 'from-emerald-500 to-teal-600',
    tag: '자바 메노나이트 리더',
    desc: '자바섬의 활기찬 교회 공동체와 함께하는 열정의 리더',
  },
  {
    id: 'id-siti',
    name: '시티 (Siti)',
    nameEn: 'Siti',
    countryCode: 'ID',
    countryName: '인도네시아',
    flag: '🇮🇩',
    emoji: '👩‍🏫',
    region: 'southeast_asia',
    bgGradient: 'from-teal-500 to-emerald-700',
    tag: '평화나눔 사역자',
    desc: '섬과 섬을 오가며 사랑의 화해 사역을 실천하는 지체',
  },
  // 3. 태국
  {
    id: 'th-somchai',
    name: '솜차이 (Somchai)',
    nameEn: 'Somchai',
    countryCode: 'TH',
    countryName: '태국',
    flag: '🇹🇭',
    emoji: '👨‍🍳',
    region: 'southeast_asia',
    bgGradient: 'from-amber-500 to-orange-600',
    tag: '친교와 나눔의 메신저',
    desc: '음식과 사랑을 함께 나누며 치앙마이 복음을 전하는 사역자',
  },
  // 4. 베트남
  {
    id: 'vn-linh',
    name: '린 (Linh)',
    nameEn: 'Linh',
    countryCode: 'VN',
    countryName: '베트남',
    flag: '🇻🇳',
    emoji: '👩‍🎓',
    region: 'southeast_asia',
    bgGradient: 'from-rose-500 to-red-600',
    tag: '주일학교 교사',
    desc: '메콩 델타와 호치민에서 어린이들에게 성경을 가르치는 선생님',
  },
  // 5. 미얀마
  {
    id: 'mm-thwin',
    name: '틴 (Thwin)',
    nameEn: 'Thwin',
    countryCode: 'MM',
    countryName: '미얀마',
    flag: '🇲🇲',
    emoji: '👨‍⚕️',
    region: 'southeast_asia',
    bgGradient: 'from-cyan-500 to-blue-600',
    tag: '희망과 평화의 의무 봉사자',
    desc: '어려운 이웃 곁을 지키며 화해의 복음을 전하는 평화의 일꾼',
  },
  // 6. 인도
  {
    id: 'in-amit',
    name: '아미트 (Amit)',
    nameEn: 'Amit',
    countryCode: 'IN',
    countryName: '인도',
    flag: '🇮🇳',
    emoji: '👨‍🏫',
    region: 'south_asia',
    bgGradient: 'from-orange-500 to-amber-600',
    tag: '신학교 학술 멘토',
    desc: '남아시아 메노나이트 전통과 평화신학을 연구하는 학자',
  },
  // 7. 네팔
  {
    id: 'np-priya',
    name: '프리야 (Priya)',
    nameEn: 'Priya',
    countryCode: 'NP',
    countryName: '네팔',
    flag: '🇳🇵',
    emoji: '👩‍🌾',
    region: 'south_asia',
    bgGradient: 'from-lime-500 to-emerald-600',
    tag: '히말라야 봉사단',
    desc: '히말라야 산자락 마을을 누비며 기도의 불씨를 밝히는 사역자',
  },
  // 8. 일본
  {
    id: 'jp-kenji',
    name: '켄지 (Kenji)',
    nameEn: 'Kenji',
    countryCode: 'JP',
    countryName: '일본',
    flag: '🇯🇵',
    emoji: '🧑‍💻',
    region: 'east_asia',
    bgGradient: 'from-slate-600 to-indigo-700',
    tag: '동아시아 화해 연구자',
    desc: '역사적 화해와 비폭력 평화주의의 가치를 탐구하는 청년',
  },
  // 9. 필리핀
  {
    id: 'ph-maria',
    name: '마리아 (Maria)',
    nameEn: 'Maria',
    countryCode: 'PH',
    countryName: '필리핀',
    flag: '🇵🇭',
    emoji: '👩‍🎤',
    region: 'southeast_asia',
    bgGradient: 'from-fuchsia-500 to-pink-600',
    tag: '미디어 & 찬양 디렉터',
    desc: '밝은 에너지와 음악으로 아시아 네트워크에 기쁨을 주는 찬양인도자',
  },
  // 10. 캄보디아
  {
    id: 'kh-bopha',
    name: '보파 (Bopha)',
    nameEn: 'Bopha',
    countryCode: 'KH',
    countryName: '캄보디아',
    flag: '🇰🇭',
    emoji: '🧑‍🎨',
    region: 'southeast_asia',
    bgGradient: 'from-pink-500 to-rose-600',
    tag: '크메르 문화선교사',
    desc: '전통 예술과 찬양을 결합해 복음의 감동을 전하는 예술 사역자',
  },
  // 11. 라오스
  {
    id: 'la-somsak',
    name: '솜삭 (Somsak)',
    nameEn: 'Somsak',
    countryCode: 'LA',
    countryName: '라오스',
    flag: '🇱🇦',
    emoji: '🧑‍🌾',
    region: 'southeast_asia',
    bgGradient: 'from-teal-600 to-cyan-700',
    tag: '메콩 농촌공동체 섬김이',
    desc: '순박한 자연 속에서 이웃들과 삶을 나누는 농촌 공동체 형제',
  },
  // 12. 몽골
  {
    id: 'mn-bat',
    name: '바트 (Bat)',
    nameEn: 'Bat',
    countryCode: 'MN',
    countryName: '몽골',
    flag: '🇲🇳',
    emoji: '🏇',
    region: 'central_global',
    bgGradient: 'from-sky-500 to-blue-700',
    tag: '초원 순회 전도자',
    desc: '광활한 몽골 대초원을 말을 타고 누비며 기도하는 청년',
  },
  // 13. 대만
  {
    id: 'tw-meiling',
    name: '메이링 (Mei-Ling)',
    nameEn: 'Mei-Ling',
    countryCode: 'TW',
    countryName: '대만',
    flag: '🇹🇼',
    emoji: '👩‍🔬',
    region: 'east_asia',
    bgGradient: 'from-indigo-500 to-violet-600',
    tag: '아시아 청년교류 코디',
    desc: '다양한 언어와 문화의 청년들이 하나 되도록 돕는 소통 전문가',
  },
  // 14. 글로벌 AAMEN 평화의 비둘기
  {
    id: 'global-shalom',
    name: '샬롬 (Shalom Dove)',
    nameEn: 'Shalom Dove',
    countryCode: 'GLOBAL',
    countryName: 'AAMEN 전역',
    flag: '🕊️',
    emoji: '🕊️',
    region: 'central_global',
    bgGradient: 'from-amber-400 via-yellow-500 to-emerald-500',
    tag: '평화와 일치의 비둘기',
    desc: '그리스도의 온전한 평화(Shalom)를 온 아시아에 전하는 상징',
  },
]

export function getCharacterById(id?: string | null): CharacterAvatar {
  if (!id) return AAMEN_CHARACTERS[0]
  return AAMEN_CHARACTERS.find((c) => c.id === id) || AAMEN_CHARACTERS[0]
}
