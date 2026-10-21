// ============================================================================
// Multi-lingual Fuzzy & Korean Chosung Search Utility
// Supports: Direct match, English/Korean aliases, Chosung match, Typo tolerance
// ============================================================================

// 한글 초성 목록 (19자)
const CHOSUNG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
]

// 영타 -> 한타 키 매핑
const ENG_KEY = "rRseEfaqQtTdwWczxvgkoiOjpuPhynbml"
const KOR_KEY = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣ"

/**
 * 한글 문자열에서 초성만 추출
 * 예: "배용하" -> "ㅂㅇㅎ", "김복기" -> "ㄱㅂㄱ"
 */
export function getChosung(text: string): string {
  if (!text) return ''
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code >= 0xac00 && code <= 0xd7a3) {
      const chosungIndex = Math.floor((code - 0xac00) / (21 * 28))
      result += CHOSUNG[chosungIndex] || ''
    } else {
      result += text[i]
    }
  }
  return result
}

/**
 * 문자열이 오직 한글 자음(초성)만으로 구성되어 있는지 확인
 */
export function isOnlyChosung(text: string): boolean {
  if (!text) return false
  const clean = text.replace(/\s+/g, '')
  return clean.length > 0 && /^[ㄱ-ㅎ]+$/.test(clean)
}

/**
 * 영타로 잘못 친 한글을 영문 -> 한글 자모로 변환
 * 예: 'qodydgk' -> 'ㅂㅐㅇㅛㅇㅎㅏ'
 */
export function engToKorJamo(text: string): string {
  if (!text) return ''
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const idx = ENG_KEY.indexOf(ch)
    if (idx !== -1) {
      result += KOR_KEY[idx]
    } else {
      result += ch
    }
  }
  return result
}

/**
 * 한타로 잘못 친 영문을 한글 -> 영문으로 변환
 * 예: 'ㅠㅁㄷ' -> 'bae'
 */
export function korToEng(text: string): string {
  if (!text) return ''
  let result = ''
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const idx = KOR_KEY.indexOf(ch)
    if (idx !== -1) {
      result += ENG_KEY[idx]
    } else {
      result += ch
    }
  }
  return result
}

/**
 * Damerau-Levenshtein 거리 계산
 * 삽입, 삭제, 치환뿐만 아니라 인접한 두 문자 전치(Transposition: 예: 'BEA' <-> 'BAE')를 거리 1로 정확하게 계산
 */
export function damerauLevenshteinDistance(s1: string, s2: string): number {
  const m = s1.length
  const n = s2.length
  if (m === 0) return n
  if (n === 0) return m

  const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) d[i][0] = i
  for (let j = 0; j <= n; j++) d[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1].toLowerCase() === s2[j - 1].toLowerCase() ? 0 : 1
      d[i][j] = Math.min(
        d[i - 1][j] + 1,       // deletion
        d[i][j - 1] + 1,       // insertion
        d[i - 1][j - 1] + cost // substitution
      )

      // Transposition check
      if (
        i > 1 &&
        j > 1 &&
        s1[i - 1].toLowerCase() === s2[j - 2].toLowerCase() &&
        s1[i - 2].toLowerCase() === s2[j - 1].toLowerCase()
      ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }

  return d[m][n]
}

/**
 * 회원의 다국어 별칭 및 필드들과 검색어 사이의 매칭 점수(Score) 산출
 * 점수가 높을수록 최우선 추천 (0점이면 불일치)
 */
export function getFuzzyMatchScore(
  query: string,
  targetFields: (string | undefined | null)[]
): number {
  const q = query.trim().toLowerCase()
  if (!q) return 100 // 빈 검색어는 기본 노출

  const cleanQ = q.replace(/\s+/g, '')
  const qChosung = isOnlyChosung(cleanQ) ? cleanQ : null
  const qAsKorJamo = engToKorJamo(q)
  const qAsEng = korToEng(q).toLowerCase()

  let maxScore = 0

  for (const field of targetFields) {
    if (!field) continue
    const target = field.trim().toLowerCase()
    const cleanTarget = target.replace(/\s+/g, '')

    // 1. 완전 일치 (100점)
    if (target === q || cleanTarget === cleanQ) {
      maxScore = Math.max(maxScore, 100)
      continue
    }

    // 2. 시작 부분 일치 (90점)
    if (target.startsWith(q) || cleanTarget.startsWith(cleanQ)) {
      maxScore = Math.max(maxScore, 90)
      continue
    }

    // 3. 단어 단위 접두사 일치 (85점) - 예: "Bae Yongha"에서 "Yong" 검색 시
    const words = target.split(/[\s/(),_-]+/)
    if (words.some((w) => w.startsWith(q))) {
      maxScore = Math.max(maxScore, 85)
      continue
    }

    // 4. 부분 문자열 포함 (80점)
    if (target.includes(q) || cleanTarget.includes(cleanQ)) {
      maxScore = Math.max(maxScore, 80)
      continue
    }

    // 5. 한글 초성 검색 일치 (78점)
    if (qChosung) {
      const targetChosung = getChosung(target).replace(/\s+/g, '')
      if (targetChosung.includes(qChosung)) {
        maxScore = Math.max(maxScore, targetChosung.startsWith(qChosung) ? 79 : 75)
        continue
      }
    }

    // 6. 영타-한타 오타 변환 매칭 (72점) - 예: 'qodydgk' -> '배용하'
    if (qAsKorJamo && qAsKorJamo.length >= 2) {
      const targetJamo = getChosung(target)
      if (target.includes(qAsKorJamo) || targetJamo.includes(qAsKorJamo)) {
        maxScore = Math.max(maxScore, 72)
        continue
      }
    }

    // 7. 한타-영타 오타 변환 매칭 (72점) - 예: 'ㅠㅁㄷ' -> 'bae'
    if (qAsEng && qAsEng.length >= 2) {
      if (target.includes(qAsEng) || cleanTarget.includes(qAsEng)) {
        maxScore = Math.max(maxScore, 72)
        continue
      }
    }

    // 8. Damerau-Levenshtein 오타 퍼지 매칭 (인접 전치 오타, 1글자 차이 교정)
    // 예: 'BEA' vs 'Bae' (거리 1), 'Yonga' vs 'Yongha' (거리 1)
    if (cleanQ.length >= 2) {
      for (const w of words) {
        if (w.length >= 2) {
          const dist = damerauLevenshteinDistance(cleanQ, w)
          if (dist === 1) {
            maxScore = Math.max(maxScore, 70)
          } else if (dist === 2 && cleanQ.length >= 4) {
            maxScore = Math.max(maxScore, 55)
          }
        }
      }
    }
  }

  return maxScore
}
