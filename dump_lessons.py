import json, sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Dev\AAMEN\convictions_en_data.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

for slug in ['god', 'jesus', 'spirit', 'church', 'peace', 'community', 'unity']:
    meta = en[slug]['meta']
    print('**************************************************')
    print(f'SLUG: {slug}')
    print('Title:', meta.get('title'))
    print('Overall:', meta.get('overallObjective'))
    print('Session:', meta.get('sessionObjective'))
    print('Materials:')
    for m in meta.get('materials', []):
        print('  -', m)
    print('Readings:')
    for r in meta.get('readings', []):
        print('  -', r)
    print('Timeline:')
    for s in meta.get('timeline', []):
        dur = s.get('duration')
        title = s.get('title')
        print(f"  [{dur}] {title}")
        for it in s.get('items', []):
            print(f'    * {it}')
