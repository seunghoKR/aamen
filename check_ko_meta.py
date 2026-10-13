import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Dev\AAMEN\convictions_all_13.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("Ko god meta keys:", list(d['ko']['god']['meta'].keys()))
for s in ['god', 'jesus', 'spirit', 'church', 'peace', 'community', 'unity']:
    m = d['ko'][s]['meta']
    print(f"ko {s}: title={m.get('title')} has_timeline={len(m.get('timeline', []))}")
