import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Dev\AAMEN\translation_cache.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

langs = set()
for k in d.keys():
    langs.add(k.split(':')[0])

print(f"Total translations in cache: {len(d)}")
print(f"Languages touched: {sorted(list(langs))}")
