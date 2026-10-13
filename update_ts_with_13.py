# -*- coding: utf-8 -*-
import json, sys

sys.stdout.reconfigure(encoding='utf-8')

# Read generated 13 languages json
with open(r'C:\Dev\AAMEN\convictions_all_13.json', 'r', encoding='utf-8') as f:
    all_data = json.load(f)

# Read Korean pages from current convictionsData.ts
with open(r'C:\Dev\AAMEN\renewal\frontend\src\data\convictionsData.ts', 'r', encoding='utf-8') as f:
    orig_ts = f.read()

p1 = orig_ts.find('convictionPagesKo: Record<string, ConvictionPageData> = ') + len('convictionPagesKo: Record<string, ConvictionPageData> = ')
p2 = orig_ts.find('// 영어 (Y:\\SynologyDrive\\AAMEN\\source')
orig_ko_str = orig_ts[p1:p2].strip().rstrip(';')

# Put KO original data into all_data['ko']
all_data['ko'] = json.loads(orig_ko_str)

all_data_str = json.dumps(all_data, ensure_ascii=False, indent=2)

ts_content = f"""export interface ConvictionTimelineStep {{
  duration: string
  title: string
  items: string[]
}}

export interface ConvictionPageData {{
  slug: string
  meta: {{
    themeNum: string
    title: string
    quote: string
    overallObjective?: string
    sessionObjective?: string
    materials?: string[]
    readings?: string[]
    timeline?: ConvictionTimelineStep[]
  }}
  rawHtml: string
}}

// 7대 공유된 신념 순서 및 다국어 기본 타이틀
export const convictionOrder = [
  {{ slug: 'god', num: '01', titleKo: '하나님', titleEn: 'God', fullTitleKo: '하나님 (God)', fullTitleEn: 'Theme 1: God' }},
  {{ slug: 'jesus', num: '02', titleKo: '예수 그리스도', titleEn: 'Jesus Christ', fullTitleKo: '예수 그리스도 (Jesus)', fullTitleEn: 'Theme 2: Jesus' }},
  {{ slug: 'spirit', num: '03', titleKo: '성령', titleEn: 'Holy Spirit', fullTitleKo: '성령 (Holy Spirit)', fullTitleEn: 'Theme 3: Holy Spirit' }},
  {{ slug: 'church', num: '04', titleKo: '성경', titleEn: 'The Bible', fullTitleKo: '성경 (The Bible)', fullTitleEn: 'Theme 4: The Bible' }},
  {{ slug: 'peace', num: '05', titleKo: '평화와 정의', titleEn: 'Peace & Reconciliation', fullTitleKo: '평화, 정의, 화해 (Peace)', fullTitleEn: 'Theme 5: Peace, Justice, and Reconciliation' }},
  {{ slug: 'community', num: '06', titleKo: '예배와 사명', titleEn: 'Worship', fullTitleKo: '예배와 삶 (Worship)', fullTitleEn: 'Theme 6: Worship' }},
  {{ slug: 'unity', num: '07', titleKo: '지구촌 가족', titleEn: 'Global Family', fullTitleKo: '지구촌 가족 (Global Family)', fullTitleEn: 'Theme 7: Global Family' }},
]

// 13개국 완역 교안 데이터셋 (Built-in All 13 Nations Datasets)
export const convictionPagesByLocale: Record<string, Record<string, ConvictionPageData>> = {all_data_str}

// 개별 언어 참조 헬퍼
export const convictionPagesKo: Record<string, ConvictionPageData> = convictionPagesByLocale['ko'] || {{}}
export const convictionPagesEn: Record<string, ConvictionPageData> = convictionPagesByLocale['en'] || {{}}

// 기존 호환성을 위한 기본 export (기본값: 한국어)
export const convictionPages: Record<string, ConvictionPageData> = convictionPagesKo

// 언어 및 슬러그를 받아 최적의 교안 데이터를 반환하는 안전한 헬퍼 함수
export function getConvictionPage(slug: string, locale: string = 'ko'): ConvictionPageData | undefined {{
  // 1. 해당 locale 데이터 우선 탐색
  const localeData = convictionPagesByLocale[locale]
  if (localeData && localeData[slug]) {{
    return localeData[slug]
  }}

  // 2. 영어(공용어) 버전 탐색
  if (convictionPagesEn[slug]) {{
    return convictionPagesEn[slug]
  }}

  // 3. 한국어 버전 폴백
  return convictionPagesKo[slug]
}}
"""

with open(r'C:\Dev\AAMEN\renewal\frontend\src\data\convictionsData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Updated convictionsData.ts with all 13 languages successfully!")
