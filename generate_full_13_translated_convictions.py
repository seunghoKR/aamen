# -*- coding: utf-8 -*-
"""
AAMEN 13-Nation Full Translation Generator for MWC 7 Convictions
Translates all objectives, materials, readings, and timeline steps for 13 Asian languages.
"""

import json, sys, os, time, urllib.request, urllib.parse

sys.stdout.reconfigure(encoding='utf-8')
import setup_quotes

CACHE_FILE = r'C:\Dev\AAMEN\translation_cache.json'
cache = {}
if os.path.exists(CACHE_FILE):
    try:
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            cache = json.load(f)
        print(f"Loaded {len(cache)} cached translations.")
    except Exception as e:
        print(f"Cache load error: {e}")

LANGS = ['ko', 'en', 'ja', 'zh-TW', 'vi', 'id', 'th', 'my', 'hi', 'ne', 'km', 'lo', 'mn']
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

def translate_text(text, target_lang):
    if not text or not text.strip():
        return text
    if target_lang == 'en':
        return text
    cache_key = f"{target_lang}:{text.strip()}"
    if cache_key in cache:
        return cache[cache_key]

    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q=" + urllib.parse.quote(text.strip())
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=10) as res:
                data = json.loads(res.read().decode('utf-8'))
                translated = ''.join([part[0] for part in data[0] if part[0]])
                cache[cache_key] = translated
                return translated
        except Exception as e:
            time.sleep(0.5 * (attempt + 1))
    
    # Fallback to original text if translation fails
    return text

def save_cache():
    try:
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(cache, f, ensure_ascii=False)
    except Exception as e:
        print(f"Failed to save cache: {e}")

# Render complete HTML
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

print("Loading English master data...")
with open(r'C:\Dev\AAMEN\convictions_en_data.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

print("Loading Korean master data...")
with open(r'C:\Dev\AAMEN\convictions_all_13.json', 'r', encoding='utf-8') as f:
    existing_13 = json.load(f)
ko_data = existing_13.get('ko', {})

all_13_result = {
    'en': en_data,
    'ko': ko_data
}

total_tasks = len([l for l in LANGS if l not in ['en', 'ko']]) * len(SLUGS)
done_tasks = 0

print(f"Starting translation for 11 languages x 7 themes ({total_tasks} topics)...")

for lang in LANGS:
    if lang in ['en', 'ko']:
        continue
    
    print(f"\n---> Translating for language: {lang.upper()} ({UI_MIN.get(lang, 'min')})")
    lang_dataset = {}

    for slug in SLUGS:
        en_meta = en_data[slug]['meta']
        title = setup_quotes.TITLES_BY_LANG.get(slug, {}).get(lang, en_meta['title'])
        quote = setup_quotes.QUOTES_BY_LANG.get(slug, {}).get(lang, en_meta['quote'])

        overall_obj = translate_text(en_meta.get('overallObjective', ''), lang)
        session_obj = translate_text(en_meta.get('sessionObjective', ''), lang)

        # Materials & Readings
        materials = [translate_text(m, lang) for m in en_meta.get('materials', [])]
        readings = [translate_text(r, lang) for r in en_meta.get('readings', [])]

        # Timeline
        timeline = []
        for step in en_meta.get('timeline', []):
            dur_en = step.get('duration', '')
            dur_local = dur_en.replace('minutes', UI_MIN.get(lang, 'min')).replace('minute', UI_MIN.get(lang, 'min'))
            stitle_local = translate_text(step.get('title', ''), lang)
            items_local = [translate_text(it, lang) for it in step.get('items', [])]

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

        done_tasks += 1
        print(f"  [{done_tasks}/{total_tasks}] {lang}:{slug} translated (title: {title[:30]}...)")
        save_cache()

    all_13_result[lang] = lang_dataset

# Save all 13 dataset
out_json = r'C:\Dev\AAMEN\convictions_all_13.json'
with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(all_13_result, f, ensure_ascii=False, indent=2)

print(f"\n[DONE] Saved complete 13-nation translated datasets to {out_json}!")
save_cache()
