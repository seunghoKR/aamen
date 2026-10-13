# -*- coding: utf-8 -*-
"""
High-Speed Multithreaded 13-Nation MWC 7 Convictions Translation Generator
"""

import json, sys, os, time, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

sys.stdout.reconfigure(encoding='utf-8')
import setup_quotes

CACHE_FILE = r'C:\Dev\AAMEN\translation_cache.json'
cache = {}
cache_lock = threading.Lock()

if os.path.exists(CACHE_FILE):
    try:
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            cache = json.load(f)
        print(f"Loaded {len(cache)} cached translations.")
    except Exception as e:
        print(f"Cache load error: {e}")

LANGS = ['ko', 'en', 'ja', 'zh-TW', 'vi', 'id', 'th', 'my', 'hi', 'ne', 'km', 'lo', 'mn']
TARGET_LANGS = [l for l in LANGS if l not in ['en', 'ko']]
SLUGS = ['god', 'jesus', 'spirit', 'church', 'peace', 'community', 'unity']

UI_MIN = {
    'ko': '분', 'en': 'minutes', 'ja': '分', 'zh-TW': '分鐘',
    'vi': 'phút', 'id': 'menit', 'th': 'นาที', 'my': 'မိနစ်',
    'hi': 'मिनट', 'ne': 'मिनेट', 'km': 'នាទី', 'lo': 'ນາທີ', 'mn': 'минут'
}

UI_LABELS = {
    'ko': {'obj': '🎯 학습 목표', 'all': '전체 목표:', 'ses': '세션 목표:', 'mat': '📚 준비물 및 읽을거리', 'm': '준비물:', 'r': '필독서:'},
    'en': {'obj': '🎯 Learning Objectives', 'all': 'Overall Objective:', 'ses': 'One-Hour Session Objective:', 'mat': '📚 Materials & Required Readings', 'm': 'Materials:', 'r': 'Required Readings:'},
    'ja': {'obj': '🎯 学習目標', 'all': '全体目標:', 'ses': 'セッション目標:', 'mat': '📚 準備物および必読書', 'm': '準備物:', 'r': '必読文献:'},
    'zh-TW': {'obj': '🎯 學習目標', 'all': '整體目標:', 'ses': '一小時課程目標:', 'mat': '📚 課前準備與必讀材料', 'm': '所需材料:', 'r': '必讀書目:'},
    'vi': {'obj': '🎯 Mục tiêu học tập', 'all': 'Mục tiêu tổng quát:', 'ses': 'Mục tiêu phiên 1 giờ:', 'mat': '📚 Tài liệu & Bài đọc bắt buộc', 'm': 'Tài liệu:', 'r': 'Bài đọc bắt buộc:'},
    'id': {'obj': '🎯 Tujuan Pembelajaran', 'all': 'Tujuan Keseluruhan:', 'ses': 'Tujuan Sesi Satu Jam:', 'mat': '📚 Bahan & Bacaan Wajib', 'm': 'Bahan:', 'r': 'Bacaan Wajib:'},
    'th': {'obj': '🎯 วัตถุประสงค์การเรียนรู้', 'all': 'วัตถุประสงค์โดยรวม:', 'ses': 'วัตถุประสงค์ของบทเรียน 1 ชั่วโมง:', 'mat': '📚 อุปกรณ์และบทอ่านที่จำเป็น', 'm': 'อุปกรณ์:', 'r': 'บทอ่านที่จำเป็น:'},
    'my': {'obj': '🎯 သင်ယူမှု ရည်မှန်းချက်များ', 'all': 'အလုံးစုံ ရည်မှန်းချက်:', 'ses': 'တစ်နာရီ သင်ခန်းစာ ရည်မှန်းချက်:', 'mat': '📚 လိုအပ်သော အထောက်အကူပြု ပစ္စည်းများနှင့် ဖတ်ရှုရန်များ', 'm': 'ပစ္စည်းများ:', 'r': 'ဖတ်ရှုရန်များ:'},
    'hi': {'obj': '🎯 सीखने के उद्देश्य', 'all': 'समग्र उद्देश्य:', 'ses': 'एक घंटे के सत्र का उद्देश्य:', 'mat': '📚 सामग्री और अनिवार्य अध्ययन', 'm': 'सामग्री:', 'r': 'अनिवार्य अध्ययन:'},
    'ne': {'obj': '🎯 सिकाइका उद्देश्यहरू', 'all': 'समग्र उद्देश्य:', 'ses': 'एक घण्टाको सत्रको उद्देश्य:', 'mat': '📚 सामग्री र आवश्यक अध्ययन', 'm': 'सामग्री:', 'r': 'आवश्यक अध्ययन:'},
    'km': {'obj': '🎯 គោលបំណងនៃការរៀនសូត្រ', 'all': 'គោលបំណងរួម៖', 'ses': 'គោលបំណងមេរៀនមួយម៉ោង៖', 'mat': '📚 សម្ភារៈ និងអត្ថបទអានចាំបាច់', 'm': 'សម្ភារៈ៖', 'r': 'អត្ថបទអានចាំបាច់:'},
    'lo': {'obj': '🎯 ຈຸດປະສົງການຮຽນຮູ້', 'all': 'ຈຸດປະສົງລວມ:', 'ses': 'ຈຸດປະສົງບົດຮຽນ 1 ຊົ່ວໂມງ:', 'mat': '📚 ອຸປະກອນ ແລະ ບົດອ່ານທີ່ຈຳເປັນ', 'm': 'ອຸປະກອນ:', 'r': 'ບົດອ່ານທີ່ຈຳເປັນ:'},
    'mn': {'obj': '🎯 Суралцах зорилго', 'all': 'Ерөнхий зорилго:', 'ses': 'Нэг цагийн хичээлийн зорилго:', 'mat': '📚 Хэрэглэгдэхүүн ба унших материалууд', 'm': 'Хэрэглэгдэхүүн:', 'r': 'Унших материал:'}
}

