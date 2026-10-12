'use client'

import React from 'react'

export interface CharacterItem {
  id: string
  title: string
  gender: 'male' | 'female'
  ageGroup: 'youth' | 'senior'
  mood: string
  hairDesc: string
  skinDesc: string
  outfitDesc: string
  bgHex: string
}

export const CHARACTER_LIST: CharacterItem[] = [
  // 1. 청년 남성 (4명)
  {
    id: 'm-youth-smart',
    title: '지적인 청년',
    gender: 'male',
    ageGroup: 'youth',
    mood: '단정하고 지적인 분위기',
    hairDesc: '다크 브라운 댄디컷',
    skinDesc: '밝은 쿨톤',
    outfitDesc: '슬림 뿔테 안경 + 네이비 니트 & 셔츠',
    bgHex: '#E0E7FF',
  },
  {
    id: 'm-youth-active',
    title: '열정적인 청년',
    gender: 'male',
    ageGroup: 'youth',
    mood: '활기차고 에너지 넘치는 분위기',
    hairDesc: '내추럴 투블럭 볼륨컷',
    skinDesc: '건강한 탠톤',
    outfitDesc: '에메랄드 캐주얼 후디',
    bgHex: '#D1FAE5',
  },
  {
    id: 'm-youth-gentle',
    title: '온화한 청년',
    gender: 'male',
    ageGroup: 'youth',
    mood: '부드럽고 편안한 분위기',
    hairDesc: '소프트 가르마 펌',
    skinDesc: '자연스러운 웜톤',
    outfitDesc: '세이지 그린 카라 셔츠',
    bgHex: '#FEF3C7',
  },
  {
    id: 'm-youth-modern',
    title: '단정한 청년',
    gender: 'male',
    ageGroup: 'youth',
    mood: '깔끔하고 신뢰감 있는 분위기',
    hairDesc: '클래식 포마드 헤어',
    skinDesc: '뉴트럴 중간톤',
    outfitDesc: '챠콜 블레이저 + 화이트 셔츠',
    bgHex: '#F3F4F6',
  },

  // 2. 청년 여성 (4명)
  {
    id: 'f-youth-warm',
    title: '친근한 청년',
    gender: 'female',
    ageGroup: 'youth',
    mood: '따뜻하고 미소가 예쁜 분위기',
    hairDesc: '미디엄 브라운 단발',
    skinDesc: '화사한 피치톤',
    outfitDesc: '포근한 베이지 라운드 니트',
    bgHex: '#FFE4E6',
  },
  {
    id: 'f-youth-calm',
    title: '차분한 청년',
    gender: 'female',
    ageGroup: 'youth',
    mood: '사려깊고 차분한 분위기',
    hairDesc: '다크 롱 웨이브 헤어',
    skinDesc: '밝은 페어톤',
    outfitDesc: '라벤더 블라우스',
    bgHex: '#EDE9FE',
  },
  {
    id: 'f-youth-bright',
    title: '당당한 청년',
    gender: 'female',
    ageGroup: 'youth',
    mood: '밝고 쾌활한 리더십 분위기',
    hairDesc: '하이 포니테일 헤어',
    skinDesc: '생기 있는 웜톤',
    outfitDesc: '코랄 핑크 가디건',
    bgHex: '#FEE2E2',
  },
  {
    id: 'f-youth-creative',
    title: '지혜로운 청년',
    gender: 'female',
    ageGroup: 'youth',
    mood: '개성 있고 탐구적인 분위기',
    hairDesc: '쇼트 보브컷',
    skinDesc: '밝은 내추럴톤',
    outfitDesc: '라운드 메탈 안경 + 오렌지 터틀넥',
    bgHex: '#FFEDD5',
  },

  // 3. 장년 남성 (4명)
  {
    id: 'm-senior-wise',
    title: '인자한 장년',
    gender: 'male',
    ageGroup: 'senior',
    mood: '중후하고 따뜻한 미소의 분위기',
    hairDesc: '자연스러운 은발 숏컷',
    skinDesc: '건강한 중년 톤',
    outfitDesc: '네이비 정장 자켓 + 화이트 셔츠',
    bgHex: '#E2E8F0',
  },
  {
    id: 'm-senior-leader',
    title: '신뢰감 있는 장년',
    gender: 'male',
    ageGroup: 'senior',
    mood: '지혜롭고 무게감 있는 리더 분위기',
    hairDesc: '단정한 그레이 헤어',
    skinDesc: '안정된 웜톤',
    outfitDesc: '골드 프레임 안경 + 브라운 트위드 자켓',
    bgHex: '#FEF9C3',
  },
  {
    id: 'm-senior-mentor',
    title: '소탈한 장년',
    gender: 'male',
    ageGroup: 'senior',
    mood: '친근하고 소탈한 멘토 분위기',
    hairDesc: '내추럴 실버 웨이브',
    skinDesc: '건강한 햇살 탠톤',
    outfitDesc: '편안한 블루 데님 카라 셔츠',
    bgHex: '#E0F2FE',
  },
  {
    id: 'm-senior-gentle',
    title: '온유한 장년',
    gender: 'male',
    ageGroup: 'senior',
    mood: '온유하고 자상한 목회자 분위기',
    hairDesc: '부드러운 하프 은발',
    skinDesc: '밝은 웜톤',
    outfitDesc: '카키 가디건 + 체크 셔츠',
    bgHex: '#ECFDF5',
  },

  // 4. 장년 여성 (4명)
  {
    id: 'f-senior-warm',
    title: '온화한 장년',
    gender: 'female',
    ageGroup: 'senior',
    mood: '품격 있고 다정한 어머니 분위기',
    hairDesc: '우아한 쇼트 펌 은발',
    skinDesc: '부드러운 웜톤',
    outfitDesc: '딥 에메랄드 니트웨어',
    bgHex: '#CCFBF1',
  },
  {
    id: 'f-senior-gentle',
    title: '자상한 장년',
    gender: 'female',
    ageGroup: 'senior',
    mood: '화사하고 배려심 넘치는 분위기',
    hairDesc: '단정한 하프업 은발',
    skinDesc: '화사한 페어톤',
    outfitDesc: '로즈 핑크 소프트 블라우스',
    bgHex: '#FCE7F3',
  },
  {
    id: 'f-senior-scholar',
    title: '학구적인 장년',
    gender: 'female',
    ageGroup: 'senior',
    mood: '전문적이고 지적인 멘토 분위기',
    hairDesc: '클래식 보브 그레이컷',
    skinDesc: '단정한 쿨톤',
    outfitDesc: '세련된 뿔테 안경 + 딥 퍼플 자켓',
    bgHex: '#F3E8FF',
  },
  {
    id: 'f-senior-peace',
    title: '평온한 장년',
    gender: 'female',
    ageGroup: 'senior',
    mood: '자애롭고 평온한 기도자 분위기',
    hairDesc: '자연스러운 소프트 웨이브 실버',
    skinDesc: '맑은 라이트톤',
    outfitDesc: '스카이블루 스카프 니트',
    bgHex: '#E0F2FE',
  },
]

