import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Dev\AAMEN\convictions_en_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for slug in ['god', 'jesus', 'spirit', 'church', 'peace', 'community', 'unity']:
    meta = d[slug]['meta']
    print(f'=== {slug} ===')
    print('Title:', meta['title'])
    print('Overall:', meta.get('overallObjective'))
    print('Session:', meta.get('sessionObjective'))
    print('Materials count:', len(meta.get('materials', [])))
    print('Readings count:', len(meta.get('readings', [])))
    print('Timeline steps count:', len(meta.get('timeline', [])))
    for s in meta.get('timeline', []):
        print(f"  - [{s['duration']}] {s['title']} ({len(s.get('items', []))} items)")