def fetch_single_translation(text, target_lang):
    if not text or not text.strip() or target_lang == 'en':
        return text, target_lang, text

    cache_key = f"{target_lang}:{text.strip()}"
    with cache_lock:
        if cache_key in cache:
            return text, target_lang, cache[cache_key]

    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q=" + urllib.parse.quote(text.strip())
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=8) as res:
                data = json.loads(res.read().decode('utf-8'))
                translated = ''.join([part[0] for part in data[0] if part[0]])
                with cache_lock:
                    cache[cache_key] = translated
                return text, target_lang, translated
        except Exception:
            time.sleep(0.3 * (attempt + 1))

    return text, target_lang, text

print("Loading English master data...")
with open(r'C:\Dev\AAMEN\convictions_en_data.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

print("Loading Korean master data...")
with open(r'C:\Dev\AAMEN\convictions_all_13.json', 'r', encoding='utf-8') as f:
    existing_13 = json.load(f)
ko_data = existing_13.get('ko', {})

# Collect all unique English strings to translate
unique_strings = set()
for slug in SLUGS:
    m = en_data[slug]['meta']
    if m.get('overallObjective'): unique_strings.add(m['overallObjective'])
    if m.get('sessionObjective'): unique_strings.add(m['sessionObjective'])
    for mat in m.get('materials', []):
        if mat.strip(): unique_strings.add(mat.strip())
    for read in m.get('readings', []):
        if read.strip(): unique_strings.add(read.strip())
    for step in m.get('timeline', []):
        if step.get('title'): unique_strings.add(step['title'].strip())
        for it in step.get('items', []):
            if it.strip(): unique_strings.add(it.strip())

print(f"Identified {len(unique_strings)} unique English strings across 7 themes.")

# Build task list
tasks = []
for text in unique_strings:
    for lang in TARGET_LANGS:
        cache_key = f"{lang}:{text}"
        if cache_key not in cache:
            tasks.append((text, lang))

print(f"Total new translations to fetch: {len(tasks)} (using 10 parallel threads)...")

# Execute multithreaded translation
completed_count = 0
start_time = time.time()

if tasks:
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_task = {executor.submit(fetch_single_translation, text, lang): (text, lang) for text, lang in tasks}
        for future in as_completed(future_to_task):
            completed_count += 1
            if completed_count % 50 == 0 or completed_count == len(tasks):
                elapsed = time.time() - start_time
                print(f"  [{completed_count}/{len(tasks)}] translations done in {elapsed:.1f}s...")

    # Save cache
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False)
    print(f"Saved {len(cache)} items to translation_cache.json!")

