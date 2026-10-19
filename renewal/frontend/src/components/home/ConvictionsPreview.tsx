'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'

interface ConvictionItemMeta {
  id: string
  num: string
  translationKey: string
  descKo: string
  descEn: string
  emoji: string
  color: string
}

const convictionsList: ConvictionItemMeta[] = [
  {
    id: 'god',
    num: '01',
    translationKey: 'god',
    descKo: '창조주 하나님과 회복',
    descEn: 'Creator God and Restoration',
    emoji: '✝️',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'jesus',
    num: '02',
    translationKey: 'jesus',
    descKo: '삶과 가르침, 십자가와 부활',
    descEn: 'Life, Teachings, Cross and Resurrection',
    emoji: '🕊️',
    color: 'from-teal-400 to-cyan-500',
  },
  {
    id: 'spirit',
    num: '03',
    translationKey: 'spirit',
    descKo: '신자들의 부르심과 공동체',
    descEn: 'Empowering Believers and Community',
    emoji: '🔥',
    color: 'from-cyan-400 to-sky-500',
  },
  {
    id: 'church',
    num: '04',
    translationKey: 'church',
    descKo: '그리스도 중심의 성경 해석',
    descEn: 'Christ-centered Biblical Interpretation',
    emoji: '📖',
    color: 'from-sky-400 to-blue-500',
  },
  {
    id: 'peace',
    num: '05',
    translationKey: 'peace',
    descKo: '폭력 거부와 화해의 복음',
    descEn: 'Peace, Justice and Reconciliation',
    emoji: '🌿',
    color: 'from-indigo-400 to-purple-500',
  },
  {
    id: 'community',
    num: '06',
    translationKey: 'community',
    descKo: '삶으로 드리는 예배와 교제',
    descEn: 'Worship, Fellowship and Mission',
    emoji: '🙏',
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'unity',
    num: '07',
    translationKey: 'mission',
    descKo: '15개국 장벽을 넘는 그리스도의 몸',
    descEn: 'Global Family in Christ',
    emoji: '🌏',
    color: 'from-pink-400 to-rose-500',
  },
]

export default function ConvictionsPreview() {
  const t = useTranslations('convictions')
  const locale = useLocale()

  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `/${locale}${cleanPath}`
  }

  const getDesc = (key: string, fallbackKo: string, fallbackEn: string) => {
    try {
      if (t.has(`items_desc.${key}`)) {
        return t(`items_desc.${key}` as any)
      }
    } catch (e) {}
    return locale === 'ko' ? fallbackKo : fallbackEn
  }

  const themePrefix = t.has('theme_prefix') ? t('theme_prefix') : (locale === 'ko' ? '주제' : 'Theme')
  const viewLessonText = t.has('view_lesson') ? t('view_lesson') : (locale === 'ko' ? '상세 교안 보기' : 'View Lesson')
  const overviewTitle = t.has('overview_title') ? t('overview_title') : (locale === 'ko' ? '7대 공유된 신념 전체 개요' : 'All 7 Shared Convictions')
  const overviewDesc = t.has('overview_desc')
    ? t('overview_desc')
    : (locale === 'ko'
        ? 'MWC 7대 확신의 공식 전문과 아시아 15개국 교육 커리큘럼 가이드를 한 번에 확인하세요.'
        : 'Explore full MWC conviction statements and Asian church curriculum guides.')
  const readFullText = t.has('read_full') ? t('read_full') : (locale === 'ko' ? '전문 읽어보기' : 'Read Full Text')

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {convictionsList.map((item) => {
          const title = t(`items.${item.translationKey}` as any)
          const desc = getDesc(item.translationKey, item.descKo, item.descEn)

          return (
            <Link
              key={item.id}
              href={getLocalizedPath(`/convictions/${item.id}`)}
              className="group p-5 bg-white rounded-2xl border border-amber-200/60 shadow-xs hover:border-emerald-300 hover:shadow-md hover:-translate-y-1 transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-xs`}
                  >
                    {item.emoji}
                  </div>
                  <span className="text-[11px] font-mono font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                    {themePrefix} {item.num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-1">
                  {title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
                <span>{viewLessonText}</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )
        })}

        {/* 전체 확신 문서로 이동하는 종합 카드 */}
        <Link
          href={getLocalizedPath('/convictions')}
          className="group p-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all text-left flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl mb-3">
              📚
            </div>
            <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest block mb-1">
              Full Convictions
            </span>
            <h3 className="text-lg font-extrabold text-white mb-1.5">
              {overviewTitle}
            </h3>
            <p className="text-xs text-white/85 leading-relaxed">
              {overviewDesc}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white">
            <span>{readFullText}</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  )
}
