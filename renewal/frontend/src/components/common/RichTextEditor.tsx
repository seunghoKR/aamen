'use client'

import React, { useState, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link2,
  Minus,
  Highlighter,
  Eye,
  PenTool,
} from 'lucide-react'

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  themeColor?: 'emerald' | 'sky' | 'blue'
  required?: boolean
  label?: string
  minHeight?: string
}

// 🎨 안전하고 미려한 마크다운/서식 렌더러
export function RichTextRenderer({ content, className = '' }: { content: string; className?: string }) {
  if (!content) return null

  // 라인 단위 파싱
  const lines = content.split('\n')
  const renderedElements: React.ReactNode[] = []

  let inList: 'bullet' | 'ordered' | null = null
  let listItems: React.ReactNode[] = []

  const flushList = (keyPrefix: number) => {
    if (inList === 'bullet') {
      renderedElements.push(
        <ul key={`ul-${keyPrefix}`} className="list-disc ml-5 my-2 space-y-1 text-gray-700">
          {listItems}
        </ul>
      )
    } else if (inList === 'ordered') {
      renderedElements.push(
        <ol key={`ol-${keyPrefix}`} className="list-decimal ml-5 my-2 space-y-1 text-gray-700">
          {listItems}
        </ol>
      )
    }
    inList = null
    listItems = []
  }

  // 인라인 서식 파서 (Bold, Italic, Underline, Strike, Highlight, Link)
  const parseInline = (text: string): React.ReactNode => {
    // 1. 링크 변환 [텍스트](URL)
    const linkRegex = /\[(.*?)\]\((https?:\/\/.*?)\)/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(parseFormatting(text.substring(lastIndex, match.index)))
      }
      const linkLabel = match[1] || match[2]
      const linkHref = match[2]
      parts.push(
        <a
          key={`link-${match.index}`}
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {linkLabel} ↗
        </a>
      )
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      parts.push(parseFormatting(text.substring(lastIndex)))
    }

    return parts.length > 0 ? parts : text
  }

  // 기본 인라인 태그 변환
  const parseFormatting = (str: string): React.ReactNode => {
    // 정규식 치환을 위해 HTML 태그 파싱 지원
    // **굵게**, *기울임*, <u>밑줄</u>, ~~취소선~~, ==형광펜==
    let formatted = str
    // <u>밑줄</u>
    formatted = formatted.replace(/<u>(.*?)<\/u>/gi, '###U_START###$1###U_END###')
    // **굵게**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '###B_START###$1###B_END###')
    // *기울임*
    formatted = formatted.replace(/\*(.*?)\*/g, '###I_START###$1###I_END###')
    // ~~취소선~~
    formatted = formatted.replace(/~~(.*?)~~/g, '###S_START###$1###S_END###')
    // ==하이라이트==
    formatted = formatted.replace(/==(.*?)==/g, '###H_START###$1###H_END###')

    const tokens = formatted.split(/(###[A-Z]+_(?:START|END)###)/)
    const result: React.ReactNode[] = []

    let isBold = false
    let isItalic = false
    let isUnderline = false
    let isStrike = false
    let isHighlight = false

    tokens.forEach((token, idx) => {
      if (token === '###B_START###') { isBold = true; return }
      if (token === '###B_END###') { isBold = false; return }
      if (token === '###I_START###') { isItalic = true; return }
      if (token === '###I_END###') { isItalic = false; return }
      if (token === '###U_START###') { isUnderline = true; return }
      if (token === '###U_END###') { isUnderline = false; return }
      if (token === '###S_START###') { isStrike = true; return }
      if (token === '###S_END###') { isStrike = false; return }
      if (token === '###H_START###') { isHighlight = true; return }
      if (token === '###H_END###') { isHighlight = false; return }

      if (!token) return

      let node: React.ReactNode = token
      if (isBold) node = <strong key={`b-${idx}`} className="font-bold text-gray-900">{node}</strong>
      if (isItalic) node = <em key={`i-${idx}`} className="italic">{node}</em>
      if (isUnderline) node = <u key={`u-${idx}`} className="underline underline-offset-2">{node}</u>
      if (isStrike) node = <del key={`s-${idx}`} className="line-through text-gray-400">{node}</del>
      if (isHighlight) node = <mark key={`h-${idx}`} className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-medium">{node}</mark>

      result.push(node)
    })

    return result.length > 0 ? result : str
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()

    // 1. 대제목 (# H1)
    if (trimmed.startsWith('# ')) {
      flushList(idx)
      renderedElements.push(
        <h3 key={`h1-${idx}`} className="text-lg sm:text-xl font-black text-gray-900 my-2.5 pb-1 border-b border-gray-100">
          {parseInline(trimmed.substring(2))}
        </h3>
      )
      return
    }

    // 2. 중제목 (## H2)
    if (trimmed.startsWith('## ')) {
      flushList(idx)
      renderedElements.push(
        <h4 key={`h2-${idx}`} className="text-base font-extrabold text-gray-900 my-2">
          {parseInline(trimmed.substring(3))}
        </h4>
      )
      return
    }

    // 3. 소제목 (### H3)
    if (trimmed.startsWith('### ')) {
      flushList(idx)
      renderedElements.push(
        <h5 key={`h3-${idx}`} className="text-sm font-bold text-gray-800 my-1.5">
          {parseInline(trimmed.substring(4))}
        </h5>
      )
      return
    }

    // 4. 구분선 (---)
    if (trimmed === '---' || trimmed === '***') {
      flushList(idx)
      renderedElements.push(<hr key={`hr-${idx}`} className="my-3 border-gray-200" />)
      return
    }

    // 5. 인용구 (> Blockquote)
    if (trimmed.startsWith('> ')) {
      flushList(idx)
      renderedElements.push(
        <blockquote
          key={`quote-${idx}`}
          className="my-2 pl-3 py-1.5 border-l-4 border-emerald-500 bg-emerald-50/60 rounded-r-xl text-gray-700 italic text-xs sm:text-sm"
        >
          {parseInline(trimmed.substring(2))}
        </blockquote>
      )
      return
    }

    // 6. 글머리 기호 (- 또는 *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (inList !== 'bullet') {
        flushList(idx)
        inList = 'bullet'
      }
      listItems.push(
        <li key={`li-b-${idx}`} className="text-xs sm:text-sm leading-relaxed">
          {parseInline(trimmed.substring(2))}
        </li>
      )
      return
    }

    // 7. 번호 매기기 (1. 2. 3.)
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
    if (numMatch) {
      if (inList !== 'ordered') {
        flushList(idx)
        inList = 'ordered'
      }
      listItems.push(
        <li key={`li-o-${idx}`} className="text-xs sm:text-sm leading-relaxed">
          {parseInline(numMatch[2])}
        </li>
      )
      return
    }

    // 일반 문장
    flushList(idx)
    if (!trimmed) {
      renderedElements.push(<div key={`br-${idx}`} className="h-2" />)
    } else {
      renderedElements.push(
        <p key={`p-${idx}`} className="text-xs sm:text-sm leading-relaxed text-gray-700 my-0.5">
          {parseInline(line)}
        </p>
      )
    }
  })

  flushList(lines.length)

  return <div className={`rich-text-content space-y-1 ${className}`}>{renderedElements}</div>
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = '내용을 상세히 입력해 주세요...',
  rows = 6,
  themeColor = 'emerald',
  required = false,
  label,
  minHeight = '140px',
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 테마별 색상 매핑
  const themeStyles = {
    emerald: {
      borderFocus: 'focus:ring-emerald-500 focus:border-emerald-500',
      tabActive: 'bg-emerald-600 text-white shadow-2xs',
      toolHover: 'hover:bg-emerald-50 hover:text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    sky: {
      borderFocus: 'focus:ring-sky-500 focus:border-sky-500',
      tabActive: 'bg-sky-600 text-white shadow-2xs',
      toolHover: 'hover:bg-sky-50 hover:text-sky-700',
      badge: 'bg-sky-100 text-sky-800',
    },
    blue: {
      borderFocus: 'focus:ring-blue-500 focus:border-blue-500',
      tabActive: 'bg-blue-600 text-white shadow-2xs',
      toolHover: 'hover:bg-blue-50 hover:text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
    },
  }[themeColor]

  // 마크다운 서식 삽입기
  const insertFormat = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)
    const textToInsert = selected || defaultText

    const replacement = `${before}${textToInsert}${after}`
    const newValue = value.substring(0, start) + replacement + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      const newCursorStart = start + before.length
      const newCursorEnd = newCursorStart + textToInsert.length
      textarea.setSelectionRange(newCursorStart, newCursorEnd)
    }, 10)
  }

  // 링크 삽입
  const handleInsertLink = () => {
    const textarea = textareaRef.current
    const start = textarea?.selectionStart || 0
    const end = textarea?.selectionEnd || 0
    const selected = value.substring(start, end)

    const url = window.prompt('연결할 웹사이트 URL을 입력해 주세요:', 'https://')
    if (!url) return

    const linkText = selected || '여기를 클릭하세요'
    const linkMd = `[${linkText}](${url.trim()})`
    const newValue = value.substring(0, start) + linkMd + value.substring(end)
    onChange(newValue)

    setTimeout(() => {
      textarea?.focus()
    }, 10)
  }

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-gray-700">{label}</label>
          <span className="text-[11px] text-gray-400">마크다운 서식 지원</span>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-opacity-80 transition-all">
        {/* 상단 툴바 */}
        <div className="flex flex-wrap items-center justify-between gap-1 px-2.5 py-1.5 bg-gray-50/90 border-b border-gray-200 text-gray-600">
          <div className="flex flex-wrap items-center gap-0.5">
            {/* 굵게 */}
            <button
              type="button"
              onClick={() => insertFormat('**', '**', '굵은 텍스트')}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title="굵게 (Bold)"
            >
              <Bold size={14} />
            </button>

            {/* 기울임 */}
            <button
              type="button"
              onClick={() => insertFormat('*', '*', '기울임 텍스트')}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title="기울임 (Italic)"
            >
              <Italic size={14} />
            </button>

            {/* 밑줄 */}
            <button
              type="button"
              onClick={() => insertFormat('<u>', '</u>', '밑줄 텍스트')}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title="밑줄 (Underline)"
            >
              <UnderlineIcon size={14} />
            </button>

            {/* 취소선 */}
            <button
              type="button"
              onClick={() => insertFormat('~~', '~~', '취소선 텍스트')}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title="취소선 (Strikethrough)"
            >
              <Strikethrough size={14} />
            </button>

            <span className="w-px h-4 bg-gray-300 mx-1" />

            {/* 대제목 H1 */}
            <button
              type="button"
              onClick={() => insertFormat('\n# ', '\n', '대제목')}
              className={`p-1.5 rounded-lg text-gray-700 font-black text-xs transition-colors ${themeStyles.toolHover} flex items-center gap-0.5`}
              title="대제목 (H1)"
            >
              <Heading1 size={14} />
            </button>

            {/* 중제목 H2 */}
            <button
              type="button"
              onClick={() => insertFormat('\n## ', '\n', '중제목')}
              className={`p-1.5 rounded-lg text-gray-700 font-black text-xs transition-colors ${themeStyles.toolHover} flex items-center gap-0.5`}
              title="중제목 (H2)"
            >
              <Heading2 size={14} />
            </button>

            <span className="w-px h-4 bg-gray-300 mx-1" />

            {/* 글머리 기호 */}
            <button
              type="button"
              onClick={() => insertFormat('\n- ', '', '목록 항목')}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title="글머리 목록 (Bullet List)"
            >
              <List size={14} />
            </button>

            {/* 숫자 목록 */}
            <button
              type="button"
              onClick={() => insertFormat('\n1. ', '', '첫 번째 항목')}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title="번호 목록 (Numbered List)"
            >
              <ListOrdered size={14} />
            </button>

            {/* 인용구 */}
            <button
              type="button"
              onClick={() => insertFormat('\n> ', '', '중요 인용 문구')}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title="인용구 (Blockquote)"
            >
              <Quote size={13} />
            </button>

            {/* 형광펜 강조 */}
            <button
              type="button"
              onClick={() => insertFormat('==', '==', '강조')}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title="형광펜 강조 (Highlight)"
            >
              <Highlighter size={13} />
            </button>

            {/* 링크 삽입 */}
            <button
              type="button"
              onClick={handleInsertLink}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title="웹 링크 삽입 (Insert Link)"
            >
              <Link2 size={14} />
            </button>

            {/* 구분선 */}
            <button
              type="button"
              onClick={() => insertFormat('\n---\n', '', '')}
              className={`p-1.5 rounded-lg text-gray-700 transition-colors ${themeStyles.toolHover}`}
              title="구분선 삽입 (Horizontal Rule)"
            >
              <Minus size={14} />
            </button>
          </div>

          {/* 우측 편집 / 미리보기 탭 전환 */}
          <div className="flex items-center gap-1 bg-gray-200/70 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'edit' ? themeStyles.tabActive : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PenTool size={11} />
              <span>편집</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'preview' ? themeStyles.tabActive : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye size={11} />
              <span>미리보기</span>
            </button>
          </div>
        </div>

        {/* 텍스트 입력창 또는 실시간 미리보기 */}
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            required={required}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight }}
            className={`w-full p-3.5 text-xs text-gray-800 bg-white placeholder-gray-400 focus:outline-none leading-relaxed resize-y`}
          />
        ) : (
          <div
            style={{ minHeight }}
            className="p-4 bg-gray-50/50 overflow-y-auto max-h-80 border-t border-gray-100"
          >
            {value.trim() ? (
              <RichTextRenderer content={value} />
            ) : (
              <p className="text-xs text-gray-400 italic">미리볼 내용이 아직 없습니다. [편집] 탭에서 내용을 작성해 주세요.</p>
            )}
          </div>
        )}

        {/* 하단 글자수 및 안내 바 */}
        <div className="px-3 py-1.5 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>
            {activeTab === 'edit' ? '단축키: **굵게**, *기울임*, # 제목, - 목록, [링크](URL)' : '👁️ 실시간 서식 미리보기'}
          </span>
          <span className="font-mono">{value.length}자</span>
        </div>
      </div>
    </div>
  )
}