def get_trans(text, lang):
    if not text or not text.strip() or lang == 'en':
        return text
    return cache.get(f"{lang}:{text.strip()}", text)

def render_localized_html(lang, slug, meta):
    ui = UI_LABELS.get(lang, UI_LABELS['en'])
    title = meta['title']
    quote = meta['quote']
    overall_obj = meta.get('overallObjective', '')
    session_obj = meta.get('sessionObjective', '')
    materials = meta.get('materials', [])
    readings = meta.get('readings', [])
    timeline = meta.get('timeline', [])

    mat_items = "".join([f'<li style="margin-bottom: 8px;">{m}</li>' for m in materials if m.strip()])
    read_items = "".join([f'<li style="margin-bottom: 8px;">{r}</li>' for r in readings if r.strip()])

    timeline_items = ""
    for step in timeline:
        dur = step.get('duration', '')
        stitle = step.get('title', '')
        items = step.get('items', [])
        body_html = ""
        for it in items:
            if it.lower().startswith('discussion:') or it.lower().startswith('토의:') or it.lower().startswith('討議:'):
                body_html += f'<p style="margin: 10px 0 5px 0; font-weight: 700; color: #0d9488;">{it}</p>'
            elif it.startswith('-') or it.startswith('•'):
                body_html += f'<li style="margin-bottom: 6px;">{it.lstrip("-• ")}</li>'
            elif len(it) > 0 and (it[0].isdigit() and (it[1] == '.' or it[1] == ':')):
                body_html += f'<li style="margin-bottom: 6px;">{it}</li>'
            elif it.startswith('Group') or it.startswith('第') or it.startswith('Nhóm') or it.startswith('Kelompok'):
                body_html += f'<li style="margin-bottom: 6px;"><strong>{it}</strong></li>'
            else:
                body_html += f'<p style="margin: 0 0 10px 0; color: #475569; line-height: 1.6;">{it}</p>'

        timeline_items += f"""
        <div class="lp-timeline-item" style="position: relative; margin-bottom: 40px; padding-left: 10px;">
            <div class="lp-dot" style="position: absolute; left: -29px; top: 0; width: 16px; height: 16px; border-radius: 50%; background: #10b981; border: 4px solid #fff; box-shadow: 0 0 0 2px #10b981;">&nbsp;</div>
            <span class="lp-badge" style="display: inline-block; background: #10b981; color: #fff; padding: 4px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; margin-bottom: 12px;">{dur}</span>
            <div>
                <h3 class="lp-timeline-title" style="margin: 0 0 12px 0; font-size: 1.35rem; color: #1e293b; font-weight: 700;">{stitle}</h3>
                <div class="lp-box" style="background: #ffffff; padding: 22px; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04); word-break: keep-all;">
                    {body_html}
                </div>
            </div>
        </div>"""

    return f"""<div class="lp-container" style="max-width: 900px; margin: 0 auto; font-family: inherit;">
    <div class="lp-header" style="text-align: center; padding: 48px 24px; background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%); color: #fff; border-radius: 20px; margin-bottom: 36px; box-shadow: 0 12px 24px -6px rgba(16, 185, 129, 0.25); word-break: keep-all;">
        <h2 style="font-size: 2.2rem; margin: 0 0 16px 0; font-weight: 800; color: #fff; letter-spacing: -0.02em;">{title}</h2>
        <div class="lp-header-desc" style="font-size: 1.15rem; font-style: italic; opacity: 0.95; max-width: 820px; margin: 0 auto; border-left: 4px solid rgba(255,255,255,0.7); padding-left: 20px; text-align: left; line-height: 1.7;">
            &quot;{quote}&quot;
        </div>
    </div>

    <div class="lp-card-wrap" style="display: flex; gap: 24px; margin-bottom: 45px; flex-wrap: wrap;">
        <div class="lp-card" style="flex: 1; min-width: 320px; background: #ffffff; padding: 28px; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
            <div class="lp-card-title" style="color: #0d9488; font-size: 1.3rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 18px; font-weight: 700;">
                {ui['obj']}
            </div>
            <div style="margin-bottom: 16px; word-break: keep-all;">
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">{ui['all']}</strong>
                <span style="color: #64748b; line-height: 1.6;">{overall_obj}</span>
            </div>
            <div style="word-break: keep-all;">
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">{ui['ses']}</strong>
                <span style="color: #64748b; line-height: 1.6;">{session_obj}</span>
            </div>
        </div>

        <div class="lp-card" style="flex: 1; min-width: 320px; background: #ffffff; padding: 28px; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
            <div class="lp-card-title" style="color: #4f46e5; font-size: 1.3rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 18px; font-weight: 700;">
                {ui['mat']}
            </div>
            {f'<div style="margin-bottom: 14px;"><strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">{ui["m"]}</strong><ul style="margin: 0; padding-left: 20px; color: #64748b; line-height: 1.6;">{mat_items}</ul></div>' if mat_items else ''}
            {f'<div><strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">{ui["r"]}</strong><ul style="margin: 0; padding-left: 20px; color: #64748b; line-height: 1.6;">{read_items}</ul></div>' if read_items else ''}
        </div>
    </div>

    <div class="lp-timeline-container" style="position: relative; padding: 10px 0 10px 25px; border-left: 3px solid #cbd5e1; margin-left: 15px;">
        {timeline_items}
    </div>
</div>"""

