'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Sparkles,
  Key,
  Globe,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
  Check,
} from 'lucide-react'
import {
  getGeminiConfig,
  saveGeminiConfig,
  testGeminiConnection,
  translateWithGemini,
  AVAILABLE_GEMINI_MODELS,
  AAMEN_LANGUAGES,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_SYSTEM_PROMPT,
} from '@/lib/gemini'
import { getAdminTexts } from '@/lib/adminI18n'

export default function GeminiAiSettingsPage() {
  const params = useParams()
  const currentLocale = (params?.locale as string) || 'ko'
  const isEn = currentLocale === 'en'
  const t = getAdminTexts(currentLocale).aiSettings
  const localePath = (p: string) => `/${currentLocale}${p.startsWith('/') ? p : `/${p}`}`

  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_GEMINI_MODEL)
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)

  // 테스트 도구 상태
  const [testText, setTestText] = useState(
    isEn
      ? 'Shalom! AAMEN 15-Nation Peace Network curriculum translation and ministry support.'
      : '샬롬! 아시아 15개국 평화의 네트워크 AAMEN 교안 번역 및 사역 지원입니다.'
  )
  const [testTargetLang, setTestTargetLang] = useState('Bahasa Indonesia (인도네시아)')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error'
    message: string
    latencyMs?: number
    output?: string
  }>({ status: 'idle', message: '' })

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  useEffect(() => {
    const config = getGeminiConfig()
    setApiKey(config.apiKey)
    setSelectedModel(config.model || DEFAULT_GEMINI_MODEL)
    setSystemPrompt(config.systemPrompt || DEFAULT_SYSTEM_PROMPT)
  }, [])

  // 설정 저장
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    saveGeminiConfig({
      apiKey,
      model: selectedModel,
      preferredEngine: 'gemini',
      systemPrompt,
    })
    showToast(
      isEn
        ? '🎉 Gemini AI engine settings have been saved successfully!'
        : '🎉 제미나이(Gemini) AI 설정이 안전하게 저장되었습니다!'
    )
  }

  // 실시간 연결 및 번역 진단 테스트
  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        status: 'error',
        message: isEn ? '⚠️ Please enter your Gemini API key first.' : '⚠️ 먼저 Gemini API 키를 입력해 주세요.',
      })
      return
    }

    setIsTesting(true)
    setTestResult({
      status: 'idle',
      message: isEn ? 'Communicating with Gemini server in real time...' : 'Gemini 서버와 실시간 통신 중...',
    })

    // 1단계: 연결 확인
    const connCheck = await testGeminiConnection(apiKey, selectedModel)
    if (!connCheck.success) {
      setIsTesting(false)
      setTestResult({
        status: 'error',
        message: connCheck.message,
        latencyMs: connCheck.latencyMs,
      })
      return
    }

    // 2단계: 실제 입력 문장 다국어 번역 테스트
    const transCheck = await translateWithGemini({
      text: testText,
      targetLanguageName: testTargetLang,
      apiKey,
      model: selectedModel,
    })

    setIsTesting(false)
    if (transCheck.success) {
      setTestResult({
        status: 'success',
        message: isEn
          ? `Connected successfully! Latency: ${connCheck.latencyMs}ms`
          : `연결 성공! 응답 지연 시간: ${connCheck.latencyMs}ms`,
        latencyMs: connCheck.latencyMs,
        output: transCheck.translation,
      })
      showToast(isEn ? '⚡ Gemini translation test completed successfully!' : '⚡ Gemini 번역 테스트가 성공적으로 완료되었습니다!')
    } else {
      setTestResult({
        status: 'error',
        message: transCheck.error || (isEn ? 'An error occurred during translation.' : '번역 처리 중 오류가 발생했습니다.'),
        latencyMs: connCheck.latencyMs,
      })
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 토스트 */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-950 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-purple-400 animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* 헤더 배너 */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white">
              AI ENGINE DASHBOARD
            </span>
            <span className="text-xs font-black bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Zap size={11} />
              <span>Gemini Flash Active (무료 지원)</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Sparkles size={28} className="text-amber-300" />
            <span>{t.title}</span>
          </h1>
          <p className="text-white/80 text-sm max-w-2xl mt-2 leading-relaxed">
            {isEn
              ? 'Manage Google Gemini 1.5 Flash API for real-time 15-nation curriculum translation and editorial assistance.'
              : 'Google Gemini 1.5 Flash 무료 API를 활용하여 15개국 실시간 다국어 지원 및 교안 번역 수정을 관리합니다.'}
          </p>
        </div>

        <Link
          href={localePath('/admin')}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs backdrop-blur-md border border-white/20 transition-all shrink-0"
        >
          {isEn ? 'Dashboard Home' : '대시보드 홈으로'}
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. API 키 및 기본 엔진 설정 카드 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                <Key size={18} />
              </span>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-gray-900">
                  {isEn ? 'Google Gemini API Credentials' : 'Google Gemini API 인증 정보'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isEn
                    ? 'Register your free API key obtained from Google AI Studio (Free Tier provides 15 RPM - sufficient for curriculum editing)'
                    : 'Google AI Studio에서 발급받은 무료 API 키를 등록합니다 (Free Tier 분당 15회 제공 - 교안 번역 수정에 충분)'}
                </p>
              </div>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 hover:underline"
            >
              <span>{isEn ? 'Get Free API Key' : 'API 키 무료 발급받기'}</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Gemini API Key <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-300 text-xs sm:text-sm font-mono font-bold focus:outline-purple-600 focus:bg-white pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title={showApiKey ? (isEn ? 'Hide' : '숨기기') : (isEn ? 'Show' : '보기')}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                <span>
                  {isEn
                    ? '🔒 Your API key is stored safely in your browser\'s local storage and is never exposed externally.'
                    : '🔒 API 키는 브라우저 로컬 저장소에 안전하게 보관되며 외부로 노출되지 않습니다.'}
                </span>
              </p>
            </div>

            {/* AI 모델 선택 */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {isEn ? 'Recommended Gemini AI Model (Free Tier Optimized)' : '권장 Gemini AI 모델 선택 (무료 티어 최적화)'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {AVAILABLE_GEMINI_MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModel(m.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      selectedModel === m.id
                        ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs sm:text-sm text-gray-900">{m.name}</span>
                      <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        {m.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 사역 맞춤 시스템 프롬프트 */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {isEn ? 'Ministry Instruction (System Instruction / Guidelines)' : '사역 맞춤 지침 (System Instruction / 사역 가이드라인)'}
              </label>
              <textarea
                rows={3}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-300 text-xs font-medium text-gray-800 focus:outline-purple-600 focus:bg-white leading-relaxed resize-none"
                placeholder={isEn ? 'Ministry translation instructions and tone guidelines...' : 'AI에게 전달할 사역적 번역 및 어조 지침...'}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                {isEn
                  ? 'Encourages warm ministry tone, Shalom, and Anabaptist Mennonite peace theology vocabulary.'
                  : '샬롬(Shalom), 메노나이트 평화 신학 용어 및 각국 성도들을 배려하는 따뜻한 어조를 유지하도록 유도합니다.'}
              </p>
            </div>
          </div>
        </div>

        {/* 2. 전용 Gemini 클라우드 엔진 안내 카드 */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 rounded-3xl p-6 border border-purple-100 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Check size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-gray-900">
                {isEn ? 'Google Gemini 1.5 Flash Active' : 'Google Gemini 전용 번역 엔진 활성화'}
              </h4>
              <p className="text-xs text-gray-600 mt-0.5">
                {isEn
                  ? 'Optimized for 15 Asian languages with zero infrastructure cost. (Local AI can be enabled later if required)'
                  : '교안 번역 및 15개국어 지원에 최적화된 구글 제미나이 단일 모드로 작동합니다. (로컬 AI는 추후 필요 시 추가 가능)'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-purple-700 border border-purple-200 shrink-0">
            {isEn ? 'Active & Ready' : '준비 완료'}
          </span>
        </div>

        {/* 3. 실시간 연결 진단 및 15개국 번역 테스트 도구 (Live Playground) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                <Globe size={18} />
              </span>
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  {isEn ? 'Live Connection Diagnostic & 15-Language Translation Tester' : '실시간 연결 진단 & 15개국 번역 테스트 도구'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isEn
                    ? 'Dispatch actual translation requests with your API key to verify latency and translation quality in real time.'
                    : '설정한 API 키로 실제 번역 요청을 날려보고 15개국 번역 속도와 품질을 즉시 검증합니다.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {isTesting ? <RefreshCw size={13} className="animate-spin" /> : <Zap size={13} />}
              <span>{isTesting ? (isEn ? 'Awaiting AI Response...' : 'AI 응답 수신 중...') : (isEn ? 'Run Live Translation Test' : '실시간 연결 및 번역 테스트')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-600">
                {isEn ? 'Test Input Text (Source)' : '테스트할 원문 (한국어)'}
              </label>
              <input
                type="text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-purple-600 focus:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-600">
                {isEn ? 'Select Target Language (15 Nations)' : '목표 언어 선택 (15개국)'}
              </label>
              <select
                value={testTargetLang}
                onChange={(e) => setTestTargetLang(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-300 text-xs font-bold text-gray-900 focus:outline-purple-600 focus:bg-white cursor-pointer"
              >
                {AAMEN_LANGUAGES.filter((l) => l.code !== 'ko').map((l) => (
                  <option key={l.code} value={l.name}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 테스트 결과 창 */}
          {testResult.status !== 'idle' && (
            <div
              className={`p-4 rounded-2xl border transition-all ${
                testResult.status === 'success'
                  ? 'bg-purple-50/70 border-purple-200 text-purple-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {testResult.status === 'success' ? (
                    <CheckCircle2 size={15} className="text-emerald-600" />
                  ) : (
                    <AlertCircle size={15} className="text-rose-600" />
                  )}
                  <span>{testResult.message}</span>
                </div>
                {testResult.latencyMs !== undefined && (
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-purple-200">
                    {testResult.latencyMs} ms
                  </span>
                )}
              </div>

              {testResult.output && (
                <div className="mt-2 p-3 bg-white rounded-xl border border-purple-200 shadow-2xs">
                  <div className="text-[10px] font-bold text-gray-400 mb-1">
                    {isEn ? `AI Translation Output (${testTargetLang}):` : `AI 번역 결과 (${testTargetLang}):`}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 leading-relaxed font-sans">
                    {testResult.output}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 저장 버튼 바 */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {isEn ? 'Make sure to click save after changing settings.' : '설정 변경 후 반드시 저장을 눌러주세요.'}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-purple-600/20 cursor-pointer"
          >
            {isEn ? 'Save AI Engine Settings' : 'AI 엔진 설정 저장하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
