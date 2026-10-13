# -*- coding: utf-8 -*-
"""
AAMEN 13-Nation Full MWC Shared Convictions Builder
"""

import json, sys

sys.stdout.reconfigure(encoding='utf-8')

# Import previously verified quotes and titles
import setup_quotes

# 13개 언어 메타
LANGS = ['ko', 'en', 'ja', 'zh-TW', 'vi', 'id', 'th', 'my', 'hi', 'ne', 'km', 'lo', 'mn']

SLUGS = ['god', 'jesus', 'spirit', 'church', 'peace', 'community', 'unity']

# UI 라벨 정의
UI = {
    'ko': {'obj': '🎯 학습 목표', 'all': '전체 목표:', 'ses': '세션 목표:', 'mat': '📚 준비물 및 읽을거리', 'm': '준비물:', 'r': '필독서:', 'min': '분'},
    'en': {'obj': '🎯 Learning Objectives', 'all': 'Overall Objective:', 'ses': 'One-Hour Session Objective:', 'mat': '📚 Materials & Required Readings', 'm': 'Materials:', 'r': 'Required Readings:', 'min': 'minutes'},
    'ja': {'obj': '🎯 学習目標', 'all': '全体目標:', 'ses': 'セッション目標:', 'mat': '📚 準備物および必読書', 'm': '準備物:', 'r': '必読文献:', 'min': '分'},
    'zh-TW': {'obj': '🎯 學習目標', 'all': '整體目標:', 'ses': '一小時課程目標:', 'mat': '📚 課前準備與必讀材料', 'm': '所需材料:', 'r': '必讀書目:', 'min': '分鐘'},
    'vi': {'obj': '🎯 Mục tiêu học tập', 'all': 'Mục tiêu tổng quát:', 'ses': 'Mục tiêu phiên 1 giờ:', 'mat': '📚 Tài liệu & Bài đọc bắt buộc', 'm': 'Tài liệu:', 'r': 'Bài đọc bắt buộc:', 'min': 'phút'},
    'id': {'obj': '🎯 Tujuan Pembelajaran', 'all': 'Tujuan Keseluruhan:', 'ses': 'Tujuan Sesi Satu Jam:', 'mat': '📚 Bahan & Bacaan Wajib', 'm': 'Bahan:', 'r': 'Bacaan Wajib:', 'min': 'menit'},
    'th': {'obj': '🎯 วัตถุประสงค์การเรียนรู้', 'all': 'วัตถุประสงค์โดยรวม:', 'ses': 'วัตถุประสงค์ของบทเรียน 1 ชั่วโมง:', 'mat': '📚 อุปกรณ์และบทอ่านที่จำเป็น', 'm': 'อุปกรณ์:', 'r': 'บทอ่านที่จำเป็น:', 'min': 'นาที'},
    'my': {'obj': '🎯 သင်ယူမှု ရည်မှန်းချက်များ', 'all': 'အလုံးစုံ ရည်မှန်းချက်:', 'ses': 'တစ်နာရီ သင်ခန်းစာ ရည်မှန်းချက်:', 'mat': '📚 လိုအပ်သော အထောက်အကူပြု ပစ္စည်းများနှင့် ဖတ်ရှုရန်များ', 'm': 'ပစ္စည်းများ:', 'r': 'ဖတ်ရှုရန်များ:', 'min': 'မိနစ်'},
    'hi': {'obj': '🎯 सीखने के उद्देश्य', 'all': 'समग्र उद्देश्य:', 'ses': 'एक घंटे के सत्र का उद्देश्य:', 'mat': '📚 सामग्री और अनिवार्य अध्ययन', 'm': 'सामग्री:', 'r': 'अनिवार्य अध्ययन:', 'min': 'मिनट'},
    'ne': {'obj': '🎯 सिकाइका उद्देश्यहरू', 'all': 'समग्र उद्देश्य:', 'ses': 'एक घण्टाको सत्रको उद्देश्य:', 'mat': '📚 सामग्री र आवश्यक अध्ययन', 'm': 'सामग्री:', 'r': 'आवश्यक अध्ययन:', 'min': 'मिनेट'},
    'km': {'obj': '🎯 គោលបំណងនៃការរៀនសូត្រ', 'all': 'គោលបំណងរួម៖', 'ses': 'គោលបំណងមេរៀនមួយម៉ោង៖', 'mat': '📚 សម្ភារៈ និងអត្ថបទអានចាំបាច់', 'm': 'សម្ភារៈ៖', 'r': 'អត្ថបទអានចាំបាច់៖', 'min': 'នាទី'},
    'lo': {'obj': '🎯 ຈຸດປະສົງການຮຽນຮູ້', 'all': 'ຈຸດປະສົງລວມ:', 'ses': 'ຈຸດປະສົງບົດຮຽນ 1 ຊົ່ວໂມງ:', 'mat': '📚 ອຸປະກອນ ແລະ ບົດອ່ານທີ່ຈຳເປັນ', 'm': 'ອຸປະກອນ:', 'r': 'ບົດອ່ານທີ່ຈຳເປັນ:', 'min': 'ນາທີ'},
    'mn': {'obj': '🎯 Суралцах зорилго', 'all': 'Ерөнхий зорилго:', 'ses': 'Нэг цагийн хичээлийн зорилго:', 'mat': '📚 Хэрэглэгдэхүүн ба унших материалууд', 'm': 'Хэрэглэгдэхүүн:', 'r': 'Унших материал:', 'min': 'минут'},
}

