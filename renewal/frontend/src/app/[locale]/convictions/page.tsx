import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { BookOpen, ShieldCheck, HeartHandshake, Church, Sparkles, Globe2, Flame } from 'lucide-react'

// MWC(메노나이트 세계 협의회) 7대 공유된 확신 전문 (기존 AAMEN page17 내용 완벽 계승)
const convictionList = [
  {
    id: 'god',
    num: '01',
    title: '하나님 (God)',
    subtitle: '천지를 창조하시고 구원하시는 전능하신 하나님',
    lead: '우리는 전능하신 유일한 하나님, 천지의 창조주이시며 모든 만물을 사랑으로 돌보시는 아버지를 믿습니다.',
    content: [
      '하나님은 사랑과 정의, 은혜로 세상을 통치하시며, 타락한 세상을 구원하시기 위해 끝없이 인간을 찾아오십니다.',
      '구약의 언약과 예언자들을 통해 자신을 계시하셨으며, 독생자 예수 그리스도를 통해 온전한 사랑을 보여주셨습니다.',
    ],
    scripture: '창세기 1:1, 신명기 6:4, 요한일서 4:8',
  },
  {
    id: 'jesus',
    num: '02',
    title: '예수 그리스도 (Jesus Christ)',
    subtitle: '말씀이 육신이 되신 주님이시며 유일한 구원자',
    lead: '우리는 하나님의 아들이시며 완전한 하나님이시자 완전한 인간이신 예수 그리스도를 믿습니다.',
    content: [
      '예수님은 십자가에서 우리의 죄를 대속하시고 부활하심으로 죄와 사망의 권세를 깨뜨리셨습니다.',
      '그분의 삶과 가르침, 산상수훈은 그리스도인이 따라야 할 궁극적인 삶의 모범이자 제자도의 표준입니다.',
    ],
    scripture: '요한복음 1:14, 빌립보서 2:5-11, 마태복음 5-7장',
  },
  {
    id: 'spirit',
    num: '03',
    title: '성령 (Holy Spirit)',
    subtitle: '공동체 안에 임재하시며 새 생명을 주시는 보혜사',
    lead: '우리는 우리를 거듭나게 하시고 그리스도의 증인으로 살아가도록 능력을 주시는 성령 하나님을 믿습니다.',
    content: [
      '성령은 신자들의 마음에 내주하시며, 죄를 깨닫게 하시고 진리 가운데로 인도하십니다.',
      '신자들의 공동체 안에 다양한 은사를 주시어 서로를 세우고 세상을 향해 평화와 사랑을 증거하게 하십니다.',
    ],
    scripture: '사도행전 1:8, 요한복음 14:16-17, 갈라디아서 5:22-23',
  },
  {
    id: 'church',
    num: '04',
    title: '교회 (Church)',
    subtitle: '그리스도의 몸이자 부름받은 언약 공동체',
    lead: '우리는 자발적인 신앙고백과 침례(세례)를 통해 그리스도의 몸 된 지체가 된 신자들의 언약 공동체를 믿습니다.',
    content: [
      '교회는 위계적 권력 조직이 아니라, 그리스도를 머리로 모신 형제자매들의 평등한 사랑의 연합입니다.',
      '예배와 교제, 상호 권면과 나눔을 통해 하나님 나라의 현존을 이 땅 위에 미리 보여줍니다.',
    ],
    scripture: '고린도전서 12:12-27, 에베소서 4:1-16, 마태복음 18:15-20',
  },
  {
    id: 'bible',
    num: '05',
    title: '성경 (Bible)',
    subtitle: '그리스도를 중심으로 해석되는 하나님의 권위 있는 말씀',
    lead: '우리는 성경이 하나님의 감동으로 기록된 신앙과 삶의 최고의 권위이자 지침임을 믿습니다.',
    content: [
      '성경은 성령의 인도하심 아래 신자들의 공동체 안에서 함께 읽혀지고 해석되어야 합니다.',
      '예수 그리스도의 삶과 가르침, 십자가의 렌즈를 통해 성경 전체를 바라보며 참된 평화와 화해의 길을 발견합니다.',
    ],
    scripture: '디모데후서 3:16-17, 히브리서 1:1-2, 누가복음 24:27',
  },
  {
    id: 'peace',
    num: '06',
    title: '제자도와 평화 (Peace & Discipleship)',
    subtitle: '폭력을 거부하고 원수까지 사랑하는 평화의 길',
    lead: '우리는 화해와 비폭력 평화가 복음의 선택 사항이 아닌, 복음 그 자체의 핵심임을 고백합니다.',
    content: [
      '예수 그리스도를 따르는 제자는 모든 형태의 폭력과 전쟁, 억압을 거부하며 원수까지 사랑해야 합니다.',
      '불의한 세상 속에서 정의와 자비, 용서를 실천하며 갈등이 있는 곳에 평화의 사절로 섭니다.',
    ],
    scripture: '마태복음 5:9, 로마서 12:14-21, 고린도후서 5:18-20',
  },
  {
    id: 'community',
    num: '07',
    title: '예배와 공동체적 삶 (Worship & Mission)',
    subtitle: '모든 장벽을 넘어 세상 끝까지 뻗어나가는 증거',
    lead: '우리는 삶 전체가 하나님께 드리는 거룩한 예배이며, 전 세계적 복음 증거임을 믿습니다.',
    content: [
      '인종, 국가, 언어, 성별, 신분의 장벽을 그리스도 안에서 허물고 13개국과 온 세상이 한 가족임을 고백합니다.',
      '가난한 자를 돌보고, 억눌린 자를 해방하며, 예수 그리스도의 다시 오심을 소망하며 담대히 복음을 전합니다.',
    ],
    scripture: '갈라디아서 3:28, 미가 6:8, 계시록 7:9-10',
  },
]

