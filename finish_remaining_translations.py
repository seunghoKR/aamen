# -*- coding: utf-8 -*-
import json, sys, re, urllib.request, time

sys.stdout.reconfigure(encoding='utf-8')
import rebuild_all_convictions

CACHE_FILE = r'C:\Dev\AAMEN\translation_cache_v2.json'
with open(CACHE_FILE, 'r', encoding='utf-8') as f:
    cache = json.load(f)

LM_STUDIO_URL = 'http://49.170.204.109:1234/v1/chat/completions'

LANG_NAMES = rebuild_all_convictions.LANG_NAMES

def translate_item(text, lang):
    key = f"{lang}:{text.strip()}"
    if key in cache:
        return cache[key]
    lang_name = LANG_NAMES.get(lang, lang)
    prompt = f"Translate the following Christian lesson sentence into {lang_name}. Output ONLY the translated text without quotes or explanations:\n{text.strip()}"
    for attempt in range(3):
        try:
            req = urllib.request.Request(LM_STUDIO_URL, data=json.dumps({
                'model': 'qwen2.5-7b-instruct-1m',
                'messages': [{'role': 'user', 'content': prompt}],
                'temperature': 0.1,
                'max_tokens': 250
            }).encode('utf-8'), headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=30) as res:
                data = json.loads(res.read().decode('utf-8'))
                trans = data['choices'][0]['message']['content'].strip(' "\'「」')
                trans = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', trans)
                cache[key] = trans
                print(f"[{lang}] Translated: {text[:30]}... -> {trans[:30]}...")
                return trans
        except Exception as e:
            print(f"Retry {attempt+1} for {lang}: {e}")
            time.sleep(1)
    return text

with open(r'C:\Dev\AAMEN\convictions_all_13.json', 'r', encoding='utf-8') as f:
    all_data = json.load(f)

ENGLISH_TRIGGERS = ['read ', 'discussion:', 'what does it mean', 'begin with a short', 'closing prayer', 'summarize:', 'choose the selected', 'step 3', 'share the story', 'share ideas', 'caring for creation', 'icebreaker']

for lang, slugs in all_data.items():
    if lang in ['en', 'ko']:
        continue
    for slug, cdata in slugs.items():
        meta = cdata['meta']
        # Clean [TAG] from meta
        meta['title'] = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', meta.get('title', ''))
        meta['quote'] = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', meta.get('quote', ''))
        meta['overallObjective'] = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', meta.get('overallObjective', ''))
        meta['sessionObjective'] = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', meta.get('sessionObjective', ''))
        
        # Check timeline items
        timeline = meta.get('timeline', [])
        for step in timeline:
            step['title'] = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', step.get('title', ''))
            new_items = []
            for it in step.get('items', []):
                it_clean = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', it).strip()
                if any(w in it_clean.lower() for w in ENGLISH_TRIGGERS):
                    it_clean = translate_item(it_clean, lang)
                new_items.append(it_clean)
            step['items'] = new_items

        # Materials
        new_mat = []
        for m in meta.get('materials', []):
            m_clean = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', m).strip()
            if any(w in m_clean.lower() for w in ['information on local', 'handout with']):
                m_clean = translate_item(m_clean, lang)
            new_mat.append(m_clean)
        meta['materials'] = new_mat

        # Re-render HTML with perfect typography
        cdata['rawHtml'] = rebuild_all_convictions.render_localized_html(lang, slug, meta)

# Save updated cache
with open(CACHE_FILE, 'w', encoding='utf-8') as f:
    json.dump(cache, f, ensure_ascii=False)

# Save updated json
with open(r'C:\Dev\AAMEN\convictions_all_13.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

# Regenerate convictionsData.ts
rebuild_all_convictions.generate_ts_file(all_data)
print("Finished polishing all remaining translations!")
