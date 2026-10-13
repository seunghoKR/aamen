import json, glob, os

files = glob.glob(r'C:\Dev\AAMEN\renewal\frontend\messages\*.json')
for f in sorted(files):
    lang = os.path.basename(f).replace('.json', '')
    with open(f, 'r', encoding='utf-8') as fp:
        d = json.load(fp)
    conv = d.get('convictions', {})
    title = conv.get('title', 'N/A')
    items = conv.get('items', {})
    god = items.get('god', 'N/A')
    jesus = items.get('jesus', 'N/A')
    peace = items.get('peace', 'N/A')
    print(f"{lang:6s} | Title: {title} | God: {god} | Jesus: {jesus} | Peace: {peace}")