import { setRequestLocale } from 'next-intl/server'

export default async function ConvictionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `/${locale}${cleanPath}`
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4">
        {/* 기존 lesson.css 기반의 AAMEN 공식 문서 디자인 시스템 (.lp-container) */}
        <div className="lp-container">
          {/* 헤더 배너 (.lp-header) */}
          <div className="lp-header">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              Mennonite World Conference
            </span>
            <h2>MWC 7대 공유된 확신</h2>
            <div className="lp-header-desc">
              &quot;우리는 그리스도 안에서 성령으로 하나 되어, 세상의 평화와 사랑의 증인이 되도록 부름받은 글로벌 신앙 공동체입니다.&quot;
            </div>
          </div>

          {/* 안내 인트로 박스 (.lp-box) */}
          <div className="lp-box mb-10 shadow-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-emerald-700 text-lg">
              <Sparkles size={20} />
              <span>AAMEN 신앙의 기초</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              아시아 아나밥티스트 메노나이트 교육 네트워크(AAMEN)에 속한 13개국 교회와 학교는 메노나이트 세계 협의회(MWC)의
              7대 공유된 확신을 우리의 공동 신앙 고백으로 삼고 있습니다. 각 항목을 클릭하여 깊이 묵상해 보세요.
            </p>
          </div>

          {/* 7대 신념 카드 리스트 */}
          <div className="space-y-8">
            {convictionList.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="lp-card scroll-mt-24 transition-all hover:shadow-lg border-emerald-100/60"
              >
                {/* 카드 타이틀 헤더 */}
                <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-mono font-extrabold text-emerald-600 block mb-0.5">
                      CONVICTION {item.num}
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full shrink-0">
                    {item.id.toUpperCase()}
                  </span>
                </div>

                {/* 서브 부제 및 리드 문장 */}
                <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100/50 mb-5 text-emerald-950 font-medium text-sm leading-relaxed">
                  👉 {item.lead}
                </div>

                {/* 본문 설명 */}
                <div className="space-y-2 mb-6">
                  {item.content.map((p, idx) => (
                    <p key={idx} className="text-gray-700 text-sm sm:text-base leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{p}</span>
                    </p>
                  ))}
                </div>

                {/* 관련 성경 구절 바 */}
                <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <BookOpen size={14} className="text-emerald-600" />
                    <span>참고 성경 말씀:</span>
                  </div>
                  <span className="font-mono text-emerald-700 font-semibold">{item.scripture}</span>
                </div>

                {/* 개별 상세 페이지 바로가기 버튼 */}
                <div className="pt-2 text-right">
                  <Link
                    href={getLocalizedPath(`/convictions/${item.id === 'bible' ? 'church' : item.id}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>{item.title} 상세 교안 & 원본 보기</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 교육 자료 연결 CTA */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-sky-600 text-white text-center shadow-lg">
            <h3 className="text-2xl font-black mb-2">이 확신을 바탕으로 제작된 7대 레슨 플랜</h3>
            <p className="text-white/85 text-sm max-w-lg mx-auto mb-6">
              AAMEN의 레슨 플랜은 13개국 언어로 번역되어 각 나라 교회와 주일학교에서 무료로 다운로드하여 가르칠 수 있습니다.
            </p>
            <Link
              href={getLocalizedPath('/community/resources')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-800 font-extrabold rounded-full hover:bg-emerald-50 transition-all shadow-md"
            >
              <span>📚 교육 자료실(레슨 플랜) 바로가기</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
