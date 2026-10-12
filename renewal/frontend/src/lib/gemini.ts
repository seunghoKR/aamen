// ============================================================================
// AAMEN Gemini AI & Translation Engine Management Utility
// ============================================================================

export interface GeminiConfig {
  apiKey: string
  model: string
  preferredEngine: 'gemini' | 'local_ai'
  localAiEndpoint: string
  localAiModel: string
  systemPrompt: string
}

export const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash'
export const DEFAULT_LOCAL_AI_ENDPOINT = 'http://localhost:1234/v1'
export const DEFAULT_LOCAL_AI_MODEL = 'gemma-2-9b-it'

export const DEFAULT_SYSTEM_PROMPT = `당신은 아시아 13개국 기독교 아나밥티스트 메노나이트 교육 네트워크(AAMEN)의 공식 다국어 번역 및 사역 지원 AI입니다.
원문의 기독교적 은혜와 평화(Shalom), 존중의 뉘앙스를 보존하고, 현지 성도들이 자연스럽고 따뜻하게 이해할 수 있도록 번역 및 작성하세요.`

export const AAMEN_LANGUAGES = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English (공용)', flag: '🌐' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'th', name: 'ภาษาไทย (태국)', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt (베트남)', flag: '🇻🇳' },
  { code: 'my', name: 'မြန်မာစာ (미얀마)', flag: '🇲🇲' },
  { code: 'ja', name: '日本語 (일본)', flag: '🇯🇵' },
  { code: 'zh-TW', name: '繁體中文 (대만)', flag: '🇹🇼' },
  { code: 'hi', name: 'हिन्दी (인도)', flag: '🇮🇳' },
  { code: 'ne', name: 'नेपाली (네팔)', flag: '🇳🇵' },
  { code: 'km', name: 'ភាសាខ្មែរ (캄보디아)', flag: '🇰🇭' },
  { code: 'lo', name: 'ພາສາລາວ (라오스)', flag: '🇱🇦' },
  { code: 'mn', name: 'Монгол хэл (몽골)', flag: '🇲🇳' },
]

export const AVAILABLE_GEMINI_MODELS = [
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash (권장)',
    desc: '초고속 1~2초 응답, 13개국어 번역에 최적화, 무료 티어 충분',
    badge: '추천',
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    desc: '최신 차세대 고속 모델, 향상된 문맥 이해도',
    badge: '최신',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    desc: '심층 신학 자료, 장문 공과공부 문서 전문 분석 및 번역',
    badge: '고지능',
  },
]

export function getGeminiConfig(): GeminiConfig {
  if (typeof window === 'undefined') {
    return {
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
      model: DEFAULT_GEMINI_MODEL,
      preferredEngine: 'gemini',
      localAiEndpoint: DEFAULT_LOCAL_AI_ENDPOINT,
      localAiModel: DEFAULT_LOCAL_AI_MODEL,
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
    }
  }

  const savedKey = localStorage.getItem('aamen_gemini_api_key') || ''
  const savedModel = localStorage.getItem('aamen_gemini_model') || DEFAULT_GEMINI_MODEL
  const savedEngine = (localStorage.getItem('aamen_ai_preferred_engine') as 'gemini' | 'local_ai') || 'gemini'
  const savedLocalEndpoint = localStorage.getItem('aamen_local_ai_endpoint') || DEFAULT_LOCAL_AI_ENDPOINT
  const savedLocalModel = localStorage.getItem('aamen_local_ai_model') || DEFAULT_LOCAL_AI_MODEL
  const savedSystemPrompt = localStorage.getItem('aamen_gemini_system_prompt') || DEFAULT_SYSTEM_PROMPT

  return {
    apiKey: savedKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    model: savedModel,
    preferredEngine: savedEngine,
    localAiEndpoint: savedLocalEndpoint,
    localAiModel: savedLocalModel,
    systemPrompt: savedSystemPrompt,
  }
}

export function saveGeminiConfig(config: Partial<GeminiConfig>) {
  if (typeof window === 'undefined') return

  if (config.apiKey !== undefined) {
    localStorage.setItem('aamen_gemini_api_key', config.apiKey.trim())
  }
  if (config.model !== undefined) {
    localStorage.setItem('aamen_gemini_model', config.model)
  }
  if (config.preferredEngine !== undefined) {
    localStorage.setItem('aamen_ai_preferred_engine', config.preferredEngine)
  }
  if (config.localAiEndpoint !== undefined) {
    localStorage.setItem('aamen_local_ai_endpoint', config.localAiEndpoint.trim())
  }
  if (config.localAiModel !== undefined) {
    localStorage.setItem('aamen_local_ai_model', config.localAiModel.trim())
  }
  if (config.systemPrompt !== undefined) {
    localStorage.setItem('aamen_gemini_system_prompt', config.systemPrompt.trim())
  }
}

/**
 * Gemini API 연결 테스트 함수
 */
export async function testGeminiConnection(apiKey: string, model: string = DEFAULT_GEMINI_MODEL): Promise<{
  success: boolean
  message: string
  latencyMs?: number
  sampleOutput?: string
}> {
  const cleanKey = apiKey.trim()
  if (!cleanKey) {
    return {
      success: false,
      message: 'Gemini API 키가 입력되지 않았습니다. Google AI Studio에서 발급받은 키를 입력해 주세요.',
    }
  }

  const startTime = Date.now()
  const testPrompt = '샬롬! 아시아 13개국 평화의 네트워크 AAMEN을 위한 짧은 축복 인사말 한 문장을 영어와 한국어로 작성해 주세요.'

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: testPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 120,
        },
      }),
    })

    const latencyMs = Date.now() - startTime
    const data = await res.json()

    if (!res.ok || data.error) {
      const errMsg = data.error?.message || `HTTP ${res.status} 에러`
      return {
        success: false,
        message: `Gemini API 연결 실패: ${errMsg}`,
        latencyMs,
      }
    }

    const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return {
      success: true,
      message: `성공! Gemini 엔진이 정상 응답했습니다. (${latencyMs}ms)`,
      latencyMs,
      sampleOutput: outputText.trim(),
    }
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime
    const errText = err instanceof Error ? err.message : '알 수 없는 네트워크 오류'
    return {
      success: false,
      message: `네트워크 연결 실패: ${errText}`,
      latencyMs,
    }
  }
}

/**
 * 입력 텍스트를 목표 언어로 실시간 번역
 */
export async function translateWithGemini({
  text,
  targetLanguageName,
  apiKey,
  model = DEFAULT_GEMINI_MODEL,
}: {
  text: string
  targetLanguageName: string
  apiKey: string
  model?: string
}): Promise<{ success: boolean; translation: string; error?: string }> {
  const cleanKey = apiKey.trim()
  if (!cleanKey) {
    return { success: false, translation: '', error: 'API 키가 필요합니다.' }
  }

  const prompt = `당신은 기독교 아나밥티스트 메노나이트 평화 사역 전문 번역가입니다.
다음 원문을 '${targetLanguageName}'로 번역해 주세요.
불필요한 인사말이나 부연 설명 없이, 오직 번역된 결과 텍스트만 출력하세요.

원문:
${text}`

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
      }),
    })

    const data = await res.json()
    if (!res.ok || data.error) {
      return { success: false, translation: '', error: data.error?.message || '번역 실패' }
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
    return { success: true, translation: result }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '네트워크 통신 오류'
    return { success: false, translation: '', error: msg }
  }
}
