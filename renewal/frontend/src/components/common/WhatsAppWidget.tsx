'use client'

import { useState } from 'react'
import { MessageCircle, X, Send, Heart, BookOpen, Users, HelpCircle, Sparkles } from 'lucide-react'

export default function WhatsAppWidget() {
  // 대표님 요청: 현재는 활용도가 낮아 필요 시까지 플로팅 아이콘 비활성화(숨김)
  const isEnabled = false
  if (!isEnabled) return null

  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  // 본부 공인 왓츠앱 연락 번호 (국가번호 +82)
  const adminWhatsAppNumber = '821023456789' // AAMEN 코디네이터 대표 번호

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || message.trim() || '안녕하세요! AAMEN 사역 및 커뮤니티에 대해 문의드립니다.'
    const fullText = `🕊️ [AAMEN 웹사이트 사역 문의]\n${textToSend}`
    const url = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(fullText)}`
    window.open(url, '_blank')
    setMessage('')
    setIsOpen(false)
  }

  return (
    <>
      {/* 화면 우측 하단 플로팅 버튼 */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {/* 미니 안내 툴팁 배지 */}
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] font-bold shadow-xl border border-emerald-400/30 backdrop-blur-md animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>WhatsApp 사역 소통창구</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="WhatsApp 소통 헬프데스크 열기"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-2xl hover:shadow-emerald-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-white/30"
        >
          {isOpen ? <X size={26} /> : <MessageCircle size={28} className="fill-white" />}
        </button>
      </div>

      {/* 팝업 모달 대화창 */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-xs">
                💬
              </div>
              <div>
                <h4 className="font-extrabold text-base leading-tight flex items-center gap-1.5">
                  <span>AAMEN 사역 헬프데스크</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </h4>
                <p className="text-xs text-emerald-100 opacity-90 mt-0.5">
                  13개국 실시간 WhatsApp 소통 지원
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 본문 안내 */}
          <div className="p-5 bg-gray-50/70 border-b border-gray-100">
            <p className="text-xs text-gray-700 leading-relaxed">
              샬롬! 평화와 화해의 인사를 전합니다. 🌿<br />
              궁금하신 점이나 긴급 기도요청, 사역 협력 문의를 남겨주시면 본부 코디네이터와 <strong>WhatsApp으로 즉시 1:1 대화</strong>가 연결됩니다.
            </p>

            {/* 빠른 선택 프리셋 버튼 */}
            <div className="mt-4 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
                자주 묻는 문의 바로가기
              </span>
              <button
                onClick={() => handleSendMessage('🙏 [긴급 기도] 우리 지역 교회를 위한 긴급 중보기도를 요청합니다.')}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-xs text-gray-700 font-semibold flex items-center gap-2 transition-all"
              >
                <Heart size={14} className="text-rose-500 shrink-0" />
                <span className="truncate">긴급 중보기도 요청 및 나눔</span>
              </button>
              <button
                onClick={() => handleSendMessage('📚 [자료실 교재] AAMEN 7대 신념 교안 현지어 번역 및 인쇄 파일 문의')}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-gray-200 hover:border-sky-300 text-xs text-gray-700 font-semibold flex items-center gap-2 transition-all"
              >
                <BookOpen size={14} className="text-sky-500 shrink-0" />
                <span className="truncate">7대 신념 교재 및 예배자료 문의</span>
              </button>
              <button
                onClick={() => handleSendMessage('👥 [단체방 초대] 우리 국가(사역지) 사역자 WhatsApp 단체방 입장을 희망합니다.')}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 text-xs text-gray-700 font-semibold flex items-center gap-2 transition-all"
              >
                <Users size={14} className="text-purple-500 shrink-0" />
                <span className="truncate">13개국 사역자 WhatsApp 단체방 초대</span>
              </button>
            </div>
          </div>

          {/* 직접 입력 폼 */}
          <div className="p-4 bg-white">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="문의 내용을 자유롭게 입력하세요..."
                rows={2}
                className="w-full p-3 pr-10 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
              <button
                onClick={() => handleSendMessage()}
                className="absolute right-2.5 bottom-3.5 p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                title="WhatsApp으로 전송"
              >
                <Send size={14} />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
              <span>보안 암호화 전송 지원</span>
              <span className="font-mono text-emerald-700 font-bold">AAMEN Global Office</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