print("\nAssembling 13-nation full datasets...")
all_13_result = {
    'en': en_data,
    'ko': ko_data
}

for lang in TARGET_LANGS:
    lang_dataset = {}
    for slug in SLUGS:
        en_meta = en_data[slug]['meta']
        title = setup_quotes.TITLES_BY_LANG.get(slug, {}).get(lang, en_meta['title'])
        quote = setup_quotes.QUOTES_BY_LANG.get(slug, {}).get(lang, en_meta['quote'])

        overall_obj = get_trans(en_meta.get('overallObjective', ''), lang)
        session_obj = get_trans(en_meta.get('sessionObjective', ''), lang)

        materials = [get_trans(m, lang) for m in en_meta.get('materials', [])]
        readings = [get_trans(r, lang) for r in en_meta.get('readings', [])]

        timeline = []
        for step in en_meta.get('timeline', []):
            dur_en = step.get('duration', '')
            dur_local = dur_en.replace('minutes', UI_MIN.get(lang, 'min')).replace('minute', UI_MIN.get(lang, 'min'))
            stitle_local = get_trans(step.get('title', ''), lang)
            items_local = [get_trans(it, lang) for it in step.get('items', [])]

            timeline.append({
                'duration': dur_local,
                'title': stitle_local,
                'items': items_local
            })

        meta = {
            'themeNum': en_meta.get('themeNum', ''),
            'title': title,
            'quote': quote,
            'overallObjective': overall_obj,
            'sessionObjective': session_obj,
            'materials': materials,
            'readings': readings,
            'timeline': timeline
        }

        rendered_html = render_localized_html(lang, slug, meta)
        lang_dataset[slug] = {
            'slug': slug,
            'meta': meta,
            'rawHtml': rendered_html
        }

    all_13_result[lang] = lang_dataset
    print(f"  [DONE] Language dataset assembled: {lang.upper()} (Sample title: {lang_dataset['god']['meta']['title']})")

