import json, re

# Read parsed English lessons
with open(r'C:\Dev\AAMEN\parsed_en_lessons.json', 'r', encoding='utf-8') as f:
    en_lessons = json.load(f)

# Helper to clean up typographic quotes/spaces cleanly
def clean_text(s):
    if not s:
        return ""
    # Only replace non-breaking spaces and smart quotes, DO NOT do empty string replace!
    res = s.replace('\xa0', ' ').replace('“', '"').replace('”', '"').replace('‘', "'").replace('’', "'")
    return res.strip()

def render_html_en(lesson):
    slug = lesson['slug']
    theme_num = lesson['themeNum']
    theme_title = lesson['themeTitle']
    quote = clean_text(lesson['quote'])
    overall_obj = clean_text(lesson['overallObjective'])
    session_obj = clean_text(lesson['sessionObjective'])
    materials = [clean_text(m) for m in lesson['materials']]
    readings = [clean_text(r) for r in lesson['readings']]
    timeline = lesson['timeline']

    materials_html = "".join([f'<li style="margin-bottom: 8px;">{m}</li>' for m in materials])
    readings_html = "".join([f'<li style="margin-bottom: 8px;">{r}</li>' for r in readings])

    timeline_items_html = ""
    for step in timeline:
        title = clean_text(step['title'])
        duration = clean_text(step['duration'])
        items = [clean_text(it) for it in step['items']]
        
        body_items = ""
        for it in items:
            if it.lower().startswith('discussion:') or it.lower().startswith('group discussions:'):
                body_items += f'<p style="margin: 10px 0 5px 0; font-weight: 700; color: #0d9488;">{it}</p>'
            elif it.startswith('-') or it.startswith('•'):
                body_items += f'<li style="margin-bottom: 6px;">{it.lstrip("-• ")}</li>'
            elif len(it) > 0 and (it[0].isdigit() and (it[1] == '.' or it[1] == ':')):
                body_items += f'<li style="margin-bottom: 6px;">{it}</li>'
            elif it.startswith('Group 1:') or it.startswith('Group 2:') or it.startswith('Group 3:'):
                body_items += f'<li style="margin-bottom: 6px;"><strong>{it}</strong></li>'
            else:
                body_items += f'<p style="margin: 0 0 10px 0; color: #475569; line-height: 1.6;">{it}</p>'
        
        timeline_items_html += f"""
        <div class="lp-timeline-item" style="position: relative; margin-bottom: 40px; padding-left: 10px;">
            <div class="lp-dot" style="position: absolute; left: -29px; top: 0; width: 16px; height: 16px; border-radius: 50%; background: #10b981; border: 4px solid #fff; box-shadow: 0 0 0 2px #10b981;">&nbsp;</div>
            <span class="lp-badge" style="display: inline-block; background: #10b981; color: #fff; padding: 4px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; margin-bottom: 12px;">{duration}</span>
            <div>
                <h3 class="lp-timeline-title" style="margin: 0 0 12px 0; font-size: 1.35rem; color: #1e293b; font-weight: 700;">{title}</h3>
                <div class="lp-box" style="background: #ffffff; padding: 22px; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04); word-break: keep-all;">
                    {body_items}
                </div>
            </div>
        </div>"""

    html = f"""<div class="lp-container" style="max-width: 900px; margin: 0 auto; font-family: inherit;">
    <div class="lp-header" style="text-align: center; padding: 48px 24px; background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%); color: #fff; border-radius: 20px; margin-bottom: 36px; box-shadow: 0 12px 24px -6px rgba(16, 185, 129, 0.25); word-break: keep-all;">
        <h2 style="font-size: 2.2rem; margin: 0 0 16px 0; font-weight: 800; color: #fff; letter-spacing: -0.02em;">{theme_num}: {theme_title}</h2>
        <div class="lp-header-desc" style="font-size: 1.15rem; font-style: italic; opacity: 0.95; max-width: 820px; margin: 0 auto; border-left: 4px solid rgba(255,255,255,0.7); padding-left: 20px; text-align: left; line-height: 1.7;">
            &quot;{quote}&quot;
        </div>
    </div>

    <div class="lp-card-wrap" style="display: flex; gap: 24px; margin-bottom: 45px; flex-wrap: wrap;">
        <div class="lp-card" style="flex: 1; min-width: 320px; background: #ffffff; padding: 28px; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
            <div class="lp-card-title" style="color: #0d9488; font-size: 1.3rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 18px; font-weight: 700;">
                🎯 Learning Objectives
            </div>
            <div style="margin-bottom: 16px; word-break: keep-all;">
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">Overall Objective:</strong>
                <span style="color: #64748b; line-height: 1.6;">{overall_obj}</span>
            </div>
            <div style="word-break: keep-all;">
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">One-Hour Session Objective:</strong>
                <span style="color: #64748b; line-height: 1.6;">{session_obj}</span>
            </div>
        </div>

        <div class="lp-card" style="flex: 1; min-width: 320px; background: #ffffff; padding: 28px; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
            <div class="lp-card-title" style="color: #4f46e5; font-size: 1.3rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 18px; font-weight: 700;">
                📚 Materials & Required Readings
            </div>
            <div style="margin-bottom: 14px;">
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">Materials:</strong>
                <ul style="margin: 0; padding-left: 20px; color: #64748b; line-height: 1.6;">
                    {materials_html}
                </ul>
            </div>
            <div>
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">Required Readings:</strong>
                <ul style="margin: 0; padding-left: 20px; color: #64748b; line-height: 1.6;">
                    {readings_html}
                </ul>
            </div>
        </div>
    </div>

    <div class="lp-timeline-container" style="position: relative; padding: 10px 0 10px 25px; border-left: 3px solid #cbd5e1; margin-left: 15px;">
        {timeline_items_html}
    </div>
</div>"""
    return html

out_en = {}
for slug, item in en_lessons.items():
    rendered = render_html_en(item)
    out_en[slug] = {
        'slug': slug,
        'meta': {
            'themeNum': item['themeNum'],
            'title': f"{item['themeNum']}: {item['themeTitle']}",
            'quote': clean_text(item['quote']),
            'overallObjective': clean_text(item['overallObjective']),
            'sessionObjective': clean_text(item['sessionObjective']),
            'materials': [clean_text(m) for m in item['materials']],
            'readings': [clean_text(r) for r in item['readings']],
            'timeline': [
                {
                    'duration': clean_text(st['duration']),
                    'title': clean_text(st['title']),
                    'items': [clean_text(it) for it in st['items']]
                }
                for st in item['timeline']
            ],
        },
        'rawHtml': rendered
    }

with open(r'C:\Dev\AAMEN\convictions_en_data.json', 'w', encoding='utf-8') as f:
    json.dump(out_en, f, ensure_ascii=False, indent=2)

print("Regenerated convictions_en_data.json cleanly!")
print("Sample clean quote:", out_en['god']['meta']['quote'][:80])