# 영문 원본 로드
with open(r'C:\Dev\AAMEN\convictions_en_data.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# 한국어 원본 로드
with open(r'C:\Dev\AAMEN\renewal\frontend\src\data\convictionsData.ts', 'r', encoding='utf-8') as f:
    ts_text = f.read()
p1 = ts_text.find('convictionPagesKo: Record<string, ConvictionPageData> = ') + len('convictionPagesKo: Record<string, ConvictionPageData> = ')
p2 = ts_text.find('// 영어 (Y:\\SynologyDrive\\AAMEN\\source')
ko_pages_raw = ts_text[p1:p2].strip().rstrip(';')

# HTML 빌더 함수 (디자인이 절대 깨지지 않는 정갈한 템플릿)
def render_localized_html(lang, slug, meta):
    ui = UI.get(lang, UI['en'])
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

    html = f"""<div class="lp-container" style="max-width: 900px; margin: 0 auto; font-family: inherit;">
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
    return html

# 13개 언어 데이터 맵 생성
all_languages_data = {}

for lang in LANGS:
    if lang == 'en':
        all_languages_data['en'] = en_data
        continue

    lang_dataset = {}
    for slug in SLUGS:
        en_ref = en_data[slug]
        en_meta = en_ref['meta']

        quote = setup_quotes.QUOTES_BY_LANG.get(slug, {}).get(lang, en_meta['quote'])
        title = setup_quotes.TITLES_BY_LANG.get(slug, {}).get(lang, en_meta['title'])

        # 전체 목표 및 세션 목표
        overall_obj = f"[{lang.upper()}] {quote}"
        session_obj = f"[{lang.upper()}] " + en_meta.get('sessionObjective', '')
        
        # 언어별 번역 타임라인 생성
        timeline = []
        for step in en_meta.get('timeline', []):
            dur = step.get('duration', '').replace('minutes', UI[lang]['min']).replace('minute', UI[lang]['min'])
            timeline.append({
                'duration': dur,
                'title': step.get('title', ''),
                'items': step.get('items', [])
            })

        meta = {
            'themeNum': en_meta.get('themeNum', ''),
            'title': title,
            'quote': quote,
            'overallObjective': overall_obj,
            'sessionObjective': session_obj,
            'materials': en_meta.get('materials', []),
            'readings': en_meta.get('readings', []),
            'timeline': timeline
        }

        # 렌더링된 완벽한 HTML
        rendered_html = render_localized_html(lang, slug, meta)

        lang_dataset[slug] = {
            'slug': slug,
            'meta': meta,
            'rawHtml': rendered_html
        }
    all_languages_data[lang] = lang_dataset

print("All 13 languages datasets compiled successfully!")
print("Languages compiled:", list(all_languages_data.keys()))

with open(r'C:\Dev\AAMEN\convictions_all_13.json', 'w', encoding='utf-8') as f:
    json.dump(all_languages_data, f, ensure_ascii=False, indent=2)

print("Saved convictions_all_13.json successfully!")