out_json = r'C:\Dev\AAMEN\convictions_all_13.json'
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(all_13_result, f, ensure_ascii=False, indent=2)

print(f"\nSaved {out_json} successfully! ({os.path.getsize(out_json):,} bytes)")

# Update convictionsData.ts
ts_header = """export interface ConvictionTimelineStep {
  duration: string
  title: string
  items: string[]
}

export interface ConvictionPageData {
  slug: string
  meta: {
    themeNum: string
    title: string
    quote: string
    overallObjective?: string
    sessionObjective?: string
    materials?: string[]
    readings?: string[]
    timeline?: ConvictionTimelineStep[]
  }
  rawHtml: string
}

// 7대 공유된 신념 순서 및 다국어 기본 타이틀
export const convictionOrder = [
  { slug: 'god', num: '01', titleKo: '하나님', titleEn: 'God', fullTitleKo: '하나님 (God)', fullTitleEn: 'Theme 1: God' },
  { slug: 'jesus', num: '02', titleKo: '예수 그리스도', titleEn: 'Jesus Christ', fullTitleKo: '예수 그리스도 (Jesus)', fullTitleEn: 'Theme 2: Jesus' },
  { slug: 'spirit', num: '03', titleKo: '성령', titleEn: 'Holy Spirit', fullTitleKo: '성령 (Holy Spirit)', fullTitleEn: 'Theme 3: Holy Spirit' },
  { slug: 'church', num: '04', titleKo: '성경', titleEn: 'The Bible', fullTitleKo: '성경 (The Bible)', fullTitleEn: 'Theme 4: The Bible' },
  { slug: 'peace', num: '05', titleKo: '평화와 정의', titleEn: 'Peace & Reconciliation', fullTitleKo: '평화, 정의, 화해 (Peace)', fullTitleEn: 'Theme 5: Peace, Justice, and Reconciliation' },
  { slug: 'community', num: '06', titleKo: '예배와 사명', titleEn: 'Worship', fullTitleKo: '예배와 삶 (Worship)', fullTitleEn: 'Theme 6: Worship' },
  { slug: 'unity', num: '07', titleKo: '지구촌 가족', titleEn: 'Global Family', fullTitleKo: '지구촌 가족 (Global Family)', fullTitleEn: 'Theme 7: Global Family' },
]

// 13개국 완역 교안 데이터셋 (Built-in All 13 Nations Datasets)
export const convictionPagesByLocale: Record<string, Record<string, ConvictionPageData>> = """

ts_footer = """

// 개별 언어 참조 헬퍼
export const convictionPagesKo: Record<string, ConvictionPageData> = convictionPagesByLocale['ko'] || {}
export const convictionPagesEn: Record<string, ConvictionPageData> = convictionPagesByLocale['en'] || {}

// 기존 호환성을 위한 기본 export (기본값: 한국어)
export const convictionPages: Record<string, ConvictionPageData> = convictionPagesKo

// 언어 및 슬러그를 받아 최적의 교안 데이터를 반환하는 안전한 헬퍼 함수
export function getConvictionPage(slug: string, locale: string = 'ko'): ConvictionPageData | undefined {
  // 1. 해당 locale 데이터 우선 탐색
  const localeData = convictionPagesByLocale[locale]
  if (localeData && localeData[slug]) {
    return localeData[slug]
  }

  // 2. 영어(공용어) 버전 탐색
  if (convictionPagesEn[slug]) {
    return convictionPagesEn[slug]
  }

  // 3. 한국어 버전 폴백
  return convictionPagesKo[slug]
}
"""

ts_full = ts_header + json.dumps(all_13_result, ensure_ascii=False, indent=2) + ts_footer

ts_out = r'C:\Dev\AAMEN\renewal\frontend\src\data\convictionsData.ts'
with open(ts_out, 'w', encoding='utf-8') as f:
    f.write(ts_full)

print(f"Saved {ts_out} successfully! ({os.path.getsize(ts_out):,} bytes)")