export function getCharacterItem(id?: string | null): CharacterItem {
  if (!id) return CHARACTER_LIST[0]
  return CHARACTER_LIST.find((c) => c.id === id) || CHARACTER_LIST[0]
}

/**
 * 인물 캐릭터 벡터 SVG 렌더러
 * 헤어스타일, 얼굴형, 피부색, 상반신 복장, 안경, 연령대 디테일을 완벽하게 렌더링
 */
export function CharacterSvg({ id, className = 'w-full h-full' }: { id: string; className?: string }) {
  const char = getCharacterItem(id)

  // 공통 베이스 속성 결정
  const isSenior = char.ageGroup === 'senior'
  const isFemale = char.gender === 'female'

  // 피부색
  let skinColor = '#FBD3B6' // 밝은 톤
  if (id === 'm-youth-active' || id === 'm-senior-mentor') skinColor = '#E0AC69' // 탠톤
  else if (id === 'm-youth-gentle' || id === 'm-senior-leader' || id === 'f-senior-warm') skinColor = '#F2C299' // 웜톤
  else if (id === 'f-youth-calm' || id === 'f-youth-creative' || id === 'f-senior-scholar') skinColor = '#FCE2D0' // 페어톤
  else if (id === 'm-youth-modern' || id === 'm-senior-wise') skinColor = '#EDB98A'

  // 의상 색상
  let clothColor = '#2563EB' // 기본 블루
  let innerCollarColor = '#FFFFFF'
  if (id === 'm-youth-smart') { clothColor = '#1E3A8A'; innerCollarColor = '#FFFFFF' }
  else if (id === 'm-youth-active') { clothColor = '#059669'; innerCollarColor = '#10B981' }
  else if (id === 'm-youth-gentle') { clothColor = '#4D7C0F'; innerCollarColor = '#FFFFFF' }
  else if (id === 'm-youth-modern') { clothColor = '#374151'; innerCollarColor = '#FFFFFF' }
  else if (id === 'f-youth-warm') { clothColor = '#D97706'; innerCollarColor = '#FDE68A' }
  else if (id === 'f-youth-calm') { clothColor = '#7C3AED'; innerCollarColor = '#DDD6FE' }
  else if (id === 'f-youth-bright') { clothColor = '#E11D48'; innerCollarColor = '#FECDD3' }
  else if (id === 'f-youth-creative') { clothColor = '#EA580C'; innerCollarColor = '#FDBA74' }
  else if (id === 'm-senior-wise') { clothColor = '#1E293B'; innerCollarColor = '#FFFFFF' }
  else if (id === 'm-senior-leader') { clothColor = '#78350F'; innerCollarColor = '#FEF3C7' }
  else if (id === 'm-senior-mentor') { clothColor = '#0284C7'; innerCollarColor = '#E0F2FE' }
  else if (id === 'm-senior-gentle') { clothColor = '#15803D'; innerCollarColor = '#DCFCE7' }
  else if (id === 'f-senior-warm') { clothColor = '#0F766E'; innerCollarColor = '#CCFBF1' }
  else if (id === 'f-senior-gentle') { clothColor = '#DB2777'; innerCollarColor = '#FCE7F3' }
  else if (id === 'f-senior-scholar') { clothColor = '#6B21A8'; innerCollarColor = '#F3E8FF' }
  else if (id === 'f-senior-peace') { clothColor = '#0369A1'; innerCollarColor = '#BAE6FD' }

  // 헤어 색상
  let hairColor = '#2D231E' // 다크 브라운/블랙
  if (isSenior) {
    if (id === 'm-senior-wise' || id === 'f-senior-peace') hairColor = '#94A3B8' // 실버 그레이
    else if (id === 'm-senior-leader' || id === 'f-senior-scholar') hairColor = '#64748B' // 슬레이트 그레이
    else if (id === 'm-senior-mentor' || id === 'f-senior-gentle') hairColor = '#CBD5E1' // 화이트 실버
    else hairColor = '#78716C' // 웜 그레이
  } else {
    if (id === 'f-youth-warm' || id === 'm-youth-gentle') hairColor = '#5C3D2E' // 미디엄 브라운
    else if (id === 'f-youth-creative') hairColor = '#6B4226'
    else if (id === 'f-youth-bright') hairColor = '#3D2B1F'
  }

  // 안경 유무
  const hasGlasses = id === 'm-youth-smart' || id === 'f-youth-creative' || id === 'm-senior-leader' || id === 'f-senior-scholar'
  const isGoldGlasses = id === 'm-senior-leader'

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* 1. 배경 원 */}
      <circle cx="50" cy="50" r="48" fill={char.bgHex} />

      {/* 2. 뒷머리 (여성 롱헤어 전용) */}
      {id === 'f-youth-calm' && (
        <path d="M 28 42 C 24 65, 26 80, 32 90 L 68 90 C 74 80, 76 65, 72 42 Z" fill={hairColor} />
      )}
      {id === 'f-youth-bright' && (
        // 포니테일 꼬리
        <path d="M 64 30 C 78 22, 84 38, 76 48 C 72 40, 68 36, 64 34 Z" fill={hairColor} />
      )}
      {id === 'f-senior-gentle' && (
        <path d="M 29 45 C 27 60, 28 75, 34 85 L 66 85 C 72 75, 73 60, 71 45 Z" fill={hairColor} />
      )}

      {/* 3. 어깨 & 상반신 복장 */}
      <path
        d="M 20 98 C 22 75, 36 68, 50 68 C 64 68, 78 75, 80 98 Z"
        fill={clothColor}
      />

      {/* 4. 카라 / 이너웨어 디테일 */}
      {id === 'm-youth-active' ? (
        // 후드 티 스트링
        <path d="M 44 68 C 44 76, 56 76, 56 68 Z" fill={innerCollarColor} />
      ) : (
        // V넥 또는 셔츠 깃
        <>
          <polygon points="50,77 41,68 59,68" fill={innerCollarColor} />
          {/* 수트 라펠 */}
          {(id === 'm-youth-modern' || id === 'm-senior-wise' || id === 'm-senior-leader' || id === 'f-senior-scholar') && (
            <>
              <path d="M 36 70 L 44 86 L 41 87 L 31 73 Z" fill="#1F2937" opacity="0.2" />
              <path d="M 64 70 L 56 86 L 59 87 L 69 73 Z" fill="#1F2937" opacity="0.2" />
            </>
          )}
        </>
      )}

      {/* 5. 목 */}
      <rect x="44" y="54" width="12" height="16" rx="2" fill={skinColor} />
      <ellipse cx="50" cy="56" rx="6" ry="2" fill="#000000" opacity="0.08" />

      {/* 6. 귀 */}
      <circle cx="31" cy="46" r="4.2" fill={skinColor} />
      <circle cx="69" cy="46" r="4.2" fill={skinColor} />

      {/* 7. 얼굴형 */}
      {isFemale ? (
        // 여성형 부드러운 달걀형
        <path
          d="M 33 42 C 33 28, 67 28, 67 42 C 67 56, 59 63, 50 63 C 41 63, 33 56, 33 42 Z"
          fill={skinColor}
        />
      ) : (
        // 남성형 깔끔한 턱선
        <path
          d="M 33 42 C 33 27, 67 27, 67 42 C 67 56, 60 64, 50 64 C 40 64, 33 56, 33 42 Z"
          fill={skinColor}
        />
      )}

      {/* 8. 볼터치 (여성 캐릭터 친근감) */}
      {isFemale && (
        <>
          <circle cx="38" cy="49" r="3.5" fill="#FB7185" opacity="0.35" />
          <circle cx="62" cy="49" r="3.5" fill="#FB7185" opacity="0.35" />
        </>
      )}

      {/* 9. 눈썹 */}
      <path
        d={isFemale ? "M 39 37 Q 43 35 47 37" : "M 38 36 Q 43 34 47 36"}
        stroke={isSenior ? "#64748B" : "#262626"}
        strokeWidth={isFemale ? "1.6" : "2.2"}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={isFemale ? "M 53 37 Q 57 35 61 37" : "M 53 36 Q 57 34 62 36"}
        stroke={isSenior ? "#64748B" : "#262626"}
        strokeWidth={isFemale ? "1.6" : "2.2"}
        strokeLinecap="round"
        fill="none"
      />

      {/* 10. 눈 & 미소 표현 */}
      {id === 'm-youth-gentle' || id === 'f-youth-warm' || id === 'm-senior-mentor' || id === 'f-senior-peace' ? (
        // 반달 눈웃음 (따뜻한/친근한 캐릭터)
        <>
          <path d="M 39 44 Q 43 40 47 44" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 53 44 Q 57 40 61 44" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </>
      ) : (
        // 또렷한 눈동자
        <>
          <ellipse cx="43" cy="43" rx="2.5" ry="3" fill="#1F2937" />
          <ellipse cx="57" cy="43" rx="2.5" ry="3" fill="#1F2937" />
          <circle cx="44" cy="42" r="0.9" fill="#FFFFFF" />
          <circle cx="58" cy="42" r="0.9" fill="#FFFFFF" />
        </>
      )}

      {/* 장년 눈가 주름 디테일 */}
      {isSenior && (
        <>
          <path d="M 35 44 Q 33 45 32 47" stroke="#A87A54" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 65 44 Q 67 45 68 47" stroke="#A87A54" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
        </>
      )}

      {/* 11. 코 */}
      <path d="M 50 45 L 48.5 48.5 L 51.5 48.5" stroke="#B48259" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* 12. 입 (미소) */}
      {id === 'm-youth-active' || id === 'f-youth-bright' ? (
        // 밝은 치아 미소
        <path d="M 44 52 Q 50 59 56 52 Z" fill="#FFFFFF" stroke="#BE123C" strokeWidth="1.4" strokeLinejoin="round" />
      ) : (
        // 온화한 립 커브
        <path d="M 44 53 Q 50 57.5 56 53" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}

      {/* 장년 팔자 미소선 */}
      {isSenior && (
        <>
          <path d="M 42 51 Q 40 54 41 57" stroke="#B48259" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
          <path d="M 58 51 Q 60 54 59 57" stroke="#B48259" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4" />
        </>
      )}

      {/* 13. 안경 (선택적) */}
      {hasGlasses && (
        <g stroke={isGoldGlasses ? "#D97706" : "#1F2937"} strokeWidth="1.8" fill="none">
          <rect x="36" y="38" width="13" height="10" rx="3.5" />
          <rect x="51" y="38" width="13" height="10" rx="3.5" />
          <line x1="49" y1="43" x2="51" y2="43" />
          <line x1="31" y1="42" x2="36" y2="42" />
          <line x1="64" y1="42" x2="69" y2="42" />
        </g>
      )}

      {/* 14. 앞머리 & 헤어스타일 (인물별 디테일) */}
      {/* 남성 댄디컷 (스마트) */}
      {id === 'm-youth-smart' && (
        <path d="M 31 38 C 30 23, 70 23, 69 38 C 65 31, 55 31, 50 33 C 43 31, 35 34, 31 38 Z" fill={hairColor} />
      )}
      {/* 남성 투블럭 펌 (액티브) */}
      {id === 'm-youth-active' && (
        <path d="M 31 36 C 30 20, 70 20, 69 36 C 66 28, 60 27, 54 30 C 48 26, 40 28, 31 36 Z" fill={hairColor} />
      )}
      {/* 남성 가르마 펌 (젠틀) */}
      {id === 'm-youth-gentle' && (
        <path d="M 31 38 C 30 22, 70 22, 69 38 C 64 30, 56 31, 52 35 C 48 31, 38 30, 31 38 Z" fill={hairColor} />
      )}
      {/* 남성 포마드 (모던) */}
      {id === 'm-youth-modern' && (
        <path d="M 31 38 C 31 22, 69 22, 69 38 C 64 29, 44 26, 31 38 Z" fill={hairColor} />
      )}
      {/* 여성 단발 (웜) */}
      {id === 'f-youth-warm' && (
        <path d="M 28 42 C 28 22, 72 22, 72 42 C 74 54, 71 58, 68 56 C 68 34, 55 31, 50 34 C 44 31, 32 34, 32 56 C 29 58, 26 54, 28 42 Z" fill={hairColor} />
      )}
      {/* 여성 롱 웨이브 (캄) */}
      {id === 'f-youth-calm' && (
        <path d="M 30 40 C 30 22, 70 22, 70 40 C 69 48, 68 56, 66 52 C 65 33, 56 31, 50 34 C 44 31, 35 33, 34 52 C 32 56, 31 48, 30 40 Z" fill={hairColor} />
      )}
      {/* 여성 하이 포니테일 (브라이트) */}
      {id === 'f-youth-bright' && (
        <path d="M 31 38 C 31 22, 69 22, 69 38 C 64 32, 56 30, 50 33 C 44 30, 36 32, 31 38 Z" fill={hairColor} />
      )}
      {/* 여성 보브컷 (크리에이티브) */}
      {id === 'f-youth-creative' && (
        <path d="M 29 42 C 29 23, 71 23, 71 42 C 73 52, 68 53, 67 48 C 66 32, 54 31, 48 33 C 42 31, 34 32, 33 48 C 32 53, 27 52, 29 42 Z" fill={hairColor} />
      )}
      {/* 장년 남성 숏 은발 (와이즈) */}
      {id === 'm-senior-wise' && (
        <path d="M 31 38 C 30 23, 70 23, 69 38 C 65 30, 55 29, 50 32 C 43 29, 35 30, 31 38 Z" fill={hairColor} />
      )}
      {/* 장년 남성 그레이컷 (리더) */}
      {id === 'm-senior-leader' && (
        <path d="M 31 37 C 30 22, 70 22, 69 37 C 65 29, 56 29, 50 31 C 42 29, 34 30, 31 37 Z" fill={hairColor} />
      )}
      {/* 장년 남성 실버 웨이브 (멘토) */}
      {id === 'm-senior-mentor' && (
        <path d="M 30 38 C 29 21, 71 21, 70 38 C 66 31, 58 30, 50 33 C 42 30, 34 31, 30 38 Z" fill={hairColor} />
      )}
      {/* 장년 남성 하프 은발 (젠틀) */}
      {id === 'm-senior-gentle' && (
        <path d="M 31 38 C 30 23, 70 23, 69 38 C 65 30, 56 30, 51 33 C 44 30, 35 31, 31 38 Z" fill={hairColor} />
      )}
      {/* 장년 여성 펌 은발 (웜) */}
      {id === 'f-senior-warm' && (
        <path d="M 28 42 C 28 20, 72 20, 72 42 C 73 50, 70 52, 67 48 C 67 30, 56 29, 50 32 C 44 29, 33 30, 33 48 C 30 52, 27 50, 28 42 Z" fill={hairColor} />
      )}
      {/* 장년 여성 하프업 (젠틀) */}
      {id === 'f-senior-gentle' && (
        <path d="M 30 38 C 30 22, 70 22, 70 38 C 66 31, 56 30, 50 33 C 44 30, 34 31, 30 38 Z" fill={hairColor} />
      )}
      {/* 장년 여성 보브 그레이 (스칼라) */}
      {id === 'f-senior-scholar' && (
        <path d="M 29 42 C 29 22, 71 22, 71 42 C 72 50, 68 50, 67 45 C 66 31, 55 30, 50 32 C 45 30, 34 31, 33 45 C 32 50, 28 50, 29 42 Z" fill={hairColor} />
      )}
      {/* 장년 여성 소프트 웨이브 (피스) */}
      {id === 'f-senior-peace' && (
        <path d="M 28 42 C 28 21, 72 21, 72 42 C 73 52, 69 54, 67 48 C 66 30, 56 29, 50 32 C 44 29, 34 30, 33 48 C 31 54, 27 52, 28 42 Z" fill={hairColor} />
      )}
    </svg>
  )
}
